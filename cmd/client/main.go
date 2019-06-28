package main

import (
	"engarde/pkg/netutils"
	"net"

	log "github.com/sirupsen/logrus"
)

func handleErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	var wireguardAddr *net.UDPAddr
	ptrWireguardAddr := &wireguardAddr

	WireguardListenAddr, err := net.ResolveUDPAddr("udp4", "127.0.0.1:59301")
	handleErr(err)
	WireguardSocket, err := net.ListenUDP("udp", WireguardListenAddr)
	handleErr(err)
	channel1 := make(chan []byte)
	channel2 := make(chan []byte)
	go netutils.SocketToChannels(WireguardSocket, []chan []byte{channel1, channel2}, ptrWireguardAddr, "Received from WireGuard")

	UDP1DstAddr, err := net.ResolveUDPAddr("udp4", "alerinaldi4.linuxzogno.org:59301")
	handleErr(err)
	UDP1SrcAddr, err := net.ResolveUDPAddr("udp4", "192.168.1.2:0")
	handleErr(err)
	UDPConn1, err := net.ListenUDP("udp", UDP1SrcAddr)
	handleErr(err)
	go netutils.ChannelToSocket(channel1, UDPConn1, &UDP1DstAddr, "Sent to ch1")

	UDP2DstAddr, err := net.ResolveUDPAddr("udp4", "alerinaldi4.linuxzogno.org:59301")
	handleErr(err)
	UDP2SrcAddr, err := net.ResolveUDPAddr("udp4", "192.168.42.30:0")
	handleErr(err)
	UDPConn2, err := net.ListenUDP("udp", UDP2SrcAddr)
	handleErr(err)
	go netutils.ChannelToSocket(channel2, UDPConn2, &UDP2DstAddr, "Sent to ch2")

	wireguardRespChan := make(chan []byte)

	go netutils.SocketToChannels(UDPConn1, []chan []byte{wireguardRespChan}, nil, "Received from ch1")
	go netutils.SocketToChannels(UDPConn2, []chan []byte{wireguardRespChan}, nil, "Received from ch2")
	netutils.ChannelToSocket(wireguardRespChan, WireguardSocket, ptrWireguardAddr, "Sent to Wireguard")
}

// func channelToPrint(channel chan []byte) {
// 	for {
// 		buffer := <-channel
// 		print(string(buffer))
// 	}
// }
