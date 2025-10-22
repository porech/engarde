# All
all: packr client server packr-clean

# Client build commands
client-linux-i386:
	CGO_ENABLED=0 GOOS=linux GOARCH=386 ./build-scripts/build.sh client
client-linux-amd64:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 ./build-scripts/build.sh client
client-linux-arm:
	CGO_ENABLED=0 GOOS=linux GOARCH=arm ./build-scripts/build.sh client
client-linux-arm64:
	CGO_ENABLED=0 GOOS=linux GOARCH=arm64 ./build-scripts/build.sh client
client-windows-i386:
	GOOS=windows GOARCH=386 ./build-scripts/build.sh client
client-windows-amd64:
	GOOS=windows GOARCH=amd64 ./build-scripts/build.sh client
client-darwin-amd64:
	GOOS=darwin GOARCH=amd64 ./build-scripts/build.sh client

# Server build commands
server-linux-i386:
	CGO_ENABLED=0 GOOS=linux GOARCH=386 ./build-scripts/build.sh server
server-linux-amd64:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 ./build-scripts/build.sh server
server-linux-arm:
	CGO_ENABLED=0 GOOS=linux GOARCH=arm ./build-scripts/build.sh server
server-linux-arm64:
	CGO_ENABLED=0 GOOS=linux GOARCH=arm64 ./build-scripts/build.sh server
server-windows-i386:
	GOOS=windows GOARCH=386 ./build-scripts/build.sh server
server-windows-amd64:
	GOOS=windows GOARCH=amd64 ./build-scripts/build.sh server
server-darwin-amd64:
	GOOS=darwin GOARCH=amd64 ./build-scripts/build.sh server

# Packr
packr-client:
	cd cmd/engarde-client && packr2
packr-server:
	cd cmd/engarde-server && packr2
packr-clean-client:
	cd cmd/engarde-client && packr2 clean
packr-clean-server:
	cd cmd/engarde-server && packr2 clean

packr: packr-client packr-server
packr-clean: packr-clean-client packr-clean-server

# Platform-specific builds
linux-i386: client-linux-i386 server-linux-i386
linux-amd64: client-linux-amd64 server-linux-amd64
linux-arm: client-linux-arm server-linux-arm
linux-arm64: client-linux-arm64 server-linux-arm64
windows-i386: client-windows-i386 server-windows-i386
windows-amd64: client-windows-amd64 server-windows-amd64
darwin-amd64: client-darwin-amd64 server-darwin-amd64
linux: linux-i386 linux-amd64 linux-arm
windows: windows-i386 windows-amd64
darwin: darwin-amd64

# Type-specific builds
client-i386: client-linux-i386 client-windows-i386
client-amd64: client-linux-amd64 client-windows-amd64 client-darwin-amd64
client-arm: client-linux-arm
client-arm64: client-linux-arm64
server-i386: server-linux-i386 server-windows-i386
server-amd64: server-linux-amd64 server-windows-amd64 server-darwin-amd64
server-arm: server-linux-arm
server-arm64: server-linux-arm
client: client-i386 client-amd64 client-arm client-arm64
server: server-i386 server-amd64 server-arm server-arm64
