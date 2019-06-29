package main

import (
	"net"

	log "github.com/sirupsen/logrus"
)

func handleErr(err error) {
	if err != nil {
		log.Warn(err)
	}
}

func main() {
	interfaces, err := net.Interfaces()
	handleErr(err)
	for _, iface := range interfaces {
		ifname := iface.Name
		print("Interface: " + ifname + "\r\n")
		addrs, err := iface.Addrs()
		handleErr(err)
		for _, addr := range addrs {
			print("  Address: " + addr.String() + "\r\n")
		}
	}
}
