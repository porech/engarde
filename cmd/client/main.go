package main

import (
	"engarde/pkg/netutils"
	"net"
	"strings"
	"time"

	log "github.com/sirupsen/logrus"
)

type sendingRoutine struct {
	TrafficChannel chan []byte
	AbortChannel   chan bool
	Address        string
}

var sendingChannels map[string]sendingRoutine

func handleErr(err error, msg string) {
	if err != nil {
		log.Warn(msg+" | ", err)
	}
}

func isExcluded(name string) bool {
	excludedInterfaces := []string{
		"Connessione alla rete locale (LAN)* 17",
		"Connessione alla rete locale (LAN)* 1",
		"Connessione alla rete locale (LAN)* 7",
		"VMware Network Adapter VMnet1",
		"VMware Network Adapter VMnet8",
		"Ethernet 6",
		"Connessione di rete Bluetooth",
		"Loopback Pseudo-Interface 1",
	}
	for _, ifname := range excludedInterfaces {
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

func getAddressByInterface(iface net.Interface) string {
	addrs, err := iface.Addrs()
	handleErr(err, "getAddressByInterface 1")
	for _, addr := range addrs {
		splAddr := strings.Split(addr.String(), "/")[0]
		if !strings.ContainsRune(splAddr, ':') {
			return splAddr
		}
	}
	return ""
}

func updateAvailableInterfaces(wireguardRespChan chan []byte) {
	for {
		interfaces, err := net.Interfaces()
		handleErr(err, "updateAvailableInterfaces 1")
		// Delete unavailable interfaces
		for key, value := range sendingChannels {
			if !interfaceExists(interfaces, key) {
				log.Info("Interface " + key + " no longer exists, deleting it")
				value.AbortChannel <- true
				delete(sendingChannels, key)
				continue
			}
			iface, err := net.InterfaceByName(key)
			if err != nil {
				continue
			}
			handleErr(err, "updateAvailableInterfaces 2")
			ifaddr := getAddressByInterface(*iface)
			if ifaddr != value.Address {
				log.Info("Interface " + key + " changed address, re-creating socket")
				value.AbortChannel <- true
				delete(sendingChannels, key)
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
				createSendThread(ifname, getAddressByInterface(iface), wireguardRespChan)
			}
		}
		time.Sleep(1 * time.Second)
	}
}

func createSendThread(ifname, sourceAddr string, wireguardRespChan chan []byte) {
	UDPDstAddr, err := net.ResolveUDPAddr("udp4", "46.101.194.106:59302")
	handleErr(err, "createSendThread 1")
	UDPSrcAddr, err := net.ResolveUDPAddr("udp4", sourceAddr+":0")
	handleErr(err, "createSendThread 2")
	UDPConn, err := net.ListenUDP("udp", UDPSrcAddr)
	handleErr(err, "createSendThread 3")
	dataChannel := make(chan []byte)
	abortChannel := make(chan bool)
	go netutils.ChannelToSocket(dataChannel, abortChannel, UDPConn, &UDPDstAddr, ifname)
	go netutils.SocketToChannels(UDPConn, []chan []byte{wireguardRespChan}, nil, ifname)
	sendingChannels[ifname] = sendingRoutine{
		TrafficChannel: dataChannel,
		AbortChannel:   abortChannel,
		Address:        sourceAddr,
	}
}

func receiveFromWireguard(wgsock *net.UDPConn, sourceAddr **net.UDPAddr) {
	buffer := make([]byte, 1500)
	for {
		n, srcAddr, err := wgsock.ReadFromUDP(buffer)
		if sourceAddr != nil {
			*sourceAddr = srcAddr
		}

		if err != nil {
			log.Error(err)
		}
		// log.Info("Received from WireGuard")
		for _, sendingChannel := range sendingChannels {
			sendingChannel.TrafficChannel <- buffer[:n]
		}
	}
}

func main() {
	var wireguardAddr *net.UDPAddr
	sendingChannels = make(map[string]sendingRoutine)
	ptrWireguardAddr := &wireguardAddr

	WireguardListenAddr, err := net.ResolveUDPAddr("udp4", "127.0.0.1:59301")
	handleErr(err, "main 1")
	WireguardSocket, err := net.ListenUDP("udp", WireguardListenAddr)
	handleErr(err, "main 2")
	go receiveFromWireguard(WireguardSocket, &wireguardAddr)

	wireguardRespChan := make(chan []byte)
	wireguardAbortChan := make(chan bool)
	go updateAvailableInterfaces(wireguardRespChan)
	netutils.ChannelToSocket(wireguardRespChan, wireguardAbortChan, WireguardSocket, ptrWireguardAddr, "Wireguard")
}
