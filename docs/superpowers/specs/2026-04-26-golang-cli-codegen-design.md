# Design: Go CLI & Codegen

**Date:** 2026-04-26
**Status:** Approved

## Goal

Add a Go CLI binary to the monorepo. The primary target is a CLI tool; the generated HTTP client layer is structured to be importable by other Go programs as a bonus. The codegen pipeline stays entirely in TypeScript — Go toolchain is only needed for the final binary compile step.

---

## Repository Structure Changes

### `packages/openapi-transforms/src/codegen/` — split by language

```
packages/openapi-transforms/src/codegen/
  typescript/                    ← current codegen/* relocated here (no logic changes)
    index.ts
    emit-method.ts
    emit-module.ts
    emit-error-type.ts
    annotations.ts
    derive-return-type.ts
    field-overrides.ts
  golang/                        ← new Go emitter, written in TypeScript
    index.ts
    emit-file.ts
    emit-method.ts
    emit-types.ts
    case.ts
```

The package's public export `@browserstack-client/openapi-transforms/codegen` re-exports from `codegen/typescript/index.ts` — no change to external consumers.

### `packages/cli/` — split by language

```
packages/cli/
  typescript/                    ← current packages/cli/* relocated here
    src/
      generated/                 ← currently packages/cli/src/
    package.json
    tsconfig.json
    tsup.config.ts
    tsup.binary.config.ts

  golang/                        ← new Go CLI package
    generated/                   ← Go source emitted by codegen
      automate/
        client.go
        types.go
      app-automate/
        client.go
        types.go
      screenshots/
        client.go
        types.go
      local-testing/
        client.go
        types.go
      local-testing-binary/
        client.go
        types.go
      test-management/
        client.go
        types.go
      test-reporting/
        client.go
        types.go
      accessibility/
        client.go
        types.go
    cmd/
      browserstack/
        main.go
        automate.go
        app_automate.go
        screenshots.go
        local_testing.go
        test_management.go
        test_reporting.go
        accessibility.go
    internal/
      http/
        client.go
        multipart.go
      output/
        json.go
    go.mod
    go.sum
    Makefile
```

`pnpm-workspace.yaml` replaces `packages/cli` with `packages/cli/typescript`. All monorepo references to `@browserstack-client/cli` update accordingly.

---

## Codegen: `codegen/golang/`

Five TypeScript modules emit Go source from OpenAPI YAML specs.

### `golang/index.ts` — `generateGoModule()`

Entry point. Reads and parses the YAML spec, resolves `$ref` parameters, iterates all paths and HTTP methods, delegates to `emit-types.ts` and `emit-method.ts`, returns two strings: one for `types.go`, one for `client.go`.

Called from `packages/openapi/build.mjs` in a new `generateGoModules()` function that loops the same `productSpecs` array used for TypeScript generation, writing output to `packages/cli/golang/generated/{product}/`.

### `golang/emit-file.ts`

Emits the package declaration, `import` block, and client struct definition:

```go
package automate

import (
    "context"
    "github.com/browserstack/browserstack-client/internal/http"
)

type AutomateClient struct {
    http *http.Client
}

func New(c *http.Client) *AutomateClient {
    return &AutomateClient{http: c}
}
```

### `golang/emit-method.ts`

Emits one Go method per OpenAPI operation. Path params become positional arguments. Query params become a `map[string]string` argument when present. Request body becomes a typed struct pointer argument. All methods thread `context.Context` as the first parameter.

```go
func (c *AutomateClient) GetAutomateBuilds(ctx context.Context) (*GetAutomateBuildsResponse, error) {
    var out GetAutomateBuildsResponse
    if err := c.http.Get(ctx, "/automate/builds.json", nil, &out); err != nil {
        return nil, err
    }
    return &out, nil
}

func (c *AutomateClient) GetAutomateBuild(ctx context.Context, buildId string) (*Build, error) {
    var out Build
    if err := c.http.Get(ctx, "/automate/builds/"+buildId+".json", nil, &out); err != nil {
        return nil, err
    }
    return &out, nil
}

func (c *AutomateClient) UploadAutomateMediaFile(ctx context.Context, file []byte, fileName string, fields map[string]string) (*UploadAutomateMediaFileResponse, error) {
    var out UploadAutomateMediaFileResponse
    if err := c.http.PostMultipart(ctx, "/automate/upload", file, fileName, fields, &out); err != nil {
        return nil, err
    }
    return &out, nil
}
```

