.PHONY: build test lint integration-test

build:
	go build -o dist/browserstack ./cmd/browserstack

test:
	go test ./...

lint:
	go vet ./...

integration-test:
	go test -tags integration ./...
