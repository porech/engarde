package main

import (
	"io/ioutil"
	"net"
	"os"
	"strings"
	"sync"
	"time"

	log "github.com/sirupsen/logrus"
	"gopkg.in/yaml.v2"
)

type config struct {
	Client clientConfig `yaml:"client"`
}

type clientConfig struct {
	Description        string        `yaml:"description"`
	ListenAddr         string        `yaml:"listenAddr"`
	DstAddr            string        `yaml:"dstAddr"`
	WriteTimeout       time.Duration `yaml:"writeTimeout"`
	ExcludedInterfaces []string      `yaml:"excludedInterfaces"`
	DstOverrides       []dstOverride `yaml:"dstOverrides"`
	WebManager         struct {
		ListenAddr string `yaml:"listenAddr"`
		Username   string `yaml:"username"`
		Password   string `yaml:"password"`
	} `yaml:"webManager"`
}

type dstOverride struct {
	IfName  string `yaml:"ifName"`
	DstAddr string `yaml:"dstAddr"`
}

type sendingRoutine struct {
	SrcSock   *net.UDPConn
	SrcAddr   string
	DstAddr   *net.UDPAddr
	LastRec   int64
	IsClosing bool
}

var sendingChannels map[string]*sendingRoutine
var clConfig clientConfig
var exclusionSwaps map[string]bool
var sendingChannelsMutex *sync.RWMutex

// Version is passed by the compiler
var Version = "UNOFFICIAL BUILD"

func handleErr(err error, msg string) {
	if err != nil {
		log.Fatal(msg+" | ", err)
	}
}

func isSwapped(name string) bool {
	if _, ok := exclusionSwaps[name]; ok {
		return true
	}
	return false
}

func isExcluded(name string) bool {
	for _, ifname := range clConfig.ExcludedInterfaces {
		if ifname == name {
			return !isSwapped(name)
		}
	}
	return isSwapped(name)
}

func swapExclusion(ifname string) {
	if isSwapped(ifname) {
		delete(exclusionSwaps, ifname)
	} else {
		exclusionSwaps[ifname] = true
	}
}

