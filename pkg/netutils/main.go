package netutils

import (
	"net"

	log "github.com/sirupsen/logrus"
)

// ChannelToSocket reads from a channel and writes to a socket
func ChannelToSocket(channel chan []byte, abortChannel chan bool, socket *net.UDPConn, addr **net.UDPAddr, ifname string) {
	for {
		select {
		case buffer := <-channel:
			// log.Info("Sent to " + ifname)
			_, err := socket.WriteToUDP(buffer, *addr)
			if err != nil {
				log.Error(err)
			}
		case stop := <-abortChannel:
			if stop {
				// log.Info("Stopping send for " + ifname)
				return
			}
		}
	}
}

// SocketToChannels reads from a socket and writes to some channels
func SocketToChannels(socket *net.UDPConn, channels []chan []byte, sourceAddr **net.UDPAddr, ifname string) {
	buffer := make([]byte, 1500)

	for {
		n, srcAddr, err := socket.ReadFromUDP(buffer)
		if sourceAddr != nil {
			*sourceAddr = srcAddr
		}

		if err != nil {
			log.Error(err)
		}
		// log.Info("Received from " + ifname)
		for _, channel := range channels {
			channel <- buffer[:n]
		}
	}
}
