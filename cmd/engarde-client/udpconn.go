// +build windows

package main

import (
	"net"
)

// In Windows, it's enough to listen on a particular address to bind to its interface
func udpConn(laddr *net.UDPAddr, ifname string) (*net.UDPConn, error) {
	return net.ListenUDP("udp", laddr)
}