func interfaceExists(interfaces []net.Interface, name string) bool {
	for _, iface := range interfaces {
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

func getDstByIfname(ifname string) string {
	for _, override := range clConfig.DstOverrides {
		if override.IfName == ifname {
			return override.DstAddr
		}
	}
	return clConfig.DstAddr
}

func listInterfaces() {
	interfaces, err := net.Interfaces()
	handleErr(err, "listInterfaces 1")
	for _, iface := range interfaces {
		ifname := iface.Name
		print("\r\n" + ifname + "\r\n")
		ifaddr := getAddressByInterface(iface)
		print("  Address: " + ifaddr + "\r\n")
	}
}

func terminateRoutine(routine *sendingRoutine, ifname string, deleteFromSlice bool) {
	routine.IsClosing = true
	routine.SrcSock.Close()
	if deleteFromSlice {
		sendingChannelsMutex.Lock()
		delete(sendingChannels, ifname)
		sendingChannelsMutex.Unlock()
	}
}

func updateAvailableInterfaces(wgSock *net.UDPConn, wgAddr **net.UDPAddr) {
	for {
		interfaces, err := net.Interfaces()
		if err != nil {
			time.Sleep(1 * time.Second)
			continue
		}
		// Delete unavailable interfaces
		for ifname, routine := range sendingChannels {
			if !interfaceExists(interfaces, ifname) {
				log.Info("Interface '" + ifname + "' no longer exists, deleting it")
				terminateRoutine(routine, ifname, true)
				continue
			}
			if isExcluded(ifname) {
				log.Info("Interface '" + ifname + "' is now excluded, deleting it")
				terminateRoutine(routine, ifname, true)
				continue
			}
			iface, err := net.InterfaceByName(ifname)
			if err != nil {
				continue
			}
			ifaddr := getAddressByInterface(*iface)
			if ifaddr != routine.SrcAddr {
				log.Info("Interface '" + ifname + "' changed address, re-creating socket")
				terminateRoutine(routine, ifname, true)
				continue
			}
		}
		for _, iface := range interfaces {
			ifname := iface.Name
			if isExcluded(ifname) {
				continue
			}
			if _, ok := sendingChannels[ifname]; ok {
				continue
			}
			ifaddr := getAddressByInterface(iface)
			if ifaddr != "" {
				log.Info("New interface '" + ifname + "' with IP '" + ifaddr + "', adding it")
				createSendThread(ifname, getAddressByInterface(iface), wgSock, wgAddr)
			}
		}
		time.Sleep(1 * time.Second)
	}
}

func createSendThread(ifname, sourceAddr string, wgSock *net.UDPConn, wgAddr **net.UDPAddr) {
	dst := getDstByIfname(ifname)
	dstAddr, err := net.ResolveUDPAddr("udp4", dst)
	if err != nil {
		log.Error("Can't resolve destination address '" + dst + "' for interface '" + ifname + "', not using it")
		return
	}
	srcAddr, err := net.ResolveUDPAddr("udp4", sourceAddr+":0")
	if err != nil {
		log.Error("Can't resolve source address '" + sourceAddr + "' for interface '" + ifname + "', not using it")
		return
	}
	sock, err := udpConn(srcAddr, ifname)
	if err != nil {
		log.Error("Can't create socket for address '" + sourceAddr + "' on interface '" + ifname + "', not using it")
		return
	}

	routine := sendingRoutine{
		SrcSock:   sock,
		SrcAddr:   sourceAddr,
		DstAddr:   dstAddr,
		IsClosing: false,
	}
	ptrRoutine := &routine

	go wgWriteBack(ifname, ptrRoutine, wgSock, wgAddr)
	sendingChannelsMutex.Lock()
	sendingChannels[ifname] = ptrRoutine
	sendingChannelsMutex.Unlock()
}

func wgWriteBack(ifname string, routine *sendingRoutine, wgSock *net.UDPConn, wgAddr **net.UDPAddr) {
	buffer := make([]byte, 1500)
	var n int
	var err error
	for {
		n, _, err = routine.SrcSock.ReadFromUDP(buffer)
		if routine.IsClosing {
			return
		}
		if err != nil {
			log.Warn("Error reading from '" + ifname + "', re-creating socket")
			terminateRoutine(routine, ifname, true)
			return
		}
		routine.LastRec = time.Now().Unix()
		_, err = wgSock.WriteToUDP(buffer[:n], *wgAddr)
		if err != nil {
			log.Warn("Error writing to WireGuard")
		}
	}
}

func receiveFromWireguard(wgsock *net.UDPConn, sourceAddr **net.UDPAddr) {
	buffer := make([]byte, 1500)
	var n int
	var srcAddr *net.UDPAddr
	var routine *sendingRoutine
	var err error
	var ifname string
	var toDelete []string
	for {
		n, srcAddr, err = wgsock.ReadFromUDP(buffer)
		if err != nil {
			log.Warn("Error reading from Wireguard")
			continue
		}
		*sourceAddr = srcAddr
		sendingChannelsMutex.RLock()
		for ifname, routine = range sendingChannels {
			if clConfig.WriteTimeout > 0 {
				err = routine.SrcSock.SetWriteDeadline(time.Now().Add(clConfig.WriteTimeout * time.Millisecond))
				if err != nil {
					log.WithError(err).Warn("Error setting source socket write deadline to " + clConfig.WriteTimeout.String())
				}
			}
			_, err = routine.SrcSock.WriteToUDP(buffer[:n], routine.DstAddr)
			if err != nil {
				log.Warn("Error writing to '" + ifname + "', re-creating socket")
				terminateRoutine(routine, ifname, false)
				toDelete = append(toDelete, ifname)
			}
		}
		sendingChannelsMutex.RUnlock()
		sendingChannelsMutex.Lock()
		for _, ifname = range toDelete {
			delete(sendingChannels, ifname)
		}
		toDelete = toDelete[:0]
		sendingChannelsMutex.Unlock()
	}
}

func printVersion() {
	if Version != "" {
		print("engarde-client ver. " + Version + "\r\n")
	}
}

func main() {
	var genconfig config
	var configName string
	if len(os.Args) > 1 {
		configName = os.Args[1]
	} else {
		configName = "engarde.yml"
	}

	printVersion()

	// If flag is -v, exit after printing version
	if configName == "-v" {
		return
	}

	if configName == "list-interfaces" {
		listInterfaces()
		return
	}

	sendingChannelsMutex = &sync.RWMutex{}

	yamlFile, err := ioutil.ReadFile(configName)
	handleErr(err, "Reading config file "+configName+" failed")
	err = yaml.Unmarshal(yamlFile, &genconfig)
	handleErr(err, "Parsing config file failed")
	clConfig = genconfig.Client
	if clConfig.Description != "" {
		log.Info(clConfig.Description)
	}

	if clConfig.ListenAddr == "" {
		log.Fatal("No listenAddr specified.")
	}

	if clConfig.DstAddr == "" {
		log.Fatal("No dstAddr specified.")
	}

	if clConfig.WriteTimeout == 0 {
		clConfig.WriteTimeout = 10
	}
	exclusionSwaps = make(map[string]bool)

	var wireguardAddr *net.UDPAddr
	sendingChannels = make(map[string]*sendingRoutine)
	ptrWireguardAddr := &wireguardAddr

	WireguardListenAddr, err := net.ResolveUDPAddr("udp4", clConfig.ListenAddr)
	handleErr(err, "main 1")
	WireguardSocket, err := net.ListenUDP("udp", WireguardListenAddr)
	handleErr(err, "main 2")
	log.Info("Listening on " + clConfig.ListenAddr)

	if clConfig.WebManager.ListenAddr != "" {
		go webserver(clConfig.WebManager.ListenAddr, clConfig.WebManager.Username, clConfig.WebManager.Password)
	}
	go updateAvailableInterfaces(WireguardSocket, ptrWireguardAddr)
	receiveFromWireguard(WireguardSocket, ptrWireguardAddr)
}
