package main

import (
	"io/ioutil"
	"net"
	"os"
	"strings"
	"time"

	log "github.com/sirupsen/logrus"
	"gopkg.in/yaml.v2"
)

type config struct {
	Client clientConfig `yaml:"client"`
}

type clientConfig struct {
	ListenAddr         string        `yaml:"listenAddr"`
	DstAddr            string        `yaml:"dstAddr"`
	ExcludedInterfaces []string      `yaml:"excludedInterfaces"`
	DstOverrides       []dstOverride `yaml:"dstOverrides"`
}

type dstOverride struct {
	IfName  string `yaml:"ifName"`
	DstAddr string `yaml:"dstAddr"`
}

type sendingRoutine struct {
	SrcSock   *net.UDPConn
	SrcAddr   string
	DstAddr   *net.UDPAddr
	IsClosing bool
}

var sendingChannels map[string]*sendingRoutine
var clConfig clientConfig

func handleErr(err error, msg string) {
	if err != nil {
		log.Fatal(msg+" | ", err)
	}
}

func isExcluded(name string) bool {
	for _, ifname := range clConfig.ExcludedInterfaces {
		if ifname == name {
			return true
		}
	}
	return false
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
	handleErr(err, "getAddressByInterface 1")
	for _, addr := range addrs {
		splAddr := strings.Split(addr.String(), "/")[0]
		if isAddressAllowed(splAddr) {
			return splAddr
		}
	}
	return ""
}

func getDstOverrideByIfname(ifname string) string {
	for _, override := range clConfig.DstOverrides {
		if override.IfName == ifname {
			return override.DstAddr
		}
	}
	return ""
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

func updateAvailableInterfaces(wgSock *net.UDPConn, wgAddr **net.UDPAddr) {
	for {
		interfaces, err := net.Interfaces()
		handleErr(err, "updateAvailableInterfaces 1")
		// Delete unavailable interfaces
		for ifname, routine := range sendingChannels {
			if !interfaceExists(interfaces, ifname) {
				log.Info("Interface '" + ifname + "'' no longer exists, deleting it")
				routine.IsClosing = true
				addr, err := net.ResolveUDPAddr("udp4", routine.SrcSock.LocalAddr().String())
				if err == nil {
					routine.SrcSock.WriteToUDP([]byte("X"), addr)
				}
				delete(sendingChannels, ifname)
				continue
			}
			iface, err := net.InterfaceByName(ifname)
			if err != nil {
				continue
			}
			handleErr(err, "updateAvailableInterfaces 2")
			ifaddr := getAddressByInterface(*iface)
			if ifaddr != routine.SrcAddr {
				log.Info("Interface " + ifname + " changed address, re-creating socket")
				routine.IsClosing = true
				addr, err := net.ResolveUDPAddr("udp4", routine.SrcSock.LocalAddr().String())
				if err == nil {
					routine.SrcSock.WriteToUDP([]byte("X"), addr)
				}
				delete(sendingChannels, ifname)
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
				log.Info("New interface " + ifname + " with IP " + ifaddr + ", adding it")
				createSendThread(ifname, getAddressByInterface(iface), wgSock, wgAddr)
			}
		}
		time.Sleep(1 * time.Second)
	}
}

func createSendThread(ifname, sourceAddr string, wgSock *net.UDPConn, wgAddr **net.UDPAddr) {
	dst := getDstOverrideByIfname(ifname)
	if dst == "" {
		dst = clConfig.DstAddr
	}
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
	sock, err := net.ListenUDP("udp", srcAddr)
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

	go WGWriteBack(ifname, ptrRoutine, wgSock, wgAddr)
	sendingChannels[ifname] = ptrRoutine
}

func WGWriteBack(ifname string, routine *sendingRoutine, wgSock *net.UDPConn, wgAddr **net.UDPAddr) {
	log.Info("Starting WGWriteBack routine for '" + ifname + "'")
	buffer := make([]byte, 1500)
	var n int
	for {
		n, _, _ = routine.SrcSock.ReadFromUDP(buffer)
		if routine.IsClosing {
			log.Info("Stopping WGWriteBack routine for '" + ifname + "'")
		}
		wgSock.WriteToUDP(buffer[:n], *wgAddr)
	}
}

func receiveFromWireguard(wgsock *net.UDPConn, sourceAddr **net.UDPAddr) {
	buffer := make([]byte, 1500)
	var n int
	var srcAddr *net.UDPAddr
	var routine *sendingRoutine
	for {
		n, srcAddr, _ = wgsock.ReadFromUDP(buffer)
		*sourceAddr = srcAddr

		for _, routine = range sendingChannels {
			routine.SrcSock.WriteToUDP(buffer[:n], routine.DstAddr)
		}
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
	if configName == "list-interfaces" {
		listInterfaces()
		return
	}
	yamlFile, err := ioutil.ReadFile(configName)
	handleErr(err, "Reading config file "+configName+" failed")
	err = yaml.Unmarshal(yamlFile, &genconfig)
	handleErr(err, "Parsing config file failed")
	clConfig = genconfig.Client
	var wireguardAddr *net.UDPAddr
	sendingChannels = make(map[string]*sendingRoutine)
	ptrWireguardAddr := &wireguardAddr

	WireguardListenAddr, err := net.ResolveUDPAddr("udp4", clConfig.ListenAddr)
	handleErr(err, "main 1")
	WireguardSocket, err := net.ListenUDP("udp", WireguardListenAddr)
	handleErr(err, "main 2")
	log.Info("Listening on " + clConfig.ListenAddr)

	go updateAvailableInterfaces(WireguardSocket, ptrWireguardAddr)
	receiveFromWireguard(WireguardSocket, ptrWireguardAddr)
}
