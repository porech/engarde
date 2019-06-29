package main

import (
	"engarde/pkg/netutils"
	"io/ioutil"
	"net"
	"os"
	"strconv"
	"time"

	log "github.com/sirupsen/logrus"
	"gopkg.in/yaml.v2"
)

type config struct {
	Server serverConfig `yaml:"server"`
}

type serverConfig struct {
	ListenAddr    string `yaml:"listenAddr"`
	DstAddr       string `yaml:"dstAddr"`
	ClientTimeout int64  `yaml:"clientTimeout"`
}

// ConnectedClient contains the information about a client
type ConnectedClient struct {
	Addr         *net.UDPAddr
	LastReceived int64
	Channel      chan []byte
	IsClosing    bool
}

var clients []*ConnectedClient
var srConfig serverConfig

func handleErr(err error, msg string) {
	if err != nil {
		log.Fatal(msg+" | ", err)
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
	var genconfig config
	var configName string
	if len(os.Args) > 1 {
		configName = os.Args[1]
	} else {
		configName = "engarde.yml"
	}
	yamlFile, err := ioutil.ReadFile(configName)
	handleErr(err, "Reading config file "+configName+" failed")
	err = yaml.Unmarshal(yamlFile, &genconfig)
	handleErr(err, "Parsing config file failed")
	srConfig = genconfig.Server
	if srConfig.ClientTimeout == 0 {
		srConfig.ClientTimeout = 30
	}

	WireguardAddr, err := net.ResolveUDPAddr("udp4", srConfig.DstAddr)
	handleErr(err, "Cannot resolve destination address")
	WireguardSource, err := net.ResolveUDPAddr("udp4", "0.0.0.0:0")
	handleErr(err, "Cannot resolve listen address")
	WireguardSocket, err := net.ListenUDP("udp", WireguardSource)
	handleErr(err, "Cannot initialize Wireguard socket")

	ClientsListenAddr, err := net.ResolveUDPAddr("udp4", srConfig.ListenAddr)
	handleErr(err, "Cannot resolve listen address")
	ClientSocket, err := net.ListenUDP("udp", ClientsListenAddr)
	handleErr(err, "Cannot create listen socket")
	log.Info("Listening on " + srConfig.ListenAddr)

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
		if err != nil {
			continue
		}
		handleClientMessage(srcAddr, buffer[:n], socket, wgChannel)
	}
}

func receiveFromWireguard(channel chan []byte) {
	for {
		message := <-channel
		for _, client := range clients {
			if client.LastReceived > time.Now().Unix()-srConfig.ClientTimeout {
				client.Channel <- message
			}
		}
	}
}

func handleClientMessage(srcAddr *net.UDPAddr, message []byte, socket *net.UDPConn, wgChannel chan []byte) {
	client := getClientByAddr(srcAddr)
	currentTime := time.Now().Unix()
	if client == nil {
		log.Info("New client connected: " + srcAddr.IP.String() + ":" + strconv.Itoa(srcAddr.Port))
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
