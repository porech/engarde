package models

import "net"

type Connection struct {
	Interface string `json:"interface"`
	Socket    *net.UDPConn
}

type Connections []Connection
