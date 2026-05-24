# Codegen Test Suite

Tests for the TypeScript client code generator in `src/codegen/typescript/` and shared utilities in `src/codegen/shared/`.

## Test Files

### `annotations.test.ts`
Tests `readAnnotations` — parses `x-response-transform`, `x-request-transform`, and `x-*-custom` flags from an OpenAPI operation object into a typed `OperationAnnotations` struct.

- Returns defaults (`json` codec, no custom flags) when no annotations are present
- Parses `x-response-transform` codec and config
- Throws on unknown codec names
- Throws with operationId + field path when config fails schema validation
- Sets `custom.response = true` for `x-response-custom`

### `annotations.test.ts` → `readAnnotations`

### `derive-return-type.test.ts`
Tests `deriveReturnType` — maps the OpenAPI success response type + codec annotation into a TypeScript return type expression, optionally emitting named helper type aliases.

- `json-unwrap` with `$.foo` path: extracts `foo` property, emits a named `GetXResult` alias
- `json-unwrap` with `$[*].bar` path: emits both an element alias (`GetXResultItem`) and a list alias (`GetXResult`)
- `json` codec: returns the raw response type with no aliases
- `text` codec: returns `string`; `binary` codec: returns `ArrayBuffer` or `Blob`

### `emit-error-type.test.ts`
Tests `emitErrorAlias` — generates a `export type XError = HttpError<…>` union from the operation's 4xx/5xx response schemas.

- Builds a union of error body types from the listed status codes
- Emits `HttpError<unknown>` when there are no error responses

### `emit-method.test.ts`
Tests `emitMethod` — the core method body emitter. Exercises the full range of method generation behavior.

- Emits correct method signature with path params (camelized), return type, and `Promise<>`
- Camelizes `snake_case` path param names in the TypeScript signature
- Wraps request body with `toSnakeCase` when `hasRequestBody` is true
- Wraps response with `toCamelCase`
- Inverts request field overrides for `toSnakeCase` (sidecar: `snake→camel` → inverted `camel→snake`)
- Emits `@param name - description` JSDoc tags for path params that have descriptions
- Emits `@param name - description` JSDoc tags for query params that have descriptions
- Emits `@param options` JSDoc tag on every method (always present)
- Does NOT emit `@param` tags for path/query params that have no descriptions
- Combines method-level description and `@param` tags into a single JSDoc block

### `emit-module.test.ts`
Tests `emitModule` — assembles a complete TypeScript module from a class name, methods, error aliases, return type aliases, and field overrides.

- Emits the `/* AUTO-GENERATED — do not edit */` header
- Imports `operations` from the provided `typesImportPath`
- Imports only `toCamelCase` when no methods have request bodies
- Imports `toSnakeCase` when any method has a request body
- Emits `export class X extends APIClient` with the provided class name
- Emits error type aliases for operations with 4xx/5xx responses
- Emits return type helper aliases before the class body
- Deduplicates identical return type aliases across multiple methods
- Applies field overrides to the correct method by operationId
- Trims trailing whitespace from every output line
- Emits multiple methods in source order

### `generate-client.test.ts`
Integration tests for `generateClientModule` — reads a real YAML spec file and produces a complete TypeScript module string.

- Matches the golden snapshot for the `tiny-spec.yml` fixture (via `snapshot.test.ts`)
- Strips the product prefix from method names (`getAutomateBrowsers` → `getBrowsers`)
- Skips operations marked `x-request-custom` or `x-response-custom`
- Emits `@param` JSDoc tags from `description` fields on path/query parameters in the spec
- Resolves `$ref` parameters from `components/parameters` and applies their descriptions
- Respects `x-base-url: sdkCloud` per-operation override
- Emits array query params (name ending in `[]`) as `tsType[]` with the `[]` suffix stripped

### `field-overrides.test.ts`
Tests `loadFieldOverrides` — loads a YAML sidecar file that maps operation IDs to field rename rules.

- Returns `{}` when the file does not exist
- Parses `response` and `request` rename maps from YAML
- Returns `{}` when the `overrides` key is present but empty

### `operation.test.ts`
Tests shared utilities in `src/codegen/shared/operation.ts`.

**`toPascalCase`**
- Converts hyphen-, underscore-, and dot-separated words to PascalCase
- Handles single words, already-PascalCase input, and consecutive separators

**`stripOperationPrefix`**
- Strips the known product prefix from an operationId (`getAutomateBrowsers` → `getBrowsers`)
- Handles multi-word products (`test-management` → strips `TestManagement`)
- Returns the operationId unchanged for unknown products or missing prefixes
- Covers all entries in `OPERATION_ID_PREFIX`

**`toActionSlug`**
- Converts camelCase method names to kebab-case CLI slugs
- Handles acronyms and all-caps sequences

**`toCLIAction`**
- Maps `get-*s` (plural) to `list-*`
- Maps `get-*` returning an array schema to `list-*`
- Preserves non-get verbs and singular non-array getters

**`isArrayList`**
- Returns `true` for `{ type: "array" }` schemas
- Returns `false` for object, string, `null`, and `undefined`
- Recurses into `oneOf` / `anyOf` to find array members

### `snapshot.test.ts`
Golden-file test. Generates a module from `fixtures/tiny-spec.yml` and asserts byte-for-byte equality with `fixtures/tiny-spec.expected.ts`. Catches any unintended changes to code generation output.

## Fixtures

| File | Purpose |
| ---- | ------- |
| `tiny-spec.yml` | Minimal 3-path spec: one GET with path param (json-unwrap), one GET returning text, one POST with custom codecs (excluded from generation) |
| `tiny-spec.expected.ts` | Golden output for `tiny-spec.yml` — the exact string `generateClientModule` must produce |
