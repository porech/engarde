package main

import (
	"engarde/pkg/netutils"
	"net"
	"strconv"
	"time"

	log "github.com/sirupsen/logrus"
)

// ConnectedClient contains the information about a client
type ConnectedClient struct {
	Addr         *net.UDPAddr
	LastReceived int64
	Channel      chan []byte
	IsClosing    bool
}

var clients []*ConnectedClient

func handleErr(err error) {
	if err != nil {
		log.Warn(err)
	}
}

func getClientByAddr(addr *net.UDPAddr) *ConnectedClient {
	for _, client := range clients {
		if string(client.Addr.IP) == string(addr.IP) && client.Addr.Port == addr.Port {
			return client
		}
	}
	return nil
}

func main() {
	WireguardAddr, err := net.ResolveUDPAddr("udp4", "127.0.0.1:59301")
	handleErr(err)
	WireguardSource, err := net.ResolveUDPAddr("udp4", "127.0.0.1:0")
	handleErr(err)
	WireguardSocket, err := net.ListenUDP("udp", WireguardSource)
	handleErr(err)

	ClientsListenAddr, err := net.ResolveUDPAddr("udp4", "127.0.0.1:59302")
	handleErr(err)
	ClientSocket, err := net.ListenUDP("udp", ClientsListenAddr)

	chanToWireguard := make(chan []byte)
	abortWireguard := make(chan bool)
	go netutils.ChannelToSocket(chanToWireguard, abortWireguard, WireguardSocket, &WireguardAddr, "Invio a Wireguard")

	chanFromWireguard := make(chan []byte)
	go netutils.SocketToChannels(WireguardSocket, []chan []byte{chanFromWireguard}, nil, "Ricevo da Wireguard")
	go receiveFromWireguard(chanFromWireguard)

	listenForConnections(ClientSocket, chanToWireguard)
}

func listenForConnections(socket *net.UDPConn, wgChannel chan []byte) {
	buffer := make([]byte, 1500)
	for {
		n, srcAddr, err := socket.ReadFromUDP(buffer)
		handleErr(err)
		handleClientMessage(srcAddr, buffer[:n], socket, wgChannel)
	}
}

func receiveFromWireguard(channel chan []byte) {
	for {
		message := <-channel
		for _, client := range clients {
			if client.LastReceived > time.Now().Unix()-30 {
				client.Channel <- message
			}
		}
	}
}

func handleClientMessage(srcAddr *net.UDPAddr, message []byte, socket *net.UDPConn, wgChannel chan []byte) {
	client := getClientByAddr(srcAddr)
	currentTime := time.Now().Unix()
	if client == nil {
		log.Info("Nuovo client, creo quel che serve per lui")
		channel := make(chan []byte)
		abortChannel := make(chan bool)
		go netutils.ChannelToSocket(channel, abortChannel, socket, &srcAddr, "Invio al client "+string(srcAddr.IP)+":"+strconv.Itoa(srcAddr.Port))

		client := ConnectedClient{
			Addr:         srcAddr,
			LastReceived: currentTime,
			Channel:      channel,
			IsClosing:    false,
		}
		clients = append(clients, &client)
	} else {
		client.LastReceived = currentTime
	}
	wgChannel <- message
}
