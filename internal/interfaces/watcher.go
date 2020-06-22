package interfaces

import (
	log "github.com/sirupsen/logrus"
	"net"
	"strings"
	"time"
)

type Watcher struct {
	Ifaces        *Interfaces
	UpdateChannel chan *InterfaceUpdate
	QuitChannel   chan bool
}

func NewWatcher() *Watcher {
	updateChannel := make(chan *InterfaceUpdate)
	quitChannel := make(chan bool)
	var interfaces Interfaces
	watcher := Watcher{
		Ifaces:        &interfaces,
		UpdateChannel: updateChannel,
		QuitChannel:   quitChannel,
	}
	go watcher.Watch()
	return &watcher
}

func (w *Watcher) Watch() {
	ticker := time.NewTicker(1 * time.Second)
	quit := make(chan struct{})
	go func() {
		w.refreshInterfaces()
		for {
			select {
			case <-ticker.C:
				w.refreshInterfaces()
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()
}

func (w *Watcher) refreshInterfaces() {
	interfaces, err := net.Interfaces()
	if err != nil {
		log.Errorf("watcher.refreshInterfaces: annot get interfaces list: %v", err)
		return
	}
	w.handleIfacesList(interfaces)
}

func interfaceInlist(list *[]net.Interface, name string) bool {
	if list == nil {
		return false
	}
	for _, iface := range *list {
		if iface.Name == name {
			return true
		}
	}
	return false
}

func isAddressAllowed(addr string) bool {
	// TODO: IPv6 support
	if strings.ContainsRune(addr, ':') {
		return false
	}
	ip := net.ParseIP(addr)
	disallowedNetworks := []string{
		"169.254.0.0/16",
		"127.0.0.0/8",
	}
	for _, disallowedNetwork := range disallowedNetworks {
		_, subnet, _ := net.ParseCIDR(disallowedNetwork)
		if subnet.Contains(ip) {
			return false
		}
	}
	return true
}

func getAddressByInterface(iface net.Interface) string {
	addrs, err := iface.Addrs()
	if err != nil {
		return ""
	}
	for _, addr := range addrs {
		splAddr := strings.Split(addr.String(), "/")[0]
		if isAddressAllowed(splAddr) {
			return splAddr
		}
	}
	return ""
}

func (w *Watcher) handleIfacesList(list []net.Interface) {
	var existingIface *Interface
	// For each already existing interface, delete it if it doesn't exist anymore
	for _, iface := range w.Ifaces.GetAll() {
		if !interfaceInlist(&list, iface.Name) {
			w.removeIface(iface.Name)
		}
	}
	// For each interface in list
	for _, iface := range list {
		existingIface = w.Ifaces.Get(iface.Name)
		// If it doesn't exist, create it
		if existingIface == nil {
			w.createIface(iface)
		} else {
			w.updateIface(iface, existingIface)
		}
	}
}

func (w *Watcher) createIface(iface net.Interface) {
	address := getAddressByInterface(iface)
	log.Debugf("Watcher.createIface: new interface %s detected", iface.Name)
	newIface := Interface{
		Name:        iface.Name,
		Address:     address,
		Destination: "vps.radioduepuntozero.it:59401",
		Excluded:    false,
	}
	err := w.Ifaces.Add(&newIface)
	if err != nil {
		log.Errorf("Watcher.createIface: cannot create interface %s: %v", iface.Name, err)
		return
	}
	w.UpdateChannel <- &InterfaceUpdate{
		Name:         iface.Name,
		NewInterface: &newIface,
	}
}

func (w *Watcher) updateIface(iface net.Interface, existingIface *Interface) {
	address := getAddressByInterface(iface)
	if address != existingIface.Address {
		log.Debugf("Watcher.updateIface: interface %s changed", iface.Name)
		newIface := Interface{
			Name:        iface.Name,
			Address:     address,
			Destination: "vps.radioduepuntozero.it:59401",
			Excluded:    false,
		}
		err := w.Ifaces.Remove(iface.Name)
		if err != nil {
			log.Errorf("Watcher.updateIface: cannot remove updated interface %s: %v", iface.Name, err)
			return
		}
		err = w.Ifaces.Add(&newIface)
		if err != nil {
			log.Errorf("Watcher.updateIface: cannot create updated interface %s: %v", iface.Name, err)
			return
		}
		w.UpdateChannel <- &InterfaceUpdate{
			Name:         iface.Name,
			NewInterface: &newIface,
		}
	}
}

func (w *Watcher) removeIface(ifname string) {
	log.Debugf("Watcher.removeIface: interface %s doesn't exist anymore", ifname)
	err := w.Ifaces.Remove(ifname)
	if err != nil {
		log.Errorf("Watcher.removeIface: cannot remove interface %s: %v", ifname, err)
		return
	}
	w.UpdateChannel <- &InterfaceUpdate{
		Name:         ifname,
		NewInterface: nil,
	}
}
