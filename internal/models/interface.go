package models

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"sync"
)

type Interface struct {
	Name        string `json:"name"`
	Address     string `json:"address"`
	Destination string `json:"destination"`
	Excluded    bool   `json:"excluded"`
}

type InterfaceUpdate struct {
	Name         string     `json:"name"`
	NewInterface *Interface `json:"newInterface"`
}

type Interfaces struct {
	Interfaces []*Interface
	Mutex      sync.RWMutex
}

func (is Interfaces) Get(name string) *Interface {
	is.Mutex.RLock()
	defer is.Mutex.RUnlock()
	for _, i := range is.Interfaces {
		if i.Name == name {
			return i
		}
	}
	return nil
}

func (is Interfaces) Add(i *Interface) error {
	is.Mutex.RLock()
	for _, ei := range is.Interfaces {
		if ei.Name == i.Name {
			is.Mutex.RUnlock()
			return fmt.Errorf("interface already exists")
		}
	}
	is.Mutex.RUnlock()
	is.Mutex.Lock()
	is.Interfaces = append(is.Interfaces, i)
	is.Mutex.Unlock()
	log.Debugf("Interfaces.Add: added interface %s", i.Name)
	return nil
}

func (is Interfaces) Remove(name string) error {
	removed := false
	var newInterfaces []*Interface
	is.Mutex.RLock()
	for _, int := range is.Interfaces {
		if int.Name != name {
			newInterfaces = append(newInterfaces, int)
		} else {
			removed = true
		}
	}
	is.Mutex.RUnlock()
	if !removed {
		return fmt.Errorf("interface not found")
	}
	is.Mutex.Lock()
	is.Interfaces = newInterfaces
	is.Mutex.Unlock()
	log.Debugf("Interfaces.Remove: removed interface %s", name)
	return nil
}
