package models

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"net"
	"sync"
)

type Connection struct {
	Interface      string `json:"interface"`
	Socket         *net.UDPConn
	CloseWriteBack *bool
}

type Connections struct {
	Connections []*Connection
	Mutex       *sync.RWMutex
}

func (cs Connections) Get(iface string) *Connection {
	cs.Mutex.RLock()
	defer cs.Mutex.RUnlock()
	for _, c := range cs.Connections {
		if c.Interface == iface {
			return c
		}
	}
	return nil
}

func (cs Connections) Add(c *Connection) error {
	cs.Mutex.RLock()
	for _, ei := range cs.Connections {
		if ei.Interface == c.Interface {
			return fmt.Errorf("connection for this interface already exists")
		}
	}
	cs.Mutex.RLock()
	cs.Mutex.Lock()
	cs.Connections = append(cs.Connections, c)
	cs.Mutex.Unlock()
	log.Debugf("Connections.Add: added connection for interface %s", c.Interface)
	return nil
}

func (cs Connections) Remove(iface string) error {
	removed := false
	var newConnections []*Connection
	cs.Mutex.RLock()
	for _, con := range cs.Connections {
		if con.Interface != iface {
			newConnections = append(newConnections, con)
		} else {
			removed = true
		}
	}
	cs.Mutex.RUnlock()
	if !removed {
		return fmt.Errorf("connection not found")
	}
	cs.Mutex.Lock()
	cs.Connections = newConnections
	cs.Mutex.Unlock()
	log.Debugf("Connections.Remove: removed connection for interface %s", iface)
	return nil
}
