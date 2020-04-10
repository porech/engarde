package models

import "fmt"

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

type Interfaces []*Interface

func (is Interfaces) GetByName(name string) *Interface {
	for _, i := range is {
		if i.Name == name {
			return i
		}
	}
	return nil
}

func (is Interfaces) GetIndexByName(name string) int {
	for n, i := range is {
		if i.Name == name {
			return n
		}
	}
	return -1
}

func (is *Interfaces) Add(i *Interface) (int, error) {
	if is == nil {
		return 0, fmt.Errorf("nil interface reference")
	}
	for _, ei := range *is {
		if ei.Name == i.Name {
			return 0, fmt.Errorf("interface already exists")
		}
	}
	newIdx := len(*is)
	*is = append(*is, i)
	return newIdx, nil
}

func (is *Interfaces) RemoveByIndex(i int) error {
	if is == nil {
		return fmt.Errorf("nil interface reference")
	}
	removed := false
	var newInterfaces Interfaces
	for n, int := range *is {
		if n != i {
			newInterfaces = append(newInterfaces, int)
		} else {
			removed = true
		}
	}
	if !removed {
		return fmt.Errorf("interface not found")
	}
	*is = newInterfaces
	return nil
}

func (is *Interfaces) RemoveByName(name string) error {
	if is == nil {
		return fmt.Errorf("nil interface reference")
	}
	removed := false
	var newInterfaces Interfaces
	for _, int := range *is {
		if int.Name != name {
			newInterfaces = append(newInterfaces, int)
		} else {
			removed = true
		}
	}
	if !removed {
		return fmt.Errorf("interface not found")
	}
	*is = newInterfaces
	return nil
}
