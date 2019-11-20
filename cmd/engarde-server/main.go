package main

import (
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
	Description   string        `yaml:"description"`
	ListenAddr    string        `yaml:"listenAddr"`
	DstAddr       string        `yaml:"dstAddr"`
	WriteTimeout  time.Duration `yaml:"writeTimeout"`
	ClientTimeout int64         `yaml:"clientTimeout"`
	WebManager    struct {
		ListenAddr string `yaml:"listenAddr"`
		Username   string `yaml:"username"`
		Password   string `yaml:"password"`
	} `yaml:"webManager"`
}

// ConnectedClient contains the information about a client
type ConnectedClient struct {
	Addr *net.UDPAddr
	Last int64
}

var clients map[string]*ConnectedClient
var clientsMutex *sync.Mutex
var srConfig serverConfig

// Version is passed by the compiler
var Version = "UNOFFICIAL BUILD"

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

func printVersion() {
	if Version != "" {
		print("engarde-server ver. " + Version + "\r\n")
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

	yamlFile, err := ioutil.ReadFile(configName)
	handleErr(err, "Reading config file "+configName+" failed")
	err = yaml.Unmarshal(yamlFile, &genconfig)
	handleErr(err, "Parsing config file failed")
	srConfig = genconfig.Server
	if srConfig.Description != "" {
		log.Info(srConfig.Description)
	}

	if srConfig.ListenAddr == "" {
		log.Fatal("No listenAddr specified.")
	}

	if srConfig.DstAddr == "" {
		log.Fatal("No dstAddr specified.")
	}
	if srConfig.ClientTimeout == 0 {
		srConfig.ClientTimeout = 30
	}
	if srConfig.WriteTimeout == 0 {
		srConfig.WriteTimeout = 10
	}

	clients = make(map[string]*ConnectedClient)
	clientsMutex = &sync.Mutex{}

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

	if srConfig.WebManager.ListenAddr != "" {
		go webserver(srConfig.WebManager.ListenAddr, srConfig.WebManager.Username, srConfig.WebManager.Password)
	}
	go receiveFromWireguard(WireguardSocket, ClientSocket)
	receiveFromClient(ClientSocket, WireguardSocket, WireguardAddr)
}

func receiveFromClient(socket, wgSocket *net.UDPConn, wgAddr *net.UDPAddr) {
	buffer := make([]byte, 1500)
	var currentTime int64
	var n int
	var srcAddr *net.UDPAddr
	var srcAddrS string
	var client *ConnectedClient
	var exists bool
	var err error
	for {
		n, srcAddr, err = socket.ReadFromUDP(buffer)
		if err != nil {
			log.Warn("Error reading from client")
			continue
		}

		// Check if client exists
		currentTime = time.Now().Unix()
		srcAddrS = srcAddr.IP.String() + ":" + strconv.Itoa(srcAddr.Port)
		clientsMutex.Lock()
		client, exists = clients[srcAddrS]
		clientsMutex.Unlock()
		if exists {
			client.Last = currentTime
		} else {
			log.Info("New client connected: '" + srcAddrS + "'")
			newClient := ConnectedClient{
				Addr: srcAddr,
				Last: currentTime,
			}
			clients[srcAddrS] = &newClient
		}
		if srConfig.WriteTimeout > 0 {
			wgSocket.SetWriteDeadline(time.Now().Add(srConfig.WriteTimeout * time.Millisecond))
		}
		_, err = wgSocket.WriteToUDP(buffer[:n], wgAddr)
		if err != nil {
			log.Warn("Error writing to WireGuard")
		}
	}
}

func receiveFromWireguard(wgSocket, socket *net.UDPConn) {
	buffer := make([]byte, 1500)
	var n int
	var client *ConnectedClient
	var currentTime int64
	var clientAddr string
	var err error
	var toDelete []string
	for {
		n, _, err = wgSocket.ReadFromUDP(buffer)
		if err != nil {
			log.Warn("Error reading from WireGuard")
			continue
		}
		currentTime = time.Now().Unix()
		for clientAddr, client = range clients {
			if client.Last > currentTime-srConfig.ClientTimeout {
				if srConfig.WriteTimeout > 0 {
					socket.SetWriteDeadline(time.Now().Add(srConfig.WriteTimeout * time.Millisecond))
				}
				_, err = socket.WriteToUDP(buffer[:n], client.Addr)
				if err != nil {
					log.Warn("Error writing to client '" + clientAddr + "', terminating it")
					toDelete = append(toDelete, clientAddr)
				}
			} else {
				log.Info("Client '" + clientAddr + "' timed out")
				toDelete = append(toDelete, clientAddr)
			}
		}
		clientsMutex.Lock()
		for _, clientAddr = range toDelete {
			delete(clients, clientAddr)
		}
		clientsMutex.Unlock()
		toDelete = toDelete[:0]
	}
}
