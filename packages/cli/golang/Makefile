.PHONY: build test lint integration-test

VERSION := $(shell node -e "process.stdout.write(require('../typescript/package.json').version)")

build:
	go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client ./cmd/browserstack

test:
	go test ./...

lint:
	go vet ./...

integration-test:
	go test -tags integration ./...
