# All
all: frontend client server

frontend:
	cd webmanager && \
	npm install && \
	npm run-script \
	build-prod && \
	cd .. && \
	rm -rf internal/assets/browser && \
	cp -r webmanager/dist/webmanager/browser internal/assets/

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
client-windows-arm:
	GOOS=windows GOARCH=arm ./build-scripts/build.sh client
client-windows-arm64:
	GOOS=windows GOARCH=arm64 ./build-scripts/build.sh client
client-darwin-amd64:
	GOOS=darwin GOARCH=amd64 ./build-scripts/build.sh client
client-darwin-arm64:
	GOOS=darwin GOARCH=arm64 ./build-scripts/build.sh client

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
server-windows-arm:
	GOOS=windows GOARCH=arm ./build-scripts/build.sh server
server-windows-arm64:
	GOOS=windows GOARCH=arm64 ./build-scripts/build.sh server
server-darwin-amd64:
	GOOS=darwin GOARCH=amd64 ./build-scripts/build.sh server
server-darwin-arm64:
	GOOS=darwin GOARCH=arm64 ./build-scripts/build.sh server

# Platform-specific builds
linux-i386: client-linux-i386 server-linux-i386
linux-amd64: client-linux-amd64 server-linux-amd64
linux-arm: client-linux-arm server-linux-arm
linux-arm64: client-linux-arm64 server-linux-arm64
windows-i386: client-windows-i386 server-windows-i386
windows-amd64: client-windows-amd64 server-windows-amd64
windows-arm: client-windows-arm server-windows-arm
windows-arm64: client-windows-arm64 server-windows-arm64
darwin-amd64: client-darwin-amd64 server-darwin-amd64
darwin-arm64: client-darwin-arm64 server-darwin-arm64
linux: linux-i386 linux-amd64 linux-arm linux-arm64
windows: windows-i386 windows-amd64 windows-arm windows-arm64
darwin: darwin-amd64 darwin-arm64

# Type-specific builds
client-i386: client-linux-i386 client-windows-i386
client-amd64: client-linux-amd64 client-windows-amd64 client-darwin-amd64
client-arm: client-linux-arm client-windows-arm
client-arm64: client-linux-arm64 client-windows-arm64 client-darwin-arm64
server-i386: server-linux-i386 server-windows-i386
server-amd64: server-linux-amd64 server-windows-amd64 server-darwin-amd64
server-arm: server-linux-arm server-windows-arm
server-arm64: server-linux-arm64 server-windows-arm64 server-darwin-arm64
client: client-i386 client-amd64 client-arm client-arm64
server: server-i386 server-amd64 server-arm server-arm64