Operations with `x-request-transform: codec: multipart` emit a `PostMultipart` call. Operations with `x-response-transform: codec: text` return `(string, error)` instead of a struct pointer.

### `golang/emit-types.ts`

Emits Go structs from `components/schemas`. Each property maps to a PascalCase exported field with a snake_case `json` tag. Optional fields (not in `required`) use pointer types.

```go
type Build struct {
    Name            *string  `json:"name"`
    Status          *string  `json:"status"`
    Duration        *int     `json:"duration"`
    HashedId        *string  `json:"hashed_id"`
    BuildTag        *string  `json:"build_tag"`
    PublicUrl       *string  `json:"public_url"`
}

type GetAutomateBuildsResponse struct {
    AutomationBuilds []Build `json:"automation_builds"`
}
```

Response wrapper structs (e.g. `GetAutomateBuildsResponse`) are emitted inline — not derived from `components/schemas` but synthesised from the operation's 200 response schema.

### `golang/case.ts`

Naming helpers:

- `toPascalCase(s)` — converts `snake_case` or `kebab-case` to `PascalCase` for struct field names and type names
- `toGoPackageName(product)` — converts product name to Go package name using the rule: last word of hyphenated name, with an explicit exceptions map for stdlib conflicts:

```typescript
const STDLIB_CONFLICTS: Record<string, string> = {
  "local-testing":        "localtesting",
  "local-testing-binary": "localbinary",
};

export function toGoPackageName(product: string): string {
  if (STDLIB_CONFLICTS[product]) return STDLIB_CONFLICTS[product];
  return product.split("-").at(-1)!;
}
```

All other products use their last hyphen-segment: `test-management` → `management`, `test-reporting` → `reporting`, `screenshots` → `screenshots`, `accessibility` → `accessibility`.

Note: `app-automate` would also resolve to `automate` via this rule, colliding with the standalone `automate` package. It is therefore also added to the exceptions map: `"app-automate": "appautomatepackage"` is ugly, so it uses `"appautomatepackage"` → actually `"appautomate"` (concatenated, no separator):

```typescript
const STDLIB_CONFLICTS: Record<string, string> = {
  "local-testing":        "localtesting",
  "local-testing-binary": "localbinary",
  "app-automate":         "appautomate",
};
```

Directory names under `generated/` remain kebab-case (`app-automate/`, `local-testing/`) since directory names are not constrained by Go package naming rules — the `package` declaration inside each file is what matters.

---

## Hand-Written Go

### `internal/http/client.go`

Shared HTTP executor used by all generated clients. Handles Basic Auth, JSON encode/decode, URL construction, query string building, and error detection.

```go
type Client struct {
    baseURL    string
    username   string
    accessKey  string
    httpClient *http.Client
}

type APIError struct {
    StatusCode int
    Status     string
    Body       string
}

func (e *APIError) Error() string {
    return fmt.Sprintf("HTTP %d %s: %s", e.StatusCode, e.Status, e.Body)
}

func New(baseURL, username, accessKey string) *Client
func (c *Client) Get(ctx context.Context, path string, query map[string]string, out any) error
func (c *Client) Post(ctx context.Context, path string, body any, out any) error
func (c *Client) Put(ctx context.Context, path string, body any, out any) error
func (c *Client) Patch(ctx context.Context, path string, body any, out any) error
func (c *Client) Delete(ctx context.Context, path string, query map[string]string, out any) error
func (c *Client) PostMultipart(ctx context.Context, path string, file []byte, fileName string, fields map[string]string, out any) error
```

Non-2xx responses return `*APIError`. Network failures return the raw `net/http` error wrapped with `fmt.Errorf("...: %w", err)`. No error hierarchy beyond this.

### `internal/http/multipart.go`

Helper that builds a `multipart/form-data` request body from a file byte slice, filename, and additional string fields. Used by generated multipart upload methods.

### `internal/output/json.go`

```go
func Print(v any) error {
    b, err := json.MarshalIndent(v, "", "  ")
    if err != nil {
        return err
    }
    fmt.Println(string(b))
    return nil
}
```

All CLI output goes through this. Responses are printed as snake_case JSON (from the struct `json` tags) — idiomatic for Go CLI tools.

### `cmd/browserstack/main.go`

