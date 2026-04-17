# Streaming Transform Layer — Design

**Status:** Draft
**Date:** 2026-04-18
**Target version:** 6.x (additive, no public API breaks)
**Scope:** Core runtime, OpenAPI codegen, all product-client packages

## Summary

Replace ~2,500 lines of hand-written, boilerplate-heavy client methods across the six product-client packages with a declarative, codec-driven transform layer. Spec annotations (`x-request-transform`, `x-response-transform`) become the single source of truth for how request bodies are serialized, how response bodies are parsed and unwrapped, and how responses are collected. Internally, response transforms run as streaming pipelines to keep peak memory bounded on large responses. The public API (method signatures, return types, error shape) is unchanged for existing consumers.

The design is extensible through a **codec registry**: each named transform (e.g. `json-unwrap`, `multipart`, `json-compose`) is a codec with a typed config. New content types (NDJSON, SSE, protobuf, streaming upload) are added as new codecs without schema changes to annotations or core.

Error handling is upgraded to a typed subclass hierarchy (`NetworkError`, `HttpError<TBody>`, `DecodeError`, `TransformError`, `ClientError`) that guarantees HTTP context (status, headers, operationId) whenever a response was received, while preserving the existing `BrowserStackError` base class for backward compatibility.

## Goals

1. Eliminate pass-through boilerplate in client classes (~70–80% of current method code)
2. Keep memory bounded during parsing of large response bodies (multi-MB logs, build lists)
3. Centralize envelope-unwrapping rules in the OpenAPI spec rather than hand-coded `.then()` chains
4. Provide a single, extensible mechanism for all request/response content types — present and future
5. Deliver a consistent, strongly-typed error model with HTTP status always available when a response arrived
6. Preserve the public API — no consumer code needs to change to stay on 6.x

## Non-goals

- Streaming **public** return types (`AsyncIterable`) — out of scope. Streaming is internal; `getBuilds()` still returns `Promise<Build[]>`.
- Runtime schema validation of success responses (beyond codec decode failures) — reserved as `"validation"` error kind; not implemented in v1.
- Retry logic — `retryable` boolean is surfaced on errors; policies/executors are not built in.
- Runtime-behavior breaking changes — all changes ship within the 6.x line. Type-level refinements that may surface latent errors in consumer code are expected and called out in release notes; they are not considered runtime breaks.
- Migration away from `openapi-fetch` — it remains the default transport.

## Background

### Current state

Each product-client package (`automate`, `app-automate`, `js-testing`, `screenshots`, `local-testing`, `local-testing-binary`) extends `APIClient<paths>` from `@browserstack-client/core`. Client methods follow one of three patterns:

1. **Pass-through** (~60–70%): build `params.path`/`params.query` from arguments, call `makeXRequest`, return.
2. **Envelope unwrap** (~25%): pass-through + `.then((d) => d.project)` to flatten API response envelopes.
3. **Custom** (~5–10%): hand-crafted `bodySerializer` for FormData uploads; composed responses merging multiple envelope fields.

The current `APIClient` wraps `openapi-fetch` and exposes protected helpers (`makeGetRequest`, `makeCloudPostRequest`, etc.). Error handling throws `BrowserStackError("Request failed", { path, response, ...init })` — uniform but lossy: no structured access to HTTP status, no differentiation between network/HTTP/decode failures.

### Pain points driving this work

- Adding a new endpoint requires hand-writing a client method even though the spec already encodes everything the method needs.
- Large responses (network logs, build lists, session enumeration) materialize the full body and parse tree in memory before unwrapping.
- Future BrowserStack APIs are expected to return larger payloads; the current "parse whole body, then transform" approach won't scale.
- Error handling forces consumers to destructure `error.context.response` by trial and error.

### What survives from today

- The OpenAPI specs in `packages/openapi/specs/` and their generated types in `packages/openapi/generated/`.
- The `APIClient` base class name and auth resolution (username/accessKey + env vars).
- `BrowserStackError` as a public class name.
- `openapi-fetch` as the default transport.
- The `fetchFn` option for Axios/Got adapters.

## Architecture

### Layers

