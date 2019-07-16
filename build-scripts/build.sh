#!/bin/bash

type=$1

if [ "$type" != "client" ] && [ "$type" != "server" ]; then
    echo "Usage: $0 [client|server]"
    exit 1
fi

if [ "$TRAVIS_COMMIT" != "" ]; then
    commit=$(echo "$TRAVIS_COMMIT" | head -c 7);
    branch="$TRAVIS_BRANCH";
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

echo "Building $type for $GOOS $dstArch - ver. $version"
go build -ldflags "-X 'main.Version=$version'" -o dist/$GOOS/$dstArch/engarde-$type ./cmd/engarde-$type
