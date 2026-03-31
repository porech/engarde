# Building from source

## Prerequisites

- **Go** (1.16 or later)
- **Node.js** (22.x recommended) and **npm** -- only needed for the web management frontend
- **Git** -- used to embed version information in the binaries
- **Make** -- for the automated build

## Quick build (all platforms)

To build the frontend and all client/server binaries for every supported platform:

```sh
make
```

This produces binaries under `dist/{os}/{arch}/`:

```
dist/
  linux/      i386/ amd64/ arm/ arm64/
  windows/    i386/ amd64/ arm/ arm64/
  darwin/     amd64/ arm64/
```

You can also build a subset:

```sh
make linux          # all Linux architectures
make windows-arm64  # Windows ARM64 only
make client         # client for all platforms
make server-linux-amd64  # single target
```

Run `grep '^[a-z]' Makefile` to see all available targets.

## Manual build

If you need more control over the build process, you can run each step separately.

### 1. Build the frontend

The web management UI is an Angular application in the `webmanager/` directory. The compiled assets are embedded into the Go binaries at build time.

```sh
cd webmanager
npm install
npm run build-prod
cd ..
rm -rf internal/assets/browser
cp -r webmanager/dist/webmanager/browser internal/assets/
```

This only needs to be done once (or whenever you modify the frontend). If you skip this step, the binaries will use whatever assets are already in `internal/assets/`.

### 2. Build the Go binaries

Each binary is built with `go build`, targeting `./cmd/engarde-client` or `./cmd/engarde-server`:

```sh
go build -ldflags "-s -w" -o engarde-client ./cmd/engarde-client
go build -ldflags "-s -w" -o engarde-server ./cmd/engarde-server
```

This builds for your current OS and architecture. The `-s -w` flags strip debug information to reduce binary size.

### Cross-compiling

Go supports cross-compilation natively via the `GOOS` and `GOARCH` environment variables. For example, to build the server for Linux ARM64:

```sh
GOOS=linux GOARCH=arm64 go build -ldflags "-s -w" -o engarde-server ./cmd/engarde-server
```

For Linux targets, you may want to disable CGO to produce fully static binaries:

```sh
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -ldflags "-s -w" -o engarde-server ./cmd/engarde-server
```

Common `GOOS`/`GOARCH` combinations:

| OS      | GOARCH  |
| ------- | ------- |
| linux   | 386, amd64, arm, arm64 |
| windows | 386, amd64, arm, arm64 |
| darwin  | amd64, arm64 |

See the full list with `go tool dist list`.