```go
func main() {
    username  := os.Getenv("BROWSERSTACK_USERNAME")
    accessKey := os.Getenv("BROWSERSTACK_ACCESS_KEY")

    if username == "" || accessKey == "" {
        fmt.Fprintln(os.Stderr, "BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set")
        os.Exit(1)
    }

    if len(os.Args) < 3 {
        fmt.Fprintln(os.Stderr, "Usage: browserstack <product> <action> [args...]")
        os.Exit(1)
    }

    product := os.Args[1]
    action  := os.Args[2]
    args    := os.Args[3:]

    httpClient := internalhttp.New("https://api.browserstack.com", username, accessKey)

    switch product {
    case "automate":      runAutomate(httpClient, action, args)
    case "app-automate":  runAppAutomate(httpClient, action, args)
    case "screenshots":   runScreenshots(httpClient, action, args)
    // ...
    default:
        fmt.Fprintf(os.Stderr, "unknown product: %s\n", product)
        os.Exit(1)
    }
}
```

Product handler files (`automate.go`, `app_automate.go`, etc.) instantiate the generated client, call the appropriate method based on `action`, and print the result via `output.Print()`. Errors are written to stderr with `os.Exit(1)`.

---

## Build Pipeline Integration

### `pnpm build:types`

Unchanged in invocation. `build.mjs` gains a `generateGoModules()` function called after TS generation:

```js
// build.mjs (addition)
import { generateGoModule } from "@browserstack-client/openapi-transforms/codegen/golang";

async function generateGoModules() {
  for (const { product, baseUrl } of productSpecs) {
    const specPath = path.join(__dirname, "specs", `${product}.yml`);
    const { typesGo, clientGo } = await generateGoModule({ specPath, product, baseUrl });
    const outDir = path.join(__dirname, "../../cli/golang/generated", product);
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, "types.go"), typesGo);
    await fs.writeFile(path.join(outDir, "client.go"), clientGo);
    console.log(`  ✓ ${product}/ (Go)`);
  }
}

await generateGoModules();
```

Generated `.go` files are committed to the repo. Developers working TS-only never need Go installed.

### `pnpm build:go`

New root script:

```json
"build:go": "cd packages/cli/golang && make build"
```

The `Makefile` in `packages/cli/golang/`:

```makefile
.PHONY: build test lint

build:
	go build -o dist/browserstack ./cmd/browserstack

test:
	go test ./...

lint:
	go vet ./...

integration-test:
	go test -tags integration ./...
```

---

## Testing

### Codegen tests (TypeScript)

`packages/openapi-transforms/src/__tests__/codegen/golang/` mirrors the existing TypeScript codegen test structure. Snapshot tests assert that `generateGoModule()` emits expected `.go` source for known spec fixtures. Syntactic validity is verified by shelling out to `gofmt -e` on the emitted string — exit code 0 means valid Go syntax.

### Go unit tests

`internal/http/` and `internal/output/` have `_test.go` files using Go stdlib `testing` and `net/http/httptest` for mock HTTP servers. No third-party assertion libraries.

### Go integration tests

```go
//go:build integration

package automate_test

func TestGetAutomateBuilds(t *testing.T) {
    username  := os.Getenv("BROWSERSTACK_USERNAME")
    accessKey := os.Getenv("BROWSERSTACK_ACCESS_KEY")
    if username == "" || accessKey == "" {
        t.Skip("credentials not set")
    }
    // ...
}
```

Run with `go test -tags integration ./...`. Same credential pattern as TypeScript integration tests. Skipped automatically when credentials are absent.

---

## Conventions Summary

| Concern | Convention |
|---------|-----------|
| Exported names | PascalCase (`AutomateClient`, `GetAutomateBuilds`) |
| Package names | Last hyphen-segment of product name; `localtesting`/`localbinary` for stdlib conflicts |
| JSON decode tags | snake_case matching API wire format |
| JSON output | snake_case (from struct tags, no transform) |
| Optional fields | Pointer types (`*string`, `*int`) |
| Error handling | Flat: `*APIError` for HTTP errors, wrapped stdlib errors for network failures |
| Context | `context.Context` as first param on every method |
| File names | `client.go`, `types.go`, `main.go`, `automate.go` (lowercase, no separators) |
| Tests | stdlib `testing`, `net/http/httptest` for mocks, `//go:build integration` tag |
