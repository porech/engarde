// +build !windows,!darwin

package main

import (
	"fmt"
	"net"
	"os"
	"syscall"
)

/* Borrowed from https://github.com/udhos/nexthop/ - Thanks! */
func udpConn(laddr *net.UDPAddr, ifname string) (*net.UDPConn, error) {
	if laddr == nil {
		laddr = &net.UDPAddr{IP: net.IPv4zero, Port: 0}
	}
	s, err1 := syscall.Socket(syscall.AF_INET, syscall.SOCK_DGRAM, syscall.IPPROTO_UDP)
	if err1 != nil {
		return nil, fmt.Errorf("Could not create socket(laddr=%v,ifname=%s): %v", laddr, ifname, err1)
	}
	if err := syscall.SetsockoptInt(s, syscall.SOL_SOCKET, syscall.SO_REUSEADDR, 1); err != nil {
		syscall.Close(s)
		return nil, fmt.Errorf("Could not set reuse addr socket(laddr=%v,ifname=%s): %v", laddr, ifname, err)
	}
	if ifname != "" {
		if err := syscall.SetsockoptString(s, syscall.SOL_SOCKET, syscall.SO_BINDTODEVICE, ifname); err != nil {
			syscall.Close(s)
			return nil, fmt.Errorf("Could not bind to device socket(laddr=%v, ifname=%s): %v", laddr, ifname, err)
		}
	}
	lsa := syscall.SockaddrInet4{Port: laddr.Port}
	copy(lsa.Addr[:], laddr.IP.To4())

	if err := syscall.Bind(s, &lsa); err != nil {
		syscall.Close(s)
		return nil, fmt.Errorf("Could not bind socket to address %v: %v", laddr, err)
	}
	f := os.NewFile(uintptr(s), "")
	c, err2 := net.FilePacketConn(f)
	f.Close()
	if err2 != nil {
		syscall.Close(s)
		return nil, fmt.Errorf("Could not get packet connection for socket(laddr=%v,ifname=%s): %v", laddr, ifname, err2)
	}

	return c.(*net.UDPConn), nil
}
