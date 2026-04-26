.PHONY: build test lint integration-test

VERSION := $(shell node -e "process.stdout.write(require('../typescript/package.json').version)")

build:
	go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client ./cmd/browserstack

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
