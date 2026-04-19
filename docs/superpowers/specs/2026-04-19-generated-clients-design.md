# Generated Clients Design

**Date:** 2026-04-19  
**Branch:** feature/streaming-transforms  
**Goal:** Replace all hand-written client files with generated clients. Minimal hand-written layer, maximum generated surface.

---

## Problem

Each package in the monorepo has a hand-written `client.ts` (1,776 lines total across all packages) that is a maintenance burden. The generated base classes already do 80% of the work. The remaining 20% — response unwrapping, FormData construction, platform overloads — can either be moved into codegen or dropped entirely.

---

## Decision

**Option A — Thin convenience layer:** The generated client is the primary export. Hand-written `client.ts` files are deleted. Each package's `index.ts` re-exports the generated class directly. The only code that remains per package is `index.ts`, `package.json`, and `tsconfig.json`.

Platform overloads (e.g., `uploadFlutterApp("android" | "ios", ...)`) are dropped. Callers use the generated method by operationId directly.

---

## Architecture

### Layers

1. **OpenAPI YAML spec** — annotated with `x-response-transform` and `x-request-transform` extensions to drive codec selection
2. **Field override sidecar** (`packages/openapi/field-overrides.yaml`) — per-field camelCase name exceptions for API inconsistencies
3. **Codegen** (`packages/openapi-transforms/src/codegen/`) — emits one typed class per product
4. **Package exports** — `packages/*/src/index.ts` re-exports the generated class as the public API

### Generated method shape

```ts
// Input: camelCase (public API)
// Wire: snake_case (derived from spec field names)
uploadAppiumApp(data: { file: Blob; fileName: string; customId?: string }, options?: ExecuteOptions) {
  return this.execute({ ..., requestInput: toSnakeCase(data), ... }).then(toCamelCase);
}
```

---

## operationId Typing

```ts
type OperationId = keyof operations | (string & {})
```

- `keyof operations` — IDE autocomplete + compile-time safety for known operationIds
- `string & {}` — accepts unknown operationIds (new server endpoints not yet in generated types) without collapsing the union and losing autocomplete

Applied to: `execute()` in core, all generated method signatures, any public-facing type that accepts an operationId.

---

## Case Transform

**Convention:**
- **Public API (method names, parameters, response objects):** camelCase
- **Wire format (query params, request bodies, path params, response fields):** snake_case as defined in the spec

**Implementation:**
- `packages/openapi-transforms/src/transforms/case.ts` — two pure functions:
  - `toSnakeCase(obj)` — applied to request input before codec encoding
  - `toCamelCase(obj)` — applied to decoded response before returning to caller
- Both functions recurse over plain objects and arrays; non-object values are passed through untouched
- Codegen wraps every `execute()` call with these transforms — no manual wiring per method

**Exceptions:**
- Blanket camelCase↔snake_case is the default
- Per-field overrides live in `packages/openapi/field-overrides.yaml` (sidecar, not in the spec itself)
- Format: `operationId.fieldPath → camelCaseName` for both request and response fields
- Rationale: naming exceptions are a client concern, not an API contract concern — keeping them out of the spec avoids polluting it with client-side details
- Codegen reads the sidecar alongside the spec and emits the override mapping into the generated method

**Example sidecar entry:**
```yaml
overrides:
  getAppAutomateBuilds:
    response:
      "automation_build": "build"   # expose as .build instead of .automationBuild
  uploadAppAutomateApp:
    request:
      "custom_id": "appId"          # accept as appId instead of customId
```

---

## FormData / Multipart

- The `request-multipart` codec already exists in `packages/openapi-transforms/src/codecs/`
- Codegen reads `x-request-transform: { codec: "multipart" }` on upload operations and emits `requestCodec: "multipart"`
- Generated method input type is camelCase (e.g., `{ file: Blob; fileName: string; customId?: string }`)
- `toSnakeCase()` converts to wire format before the codec runs
- Any upload operation not yet annotated in the spec gets annotated as part of this migration
- No hand-written `new FormData()` anywhere

---

## What Changes

### Deleted
- `packages/automate/src/client.ts`
- `packages/app-automate/src/client.ts`
- `packages/js-testing/src/client.ts`
- `packages/screenshots/src/client.ts`
- `packages/local-testing/src/client.ts`

### Modified
- `packages/*/src/index.ts` — re-export generated class instead of hand-written class
- `packages/openapi/openapi.yml` — add `x-request-transform`/`x-response-transform` annotations to any operations not yet annotated (especially multipart uploads)
- `packages/openapi-transforms/src/codegen/` — emit camelCase param types, wrap execute with case transforms, read field-overrides sidecar
- `packages/core/src/api-client.ts` — update `execute()` operationId type to `keyof operations | (string & {})`

### New files
- `packages/openapi/field-overrides.yaml` — per-field name exception map
- `packages/openapi-transforms/src/transforms/case.ts` — `toSnakeCase` / `toCamelCase` pure functions

---

## What Is Not Changed

- `packages/local-testing-binary/` — uses `node:*` modules, not an API client, out of scope
- `packages/cli/` — CLI entry points, not affected
- `packages/core/` — runtime unchanged except operationId type update
- Test infrastructure — integration tests will need updating to use generated method names, but test strategy (live API) is unchanged

---

## Success Criteria

1. All hand-written `client.ts` files deleted
2. Every package exports the generated class directly
3. All public method parameters and response fields are camelCase
4. Known operationIds have autocomplete; unknown strings are accepted without type errors
5. No hand-written FormData construction
6. Field override sidecar covers all known API naming inconsistencies
7. Existing integration tests pass (updated to new method names)
