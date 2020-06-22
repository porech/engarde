package main

import (
	"github.com/porech/engarde/v2/internal/interfaces"
	log "github.com/sirupsen/logrus"
)

func main() {
	log.SetLevel(log.DebugLevel)
	watcher := interfaces.NewWatcher()
	defer func() { watcher.QuitChannel <- true }()

	for {
		_ = <-watcher.UpdateChannel
	}
}
