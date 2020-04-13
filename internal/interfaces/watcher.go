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
}

func (w *Watcher) Watch() {
	// Constantly look for the list of interface, once every second
	for {
		interfaces, err := net.Interfaces()
		if err != nil {
			log.Errorf("Cannot get interfaces list: %v", err)
			continue
		}
		w.handleIfacesList(interfaces)
		time.Sleep(time.Second)
	}
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
	log.Debugf("New interface %s detected", iface.Name)
	newIface := Interface{
		Name:        iface.Name,
		Address:     address,
		Destination: "vps.radioduepuntozero.it:59401",
		Excluded:    false,
	}
	err := w.Ifaces.Add(&newIface)
	if err != nil {
		log.Errorf("Cannot create interface %s: %v", iface.Name, err)
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
		log.Debugf("Interface %s changed", iface.Name)
		newIface := Interface{
			Name:        iface.Name,
			Address:     address,
			Destination: "vps.radioduepuntozero.it:59401",
			Excluded:    false,
		}
		err := w.Ifaces.Remove(iface.Name)
		if err != nil {
			log.Errorf("Cannot remove updated interface %s: %v", iface.Name, err)
			return
		}
		err = w.Ifaces.Add(&newIface)
		if err != nil {
			log.Errorf("Cannot create updated interface %s: %v", iface.Name, err)
			return
		}
		w.UpdateChannel <- &InterfaceUpdate{
			Name:         iface.Name,
			NewInterface: &newIface,
		}
	}
}

func (w *Watcher) removeIface(ifname string) {
	log.Debugf("Interface %s doesn't exist anymore", ifname)
	err := w.Ifaces.Remove(ifname)
	if err != nil {
		log.Errorf("Cannot remove interface %s: %v", ifname, err)
		return
	}
	w.UpdateChannel <- &InterfaceUpdate{
		Name:         ifname,
		NewInterface: nil,
	}
}
