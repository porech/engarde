package netutils

import (
	"net"

	log "github.com/sirupsen/logrus"
)

// ChannelToSocket reads from a channel and writes to a socket
func ChannelToSocket(channel chan []byte, socket *net.UDPConn, addr **net.UDPAddr, msg string) {
	for {
		buffer := <-channel
		log.Info(msg)
		_, err := socket.WriteToUDP(buffer, *addr)
		if err != nil {
			log.Fatal(err)
		}
	}
}

// SocketToChannels reads from a socket and writes to some channels
func SocketToChannels(socket *net.UDPConn, channels []chan []byte, sourceAddr **net.UDPAddr, msg string) {
	buffer := make([]byte, 1500)

	for {
		n, srcAddr, err := socket.ReadFromUDP(buffer)
		if sourceAddr != nil {
			*sourceAddr = srcAddr
		}

		if err != nil {
			log.Fatal(err)
		}
		log.Info(msg)
		for _, channel := range channels {
			channel <- buffer[:n]
		}
	}
}
