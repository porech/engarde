package main

import (
	"crypto/subtle"
	"encoding/json"
	"io"
	"io/fs"
	"net/http"
	"time"

	"github.com/porech/engarde/v2/internal/assets"
	log "github.com/sirupsen/logrus"
)

type webSocket struct {
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

func webHandleFileServer(webFS fs.FS) http.HandlerFunc {
	fs := http.FileServer(http.FS(webFS))
	return func(w http.ResponseWriter, req *http.Request) {
		if req.URL.Path == "/" {
			index, err := webFS.Open("index.html")
			if err != nil {
				http.NotFound(w, req)
				return
			}
			defer index.Close()
			content, err := io.ReadAll(index)
			if err != nil {
				http.NotFound(w, req)
				return
			}
			w.WriteHeader(200)
			w.Write(content)
			return
		}
		fs.ServeHTTP(w, req)
	}
}

func webGetList(w http.ResponseWriter, r *http.Request) {
	rspSockets := []webSocket{}
	for address, client := range clients {
		last := time.Now().Unix() - client.Last
		rspSocket := webSocket{
			Address: address,
		}
		if client.Last > 0 {
			rspSocket.Last = &last
		}
		rspSockets = append(rspSockets, rspSocket)
	}

	rspObject := struct {
		Type          string      `json:"type"`
		Version       string      `json:"version"`
		Description   string      `json:"description"`
		ListenAddress string      `json:"listenAddress"`
		DstAddress    string      `json:"dstAddress"`
		Sockets       []webSocket `json:"sockets"`
	}{"server", Version, srConfig.Description, srConfig.ListenAddr, srConfig.DstAddr, rspSockets}
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

func webserver(listenAddr, username, password string) {
	for {
		realm := "engarde"
		webFS := assets.GetWebFS()
		http.HandleFunc("/", webBasicAuth(webHandleFileServer(webFS), username, password, realm))
		http.HandleFunc("/api/v1/get-list", NoCache(webBasicAuth(webGetList, username, password, realm)))
		log.Info("Management webserver listening on " + listenAddr)
		if err := http.ListenAndServe(listenAddr, nil); err != nil {
			log.Error(err)
			time.Sleep(1 * time.Second)
		}
	}
}
