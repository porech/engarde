#!/bin/bash

type=$1

if [ "$type" != "client" ] && [ "$type" != "server" ]; then
    echo "Usage: $0 [client|server]"
    exit 1
fi

if [ "$GITHUB_REF" != "" ]; then
    commit=$(echo "$GITHUB_SHA" | head -c 7);
    branch=${GITHUB_REF#refs/heads/};
    version="$commit ($branch)"
elif [ $(which git) != "" ]; then
    commit=$(git rev-parse HEAD | head -c 7);
    branch=$(git rev-parse --abbrev-ref HEAD);
    version="$commit ($branch) - UNOFFICIAL BUILD"
else
   version="UNOFFICIAL BUILD"
fi

dstArch="$GOARCH"
if [ "$dstArch" = "386" ]; then
    dstArch="i386"
fi

dstName="engarde-$type"
if [ "$GOOS" = "windows" ]; then
    dstName="$dstName.exe"
fi

echo "Building $type for $GOOS $dstArch - ver. $version"
go build -ldflags "-s -w -X 'main.Version=$version'" -o dist/$GOOS/$dstArch/$dstName ./cmd/engarde-$type
