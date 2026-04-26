.PHONY: build build-all-platforms test lint integration-test

VERSION := $(shell node -e "process.stdout.write(require('../typescript/package.json').version)")

build:
	go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client ./cmd/browserstack

build-all-platforms:
	GOOS=linux GOARCH=amd64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-linux-amd64 ./cmd/browserstack
	GOOS=linux GOARCH=arm64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-linux-arm64 ./cmd/browserstack
	GOOS=darwin GOARCH=amd64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-darwin-amd64 ./cmd/browserstack
	GOOS=darwin GOARCH=arm64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-darwin-arm64 ./cmd/browserstack
	GOOS=windows GOARCH=amd64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-windows-amd64.exe ./cmd/browserstack

test:
	go test ./...

lint:
	@if ! command -v golangci-lint >/dev/null 2>&1; then \
		if ! command -v $$(go env GOPATH)/bin/golangci-lint >/dev/null 2>&1; then \
			echo "Installing golangci-lint..."; \
			curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $$(go env GOPATH)/bin v1.59.1; \
		fi; \
	fi
	$$(go env GOPATH)/bin/golangci-lint run

integration-test:
	go test -tags integration ./...