```
┌──────────────────────────────────────────────────────────────┐
│  Public API: AutomateClient, AppAutomateClient, ...          │
│  (hand-written overrides extend generated base classes)      │
├──────────────────────────────────────────────────────────────┤
│  Generated clients (per product package)                     │
│  Thin methods that call execute() with codec references      │
├──────────────────────────────────────────────────────────────┤
│  APIClient.execute()                                         │
│  Routes request through codecs; wraps errors                 │
├──────────────────────────────────────────────────────────────┤
│  Codec registry                                              │
│  Built-in codecs (json, json-unwrap, multipart, ...) +       │
│  user-registered codecs                                      │
├──────────────────────────────────────────────────────────────┤
│  Transport: openapi-fetch (default) or user-supplied fetchFn │
└──────────────────────────────────────────────────────────────┘
```

### Data flow — response path

```
fetch() ─► Response
              │
              ├─ status !ok ─► body capture ─► HttpError<TBody>
              │
              └─ status ok
                    │
                    ▼
           Response codec (decode)
                    │
                    ├─ decode failure ─► DecodeError
                    │
                    └─ decoded value
                          │
                          ▼
                 Transform (path extraction)
                          │
                          ├─ transform failure ─► TransformError
                          │
                          └─ typed value ──► consumer
```

For codecs that support streaming (e.g. `json-unwrap`), `decode` and `transform` are fused into a single `ReadableStream` pipeline: bytes flow through a streaming JSON parser that emits only the path-matched records, which the collector assembles into the return value. No intermediate parse tree exists.

### Data flow — request path

```
consumer args ─► build input object
                       │
                       ▼
              Request codec (encode)
                       │
                       ├─ encode failure ─► ClientError
                       │
                       └─ { body, headers } ─► fetch()
```

## Codec Registry

### Interface

```ts
export interface CodecContext {
  operationId: string;
  method: string;
  url: string;
}

export interface ResponseCodec<TConfig, TOutput> {
  readonly name: string;
  readonly contentTypes: readonly string[];
  readonly configSchema: StandardSchemaV1<TConfig>;
  decode(
    response: Response,
    config: TConfig,
    ctx: CodecContext,
  ): Promise<TOutput>;
}

export interface EncodedRequest {
  body: BodyInit;
  headers?: Record<string, string>;
}

export interface RequestCodec<TInput, TConfig> {
  readonly name: string;
  readonly contentType: string;
  readonly configSchema: StandardSchemaV1<TConfig>;
  encode(input: TInput, config: TConfig): EncodedRequest;
}
```

