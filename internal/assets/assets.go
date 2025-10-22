package assets

import (
	"embed"
	"io/fs"
)

//go:embed browser
var WebAssets embed.FS

// GetWebFS returns the embedded web assets filesystem
func GetWebFS() fs.FS {
	webFS, _ := fs.Sub(WebAssets, "browser")
	return webFS
}
