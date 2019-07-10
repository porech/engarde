package main

import (
	"crypto/subtle"
	"encoding/json"
	"io/ioutil"
	"net"
	"net/http"
	"time"

	"github.com/gobuffalo/packr/v2"
	log "github.com/sirupsen/logrus"
)

type webInterface struct {
	Name    string `json:"name"`
	Status  string `json:"status"`
	Address string `json:"address"`
	Last    *int64 `json:"last"`
}

func webBasicAuth(handler http.HandlerFunc, username, password, realm string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if username != "" && password != "" {
			user, pass, ok := r.BasicAuth()

			if !ok || subtle.ConstantTimeCompare([]byte(user), []byte(username)) != 1 || subtle.ConstantTimeCompare([]byte(pass), []byte(password)) != 1 {
				w.Header().Set("WWW-Authenticate", `Basic realm="`+realm+`"`)
				w.WriteHeader(401)
				w.Write([]byte("Unauthorized.\n"))
				return
			}
		}
		handler(w, r)
	}
}

func webHandleFileServer(box *packr.Box, prefix string) http.HandlerFunc {
	fs := http.FileServer(box)
	realHandler := fs.ServeHTTP
	return func(w http.ResponseWriter, req *http.Request) {
		if req.URL.Path == "/" {
			index, err := box.Find("index.html")
			if err != nil {
				http.NotFound(w, req)
				return
			}
			w.WriteHeader(200)
			w.Write(index)
			return
		}
		realHandler(w, req)
	}
}

func webGetList(w http.ResponseWriter, r *http.Request) {
	rspInterfaces := []webInterface{}
	interfaces, err := net.Interfaces()
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		return
	}
	for _, iface := range interfaces {
		ifname := iface.Name
		address := getAddressByInterface(iface)
		if isExcluded(ifname) {
			rspIface := webInterface{
				Name:    ifname,
				Status:  "excluded",
				Address: address,
			}
			rspInterfaces = append(rspInterfaces, rspIface)
			continue
		}

		if routine, ok := sendingChannels[ifname]; ok {
			respLast := time.Now().Unix() - routine.LastRec
			rspIface := webInterface{
				Name:    ifname,
				Status:  "active",
				Address: address,
			}
			if routine.LastRec > 0 {
				rspIface.Last = &respLast
			}
			rspInterfaces = append(rspInterfaces, rspIface)
			continue
		} else {
			rspIface := webInterface{
				Name:    ifname,
				Status:  "idle",
				Address: address,
			}
			rspInterfaces = append(rspInterfaces, rspIface)
			continue
		}
	}
	rspObject := struct {
		Type       string         `json:"type"`
		Interfaces []webInterface `json:"interfaces"`
	}{"client", rspInterfaces}
	rspJSON, err := json.Marshal(rspObject)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(rspJSON)
}

func webResetExclusions(w http.ResponseWriter, r *http.Request) {
	exclusionSwaps = make(map[string]bool)
	rsp, err := json.Marshal(struct {
		Status string `json:"status"`
	}{"ok"})
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		return
	}
	w.WriteHeader(200)
	w.Write(rsp)
}

func webSwapExclusion(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		return
	}
	var req struct {
		Iface string `json:"interface"`
	}
	err = json.Unmarshal(body, &req)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		return
	}
	swapExclusion(req.Iface)
	rsp, err := json.Marshal(struct {
		Status string `json:"status"`
	}{"ok"})
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(rsp)
}

func webserver(listenAddr, username, password string) {
	realm := "engarde"
	box := packr.New("webmanager", "../../webmanager/dist/webmanager")
	http.HandleFunc("/", webBasicAuth(webHandleFileServer(box, "/"), username, password, realm))
	http.HandleFunc("/get-list", webBasicAuth(webGetList, username, password, realm))
	http.HandleFunc("/swap-exclusion", webBasicAuth(webSwapExclusion, username, password, realm))
	http.HandleFunc("/reset-exclusions", webBasicAuth(webResetExclusions, username, password, realm))
	log.Info("Management webserver listening on " + listenAddr)
	if err := http.ListenAndServe(listenAddr, nil); err != nil {
		log.Error(err)
	}
}