`StandardSchemaV1` refers to the [Standard Schema](https://standardschema.dev/) spec, supported by Zod, Valibot, ArkType, and others. Codec config validation at codegen time does not tie the project to a specific validator.

### Registry

A `CodecRegistry` maps codec names to implementations. One registry instance per client instance:

```ts
export class CodecRegistry {
  register(codec: ResponseCodec<any, any> | RequestCodec<any, any>): void;
  resolveResponse(name: string): ResponseCodec<any, any>;
  resolveRequest(name: string): RequestCodec<any, any>;
}
```

Built-in codecs are registered by default at construction. User-supplied codecs passed via `BrowserStackOptions.codecs` are registered on top.

### Built-in codecs (v1)

| Direction | Name | Config | Purpose |
|---|---|---|---|
| Response | `json` | `{}` | Whole-body JSON parse. Default when no annotation. |
| Response | `json-unwrap` | `{ path: string }` | Streaming JSON parse + JSONPath extraction. Handles single-value and array unwraps. |
| Response | `json-compose` | `{ base: string; merge?: Record<string, string> }` | Base object + merged fields from sibling paths. Handles `getAutomateBuild` shape. |
| Response | `text` | `{}` | Plain-text body (logs endpoints). |
| Response | `binary` | `{ as?: "arraybuffer" \| "blob" }` | Binary body. Default `arraybuffer`. |
| Request | `json` | `{}` | Whole-object JSON body. Default. |
| Request | `multipart` | `{ fileField: string; filenameFrom: string }` | FormData construction from an input object. Buffered in v1. |

### Codecs reserved for future (interfaces compatible, not shipped)

`ndjson`, `sse`, `gzip` / `gunzip`, `csv`, `xml`, `protobuf`, `msgpack`, streaming `multipart` (request-side streaming upload), `form-urlencoded`, response `stream` (raw `ReadableStream` passthrough), `byContentType` dispatcher, pipeline (array of codecs).

These are not implemented in v1. The annotation schema (see below) accepts only a single codec reference, but the internal runtime is structured so that pipeline/dispatcher variants can be added without spec schema changes.

### JSONPath subset

The `json-unwrap` codec accepts a constrained JSONPath grammar:

- `$` — root
- `.foo` — child by name
- `[*]` — all array elements
- `[0]` — array index

Sufficient for every case in BrowserStack's specs. Unsupported syntax (filters, recursive descent, slices) rejected at codegen time with a clear error message. Grammar is extensible; adding features later is non-breaking.

## Spec Annotations

Added under each operation in the OpenAPI spec files in `packages/openapi/specs/`.

### Shape

```yaml
paths:
  /automate/projects/{projectId}.json:
    get:
      operationId: getAutomateProject
      x-response-transform:
        codec: json-unwrap
        config:
          path: "$.project"
```

```yaml
x-request-transform:
  codec: multipart
  config:
    fileField: "file"
    filenameFrom: "$.filename"
```

### Variants by operation

**Array unwrap:**
```yaml
x-response-transform:
  codec: json-unwrap
  config:
    path: "$[*].automation_build"
```

**Composed response (e.g. `getAutomateBuild`):**
```yaml
x-response-transform:
  codec: json-compose
  config:
    base: "$.build.automation_build"
    merge:
      sessions: "$.build.sessions[*].automation_session"
```

**Text body (e.g. `getAutomateSessionLogs`):**
```yaml
x-response-transform:
  codec: text
```

**Opt out — operation handled by a hand-written method:**
```yaml
x-response-custom: true
x-request-custom: true
```

When either flag is present, codegen skips method generation for that operation. The hand-written override in `packages/<product>/src/client.ts` owns the implementation.

### Default behavior (no annotation)

- `x-response-transform` absent → codec `json` (whole-body parse, no unwrap).
- `x-request-transform` absent → codec `json` (whole-object JSON body).

The annotation is required only when the default doesn't match the endpoint's shape.

### Validation at codegen time

Each annotation's `config` is validated against the referenced codec's `configSchema` at codegen. Malformed configs fail the build with a line-precise error:

```
[openapi build] operation getAutomateProject
  x-response-transform.config.path must be a string, got number
  at packages/openapi/specs/automate.yml:846
```

Unknown codec names fail the same way.

## Error Model

### Taxonomy

```ts
export type ErrorKind =
  | "network"    // fetch rejected (DNS, connection, abort, timeout)
  | "http"       // response received, non-2xx
  | "decode"     // response body could not be parsed by codec
  | "transform"  // parsed OK but path/shape extraction failed
  | "validation" // reserved — response didn't match schema (not in v1)
  | "client";    // bad args / misconfiguration, caught pre-fetch
```

### Class hierarchy

```ts
export class BrowserStackError extends Error {
  readonly kind: ErrorKind;
  readonly operationId: string;
  readonly url: string;
  readonly method: string;
  readonly cause?: Error;
  // Legacy (deprecated, preserved through 6.x):
  readonly code?: string;
  readonly context?: ErrorContext | Error;
}

export class NetworkError extends BrowserStackError {
  readonly kind: "network";
  readonly cause: Error;
}

export type ErrorBody<T> = {
  contentType?: string;
  text?: string;
  parsed?: T;
  truncated?: boolean;
};

export class HttpError<TBody = unknown> extends BrowserStackError {
  readonly kind: "http";
  readonly status: number;
  readonly statusText: string;
  readonly headers: Headers;
  readonly requestId?: string;
  readonly body: ErrorBody<TBody>;
  readonly retryable: boolean;
}

export class DecodeError extends BrowserStackError {
  readonly kind: "decode";
  readonly status: number;
  readonly statusText: string;
  readonly headers: Headers;
  readonly codecName: string;
  readonly cause: Error;
}

export class TransformError extends BrowserStackError {
  readonly kind: "transform";
  readonly status: number;
  readonly statusText: string;
  readonly codecName: string;
  readonly path?: string;
  readonly cause: Error;
}

export class ClientError extends BrowserStackError {
  readonly kind: "client";
}
```

Codecs throw a narrow internal exception type, `CodecError`, which the runtime wraps into `DecodeError` or `TransformError` based on the codec's reported stage. `CodecError` is an implementation detail of the codec layer, not part of the public API:

```ts
// Internal — not exported from core's public surface
export class CodecError extends Error {
  constructor(
    public readonly codecName: string,
    public readonly stage: "decode" | "transform",
    message: string,
    public readonly cause?: Error,
  ) { super(message); }
}
```

### Invariant

**If a response arrived, `status`, `statusText`, `headers` are non-optional on the resulting error subclass.** Enforced by the type system (subclasses declare them as required) and by the runtime's single error-wrapping path — `APIClient.execute()` is the only place errors are constructed, and it populates these fields from the `Response` before throwing.

### Per-operation error body types

Codegen emits a type alias per operation that combines the spec's error response schemas:

```ts
export type GetAutomateProjectError = HttpError<
  | components["schemas"]["400.BadRequest"]
  | components["schemas"]["401.Unauthorized"]
  | components["schemas"]["404.NotFound"]
  | components["schemas"]["422.UnprocessableEntity"]
  | components["schemas"]["5xx.InternalServerError"]
>;
```

Consumers catching a known operation's error can narrow to the typed body via `instanceof HttpError` plus the generated alias.

### Message extraction from inconsistent upstream bodies

Default extractor handles the shapes observed across BrowserStack APIs:

```ts
function defaultErrorMessage(body: unknown): string | undefined {
  if (typeof body === "string") return body.slice(0, 512);
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    return firstString(o.error)
        ?? firstString(o.message)
        ?? firstString((o.errors as any[])?.[0])
        ?? firstString(o.detail)
        ?? firstString(o.description);
  }
}
```

Consumers can override per-client:

```ts
new AutomateClient({
  errorMessageExtractor: (body, ctx) => { /* custom logic */ },
  maxErrorBodySize: 128 * 1024, // default 64 KB
});
```

The raw body is always preserved on `error.body.text` and `error.body.parsed` regardless of the extractor's output.

### Retryable classification

```ts
function isRetryable(kind: ErrorKind, status?: number): boolean {
  if (kind === "network") return true;
  if (kind !== "http") return false;
  if (status === 408 || status === 429) return true;
  if (status && status >= 500 && status < 600) {
    return status !== 501 && status !== 505;
  }
  return false;
}
```

Exposed as `HttpError.retryable`. v1 does not implement retry execution; the flag is provided for consumer-side policies.

### Body capture

For `HttpError`, `DecodeError`, `TransformError`, the runtime reads up to `maxErrorBodySize` bytes of the response body (default 64 KB). Attempts JSON parse; falls back to text; sets `truncated: true` if the body exceeded the cap. Never unbounded.

## Code Generation

### Scope

`packages/openapi/build.mjs` is extended to produce, for each spec, a generated client module alongside the existing generated types:

```
packages/openapi/generated/
  automate.ts                  (existing — types)
  automate.client.ts           (new — generated thin methods + transform table)
```

Each product package imports its generated client and re-exports or extends it:

```
packages/automate/src/
  client.ts                    (hand-written — only custom methods + class shell)
```

### Generator inputs

- The spec YAML (`packages/openapi/specs/<product>.yml`)
- The codec registry's config schemas (for annotation validation)
- The spec's generated types (for return-type inference)

### Generator outputs per operation

1. **If `x-*-custom: true`** — no method generated. The hand-written client owns it.
2. **Otherwise** — a method with:
   - Parameter list derived from `operations["<operationId>"]["parameters"]` and `requestBody`
   - A body calling `this.execute(...)` with operationId, method, path, codec references, codec configs
   - A return-type annotation derived by applying the response codec's path to the response schema (e.g. `$.project` on `{ project: AutomateProject }` → `AutomateProject`)

### Generator outputs per spec

- A transform table constant for runtime dispatch
- A per-operation error body type alias (`<OperationId>Error`)

### Snapshot testing

Generator output for a fixture spec is committed as a golden file. Regenerating against the fixture and diffing catches accidental changes to generated code. Fixture is in `packages/openapi/__tests__/fixtures/` with the expected output alongside.

## Runtime

### APIClient.execute()

Replaces the four/five `makeXRequest` variants with a single method:

```ts
protected async execute<TCodec extends ResponseCodec<any, any>>(
  spec: {
    operationId: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    params?: { path?: Record<string, unknown>; query?: Record<string, unknown> };
    body?: unknown;
    requestCodec?: RequestCodec<any, any>;
    requestCodecConfig?: unknown;
    responseCodec: TCodec;
    responseCodecConfig: unknown;
    baseUrl?: "sdk" | "sdkCloud";
  },
): Promise<
  TCodec extends ResponseCodec<any, infer O> ? O : never
>;
```

Responsibilities:

1. Resolve base URL (sdk vs sdkCloud)
2. Encode request body via `requestCodec` if present
3. Invoke `openapi-fetch` for the request
4. Network-error path → throw `NetworkError`
5. HTTP-error path → capture body, throw `HttpError<TBody>` (typed by codegen at call site)
6. Success path → invoke `responseCodec.decode`, wrap `CodecError` into `DecodeError`/`TransformError`
7. Return decoded value

The existing `makeXRequest` helpers are kept temporarily (one minor version) as thin wrappers over `execute` with a fixed `json` codec — preserves backward compat for any external code that extended `APIClient` directly (internal only, but defensive).

### Streaming internals

The `json-unwrap` and `json-compose` codecs consume `response.body` (a `ReadableStream<Uint8Array>`) via `@streamparser/json`. Records matching the configured path are emitted to a collector; the collector yields a `Promise<T>` or `Promise<T[]>` depending on the path's cardinality. The intermediate parse tree is never materialized.

### Adapter compatibility

Custom `fetchFn` implementations that buffer the response body (Axios adapter with `responseType: "arraybuffer"`, Got adapter) still work — the streaming codec reads from `response.body`, which is still a `ReadableStream` even if the underlying transport buffered. Memory benefit is lost in that case (transport already buffered) but correctness is preserved.

Streaming **upload** (future phase) requires a transport that supports `body: ReadableStream` with `duplex: "half"`. Native fetch on Node ≥ 18.11 supports this; Axios/Got adapters need adaptation. Not in v1 scope.

## Public API Impact

### Unchanged

- Class names, constructor signatures, method names and parameters, return types for all existing endpoints
- `BrowserStackError` as a base class — all existing `catch (e) { if (e instanceof BrowserStackError) ... }` blocks work unchanged
- `error.message` — still populated (from extractor for HTTP errors, from underlying cause for network)
- `error.code`, `error.context` — preserved through 6.x, flagged deprecated, removed in v7
- `fetchFn` option
- Env var resolution (`BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`, `BROWSERSTACK_KEY`)
- Node ≥ 18 requirement

### New

- `BrowserStackOptions.codecs` — register custom codecs per client
- `BrowserStackOptions.errorMessageExtractor` — override default heuristic
- `BrowserStackOptions.maxErrorBodySize` — cap error body capture
- Exported error subclasses: `NetworkError`, `HttpError`, `DecodeError`, `TransformError`, `ClientError`
- Exported type guards: `isNetworkError`, `isHttpError`, `isDecodeError`, `isTransformError`, `isClientError`
- Per-operation error type aliases in each product package's generated module

### Tightened

Some generated method return types become more precise than their current inferred shape. Consumers relying on loose types (e.g. `as any` on the result) may encounter new compile errors. Documented in release notes as a type-level refinement.

## Rollout

Progressive, one package per PR. Each PR is individually shippable because all public API is preserved.

1. **Phase A** — Error model in `core` (`NetworkError`, `HttpError`, ...). Existing `BrowserStackError` remains base. Ship as a patch.
2. **Phase 0** — Codec registry infrastructure in `core`. No consumers yet.
3. **Phase 1** — Built-in response codecs (`json`, `json-unwrap`, `json-compose`, `text`, `binary`).
4. **Phase 2** — Built-in request codecs (`json`, `multipart`).
5. **Phase 3** — Codegen extension in `packages/openapi/build.mjs`.
6. **Phase B** — Type-level test infrastructure (vitest `expectTypeOf`).
7. **Phase 4** — Wire the `automate` package. Annotate its spec, regenerate, verify existing integration tests pass unchanged, trim `packages/automate/src/client.ts` to custom methods only.
8. **Phase 5** — Repeat Phase 4 for `app-automate`, `js-testing`, `screenshots`, `local-testing`. (Local-testing-binary is not HTTP-client-based and is unaffected.)
9. **Phase 6** — Documentation: new error types, codec extension guide, migration notes for tightened types.

### Version strategy

- **Phase A** ships as a minor bump — adds exported error subclasses and new constructor options (additive public API).
- **Phases 0–3** ship as patch releases — changes are internal to `core` and `openapi`; no new public API surface.
- **Phase 4** ships as another minor bump — new `BrowserStackOptions.codecs` wiring becomes observable through the `automate` client, and per-operation error aliases are published.
- **Phases 5–6** ship as patch releases — wiring additional packages and documentation, no further public API additions.
- The old `makeXRequest` helpers on `APIClient` are removed no earlier than v7 to give any downstream extenders of `APIClient` a full major version of overlap.

## Testing

### TDD sequence

Each phase is red-green-refactor. No implementation code is written before a failing test.

#### Phase A — Error model

1. Subclass construction: each subclass sets correct `kind`, non-optional fields populated from `Response`
2. `instanceof` narrowing: `e instanceof HttpError` → `e.status: number` typed correctly
3. Body capture: size cap, truncation flag, best-effort JSON parse
4. Default message extractor: each heuristic branch, plain-text fallback, string trimming
5. Custom extractor override: consumer-supplied function called with raw body + context
6. Retryable classification: 408, 429, 5xx (except 501, 505), 4xx, network
7. Backward compat: `error.context` still populated in 6.x; `code`, `message`, `name` behaviors preserved; `instanceof BrowserStackError` works for all subclasses

#### Phase 0 — Codec registry

1. Register, resolve, conflict detection on duplicate names
2. Unknown codec at resolve → descriptive error
3. Built-in codecs registered automatically on construction
4. User-supplied codecs registered on top; can't shadow built-ins (configurable later if needed)

#### Phase 1 — Response codecs

1. **Path parser** — `$`, `$.foo`, `$.foo.bar`, `$[*]`, `$[0]`, `$[*].foo`, `$.foo[*].bar`; reject unsupported syntax with line reference
2. **`json` codec** — whole-body parse; malformed JSON → `CodecError` (wrapped to `DecodeError`)
3. **`json-unwrap` single** — `$.project` on `{ project: {...} }` → unwrapped object; missing path → `CodecError` (wrapped to `TransformError`)
4. **`json-unwrap` array** — `$[*].foo` on `[{foo: 1}, {foo: 2}]` → `[1, 2]`; empty array → `[]`
5. **`json-compose`** — base + merge fixture modeled on `getAutomateBuild` response
6. **`text` codec** — body read as UTF-8 text
7. **`binary` codec** — body read as `ArrayBuffer` or `Blob` per config
8. **Streaming property test** — random valid JSON + random valid path; streaming output equals `JSON.parse` + equivalent manual extraction
9. **Streaming memory test** — large (10 MB) fixture processed without materializing the full parse tree (assertion via heap snapshot before/after)

#### Phase 2 — Request codecs

1. **`json` codec** — `JSON.stringify` of input; `Content-Type: application/json`
2. **`multipart` codec** — FormData construction from `{ file, filename, ...fields }` input; file part named correctly; other fields preserved; `Content-Type` unset (let fetch set boundary)

#### Phase 3 — Codegen

1. Fixture spec with each annotation variant → generated module matches golden file
2. `x-response-custom` / `x-request-custom` → no method generated
3. Malformed `config` → codegen exits non-zero with line-precise error
4. Unknown codec name → codegen exits non-zero
5. Per-operation error type alias generated from spec's error responses

#### Phase B — Type-level tests

Using vitest `expectTypeOf`:

1. `getProject` returns `Promise<AutomateProject>`, not `Promise<{ project: AutomateProject }>`
2. `HttpError` narrowing gives non-optional `status`, `headers`
3. `getProject` generated error type narrows `body.parsed` to the spec's error response union
4. `ResponseCodec<TConfig, TOutput>` preserves `TOutput` through `execute`
5. Custom codec registration preserves its signature on the client

#### Phase 4 — One product package (`automate`)

1. **Existing integration tests pass unchanged.** This is the backward-compat gate — `packages/automate/src/__tests__/automate.test.ts` hits the live API and asserts response shapes. If it's green, the refactor preserved behavior.
2. Unit tests for hand-written overrides (file uploads, composed responses) — these wrap generated methods; tests verify wrapper behavior.
3. Type tests (Phase B) run against the real generated output.

#### Phase 5 — Remaining packages

Each follows Phase 4 exactly. Integration tests are the gate.

### Test infrastructure

- **Fixtures** — `packages/openapi/__tests__/fixtures/` holds small spec fragments and their expected generated output
- **Golden files** — generated output committed; CI regen compares byte-for-byte
- **Property tests** — via `fast-check` for JSON/path fuzzing in streaming codec tests
- **Heap measurement** — `process.memoryUsage().heapUsed` before/after, with forced GC via `--expose-gc` in CI
- **Integration tests** — unchanged; act as contract tests for public API

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Streaming parser bug causes silent data loss (missing records) | Property test compares streaming output to `JSON.parse` oracle on random inputs |
| Codegen emits broken code on spec edge cases | Snapshot tests on fixture specs; CI fails if output drifts; integration tests catch runtime failures |
| Tightened generated types break consumer compilation | Flagged in release notes; consumers can add `as any` escapes if needed during upgrade |
| Vendor extensions lock us into this implementation | `x-*-custom: true` escape hatch allows any operation to remain hand-written; migration away would require porting annotations to the new tool |
| Adapter incompatibility with future streaming-upload codec | Deferred to follow-up phase with its own compatibility design |
| JSON streaming parser dependency (`@streamparser/json`) becomes unmaintained | Path grammar is narrow enough to hand-roll (~200 lines) if needed; interface abstracts the parser |
| Bundle size grows by ~8 KB gzipped | Acceptable for the memory/maintainability gains; flagged in release notes |

## Open Questions

None at design time. Implementation may surface questions (e.g. exact shape of `execute`'s signature, whether to expose a lower-level request method for escape hatches) that are handled in the implementation plan.

## Appendix A — Worked Example

### Before

```ts
// packages/automate/src/client.ts
getProject(
  projectId: number,
  options?: APIFetchOptions<operations["getAutomateProject"]>,
) {
  return this.makeGetRequest("/automate/projects/{projectId}.json", {
    ...options,
    params: { path: { projectId } },
  }).then((data) => data.project);
}
```

### After

Spec annotation:

```yaml
/automate/projects/{projectId}.json:
  get:
    operationId: getAutomateProject
    x-response-transform:
      codec: json-unwrap
      config:
        path: "$.project"
```

Generated method (in `packages/openapi/generated/automate.client.ts` — consumed by `packages/automate/src/client.ts`):

```ts
getProject(
  projectId: number,
  options?: APIFetchOptions<operations["getAutomateProject"]>,
): Promise<components["schemas"]["AutomateProject"]> {
  return this.execute({
    operationId: "getAutomateProject",
    method: "GET",
    path: "/automate/projects/{projectId}.json",
    params: { path: { projectId } },
    responseCodec: codecs.jsonUnwrap,
    responseCodecConfig: { path: "$.project" },
    ...options,
  }) as Promise<components["schemas"]["AutomateProject"]>;
}
```

Hand-written `AutomateClient` extends the generated class and only declares custom methods (uploads, composed responses that don't fit `json-compose`).

## Appendix B — Built-in Codec Summary Table

| Codec | Direction | Built-in v1 | Config type |
|---|---|---|---|
| `json` | response | ✓ | `{}` |
| `json-unwrap` | response | ✓ | `{ path: string }` |
| `json-compose` | response | ✓ | `{ base: string; merge?: Record<string, string> }` |
| `text` | response | ✓ | `{}` |
| `binary` | response | ✓ | `{ as?: "arraybuffer" \| "blob" }` |
| `stream` | response | — | reserved |
| `ndjson` | response | — | reserved |
| `sse` | response | — | reserved |
| `gunzip` | response | — | reserved |
| `json` | request | ✓ | `{}` |
| `multipart` | request | ✓ | `{ fileField: string; filenameFrom: string }` |
| `form-urlencoded` | request | — | reserved |
| `binary` | request | — | reserved |
| `gzip` | request | — | reserved |
