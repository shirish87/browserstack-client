# Streaming Transform Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hand-written client-method boilerplate with a declarative, spec-annotation-driven transform layer, packaged as a standalone reusable `@browserstack-client/openapi-transforms` package that `core` consumes.

**Architecture:** A new transport-agnostic package hosts the codec registry, JSON-streaming response decoders, FormData request encoders, error hierarchy, and an OpenAPI codegen emitter. `packages/openapi/build.mjs` calls the emitter per spec. `packages/core`'s `APIClient.execute()` wraps the transports's `executeOperation()` with BrowserStack auth and dual base URLs. Public API of existing clients is preserved; `BrowserStackError` remains a catchable base.

**Tech Stack:** TypeScript (ESM), tsup, pnpm workspaces, Vitest, `openapi-fetch`, `openapi-typescript`, `@streamparser/json`, `@standard-schema/spec`, `fast-check` (dev).

**Spec reference:** `docs/superpowers/specs/2026-04-18-streaming-transform-layer-design.md`

---

## File Structure

**New package `packages/openapi-transforms/`:**

```
packages/openapi-transforms/
  package.json
  tsconfig.json
  tsup.config.ts
  vitest.config.ts
  src/
    index.ts                          # public exports
    errors.ts                         # HttpError, NetworkError, DecodeError, TransformError, ClientError, type guards
    codec-error.ts                    # internal CodecError
    body-capture.ts                   # bounded response-body capture
    error-message.ts                  # defaultErrorMessage + firstString
    retryable.ts                      # isRetryable()
    registry.ts                       # CodecRegistry, ResponseCodec, RequestCodec, CodecContext
    path/
      parser.ts                       # JSONPath subset parser → AST
      matcher.ts                      # AST runner over decoded values
      types.ts                        # PathNode discriminated union
    codecs/
      response-json.ts                # whole-body JSON
      response-json-unwrap.ts         # streaming unwrap
      response-json-compose.ts        # base + merges
      response-text.ts
      response-binary.ts
      request-json.ts
      request-multipart.ts
      index.ts                        # registerBuiltins(registry)
    streaming/
      json-stream.ts                  # @streamparser/json wrapper, emits path matches
    execute.ts                        # executeOperation(spec, fetchFn, registry, options)
    codegen/
      annotations.ts                  # read + validate x-request-transform, x-response-transform, x-*-custom
      emit-method.ts                  # operation → TS method source
      emit-error-type.ts              # operation → per-op error alias
      emit-module.ts                  # assemble generated client module
      index.ts                        # generateClientModule(spec, registry)
    types.ts                          # shared utility types
  src/__tests__/
    errors.test.ts
    body-capture.test.ts
    error-message.test.ts
    retryable.test.ts
    registry.test.ts
    path/parser.test.ts
    path/matcher.test.ts
    codecs/response-json.test.ts
    codecs/response-json-unwrap.test.ts
    codecs/response-json-compose.test.ts
    codecs/response-text.test.ts
    codecs/response-binary.test.ts
    codecs/request-json.test.ts
    codecs/request-multipart.test.ts
    streaming/json-stream.test.ts
    streaming/property.test.ts
    streaming/memory.test.ts
    execute.test.ts
    codegen/annotations.test.ts
    codegen/emit-method.test.ts
    codegen/emit-error-type.test.ts
    codegen/snapshot.test.ts
    types.test-d.ts                   # vitest expectTypeOf type-level tests
    fixtures/
      tiny-spec.yml
      tiny-spec.expected.ts           # golden file
      big-json.json                   # 10 MB streaming fixture (generated)
```

**Modified `packages/core/`:**
- `src/error.ts` — re-exports transforms' errors; `BrowserStackError` becomes a shared base
- `src/api-client.ts` — adds `execute()`, keeps `makeXRequest` as thin wrappers (one version of overlap)
- `src/index.ts` — re-export new error classes + type guards
- `package.json` — add `@browserstack-client/openapi-transforms` dep

**Modified `packages/openapi/`:**
- `build.mjs` — import codegen from transforms; emit `<product>.client.ts` alongside `<product>.ts`
- `package.json` — add transforms dep

**Modified product packages (automate, app-automate, js-testing, screenshots, local-testing):**
- `src/client.ts` — extend generated base class, keep only custom methods
- Annotate corresponding `packages/openapi/specs/<product>.yml` operations

**New root:**
- `packages/openapi-transforms/README.md` — usage guide (written in Phase 6)

---

## Phase A — Error Hierarchy Foundation

**Location:** `packages/openapi-transforms/`

### Task A0: Bootstrap the new package

**Files:**
- Create: `packages/openapi-transforms/package.json`
- Create: `packages/openapi-transforms/tsconfig.json`
- Create: `packages/openapi-transforms/tsup.config.ts`
- Create: `packages/openapi-transforms/vitest.config.ts`
- Create: `packages/openapi-transforms/src/index.ts` (empty placeholder)
- Modify: `pnpm-workspace.yaml` (verify it already globs `packages/*`)
- Modify: `vitest.workspace.ts` (add project entry)

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@browserstack-client/openapi-transforms",
  "version": "0.1.0-dev",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./codegen": { "types": "./dist/codegen/index.d.ts", "import": "./dist/codegen/index.js" }
  },
  "files": ["dist", "README.md"],
  "scripts": {
    "build": "tsup",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@streamparser/json": "^0.0.21",
    "@standard-schema/spec": "^1.0.0"
  },
  "peerDependencies": {
    "openapi-fetch": "^0.11.0"
  },
  "devDependencies": {
    "fast-check": "^3.23.0",
    "openapi-fetch": "^0.11.0",
    "tsup": "^8.3.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0",
    "yaml": "^2.6.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 3: Create tsup.config.ts**

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/codegen/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "node18",
});
```

- [ ] **Step 4: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "openapi-transforms",
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test-d.ts"],
    typecheck: { enabled: true, include: ["src/**/*.test-d.ts"] },
  },
});
```

- [ ] **Step 5: Create empty src/index.ts**

```ts
export {};
```

- [ ] **Step 6: Register workspace project**

Open `vitest.workspace.ts`. If it uses an array of globs, verify `packages/*/vitest.config.ts` is included. If entries are explicit, add `"packages/openapi-transforms"`.

- [ ] **Step 7: Install deps**

Run: `pnpm install`
Expected: workspace resolves, `@browserstack-client/openapi-transforms` appears in `pnpm list --depth 0`.

- [ ] **Step 8: Commit**

```bash
git add packages/openapi-transforms pnpm-lock.yaml vitest.workspace.ts
git commit -m "feat(openapi-transforms): bootstrap new package"
```

### Task A1: CodecContext and the error base class

**Files:**
- Create: `packages/openapi-transforms/src/errors.ts`
- Create: `packages/openapi-transforms/src/__tests__/errors.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/__tests__/errors.test.ts
import { describe, expect, it } from "vitest";
import { OpenAPIError, type CodecContext } from "../errors.js";

const ctx: CodecContext = { operationId: "getFoo", method: "GET", url: "https://api.example.com/foo" };

describe("OpenAPIError", () => {
  it("captures kind, operationId, method, url, cause", () => {
    const cause = new Error("root");
    const e = new OpenAPIError("client", "boom", ctx, cause);
    expect(e.kind).toBe("client");
    expect(e.operationId).toBe("getFoo");
    expect(e.method).toBe("GET");
    expect(e.url).toBe("https://api.example.com/foo");
    expect(e.cause).toBe(cause);
    expect(e.message).toBe("boom");
    expect(e.name).toBe("OpenAPIError");
    expect(e instanceof Error).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `pnpm -F @browserstack-client/openapi-transforms test -- errors`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement**

```ts
// src/errors.ts
export type ErrorKind =
  | "network"
  | "http"
  | "decode"
  | "transform"
  | "validation"
  | "client";

export interface CodecContext {
  readonly operationId: string;
  readonly method: string;
  readonly url: string;
}

export class OpenAPIError extends Error {
  readonly kind: ErrorKind;
  readonly operationId: string;
  readonly method: string;
  readonly url: string;
  readonly cause?: Error;

  constructor(kind: ErrorKind, message: string, ctx: CodecContext, cause?: Error) {
    super(message);
    this.name = "OpenAPIError";
    this.kind = kind;
    this.operationId = ctx.operationId;
    this.method = ctx.method;
    this.url = ctx.url;
    if (cause) this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

- [ ] **Step 4: Run test, expect pass**

Run: `pnpm -F @browserstack-client/openapi-transforms test -- errors`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/openapi-transforms/src/errors.ts packages/openapi-transforms/src/__tests__/errors.test.ts
git commit -m "feat(openapi-transforms): OpenAPIError base class"
```

### Task A2: NetworkError subclass

**Files:**
- Modify: `packages/openapi-transforms/src/errors.ts`
- Modify: `packages/openapi-transforms/src/__tests__/errors.test.ts`

- [ ] **Step 1: Add failing test**

```ts
// append to errors.test.ts
import { NetworkError } from "../errors.js";

describe("NetworkError", () => {
  it("sets kind to 'network' and requires cause", () => {
    const cause = new Error("ECONNREFUSED");
    const e = new NetworkError("connection refused", ctx, cause);
    expect(e.kind).toBe("network");
    expect(e.name).toBe("NetworkError");
    expect(e.cause).toBe(cause);
    expect(e instanceof OpenAPIError).toBe(true);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
// append to errors.ts
export class NetworkError extends OpenAPIError {
  declare readonly kind: "network";
  declare readonly cause: Error;
  constructor(message: string, ctx: CodecContext, cause: Error) {
    super("network", message, ctx, cause);
    this.name = "NetworkError";
  }
}
```

- [ ] **Step 4: Run, expect pass**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat(openapi-transforms): NetworkError"
```

### Task A3: HttpError<TBody>

- [ ] **Step 1: Add failing test**

```ts
// append to errors.test.ts
import { HttpError, type ErrorBody } from "../errors.js";

describe("HttpError", () => {
  it("has non-optional status/statusText/headers and typed body", () => {
    const body: ErrorBody<{ error: string }> = {
      contentType: "application/json",
      text: '{"error":"nope"}',
      parsed: { error: "nope" },
      truncated: false,
    };
    const e = new HttpError<{ error: string }>("Not found", ctx, {
      status: 404,
      statusText: "Not Found",
      headers: new Headers({ "content-type": "application/json" }),
      requestId: "abc",
      body,
      retryable: false,
    });
    expect(e.kind).toBe("http");
    expect(e.status).toBe(404);
    expect(e.body.parsed?.error).toBe("nope");
    expect(e.retryable).toBe(false);
    expect(e.headers.get("content-type")).toBe("application/json");
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
export interface ErrorBody<T = unknown> {
  contentType?: string;
  text?: string;
  parsed?: T;
  truncated?: boolean;
}

export interface HttpErrorFields<TBody> {
  status: number;
  statusText: string;
  headers: Headers;
  requestId?: string;
  body: ErrorBody<TBody>;
  retryable: boolean;
}

export class HttpError<TBody = unknown> extends OpenAPIError {
  declare readonly kind: "http";
  readonly status: number;
  readonly statusText: string;
  readonly headers: Headers;
  readonly requestId?: string;
  readonly body: ErrorBody<TBody>;
  readonly retryable: boolean;

  constructor(message: string, ctx: CodecContext, fields: HttpErrorFields<TBody>) {
    super("http", message, ctx);
    this.name = "HttpError";
    this.status = fields.status;
    this.statusText = fields.statusText;
    this.headers = fields.headers;
    if (fields.requestId !== undefined) this.requestId = fields.requestId;
    this.body = fields.body;
    this.retryable = fields.retryable;
  }
}
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): HttpError<TBody>"
```

### Task A4: DecodeError, TransformError, ClientError

- [ ] **Step 1: Add failing tests for all three**

```ts
import { DecodeError, TransformError, ClientError } from "../errors.js";

describe("DecodeError", () => {
  it("carries HTTP fields + codecName", () => {
    const e = new DecodeError("bad json", ctx, {
      status: 200, statusText: "OK",
      headers: new Headers(), codecName: "json", cause: new Error("x"),
    });
    expect(e.kind).toBe("decode");
    expect(e.codecName).toBe("json");
    expect(e.status).toBe(200);
  });
});

describe("TransformError", () => {
  it("carries status + codecName + optional path", () => {
    const e = new TransformError("path missing", ctx, {
      status: 200, statusText: "OK",
      codecName: "json-unwrap", path: "$.project", cause: new Error("x"),
    });
    expect(e.kind).toBe("transform");
    expect(e.path).toBe("$.project");
  });
});

describe("ClientError", () => {
  it("has kind 'client' and no HTTP fields", () => {
    const e = new ClientError("bad arg", ctx);
    expect(e.kind).toBe("client");
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
export interface DecodeErrorFields {
  status: number;
  statusText: string;
  headers: Headers;
  codecName: string;
  cause: Error;
}
export class DecodeError extends OpenAPIError {
  declare readonly kind: "decode";
  declare readonly cause: Error;
  readonly status: number;
  readonly statusText: string;
  readonly headers: Headers;
  readonly codecName: string;
  constructor(message: string, ctx: CodecContext, fields: DecodeErrorFields) {
    super("decode", message, ctx, fields.cause);
    this.name = "DecodeError";
    this.status = fields.status;
    this.statusText = fields.statusText;
    this.headers = fields.headers;
    this.codecName = fields.codecName;
  }
}

export interface TransformErrorFields {
  status: number;
  statusText: string;
  codecName: string;
  path?: string;
  cause: Error;
}
export class TransformError extends OpenAPIError {
  declare readonly kind: "transform";
  declare readonly cause: Error;
  readonly status: number;
  readonly statusText: string;
  readonly codecName: string;
  readonly path?: string;
  constructor(message: string, ctx: CodecContext, fields: TransformErrorFields) {
    super("transform", message, ctx, fields.cause);
    this.name = "TransformError";
    this.status = fields.status;
    this.statusText = fields.statusText;
    this.codecName = fields.codecName;
    if (fields.path !== undefined) this.path = fields.path;
  }
}

export class ClientError extends OpenAPIError {
  declare readonly kind: "client";
  constructor(message: string, ctx: CodecContext, cause?: Error) {
    super("client", message, ctx, cause);
    this.name = "ClientError";
  }
}
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): DecodeError, TransformError, ClientError"
```

### Task A5: Type guards

- [ ] **Step 1: Add failing test**

```ts
// append to errors.test.ts
import { isNetworkError, isHttpError, isDecodeError, isTransformError, isClientError } from "../errors.js";

describe("type guards", () => {
  it("narrow discriminated union", () => {
    const err: unknown = new HttpError("x", ctx, { status: 500, statusText: "", headers: new Headers(), body: {}, retryable: true });
    if (isHttpError(err)) {
      expect(err.status).toBe(500);
    } else {
      throw new Error("guard failed");
    }
    expect(isNetworkError(new NetworkError("x", ctx, new Error("x")))).toBe(true);
    expect(isDecodeError(new DecodeError("x", ctx, { status:200, statusText:"", headers:new Headers(), codecName:"json", cause:new Error("y") }))).toBe(true);
    expect(isTransformError(new TransformError("x", ctx, { status:200, statusText:"", codecName:"json-unwrap", cause:new Error("y") }))).toBe(true);
    expect(isClientError(new ClientError("x", ctx))).toBe(true);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
export const isNetworkError = (e: unknown): e is NetworkError => e instanceof NetworkError;
export const isHttpError = <T = unknown>(e: unknown): e is HttpError<T> => e instanceof HttpError;
export const isDecodeError = (e: unknown): e is DecodeError => e instanceof DecodeError;
export const isTransformError = (e: unknown): e is TransformError => e instanceof TransformError;
export const isClientError = (e: unknown): e is ClientError => e instanceof ClientError;
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): error type guards"
```

### Task A6: Bounded body capture

**Files:**
- Create: `packages/openapi-transforms/src/body-capture.ts`
- Create: `packages/openapi-transforms/src/__tests__/body-capture.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import { captureErrorBody } from "../body-capture.js";

function mkResponse(body: string, contentType = "application/json", status = 400): Response {
  return new Response(body, { status, headers: { "content-type": contentType } });
}

describe("captureErrorBody", () => {
  it("parses JSON content-type into parsed + text", async () => {
    const r = mkResponse('{"error":"x"}');
    const cap = await captureErrorBody(r, 1024);
    expect(cap.contentType).toBe("application/json");
    expect(cap.text).toBe('{"error":"x"}');
    expect(cap.parsed).toEqual({ error: "x" });
    expect(cap.truncated).toBe(false);
  });

  it("returns text only for non-JSON content types", async () => {
    const r = mkResponse("plain text", "text/plain");
    const cap = await captureErrorBody(r, 1024);
    expect(cap.text).toBe("plain text");
    expect(cap.parsed).toBeUndefined();
  });

  it("truncates at maxBytes", async () => {
    const big = "x".repeat(10_000);
    const r = mkResponse(big, "text/plain");
    const cap = await captureErrorBody(r, 100);
    expect(cap.text!.length).toBe(100);
    expect(cap.truncated).toBe(true);
  });

  it("falls back to text when JSON parse fails", async () => {
    const r = mkResponse("not{json", "application/json");
    const cap = await captureErrorBody(r, 1024);
    expect(cap.text).toBe("not{json");
    expect(cap.parsed).toBeUndefined();
    expect(cap.truncated).toBe(false);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
import type { ErrorBody } from "./errors.js";

export async function captureErrorBody(
  response: Response,
  maxBytes: number,
): Promise<ErrorBody<unknown>> {
  const contentType = response.headers.get("content-type") ?? undefined;
  if (!response.body) return { contentType };

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  let truncated = false;

  while (received < maxBytes) {
    const { value, done } = await reader.read();
    if (done) break;
    if (received + value.length > maxBytes) {
      chunks.push(value.subarray(0, maxBytes - received));
      received = maxBytes;
      truncated = true;
      try { await reader.cancel(); } catch { /* ignore */ }
      break;
    }
    chunks.push(value);
    received += value.length;
  }

  const merged = new Uint8Array(received);
  let offset = 0;
  for (const c of chunks) { merged.set(c, offset); offset += c.length; }
  const text = new TextDecoder().decode(merged);

  const out: ErrorBody<unknown> = { contentType, text, truncated };
  if (contentType?.includes("application/json")) {
    try { out.parsed = JSON.parse(text); } catch { /* ignore */ }
  }
  return out;
}
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): bounded error body capture"
```

### Task A7: Default error message extractor

**Files:**
- Create: `packages/openapi-transforms/src/error-message.ts`
- Create: `packages/openapi-transforms/src/__tests__/error-message.test.ts`

- [ ] **Step 1: Failing tests**

```ts
import { describe, expect, it } from "vitest";
import { defaultErrorMessage } from "../error-message.js";

describe("defaultErrorMessage", () => {
  it("returns undefined for null/undefined", () => {
    expect(defaultErrorMessage(undefined)).toBeUndefined();
    expect(defaultErrorMessage(null)).toBeUndefined();
  });
  it("trims long strings to 512 chars", () => {
    const s = "x".repeat(1000);
    expect(defaultErrorMessage(s)).toHaveLength(512);
  });
  it("picks .error first", () => {
    expect(defaultErrorMessage({ error: "a", message: "b" })).toBe("a");
  });
  it("falls back to .message, errors[0], .detail, .description", () => {
    expect(defaultErrorMessage({ message: "m" })).toBe("m");
    expect(defaultErrorMessage({ errors: ["e"] })).toBe("e");
    expect(defaultErrorMessage({ detail: "d" })).toBe("d");
    expect(defaultErrorMessage({ description: "desc" })).toBe("desc");
  });
  it("returns undefined when no known key matches", () => {
    expect(defaultErrorMessage({ foo: 1 })).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
function firstString(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  return trimmed.length ? trimmed.slice(0, 512) : undefined;
}

export function defaultErrorMessage(body: unknown): string | undefined {
  if (body == null) return undefined;
  if (typeof body === "string") return firstString(body);
  if (typeof body !== "object") return undefined;
  const o = body as Record<string, unknown>;
  return (
    firstString(o.error) ??
    firstString(o.message) ??
    firstString(Array.isArray(o.errors) ? (o.errors as unknown[])[0] : undefined) ??
    firstString(o.detail) ??
    firstString(o.description)
  );
}
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): defaultErrorMessage"
```

### Task A8: Retryable classifier

**Files:**
- Create: `packages/openapi-transforms/src/retryable.ts`
- Create: `packages/openapi-transforms/src/__tests__/retryable.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from "vitest";
import { isRetryable } from "../retryable.js";

describe("isRetryable", () => {
  it("network always retryable", () => {
    expect(isRetryable("network")).toBe(true);
  });
  it("http: 408, 429, 500..599 except 501/505 retryable", () => {
    expect(isRetryable("http", 408)).toBe(true);
    expect(isRetryable("http", 429)).toBe(true);
    expect(isRetryable("http", 500)).toBe(true);
    expect(isRetryable("http", 503)).toBe(true);
    expect(isRetryable("http", 501)).toBe(false);
    expect(isRetryable("http", 505)).toBe(false);
    expect(isRetryable("http", 400)).toBe(false);
    expect(isRetryable("http", 404)).toBe(false);
  });
  it("decode/transform/client/validation not retryable", () => {
    expect(isRetryable("decode")).toBe(false);
    expect(isRetryable("transform")).toBe(false);
    expect(isRetryable("client")).toBe(false);
    expect(isRetryable("validation")).toBe(false);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
import type { ErrorKind } from "./errors.js";

export function isRetryable(kind: ErrorKind, status?: number): boolean {
  if (kind === "network") return true;
  if (kind !== "http") return false;
  if (status === 408 || status === 429) return true;
  if (status && status >= 500 && status < 600) return status !== 501 && status !== 505;
  return false;
}
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): isRetryable classifier"
```

### Task A9: Wire exports; update core to re-export

**Files:**
- Modify: `packages/openapi-transforms/src/index.ts`
- Modify: `packages/core/package.json`
- Modify: `packages/core/src/error.ts`
- Modify: `packages/core/src/index.ts`

- [ ] **Step 1: Update transforms index.ts**

```ts
// packages/openapi-transforms/src/index.ts
export {
  OpenAPIError,
  NetworkError,
  HttpError,
  DecodeError,
  TransformError,
  ClientError,
  isNetworkError,
  isHttpError,
  isDecodeError,
  isTransformError,
  isClientError,
} from "./errors.js";
export type { CodecContext, ErrorKind, ErrorBody, HttpErrorFields, DecodeErrorFields, TransformErrorFields } from "./errors.js";
export { captureErrorBody } from "./body-capture.js";
export { defaultErrorMessage } from "./error-message.js";
export { isRetryable } from "./retryable.js";
```

- [ ] **Step 2: Add dep in core/package.json**

Add to `dependencies`: `"@browserstack-client/openapi-transforms": "workspace:*"`. Run `pnpm install`.

- [ ] **Step 3: Update core/src/error.ts**

Keep `BrowserStackError` as-is for now (existing code throws it). Append re-exports:

```ts
// packages/core/src/error.ts — append below existing class
export {
  OpenAPIError,
  NetworkError,
  HttpError,
  DecodeError,
  TransformError,
  ClientError,
  isNetworkError,
  isHttpError,
  isDecodeError,
  isTransformError,
  isClientError,
} from "@browserstack-client/openapi-transforms";
export type { CodecContext, ErrorKind, ErrorBody } from "@browserstack-client/openapi-transforms";
```

- [ ] **Step 4: Update core/src/index.ts**

Add to the re-export list:

```ts
export {
  BrowserStackError,
  OpenAPIError,
  NetworkError,
  HttpError,
  DecodeError,
  TransformError,
  ClientError,
  isNetworkError,
  isHttpError,
  isDecodeError,
  isTransformError,
  isClientError,
} from "./error.js";
export type { CodecContext, ErrorKind, ErrorBody } from "./error.js";
```

- [ ] **Step 5: Typecheck and build both packages**

Run: `pnpm -F @browserstack-client/openapi-transforms build && pnpm -F @browserstack-client/core typecheck`
Expected: both succeed.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat(core): re-export new error hierarchy from openapi-transforms"
```

---

## Phase 0 — Codec Registry

### Task 0.1: Codec interfaces

**Files:**
- Create: `packages/openapi-transforms/src/registry.ts`
- Create: `packages/openapi-transforms/src/codec-error.ts`
- Create: `packages/openapi-transforms/src/__tests__/registry.test.ts`

- [ ] **Step 1: Failing tests**

```ts
import { describe, expect, it } from "vitest";
import { CodecRegistry, type ResponseCodec, type RequestCodec } from "../registry.js";

const stubSchema = { "~standard": { version: 1, vendor: "stub", validate: (v: unknown) => ({ value: v }) } } as any;

const jsonResp: ResponseCodec<{}, unknown> = {
  name: "json",
  contentTypes: ["application/json"],
  configSchema: stubSchema,
  async decode(response) { return response.json(); },
};

const jsonReq: RequestCodec<unknown, {}> = {
  name: "json",
  contentType: "application/json",
  configSchema: stubSchema,
  encode(input) { return { body: JSON.stringify(input), headers: { "content-type": "application/json" } }; },
};

describe("CodecRegistry", () => {
  it("registers and resolves response codecs", () => {
    const r = new CodecRegistry();
    r.registerResponse(jsonResp);
    expect(r.resolveResponse("json")).toBe(jsonResp);
  });
  it("registers and resolves request codecs independently", () => {
    const r = new CodecRegistry();
    r.registerRequest(jsonReq);
    expect(r.resolveRequest("json")).toBe(jsonReq);
  });
  it("throws on duplicate registration", () => {
    const r = new CodecRegistry();
    r.registerResponse(jsonResp);
    expect(() => r.registerResponse(jsonResp)).toThrow(/already registered/);
  });
  it("throws on unknown name at resolve", () => {
    const r = new CodecRegistry();
    expect(() => r.resolveResponse("missing")).toThrow(/unknown response codec/i);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement codec-error.ts**

```ts
export class CodecError extends Error {
  readonly codecName: string;
  readonly stage: "decode" | "transform" | "encode";
  readonly cause?: Error;
  constructor(codecName: string, stage: "decode" | "transform" | "encode", message: string, cause?: Error) {
    super(message);
    this.name = "CodecError";
    this.codecName = codecName;
    this.stage = stage;
    if (cause) this.cause = cause;
  }
}
```

- [ ] **Step 4: Implement registry.ts**

```ts
import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { CodecContext } from "./errors.js";

export interface EncodedRequest {
  body: BodyInit;
  headers?: Record<string, string>;
}

export interface ResponseCodec<TConfig, TOutput> {
  readonly name: string;
  readonly contentTypes: readonly string[];
  readonly configSchema: StandardSchemaV1<TConfig>;
  decode(response: Response, config: TConfig, ctx: CodecContext): Promise<TOutput>;
}

export interface RequestCodec<TInput, TConfig> {
  readonly name: string;
  readonly contentType: string;
  readonly configSchema: StandardSchemaV1<TConfig>;
  encode(input: TInput, config: TConfig): EncodedRequest;
}

export class CodecRegistry {
  private response = new Map<string, ResponseCodec<unknown, unknown>>();
  private request = new Map<string, RequestCodec<unknown, unknown>>();

  registerResponse(codec: ResponseCodec<any, any>): void {
    if (this.response.has(codec.name)) {
      throw new Error(`response codec '${codec.name}' already registered`);
    }
    this.response.set(codec.name, codec);
  }
  registerRequest(codec: RequestCodec<any, any>): void {
    if (this.request.has(codec.name)) {
      throw new Error(`request codec '${codec.name}' already registered`);
    }
    this.request.set(codec.name, codec);
  }
  resolveResponse(name: string): ResponseCodec<any, any> {
    const c = this.response.get(name);
    if (!c) throw new Error(`unknown response codec: ${name}`);
    return c;
  }
  resolveRequest(name: string): RequestCodec<any, any> {
    const c = this.request.get(name);
    if (!c) throw new Error(`unknown request codec: ${name}`);
    return c;
  }
  listResponse(): string[] { return [...this.response.keys()]; }
  listRequest(): string[] { return [...this.request.keys()]; }
}
```

- [ ] **Step 5: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): CodecRegistry + codec interfaces"
```

---

## Phase 1 — Response Codecs

### Task 1.1: JSONPath subset parser

**Files:**
- Create: `packages/openapi-transforms/src/path/types.ts`
- Create: `packages/openapi-transforms/src/path/parser.ts`
- Create: `packages/openapi-transforms/src/__tests__/path/parser.test.ts`

- [ ] **Step 1: Failing tests**

```ts
import { describe, expect, it } from "vitest";
import { parsePath } from "../../path/parser.js";

describe("parsePath", () => {
  it("parses root", () => {
    expect(parsePath("$")).toEqual([{ kind: "root" }]);
  });
  it("parses .foo", () => {
    expect(parsePath("$.foo")).toEqual([
      { kind: "root" }, { kind: "field", name: "foo" },
    ]);
  });
  it("parses nested fields", () => {
    expect(parsePath("$.foo.bar")).toEqual([
      { kind: "root" }, { kind: "field", name: "foo" }, { kind: "field", name: "bar" },
    ]);
  });
  it("parses [*]", () => {
    expect(parsePath("$[*]")).toEqual([{ kind: "root" }, { kind: "wildcard" }]);
  });
  it("parses [N]", () => {
    expect(parsePath("$[3]")).toEqual([{ kind: "root" }, { kind: "index", index: 3 }]);
  });
  it("parses mixed", () => {
    expect(parsePath("$.items[*].id")).toEqual([
      { kind: "root" }, { kind: "field", name: "items" }, { kind: "wildcard" }, { kind: "field", name: "id" },
    ]);
  });
  it("rejects empty path", () => {
    expect(() => parsePath("")).toThrow(/must start with \$/);
  });
  it("rejects filter/recursive/slice", () => {
    expect(() => parsePath("$..foo")).toThrow(/unsupported/i);
    expect(() => parsePath("$[?(@.x)]")).toThrow(/unsupported/i);
    expect(() => parsePath("$[0:2]")).toThrow(/unsupported/i);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement path/types.ts**

```ts
export type PathNode =
  | { kind: "root" }
  | { kind: "field"; name: string }
  | { kind: "wildcard" }
  | { kind: "index"; index: number };

export type PathAst = readonly PathNode[];
```

- [ ] **Step 4: Implement path/parser.ts**

```ts
import type { PathAst, PathNode } from "./types.js";

export function parsePath(input: string): PathAst {
  if (!input.startsWith("$")) throw new Error(`path must start with $, got: ${input}`);
  const out: PathNode[] = [{ kind: "root" }];
  let i = 1;
  while (i < input.length) {
    const c = input[i];
    if (c === ".") {
      if (input[i + 1] === ".") throw new Error(`unsupported path syntax (recursive descent): ${input}`);
      i++;
      let name = "";
      while (i < input.length && /[A-Za-z0-9_]/.test(input[i]!)) { name += input[i]!; i++; }
      if (!name) throw new Error(`expected field name after . at offset ${i}`);
      out.push({ kind: "field", name });
    } else if (c === "[") {
      const close = input.indexOf("]", i);
      if (close === -1) throw new Error(`unclosed bracket in path: ${input}`);
      const inner = input.slice(i + 1, close);
      if (inner === "*") out.push({ kind: "wildcard" });
      else if (/^\d+$/.test(inner)) out.push({ kind: "index", index: Number(inner) });
      else throw new Error(`unsupported path syntax: [${inner}]`);
      i = close + 1;
    } else {
      throw new Error(`unexpected character '${c}' at offset ${i} in ${input}`);
    }
  }
  return out;
}
```

- [ ] **Step 5: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): JSONPath subset parser"
```

### Task 1.2: Path matcher (in-memory extraction)

**Files:**
- Create: `packages/openapi-transforms/src/path/matcher.ts`
- Create: `packages/openapi-transforms/src/__tests__/path/matcher.test.ts`

- [ ] **Step 1: Failing tests**

```ts
import { describe, expect, it } from "vitest";
import { parsePath } from "../../path/parser.js";
import { extract, isArrayPath } from "../../path/matcher.js";

describe("extract", () => {
  it("$ returns whole value", () => {
    expect(extract(parsePath("$"), { a: 1 })).toEqual({ a: 1 });
  });
  it("$.foo extracts field", () => {
    expect(extract(parsePath("$.foo"), { foo: 42 })).toBe(42);
  });
  it("$[*] maps array", () => {
    expect(extract(parsePath("$[*]"), [1, 2, 3])).toEqual([1, 2, 3]);
  });
  it("$[*].x maps over field", () => {
    expect(extract(parsePath("$[*].x"), [{ x: 1 }, { x: 2 }])).toEqual([1, 2]);
  });
  it("$.items[*].id on nested", () => {
    expect(extract(parsePath("$.items[*].id"), { items: [{ id: "a" }, { id: "b" }] })).toEqual(["a", "b"]);
  });
  it("[N] returns index", () => {
    expect(extract(parsePath("$[2]"), [10, 20, 30])).toBe(30);
  });
  it("throws when intermediate field missing", () => {
    expect(() => extract(parsePath("$.a.b"), { a: null })).toThrow();
  });
});

describe("isArrayPath", () => {
  it("true when wildcard present", () => {
    expect(isArrayPath(parsePath("$[*]"))).toBe(true);
    expect(isArrayPath(parsePath("$.a[*]"))).toBe(true);
  });
  it("false when only root/field/index", () => {
    expect(isArrayPath(parsePath("$.a.b"))).toBe(false);
    expect(isArrayPath(parsePath("$[0]"))).toBe(false);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
import type { PathAst, PathNode } from "./types.js";

export function isArrayPath(ast: PathAst): boolean {
  return ast.some((n) => n.kind === "wildcard");
}

export function extract(ast: PathAst, root: unknown): unknown {
  return step(ast.slice(1), root);
}

function step(nodes: readonly PathNode[], value: unknown): unknown {
  if (nodes.length === 0) return value;
  const [head, ...rest] = nodes;
  if (head.kind === "field") {
    if (value == null || typeof value !== "object") throw new Error(`expected object, got ${typeof value}`);
    return step(rest, (value as Record<string, unknown>)[head.name]);
  }
  if (head.kind === "wildcard") {
    if (!Array.isArray(value)) throw new Error(`expected array at [*], got ${typeof value}`);
    return value.map((v) => step(rest, v));
  }
  if (head.kind === "index") {
    if (!Array.isArray(value)) throw new Error(`expected array at [${head.index}], got ${typeof value}`);
    return step(rest, value[head.index]);
  }
  throw new Error(`unreachable node: ${(head as any).kind}`);
}
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): path matcher + extract()"
```

### Task 1.3: `json` response codec

**Files:**
- Create: `packages/openapi-transforms/src/codecs/response-json.ts`
- Create: `packages/openapi-transforms/src/__tests__/codecs/response-json.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from "vitest";
import { jsonResponseCodec } from "../../codecs/response-json.js";
import { CodecError } from "../../codec-error.js";

const ctx = { operationId: "op", method: "GET", url: "http://x" };

describe("jsonResponseCodec", () => {
  it("parses JSON body", async () => {
    const r = new Response('{"a":1}', { headers: { "content-type": "application/json" } });
    await expect(jsonResponseCodec.decode(r, {}, ctx)).resolves.toEqual({ a: 1 });
  });
  it("throws CodecError(decode) on malformed JSON", async () => {
    const r = new Response("not{json");
    await expect(jsonResponseCodec.decode(r, {}, ctx)).rejects.toBeInstanceOf(CodecError);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
import type { ResponseCodec } from "../registry.js";
import { CodecError } from "../codec-error.js";

const emptySchema = {
  "~standard": {
    version: 1 as const,
    vendor: "openapi-transforms",
    validate: (value: unknown) => ({ value: value as {} }),
  },
};

export const jsonResponseCodec: ResponseCodec<{}, unknown> = {
  name: "json",
  contentTypes: ["application/json"],
  configSchema: emptySchema as any,
  async decode(response) {
    const text = await response.text();
    try { return text.length ? JSON.parse(text) : undefined; }
    catch (cause) {
      throw new CodecError("json", "decode", `JSON parse failed: ${(cause as Error).message}`, cause as Error);
    }
  },
};
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): json response codec"
```

### Task 1.4: Streaming JSON match engine

**Files:**
- Create: `packages/openapi-transforms/src/streaming/json-stream.ts`
- Create: `packages/openapi-transforms/src/__tests__/streaming/json-stream.test.ts`

- [ ] **Step 1: Failing tests**

```ts
import { describe, expect, it } from "vitest";
import { parsePath } from "../../path/parser.js";
import { streamExtract } from "../../streaming/json-stream.js";

function bodyStream(s: string): ReadableStream<Uint8Array> {
  const bytes = new TextEncoder().encode(s);
  return new ReadableStream({ start(c) { c.enqueue(bytes); c.close(); } });
}

describe("streamExtract", () => {
  it("extracts $.foo as single value", async () => {
    const r = await streamExtract(bodyStream('{"foo":{"a":1}}'), parsePath("$.foo"));
    expect(r).toEqual({ a: 1 });
  });
  it("extracts $[*].x as array", async () => {
    const r = await streamExtract(bodyStream('[{"x":1},{"x":2}]'), parsePath("$[*].x"));
    expect(r).toEqual([1, 2]);
  });
  it("extracts $.items[*] as array", async () => {
    const r = await streamExtract(bodyStream('{"items":[10,20,30]}'), parsePath("$.items[*]"));
    expect(r).toEqual([10, 20, 30]);
  });
  it("returns $ as whole doc", async () => {
    const r = await streamExtract(bodyStream('{"k":"v"}'), parsePath("$"));
    expect(r).toEqual({ k: "v" });
  });
  it("throws if field missing", async () => {
    await expect(streamExtract(bodyStream('{"other":1}'), parsePath("$.foo"))).rejects.toThrow();
  });
  it("survives chunked input", async () => {
    const bytes1 = new TextEncoder().encode('{"items":[{"x":');
    const bytes2 = new TextEncoder().encode('1},{"x":2}]}');
    const stream = new ReadableStream<Uint8Array>({
      start(c) { c.enqueue(bytes1); c.enqueue(bytes2); c.close(); },
    });
    expect(await streamExtract(stream, parsePath("$.items[*].x"))).toEqual([1, 2]);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
import { JSONParser } from "@streamparser/json";
import type { PathAst } from "../path/types.js";
import { isArrayPath } from "../path/matcher.js";

function astToSelector(ast: PathAst): string[] {
  const parts: string[] = [];
  for (const node of ast) {
    if (node.kind === "root") continue;
    if (node.kind === "field") parts.push(node.name);
    else if (node.kind === "wildcard") parts.push("*");
    else if (node.kind === "index") parts.push(String(node.index));
  }
  return parts;
}

export async function streamExtract(
  body: ReadableStream<Uint8Array>,
  ast: PathAst,
): Promise<unknown> {
  const selector = astToSelector(ast);
  const isArray = isArrayPath(ast);
  const collected: unknown[] = [];
  let whole: unknown;
  let matched = false;

  const parser = new JSONParser({
    paths: selector.length === 0 ? ["$"] : ["$." + selector.join(".")],
    keepStack: false,
  });

  parser.onValue = ({ value }) => {
    matched = true;
    if (selector.length === 0) whole = value;
    else if (isArray) collected.push(value);
    else whole = value;
  };

  const reader = body.getReader();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      parser.write(value);
    }
    parser.end();
  } catch (cause) {
    throw cause instanceof Error ? cause : new Error(String(cause));
  }

  if (!matched) throw new Error(`path did not match any value: ${selector.join(".") || "$"}`);
  return isArray ? collected : whole;
}
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): streaming JSONPath extractor"
```

### Task 1.5: `json-unwrap` response codec

**Files:**
- Create: `packages/openapi-transforms/src/codecs/response-json-unwrap.ts`
- Create: `packages/openapi-transforms/src/__tests__/codecs/response-json-unwrap.test.ts`

- [ ] **Step 1: Failing tests**

```ts
import { describe, expect, it } from "vitest";
import { jsonUnwrapCodec } from "../../codecs/response-json-unwrap.js";
import { CodecError } from "../../codec-error.js";

const ctx = { operationId: "op", method: "GET", url: "http://x" };

describe("jsonUnwrapCodec", () => {
  it("unwraps single path", async () => {
    const r = new Response('{"project":{"id":1}}');
    await expect(jsonUnwrapCodec.decode(r, { path: "$.project" }, ctx)).resolves.toEqual({ id: 1 });
  });
  it("unwraps array path", async () => {
    const r = new Response('[{"build":{"id":1}},{"build":{"id":2}}]');
    await expect(jsonUnwrapCodec.decode(r, { path: "$[*].build" }, ctx)).resolves.toEqual([{id:1},{id:2}]);
  });
  it("throws CodecError(transform) when path missing", async () => {
    const r = new Response('{"other":1}');
    await expect(jsonUnwrapCodec.decode(r, { path: "$.project" }, ctx)).rejects.toBeInstanceOf(CodecError);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
import type { ResponseCodec } from "../registry.js";
import { parsePath } from "../path/parser.js";
import { streamExtract } from "../streaming/json-stream.js";
import { CodecError } from "../codec-error.js";

export interface JsonUnwrapConfig { path: string }

const configSchema = {
  "~standard": {
    version: 1 as const,
    vendor: "openapi-transforms",
    validate: (value: unknown) => {
      if (!value || typeof value !== "object" || typeof (value as any).path !== "string") {
        return { issues: [{ message: "config.path must be a string" }] };
      }
      return { value: value as JsonUnwrapConfig };
    },
  },
};

export const jsonUnwrapCodec: ResponseCodec<JsonUnwrapConfig, unknown> = {
  name: "json-unwrap",
  contentTypes: ["application/json"],
  configSchema: configSchema as any,
  async decode(response, config) {
    const ast = parsePath(config.path);
    if (!response.body) {
      throw new CodecError("json-unwrap", "decode", "response has no body");
    }
    try {
      return await streamExtract(response.body, ast);
    } catch (cause) {
      const err = cause as Error;
      const stage: "decode" | "transform" =
        /^path did not match/.test(err.message) || /expected (object|array)/.test(err.message)
          ? "transform" : "decode";
      throw new CodecError("json-unwrap", stage, err.message, err);
    }
  },
};
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): json-unwrap response codec"
```

### Task 1.6: `json-compose` response codec

**Files:**
- Create: `packages/openapi-transforms/src/codecs/response-json-compose.ts`
- Create: `packages/openapi-transforms/src/__tests__/codecs/response-json-compose.test.ts`

- [ ] **Step 1: Failing tests modeled on `getAutomateBuild`**

```ts
import { describe, expect, it } from "vitest";
import { jsonComposeCodec } from "../../codecs/response-json-compose.js";

const ctx = { operationId: "op", method: "GET", url: "http://x" };

describe("jsonComposeCodec", () => {
  it("assembles base object plus merged fields", async () => {
    const body = JSON.stringify({
      build: {
        automation_build: { hashed_id: "abc", name: "my build" },
        sessions: [
          { automation_session: { hashed_id: "s1" } },
          { automation_session: { hashed_id: "s2" } },
        ],
      },
    });
    const out = await jsonComposeCodec.decode(new Response(body), {
      base: "$.build.automation_build",
      merge: { sessions: "$.build.sessions[*].automation_session" },
    }, ctx);
    expect(out).toEqual({ hashed_id: "abc", name: "my build", sessions: [{ hashed_id: "s1" }, { hashed_id: "s2" }] });
  });
  it("works with no merge (base only)", async () => {
    const out = await jsonComposeCodec.decode(new Response('{"x":{"a":1}}'), { base: "$.x" }, ctx);
    expect(out).toEqual({ a: 1 });
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

For simplicity v1 parses the full body once (not streamed), because compose requires multiple path extractions. Mark a TODO to stream later by running N parsers in parallel.

```ts
import type { ResponseCodec } from "../registry.js";
import { parsePath } from "../path/parser.js";
import { extract } from "../path/matcher.js";
import { CodecError } from "../codec-error.js";

export interface JsonComposeConfig {
  base: string;
  merge?: Record<string, string>;
}

const configSchema = {
  "~standard": {
    version: 1 as const,
    vendor: "openapi-transforms",
    validate: (v: unknown) => {
      if (!v || typeof v !== "object") return { issues: [{ message: "config must be an object" }] };
      const o = v as any;
      if (typeof o.base !== "string") return { issues: [{ message: "config.base must be a string" }] };
      if (o.merge != null && (typeof o.merge !== "object" || Array.isArray(o.merge))) {
        return { issues: [{ message: "config.merge must be an object" }] };
      }
      return { value: v as JsonComposeConfig };
    },
  },
};

export const jsonComposeCodec: ResponseCodec<JsonComposeConfig, unknown> = {
  name: "json-compose",
  contentTypes: ["application/json"],
  configSchema: configSchema as any,
  async decode(response, config) {
    let doc: unknown;
    try { doc = await response.json(); }
    catch (cause) { throw new CodecError("json-compose", "decode", (cause as Error).message, cause as Error); }
    try {
      const base = extract(parsePath(config.base), doc);
      if (!base || typeof base !== "object") {
        throw new CodecError("json-compose", "transform", `base path did not yield object: ${config.base}`);
      }
      const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
      for (const [key, path] of Object.entries(config.merge ?? {})) {
        out[key] = extract(parsePath(path), doc);
      }
      return out;
    } catch (cause) {
      if (cause instanceof CodecError) throw cause;
      throw new CodecError("json-compose", "transform", (cause as Error).message, cause as Error);
    }
  },
};
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): json-compose response codec"
```

### Task 1.7: `text` and `binary` response codecs

**Files:**
- Create: `packages/openapi-transforms/src/codecs/response-text.ts`
- Create: `packages/openapi-transforms/src/codecs/response-binary.ts`
- Create tests alongside each.

- [ ] **Step 1: Failing tests**

```ts
// response-text.test.ts
import { describe, expect, it } from "vitest";
import { textResponseCodec } from "../../codecs/response-text.js";
const ctx = { operationId: "op", method: "GET", url: "http://x" };
describe("textResponseCodec", () => {
  it("returns body text", async () => {
    const r = new Response("hello");
    await expect(textResponseCodec.decode(r, {}, ctx)).resolves.toBe("hello");
  });
});
```

```ts
// response-binary.test.ts
import { describe, expect, it } from "vitest";
import { binaryResponseCodec } from "../../codecs/response-binary.js";
const ctx = { operationId: "op", method: "GET", url: "http://x" };
describe("binaryResponseCodec", () => {
  it("returns ArrayBuffer by default", async () => {
    const r = new Response(new Uint8Array([1, 2, 3]));
    const out = await binaryResponseCodec.decode(r, {}, ctx);
    expect(out).toBeInstanceOf(ArrayBuffer);
    expect(new Uint8Array(out as ArrayBuffer)).toEqual(new Uint8Array([1,2,3]));
  });
  it("returns Blob when configured", async () => {
    const r = new Response(new Uint8Array([1,2,3]));
    const out = await binaryResponseCodec.decode(r, { as: "blob" }, ctx);
    expect(out).toBeInstanceOf(Blob);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
// response-text.ts
import type { ResponseCodec } from "../registry.js";
import { CodecError } from "../codec-error.js";
const schema = { "~standard": { version: 1 as const, vendor: "ot", validate: (v: unknown) => ({ value: v as {} }) } };
export const textResponseCodec: ResponseCodec<{}, string> = {
  name: "text",
  contentTypes: ["text/plain", "text/*"],
  configSchema: schema as any,
  async decode(response) {
    try { return await response.text(); }
    catch (cause) { throw new CodecError("text", "decode", (cause as Error).message, cause as Error); }
  },
};
```

```ts
// response-binary.ts
import type { ResponseCodec } from "../registry.js";
import { CodecError } from "../codec-error.js";
export interface BinaryConfig { as?: "arraybuffer" | "blob" }
const schema = { "~standard": { version: 1 as const, vendor: "ot", validate: (v: unknown) => {
  if (v && typeof v === "object" && "as" in v && !["arraybuffer", "blob"].includes((v as any).as)) {
    return { issues: [{ message: "config.as must be 'arraybuffer' or 'blob'" }] };
  }
  return { value: (v ?? {}) as BinaryConfig };
} } };
export const binaryResponseCodec: ResponseCodec<BinaryConfig, ArrayBuffer | Blob> = {
  name: "binary",
  contentTypes: ["application/octet-stream", "*/*"],
  configSchema: schema as any,
  async decode(response, config) {
    try { return (config.as === "blob") ? await response.blob() : await response.arrayBuffer(); }
    catch (cause) { throw new CodecError("binary", "decode", (cause as Error).message, cause as Error); }
  },
};
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): text + binary response codecs"
```

### Task 1.8: Streaming property test

**Files:**
- Create: `packages/openapi-transforms/src/__tests__/streaming/property.test.ts`

- [ ] **Step 1: Write property test using fast-check**

```ts
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { streamExtract } from "../../streaming/json-stream.js";
import { parsePath } from "../../path/parser.js";
import { extract } from "../../path/matcher.js";

const jsonValueArb: fc.Arbitrary<unknown> = fc.letrec((tie) => ({
  val: fc.oneof(fc.integer(), fc.string({ maxLength: 10 }), fc.boolean(), fc.constant(null)),
})).val;

describe("streaming vs JSON.parse oracle", () => {
  it("$.foo and $.foo[*] match reference extraction", async () => {
    await fc.assert(fc.asyncProperty(
      fc.record({ foo: fc.array(jsonValueArb, { maxLength: 10 }) }),
      async (obj) => {
        const body = JSON.stringify(obj);
        const stream = new ReadableStream<Uint8Array>({
          start(c) { c.enqueue(new TextEncoder().encode(body)); c.close(); },
        });
        const ast = parsePath("$.foo[*]");
        const streamed = await streamExtract(stream, ast);
        const oracle = extract(ast, obj);
        expect(streamed).toEqual(oracle);
      },
    ), { numRuns: 100 });
  });
});
```

- [ ] **Step 2: Run, expect pass (if parser/streamer are correct).** If it fails, debug before moving on — property tests are the safety net.

- [ ] **Step 3: Commit**

```bash
git commit -am "test(openapi-transforms): streaming-vs-oracle property test"
```

### Task 1.9: Memory bound test

**Files:**
- Create: `packages/openapi-transforms/src/__tests__/streaming/memory.test.ts`

- [ ] **Step 1: Implement test with heap measurement**

```ts
import { describe, it, expect } from "vitest";
import { streamExtract } from "../../streaming/json-stream.js";
import { parsePath } from "../../path/parser.js";

function itemStream(count: number): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  let i = 0;
  return new ReadableStream({
    pull(c) {
      if (i === 0) c.enqueue(enc.encode('{"items":['));
      if (i < count) {
        const comma = i > 0 ? "," : "";
        c.enqueue(enc.encode(`${comma}{"x":${i},"payload":"${"a".repeat(200)}"}`));
        i++;
      } else {
        c.enqueue(enc.encode("]}"));
        c.close();
      }
    },
  });
}

describe("streaming memory", () => {
  it("processes 50k items without retaining full parse tree", async () => {
    if (typeof global.gc !== "function") {
      console.warn("Skipping: run with --expose-gc");
      return;
    }
    global.gc!();
    const before = process.memoryUsage().heapUsed;
    const n = 50_000;
    const result = await streamExtract(itemStream(n), parsePath("$.items[*].x"));
    global.gc!();
    const after = process.memoryUsage().heapUsed;
    expect(Array.isArray(result) ? (result as unknown[]).length : 0).toBe(n);
    // Output array (~50k numbers) is the only retained growth.
    // Full parse-tree retention would exceed ~40 MB; assert well below.
    expect(after - before).toBeLessThan(15 * 1024 * 1024);
  }, 30_000);
});
```

- [ ] **Step 2: Add `--expose-gc` to test script**

Edit `packages/openapi-transforms/package.json` — add a `test:mem` script:

```json
"test:mem": "node --expose-gc ./node_modules/vitest/vitest.mjs run src/__tests__/streaming/memory.test.ts"
```

- [ ] **Step 3: Run, expect pass**

Run: `pnpm -F @browserstack-client/openapi-transforms test:mem`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git commit -am "test(openapi-transforms): streaming memory bound"
```

### Task 1.10: Register built-in response codecs

**Files:**
- Create: `packages/openapi-transforms/src/codecs/index.ts`

- [ ] **Step 1: Implement registerBuiltins**

```ts
import type { CodecRegistry } from "../registry.js";
import { jsonResponseCodec } from "./response-json.js";
import { jsonUnwrapCodec } from "./response-json-unwrap.js";
import { jsonComposeCodec } from "./response-json-compose.js";
import { textResponseCodec } from "./response-text.js";
import { binaryResponseCodec } from "./response-binary.js";

export function registerBuiltinResponseCodecs(registry: CodecRegistry): void {
  registry.registerResponse(jsonResponseCodec);
  registry.registerResponse(jsonUnwrapCodec);
  registry.registerResponse(jsonComposeCodec);
  registry.registerResponse(textResponseCodec);
  registry.registerResponse(binaryResponseCodec);
}
```

- [ ] **Step 2: Add a smoke test**

```ts
// append to registry.test.ts
import { registerBuiltinResponseCodecs } from "../codecs/index.js";
it("registerBuiltinResponseCodecs adds all response codecs", () => {
  const r = new CodecRegistry();
  registerBuiltinResponseCodecs(r);
  expect(r.listResponse().sort()).toEqual(["binary", "json", "json-compose", "json-unwrap", "text"]);
});
```

- [ ] **Step 3: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): register built-in response codecs"
```

---

## Phase 2 — Request Codecs

### Task 2.1: `json` request codec

**Files:**
- Create: `packages/openapi-transforms/src/codecs/request-json.ts`
- Create: test alongside

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from "vitest";
import { jsonRequestCodec } from "../../codecs/request-json.js";

describe("jsonRequestCodec", () => {
  it("stringifies input with JSON content-type", () => {
    const r = jsonRequestCodec.encode({ a: 1 }, {});
    expect(r.body).toBe('{"a":1}');
    expect(r.headers!["content-type"]).toBe("application/json");
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
import type { RequestCodec } from "../registry.js";
const schema = { "~standard": { version: 1 as const, vendor: "ot", validate: (v: unknown) => ({ value: (v ?? {}) as {} }) } };
export const jsonRequestCodec: RequestCodec<unknown, {}> = {
  name: "json",
  contentType: "application/json",
  configSchema: schema as any,
  encode(input) {
    return { body: JSON.stringify(input), headers: { "content-type": "application/json" } };
  },
};
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): json request codec"
```

### Task 2.2: `multipart` request codec

**Files:**
- Create: `packages/openapi-transforms/src/codecs/request-multipart.ts`
- Create: test alongside

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from "vitest";
import { multipartRequestCodec } from "../../codecs/request-multipart.js";

describe("multipartRequestCodec", () => {
  it("builds FormData with file field + extra fields", () => {
    const file = new Blob(["hello"], { type: "text/plain" });
    const r = multipartRequestCodec.encode(
      { file, filename: "hi.txt", extra: "abc" },
      { fileField: "file", filenameFrom: "$.filename" },
    );
    expect(r.body).toBeInstanceOf(FormData);
    expect(r.headers ?? {}).not.toHaveProperty("content-type");
    const fd = r.body as FormData;
    expect(fd.get("extra")).toBe("abc");
    const f = fd.get("file") as File;
    expect(f.name).toBe("hi.txt");
  });
  it("throws on missing file field", () => {
    expect(() => multipartRequestCodec.encode({ filename: "x" }, { fileField: "file", filenameFrom: "$.filename" })).toThrow(/missing file field/);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
import type { RequestCodec } from "../registry.js";
import { parsePath } from "../path/parser.js";
import { extract } from "../path/matcher.js";

export interface MultipartConfig {
  fileField: string;
  filenameFrom: string;
}

const schema = { "~standard": { version: 1 as const, vendor: "ot", validate: (v: unknown) => {
  const o = v as any;
  if (!o || typeof o.fileField !== "string" || typeof o.filenameFrom !== "string") {
    return { issues: [{ message: "config.fileField and config.filenameFrom must be strings" }] };
  }
  return { value: v as MultipartConfig };
} } };

export const multipartRequestCodec: RequestCodec<Record<string, unknown>, MultipartConfig> = {
  name: "multipart",
  contentType: "multipart/form-data",
  configSchema: schema as any,
  encode(input, config) {
    const filePart = input[config.fileField];
    if (!(filePart instanceof Blob)) {
      throw new Error(`multipart: missing file field '${config.fileField}' or not a Blob`);
    }
    const filenameRaw = extract(parsePath(config.filenameFrom), input);
    const filename = typeof filenameRaw === "string" ? filenameRaw : undefined;
    const fd = new FormData();
    fd.append(config.fileField, filePart, filename);
    for (const [k, v] of Object.entries(input)) {
      if (k === config.fileField) continue;
      if (v == null) continue;
      fd.append(k, typeof v === "string" ? v : JSON.stringify(v));
    }
    return { body: fd };
  },
};
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): multipart request codec"
```

### Task 2.3: Register built-in request codecs + update transforms index

- [ ] **Step 1: Extend codecs/index.ts**

```ts
import { jsonRequestCodec } from "./request-json.js";
import { multipartRequestCodec } from "./request-multipart.js";

export function registerBuiltinRequestCodecs(registry: CodecRegistry): void {
  registry.registerRequest(jsonRequestCodec);
  registry.registerRequest(multipartRequestCodec);
}

export function registerAllBuiltins(registry: CodecRegistry): void {
  registerBuiltinResponseCodecs(registry);
  registerBuiltinRequestCodecs(registry);
}
```

- [ ] **Step 2: Export from src/index.ts**

```ts
export { CodecRegistry } from "./registry.js";
export type { ResponseCodec, RequestCodec, EncodedRequest } from "./registry.js";
export {
  registerBuiltinResponseCodecs,
  registerBuiltinRequestCodecs,
  registerAllBuiltins,
} from "./codecs/index.js";
export { parsePath } from "./path/parser.js";
```

- [ ] **Step 3: Typecheck + build**

Run: `pnpm -F @browserstack-client/openapi-transforms build`
Expected: success.

- [ ] **Step 4: Commit**

```bash
git commit -am "feat(openapi-transforms): register request codecs + expose public API"
```

---

## Phase 3 — `execute()` runtime

### Task 3.1: `executeOperation` — happy path

**Files:**
- Create: `packages/openapi-transforms/src/execute.ts`
- Create: `packages/openapi-transforms/src/__tests__/execute.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it, vi } from "vitest";
import { executeOperation } from "../execute.js";
import { CodecRegistry } from "../registry.js";
import { registerAllBuiltins } from "../codecs/index.js";

function makeRegistry() {
  const r = new CodecRegistry();
  registerAllBuiltins(r);
  return r;
}

describe("executeOperation happy path", () => {
  it("GET + json codec returns parsed body", async () => {
    const fetchFn = vi.fn(async () => new Response('{"ok":true}', { status: 200, headers: { "content-type":"application/json" } }));
    const r = await executeOperation({
      operationId: "op", method: "GET", url: "http://x/a",
      registry: makeRegistry(),
      responseCodec: "json", responseCodecConfig: {},
    }, fetchFn as any);
    expect(r).toEqual({ ok: true });
    expect(fetchFn).toHaveBeenCalledOnce();
  });
  it("POST with json request codec sends serialized body + content-type", async () => {
    let captured: RequestInit | undefined;
    const fetchFn = vi.fn(async (_url: string, init: RequestInit) => {
      captured = init;
      return new Response('{}', { status: 200, headers: { "content-type": "application/json" } });
    });
    await executeOperation({
      operationId: "op", method: "POST", url: "http://x/a",
      registry: makeRegistry(),
      requestCodec: "json", requestCodecConfig: {}, requestInput: { a: 1 },
      responseCodec: "json", responseCodecConfig: {},
    }, fetchFn as any);
    expect(captured?.method).toBe("POST");
    expect(captured?.body).toBe('{"a":1}');
    expect((captured?.headers as any)["content-type"]).toBe("application/json");
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
import type { CodecRegistry } from "./registry.js";
import type { CodecContext } from "./errors.js";
import {
  HttpError, NetworkError, DecodeError, TransformError, ClientError, OpenAPIError,
} from "./errors.js";
import { CodecError } from "./codec-error.js";
import { captureErrorBody } from "./body-capture.js";
import { defaultErrorMessage } from "./error-message.js";
import { isRetryable } from "./retryable.js";

export interface ExecuteOptions {
  maxErrorBodySize?: number;
  errorMessageExtractor?: (body: unknown, ctx: CodecContext) => string | undefined;
}

export interface ExecuteSpec {
  operationId: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  registry: CodecRegistry;
  requestCodec?: string;
  requestCodecConfig?: unknown;
  requestInput?: unknown;
  responseCodec: string;
  responseCodecConfig: unknown;
}

export async function executeOperation(
  spec: ExecuteSpec,
  fetchFn: typeof fetch = fetch,
  options: ExecuteOptions = {},
): Promise<unknown> {
  const ctx: CodecContext = { operationId: spec.operationId, method: spec.method, url: spec.url };
  const maxErrorBodySize = options.maxErrorBodySize ?? 64 * 1024;
  const extractor = options.errorMessageExtractor ?? defaultErrorMessage;

  let body: BodyInit | undefined;
  let headers: Record<string, string> = { ...(spec.headers ?? {}) };

  if (spec.requestCodec) {
    try {
      const codec = spec.registry.resolveRequest(spec.requestCodec);
      const enc = codec.encode(spec.requestInput, spec.requestCodecConfig);
      body = enc.body;
      headers = { ...headers, ...(enc.headers ?? {}) };
    } catch (cause) {
      throw new ClientError(`request encode failed: ${(cause as Error).message}`, ctx, cause as Error);
    }
  }

  let response: Response;
  try {
    response = await fetchFn(spec.url, { method: spec.method, headers, body });
  } catch (cause) {
    throw new NetworkError((cause as Error).message || "network error", ctx, cause as Error);
  }

  if (!response.ok) {
    const captured = await captureErrorBody(response.clone(), maxErrorBodySize);
    const message = extractor(captured.parsed ?? captured.text, ctx) ?? `HTTP ${response.status} ${response.statusText}`;
    throw new HttpError(message, ctx, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      requestId: response.headers.get("x-request-id") ?? undefined,
      body: captured,
      retryable: isRetryable("http", response.status),
    });
  }

  const codec = spec.registry.resolveResponse(spec.responseCodec);
  try {
    return await codec.decode(response, spec.responseCodecConfig, ctx);
  } catch (cause) {
    if (cause instanceof CodecError) {
      const base = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        codecName: cause.codecName,
        cause: cause.cause ?? cause,
      };
      if (cause.stage === "decode") {
        throw new DecodeError(cause.message, ctx, base);
      }
      throw new TransformError(cause.message, ctx, { ...base });
    }
    throw new OpenAPIError("decode", (cause as Error).message, ctx, cause as Error);
  }
}
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): executeOperation happy path"
```

### Task 3.2: `executeOperation` — error paths

- [ ] **Step 1: Add failing tests**

```ts
// append to execute.test.ts
import { NetworkError, HttpError, DecodeError, TransformError, ClientError } from "../errors.js";

describe("executeOperation error paths", () => {
  it("wraps fetch reject as NetworkError", async () => {
    const fetchFn = vi.fn(async () => { throw new Error("ECONNRESET"); });
    await expect(executeOperation({
      operationId: "op", method: "GET", url: "http://x",
      registry: makeRegistry(), responseCodec: "json", responseCodecConfig: {},
    }, fetchFn as any)).rejects.toBeInstanceOf(NetworkError);
  });
  it("wraps non-2xx as HttpError with status/headers/body", async () => {
    const fetchFn = vi.fn(async () => new Response('{"error":"bad"}', {
      status: 400, statusText: "Bad Request",
      headers: { "content-type": "application/json", "x-request-id": "rid-1" },
    }));
    try {
      await executeOperation({
        operationId: "op", method: "GET", url: "http://x",
        registry: makeRegistry(), responseCodec: "json", responseCodecConfig: {},
      }, fetchFn as any);
      throw new Error("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(HttpError);
      const h = e as HttpError;
      expect(h.status).toBe(400);
      expect(h.requestId).toBe("rid-1");
      expect(h.body.parsed).toEqual({ error: "bad" });
      expect(h.message).toBe("bad");
    }
  });
  it("wraps codec decode failure as DecodeError", async () => {
    const fetchFn = vi.fn(async () => new Response("not{json", { status: 200, headers: { "content-type": "application/json" } }));
    await expect(executeOperation({
      operationId: "op", method: "GET", url: "http://x",
      registry: makeRegistry(), responseCodec: "json", responseCodecConfig: {},
    }, fetchFn as any)).rejects.toBeInstanceOf(DecodeError);
  });
  it("wraps codec transform failure as TransformError", async () => {
    const fetchFn = vi.fn(async () => new Response('{"other":1}', { status: 200 }));
    await expect(executeOperation({
      operationId: "op", method: "GET", url: "http://x",
      registry: makeRegistry(),
      responseCodec: "json-unwrap", responseCodecConfig: { path: "$.missing" },
    }, fetchFn as any)).rejects.toBeInstanceOf(TransformError);
  });
  it("wraps encode failure as ClientError", async () => {
    const fetchFn = vi.fn(async () => new Response('{}', { status: 200 }));
    await expect(executeOperation({
      operationId: "op", method: "POST", url: "http://x",
      registry: makeRegistry(),
      requestCodec: "multipart", requestCodecConfig: { fileField: "file", filenameFrom: "$.filename" },
      requestInput: { /* no file */ },
      responseCodec: "json", responseCodecConfig: {},
    }, fetchFn as any)).rejects.toBeInstanceOf(ClientError);
  });
});
```

- [ ] **Step 2: Run, expect pass (implementation already covers these).** If any fail, fix `execute.ts`.

- [ ] **Step 3: Commit**

```bash
git commit -am "test(openapi-transforms): executeOperation error paths"
```

### Task 3.3: Export `executeOperation` from index

- [ ] **Step 1: Update src/index.ts**

Add:
```ts
export { executeOperation } from "./execute.js";
export type { ExecuteSpec, ExecuteOptions } from "./execute.js";
```

- [ ] **Step 2: Build + commit**

```bash
pnpm -F @browserstack-client/openapi-transforms build
git commit -am "feat(openapi-transforms): export executeOperation"
```

---

## Phase 4 — Codegen emitter

### Task 4.1: Annotation reader + validator

**Files:**
- Create: `packages/openapi-transforms/src/codegen/annotations.ts`
- Create: `packages/openapi-transforms/src/__tests__/codegen/annotations.test.ts`

- [ ] **Step 1: Failing tests**

```ts
import { describe, expect, it } from "vitest";
import { readAnnotations } from "../../codegen/annotations.js";
import { CodecRegistry } from "../../registry.js";
import { registerAllBuiltins } from "../../codecs/index.js";

const registry = (() => { const r = new CodecRegistry(); registerAllBuiltins(r); return r; })();

describe("readAnnotations", () => {
  it("returns defaults when no annotations", () => {
    const a = readAnnotations({}, registry, "opId");
    expect(a.responseCodec).toBe("json");
    expect(a.responseCodecConfig).toEqual({});
    expect(a.requestCodec).toBe("json");
    expect(a.custom).toEqual({ response: false, request: false });
  });
  it("parses x-response-transform", () => {
    const a = readAnnotations({
      "x-response-transform": { codec: "json-unwrap", config: { path: "$.project" } },
    }, registry, "opId");
    expect(a.responseCodec).toBe("json-unwrap");
    expect(a.responseCodecConfig).toEqual({ path: "$.project" });
  });
  it("throws on unknown codec", () => {
    expect(() => readAnnotations({
      "x-response-transform": { codec: "no-such-codec" },
    }, registry, "opId")).toThrow(/unknown response codec/);
  });
  it("throws on invalid config per schema", () => {
    expect(() => readAnnotations({
      "x-response-transform": { codec: "json-unwrap", config: { path: 123 } },
    }, registry, "opId")).toThrow(/config\.path/);
  });
  it("x-response-custom skips method emission", () => {
    const a = readAnnotations({ "x-response-custom": true }, registry, "opId");
    expect(a.custom.response).toBe(true);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
import type { CodecRegistry } from "../registry.js";

export interface OperationAnnotations {
  responseCodec: string;
  responseCodecConfig: unknown;
  requestCodec: string;
  requestCodecConfig: unknown;
  custom: { response: boolean; request: boolean };
}

type Op = Record<string, unknown> & {
  "x-response-transform"?: { codec: string; config?: unknown };
  "x-request-transform"?: { codec: string; config?: unknown };
  "x-response-custom"?: boolean;
  "x-request-custom"?: boolean;
};

function validateConfig(schema: any, value: unknown, where: string): unknown {
  const res = schema["~standard"].validate(value ?? {});
  if ("issues" in res) {
    const msg = res.issues.map((i: any) => i.message).join("; ");
    throw new Error(`${where}: ${msg}`);
  }
  return res.value;
}

export function readAnnotations(op: Op, registry: CodecRegistry, operationId: string): OperationAnnotations {
  const custom = { response: Boolean(op["x-response-custom"]), request: Boolean(op["x-request-custom"]) };

  const respAnn = op["x-response-transform"];
  const respName = respAnn?.codec ?? "json";
  let respCodec;
  try { respCodec = registry.resolveResponse(respName); }
  catch { throw new Error(`${operationId}: unknown response codec '${respName}'`); }
  const respConfig = validateConfig(respCodec.configSchema, respAnn?.config, `${operationId}.x-response-transform.config`);

  const reqAnn = op["x-request-transform"];
  const reqName = reqAnn?.codec ?? "json";
  let reqCodec;
  try { reqCodec = registry.resolveRequest(reqName); }
  catch { throw new Error(`${operationId}: unknown request codec '${reqName}'`); }
  const reqConfig = validateConfig(reqCodec.configSchema, reqAnn?.config, `${operationId}.x-request-transform.config`);

  return { responseCodec: respName, responseCodecConfig: respConfig, requestCodec: reqName, requestCodecConfig: reqConfig, custom };
}
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): codegen annotation reader"
```

### Task 4.2: Method emitter

**Files:**
- Create: `packages/openapi-transforms/src/codegen/emit-method.ts`
- Create: test alongside

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from "vitest";
import { emitMethod } from "../../codegen/emit-method.js";

describe("emitMethod", () => {
  it("emits a GET method with path params and json-unwrap codec", () => {
    const src = emitMethod({
      operationId: "getAutomateProject",
      method: "GET",
      path: "/automate/projects/{projectId}.json",
      pathParams: [{ name: "projectId", tsType: "number" }],
      queryParams: [],
      hasRequestBody: false,
      operationsKey: "getAutomateProject",
      returnType: 'components["schemas"]["AutomateProject"]',
      annotations: {
        responseCodec: "json-unwrap", responseCodecConfig: { path: "$.project" },
        requestCodec: "json", requestCodecConfig: {},
        custom: { response: false, request: false },
      },
      baseUrl: "sdk",
    });
    expect(src).toContain("getAutomateProject(projectId: number");
    expect(src).toContain("operationId: \"getAutomateProject\"");
    expect(src).toContain("method: \"GET\"");
    expect(src).toContain("path: \"/automate/projects/{projectId}.json\"");
    expect(src).toContain("responseCodec: \"json-unwrap\"");
    expect(src).toContain("responseCodecConfig: { path: \"$.project\" }");
    expect(src).toContain("Promise<components[\"schemas\"][\"AutomateProject\"]>");
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
import type { OperationAnnotations } from "./annotations.js";

export interface EmitMethodInput {
  operationId: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  pathParams: Array<{ name: string; tsType: string }>;
  queryParams: Array<{ name: string; tsType: string; required: boolean }>;
  hasRequestBody: boolean;
  operationsKey: string;
  returnType: string;
  annotations: OperationAnnotations;
  baseUrl: "sdk" | "sdkCloud";
}

export function emitMethod(input: EmitMethodInput): string {
  const params = [
    ...input.pathParams.map((p) => `${p.name}: ${p.tsType}`),
    ...(input.hasRequestBody ? [`body: operations["${input.operationsKey}"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown`] : []),
    `options?: APIFetchOptions<operations["${input.operationsKey}"]>`,
  ].join(", ");

  const pathArg = input.pathParams.length
    ? `{ path: { ${input.pathParams.map((p) => p.name).join(", ")} } }`
    : "undefined";

  const configLit = JSON.stringify(input.annotations.responseCodecConfig);

  return `
  ${input.operationId}(${params}): Promise<${input.returnType}> {
    return this.execute({
      operationId: "${input.operationId}",
      method: "${input.method}",
      path: "${input.path}",
      params: ${pathArg},
      ${input.hasRequestBody ? "requestInput: body," : ""}
      requestCodec: "${input.annotations.requestCodec}",
      requestCodecConfig: ${JSON.stringify(input.annotations.requestCodecConfig)},
      responseCodec: "${input.annotations.responseCodec}",
      responseCodecConfig: ${configLit},
      baseUrl: "${input.baseUrl}",
      ...options,
    }) as Promise<${input.returnType}>;
  }`.trim();
}
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): emit-method codegen"
```

### Task 4.3: Return-type deriver

**Files:**
- Create: `packages/openapi-transforms/src/codegen/derive-return-type.ts`
- Create: test alongside

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from "vitest";
import { deriveReturnType } from "../../codegen/derive-return-type.js";

describe("deriveReturnType", () => {
  it("applies $.foo against a { foo: T } shape", () => {
    expect(deriveReturnType(
      `operations["getX"]["responses"][200]["content"]["application/json"]`,
      { responseCodec: "json-unwrap", responseCodecConfig: { path: "$.foo" } } as any,
    )).toBe(`operations["getX"]["responses"][200]["content"]["application/json"]["foo"]`);
  });
  it("applies $[*].bar against T[] shape as array of bar", () => {
    expect(deriveReturnType(
      `operations["getX"]["responses"][200]["content"]["application/json"]`,
      { responseCodec: "json-unwrap", responseCodecConfig: { path: "$[*].bar" } } as any,
    )).toBe(`Array<operations["getX"]["responses"][200]["content"]["application/json"][number]["bar"]>`);
  });
  it("returns base type for json codec", () => {
    expect(deriveReturnType(
      `operations["getX"]["responses"][200]["content"]["application/json"]`,
      { responseCodec: "json", responseCodecConfig: {} } as any,
    )).toBe(`operations["getX"]["responses"][200]["content"]["application/json"]`);
  });
  it("uses `string` for text, `ArrayBuffer` for binary default", () => {
    expect(deriveReturnType("X", { responseCodec: "text", responseCodecConfig: {} } as any)).toBe("string");
    expect(deriveReturnType("X", { responseCodec: "binary", responseCodecConfig: {} } as any)).toBe("ArrayBuffer");
    expect(deriveReturnType("X", { responseCodec: "binary", responseCodecConfig: { as: "blob" } } as any)).toBe("Blob");
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
import type { OperationAnnotations } from "./annotations.js";
import { parsePath } from "../path/parser.js";

export function deriveReturnType(baseType: string, ann: OperationAnnotations): string {
  switch (ann.responseCodec) {
    case "json": return baseType;
    case "text": return "string";
    case "binary": {
      const as = (ann.responseCodecConfig as any)?.as;
      return as === "blob" ? "Blob" : "ArrayBuffer";
    }
    case "json-unwrap": {
      const path = (ann.responseCodecConfig as any).path as string;
      return applyPath(baseType, path);
    }
    case "json-compose": {
      // base + merge — use inferred shape; emit a helper type alias at emit-module level
      return baseType; // refined later
    }
    default:
      return "unknown";
  }
}

function applyPath(base: string, path: string): string {
  const ast = parsePath(path);
  let acc = base;
  let isArray = false;
  for (const node of ast.slice(1)) {
    if (node.kind === "field") {
      if (isArray) acc = `Array<${acc}[number]["${node.name}"]>`;
      else acc = `${acc}["${node.name}"]`;
    } else if (node.kind === "wildcard") {
      isArray = true;
    } else if (node.kind === "index") {
      acc = `${acc}[number]`;
    }
  }
  if (isArray && !acc.startsWith("Array<")) acc = `Array<${acc}[number]>`;
  return acc;
}
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): derive-return-type"
```

### Task 4.4: Per-operation error alias emitter

**Files:**
- Create: `packages/openapi-transforms/src/codegen/emit-error-type.ts`
- Create: test alongside

- [ ] **Step 1: Failing test**

```ts
import { describe, expect, it } from "vitest";
import { emitErrorAlias } from "../../codegen/emit-error-type.js";

describe("emitErrorAlias", () => {
  it("builds union of error bodies from response schemas", () => {
    const src = emitErrorAlias("getAutomateProject", [400, 401, 404]);
    expect(src).toBe(
      `export type GetAutomateProjectError = HttpError<\n` +
      `  | operations["getAutomateProject"]["responses"][400]["content"]["application/json"]\n` +
      `  | operations["getAutomateProject"]["responses"][401]["content"]["application/json"]\n` +
      `  | operations["getAutomateProject"]["responses"][404]["content"]["application/json"]\n` +
      `>;`
    );
  });
  it("omits HttpError<never> when no error responses", () => {
    const src = emitErrorAlias("getX", []);
    expect(src).toBe("export type GetXError = HttpError<unknown>;");
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

```ts
export function emitErrorAlias(operationId: string, errorStatuses: number[]): string {
  const alias = operationId.charAt(0).toUpperCase() + operationId.slice(1) + "Error";
  if (!errorStatuses.length) return `export type ${alias} = HttpError<unknown>;`;
  const lines = errorStatuses.map((s) =>
    `  | operations["${operationId}"]["responses"][${s}]["content"]["application/json"]`
  );
  return `export type ${alias} = HttpError<\n${lines.join("\n")}\n>;`;
}
```

- [ ] **Step 4: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): per-op error alias emitter"
```

### Task 4.5: Module-level emitter + golden snapshot

**Files:**
- Create: `packages/openapi-transforms/src/codegen/emit-module.ts`
- Create: `packages/openapi-transforms/src/codegen/index.ts`
- Create: `packages/openapi-transforms/src/__tests__/fixtures/tiny-spec.yml`
- Create: `packages/openapi-transforms/src/__tests__/fixtures/tiny-spec.expected.ts`
- Create: `packages/openapi-transforms/src/__tests__/codegen/snapshot.test.ts`

- [ ] **Step 1: Write the fixture spec**

```yaml
# tiny-spec.yml
openapi: 3.0.3
info: { title: tiny, version: "1.0" }
paths:
  /projects/{projectId}:
    get:
      operationId: getProject
      x-response-transform: { codec: json-unwrap, config: { path: "$.project" } }
      parameters:
        - { name: projectId, in: path, required: true, schema: { type: integer } }
      responses:
        "200": { description: ok, content: { application/json: { schema: { $ref: "#/components/schemas/Envelope" } } } }
        "404": { description: nf, content: { application/json: { schema: { $ref: "#/components/schemas/Error" } } } }
  /logs:
    get:
      operationId: getLogs
      x-response-transform: { codec: text }
      responses: { "200": { description: ok, content: { text/plain: { schema: { type: string } } } } }
  /upload:
    post:
      operationId: uploadFile
      x-request-custom: true
      x-response-custom: true
      responses: { "200": { description: ok, content: { application/json: { schema: { type: object } } } } }
components:
  schemas:
    Envelope: { type: object, properties: { project: { $ref: "#/components/schemas/Project" } } }
    Project: { type: object, properties: { id: { type: integer } } }
    Error: { type: object, properties: { message: { type: string } } }
```

- [ ] **Step 2: Implement emit-module + generateClientModule**

```ts
// emit-module.ts
import { emitMethod, type EmitMethodInput } from "./emit-method.js";
import { emitErrorAlias } from "./emit-error-type.js";

export interface EmitModuleInput {
  className: string;          // e.g. "GeneratedAutomateClient"
  typesImportPath: string;    // e.g. "../../openapi/generated/automate"
  methods: EmitMethodInput[];
  errorAliases: Array<{ operationId: string; errorStatuses: number[] }>;
}

export function emitModule(input: EmitModuleInput): string {
  const header = `/* AUTO-GENERATED — do not edit */
import type { operations, components } from "${input.typesImportPath}";
import type { APIFetchOptions } from "@browserstack-client/core";
import { HttpError } from "@browserstack-client/openapi-transforms";
`;
  const aliases = input.errorAliases.map((a) => emitErrorAlias(a.operationId, a.errorStatuses)).join("\n\n");
  const body = `export abstract class ${input.className} {
  protected abstract execute(spec: any): Promise<unknown>;
${input.methods.map(emitMethod).join("\n\n")}
}`;
  return `${header}\n${aliases}\n\n${body}\n`;
}
```

```ts
// codegen/index.ts
import yaml from "yaml";
import fs from "node:fs/promises";
import type { CodecRegistry } from "../registry.js";
import { readAnnotations } from "./annotations.js";
import { emitModule } from "./emit-module.js";
import { deriveReturnType } from "./derive-return-type.js";

export interface GenerateClientOptions {
  specPath: string;
  className: string;
  typesImportPath: string;
  registry: CodecRegistry;
  baseUrl: "sdk" | "sdkCloud";
}

export async function generateClientModule(opts: GenerateClientOptions): Promise<string> {
  const raw = await fs.readFile(opts.specPath, "utf8");
  const doc: any = yaml.parse(raw);
  const methods: any[] = [];
  const errorAliases: any[] = [];
  for (const [path, pathItem] of Object.entries(doc.paths ?? {}) as any) {
    for (const method of ["get", "post", "put", "patch", "delete"] as const) {
      const op = pathItem[method]; if (!op) continue;
      const operationId = op.operationId; if (!operationId) continue;
      const annotations = readAnnotations(op, opts.registry, operationId);
      if (annotations.custom.response || annotations.custom.request) continue;

      const successCT = op.responses?.["200"]?.content?.["application/json"]
        ? `operations["${operationId}"]["responses"][200]["content"]["application/json"]`
        : op.responses?.["200"]?.content?.["text/plain"] ? `string` : `unknown`;
      const returnType = deriveReturnType(successCT, annotations);
      const pathParams = (op.parameters ?? []).filter((p: any) => p.in === "path").map((p: any) => ({
        name: p.name, tsType: p.schema?.type === "integer" ? "number" : "string",
      }));
      methods.push({
        operationId, method: method.toUpperCase(), path,
        pathParams, queryParams: [], hasRequestBody: Boolean(op.requestBody),
        operationsKey: operationId, returnType, annotations, baseUrl: opts.baseUrl,
      });
      const errorStatuses = Object.keys(op.responses ?? {}).map(Number)
        .filter((s) => Number.isFinite(s) && s >= 400);
      errorAliases.push({ operationId, errorStatuses });
    }
  }
  return emitModule({ className: opts.className, typesImportPath: opts.typesImportPath, methods, errorAliases });
}
```

- [ ] **Step 3: Generate the expected fixture output once, then commit it**

Run: `node --experimental-strip-types -e "import('./packages/openapi-transforms/dist/codegen/index.js').then(async m => { const { CodecRegistry } = await import('./packages/openapi-transforms/dist/index.js'); const { registerAllBuiltins } = await import('./packages/openapi-transforms/dist/index.js'); const r = new CodecRegistry(); registerAllBuiltins(r); const out = await m.generateClientModule({ specPath: 'packages/openapi-transforms/src/__tests__/fixtures/tiny-spec.yml', className: 'TinyClient', typesImportPath: './tiny-types', registry: r, baseUrl: 'sdk' }); require('fs').writeFileSync('packages/openapi-transforms/src/__tests__/fixtures/tiny-spec.expected.ts', out); }); "`

Inspect the file, confirm it looks right, commit.

- [ ] **Step 4: Write snapshot test**

```ts
// snapshot.test.ts
import { describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { generateClientModule } from "../../codegen/index.js";
import { CodecRegistry } from "../../registry.js";
import { registerAllBuiltins } from "../../codecs/index.js";

describe("codegen snapshot", () => {
  it("matches the golden file for tiny-spec", async () => {
    const r = new CodecRegistry();
    registerAllBuiltins(r);
    const actual = await generateClientModule({
      specPath: path.resolve(__dirname, "../fixtures/tiny-spec.yml"),
      className: "TinyClient",
      typesImportPath: "./tiny-types",
      registry: r,
      baseUrl: "sdk",
    });
    const expected = await fs.readFile(path.resolve(__dirname, "../fixtures/tiny-spec.expected.ts"), "utf8");
    expect(actual).toBe(expected);
  });
});
```

- [ ] **Step 5: Run, expect pass. Commit.**

```bash
git commit -am "feat(openapi-transforms): module emitter + snapshot test"
```

### Task 4.6: Codegen validation failures test

- [ ] **Step 1: Add a failing test with bad spec fragment**

```ts
// append to annotations.test.ts
it("throws with operationId + config path when annotation invalid", () => {
  expect(() => readAnnotations(
    { "x-response-transform": { codec: "json-unwrap", config: { path: 123 } } },
    registry, "getBad"
  )).toThrow(/getBad.*x-response-transform.config.*path/);
});
```

- [ ] **Step 2: Run, expect it already passes.** If not, sharpen the error string in `validateConfig`. Commit.

```bash
git commit -am "test(openapi-transforms): codegen annotation failure includes operationId + path"
```

---

## Phase 5 — Type-level tests

### Task 5.1: `expectTypeOf` harness + core type assertions

**Files:**
- Create: `packages/openapi-transforms/src/__tests__/types.test-d.ts`

- [ ] **Step 1: Write type tests**

```ts
import { expectTypeOf, test } from "vitest";
import { HttpError, NetworkError, isHttpError, type CodecContext } from "../index.js";

test("HttpError status is non-optional number", () => {
  const ctx: CodecContext = { operationId: "x", method: "GET", url: "u" };
  const e = new HttpError<{ foo: string }>("m", ctx, { status: 404, statusText: "", headers: new Headers(), body: {}, retryable: false });
  expectTypeOf(e.status).toEqualTypeOf<number>();
  expectTypeOf(e.headers).toEqualTypeOf<Headers>();
  expectTypeOf(e.body.parsed).toEqualTypeOf<{ foo: string } | undefined>();
});

test("isHttpError narrows unknown to HttpError<T>", () => {
  const err: unknown = new Error();
  if (isHttpError<{ q: number }>(err)) {
    expectTypeOf(err).toEqualTypeOf<HttpError<{ q: number }>>();
  }
});

test("NetworkError.cause is non-optional Error", () => {
  const e = new NetworkError("x", { operationId:"x", method:"GET", url:"u" }, new Error("y"));
  expectTypeOf(e.cause).toEqualTypeOf<Error>();
});
```

- [ ] **Step 2: Run**

Run: `pnpm -F @browserstack-client/openapi-transforms test`
Expected: type-tests pass.

- [ ] **Step 3: Commit**

```bash
git commit -am "test(openapi-transforms): type-level assertions for error API"
```

---

## Phase 6 — Integrate into `packages/openapi/build.mjs`

### Task 6.1: Call codegen from build.mjs

**Files:**
- Modify: `packages/openapi/build.mjs`
- Modify: `packages/openapi/package.json` (add transforms dep)

- [ ] **Step 1: Add dep**

Edit `packages/openapi/package.json`, add `"@browserstack-client/openapi-transforms": "workspace:*"` to `dependencies`. Run `pnpm install`.

- [ ] **Step 2: Extend build.mjs**

Append after existing types generation:

```js
import { CodecRegistry } from "@browserstack-client/openapi-transforms";
import { registerAllBuiltins } from "@browserstack-client/openapi-transforms";
import { generateClientModule } from "@browserstack-client/openapi-transforms/codegen";

console.log("Generating transform-based client modules...");
const registry = new CodecRegistry();
registerAllBuiltins(registry);

const productSpecs = [
  { product: "automate", baseUrl: "sdk" },
  { product: "app-automate", baseUrl: "sdk" },
  { product: "js-testing", baseUrl: "sdk" },
  { product: "screenshots", baseUrl: "sdk" },
  { product: "local-testing", baseUrl: "sdk" },
];

for (const { product, baseUrl } of productSpecs) {
  const specPath = path.join(__dirname, "specs", `${product}.yml`);
  try {
    const src = await generateClientModule({
      specPath,
      className: `Generated${toPascal(product)}Client`,
      typesImportPath: `./${product}`,
      registry,
      baseUrl,
    });
    await fs.writeFile(path.join(outDir, `${product}.client.ts`), src);
    console.log(`  ✓ ${product}.client.ts`);
  } catch (e) {
    console.error(`  ✗ ${product}:`, e.message);
    process.exitCode = 1;
  }
}

function toPascal(s) { return s.split(/[-_]/).map(w => w[0].toUpperCase() + w.slice(1)).join(""); }
```

- [ ] **Step 3: Run build**

Run: `pnpm build:types`
Expected: succeeds, and product `.client.ts` files appear in `packages/openapi/generated/`.

- [ ] **Step 4: Inspect one generated file**

Open `packages/openapi/generated/automate.client.ts`. Confirm: class header, method signatures, execute() calls, error alias types. If unannotated operations fail (because default `json` codec doesn't know return shape), they should still emit with `returnType = operations[...][200][...][application/json]` — verify at least one method.

- [ ] **Step 5: Commit**

```bash
git add packages/openapi/build.mjs packages/openapi/package.json packages/openapi/generated pnpm-lock.yaml
git commit -m "feat(openapi): generate .client.ts alongside types"
```

---

## Phase 7 — Wire `execute()` into core `APIClient`

### Task 7.1: Add `execute()` to APIClient

**Files:**
- Modify: `packages/core/src/api-client.ts`
- Create: `packages/core/src/__tests__/api-client-execute.test.ts`

- [ ] **Step 1: Failing test**

```ts
// api-client-execute.test.ts
import { describe, expect, it, vi } from "vitest";
import { APIClient } from "../api-client.js";
import { HttpError } from "@browserstack-client/openapi-transforms";

class TestClient extends APIClient<any> {
  run(path: string, method: any) {
    return this.execute({
      operationId: "x", method, path, responseCodec: "json", responseCodecConfig: {}, baseUrl: "sdk",
    });
  }
}

describe("APIClient.execute()", () => {
  it("resolves sdk base URL and returns JSON", async () => {
    const fetchFn = vi.fn(async () => new Response('{"ok":true}', { status: 200, headers: { "content-type": "application/json" } }));
    const c = new TestClient({ username: "u", accessKey: "k", fetchFn: fetchFn as any }, "https://api.example.com", "https://api-cloud.example.com", "pkg", "1.0");
    await expect(c.run("/foo", "GET")).resolves.toEqual({ ok: true });
    expect(fetchFn).toHaveBeenCalledWith("https://api.example.com/foo", expect.objectContaining({ method: "GET" }));
    expect((fetchFn.mock.calls[0]![1]! as any).headers.Authorization).toMatch(/^Basic /);
  });
  it("routes to cloud base URL when baseUrl: 'sdkCloud'", async () => {
    const fetchFn = vi.fn(async () => new Response('{}', { status: 200, headers: { "content-type": "application/json" } }));
    class C extends APIClient<any> {
      run() { return this.execute({ operationId: "x", method: "GET", path: "/a", responseCodec: "json", responseCodecConfig: {}, baseUrl: "sdkCloud" }); }
    }
    const c = new C({ username: "u", accessKey: "k", fetchFn: fetchFn as any }, "https://sdk", "https://cloud", "p", "1");
    await c.run();
    expect(fetchFn).toHaveBeenCalledWith("https://cloud/a", expect.anything());
  });
  it("non-2xx throws HttpError", async () => {
    const fetchFn = vi.fn(async () => new Response('{"error":"nope"}', { status: 400, headers: { "content-type": "application/json" } }));
    const c = new TestClient({ username: "u", accessKey: "k", fetchFn: fetchFn as any }, "https://a", "https://b", "p", "1");
    await expect(c.run("/x", "GET")).rejects.toBeInstanceOf(HttpError);
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement `execute()` in api-client.ts**

Add these imports at the top:

```ts
import {
  CodecRegistry,
  executeOperation,
  registerAllBuiltins,
  type ResponseCodec,
  type RequestCodec,
} from "@browserstack-client/openapi-transforms";
```

Extend `BrowserStackOptions`:

```ts
export interface BrowserStackOptions extends Partial<ClientOptions> {
  // ... existing fields
  codecs?: Array<ResponseCodec<any, any> | RequestCodec<any, any>>;
  errorMessageExtractor?: (body: unknown, ctx: { operationId: string; method: string; url: string }) => string | undefined;
  maxErrorBodySize?: number;
}
```

In the constructor, after setting `this.sdk` and `this.sdkCloud`:

```ts
    this.baseUrls = {
      sdk: options.baseUrl ?? baseUrl,
      sdkCloud: cloudBaseUrl,
    };
    this.authHeader = username ? buildBasicAuthHeader(username, accessKey) : undefined;
    this.userAgent = pkginfo.userAgent;
    this.fetchFn = options.fetchFn ?? fetch;
    this.registry = new CodecRegistry();
    registerAllBuiltins(this.registry);
    for (const c of options.codecs ?? []) {
      if ("contentTypes" in c) this.registry.registerResponse(c);
      else this.registry.registerRequest(c);
    }
    this.executeOptions = {
      maxErrorBodySize: options.maxErrorBodySize,
      errorMessageExtractor: options.errorMessageExtractor,
    };
```

Add fields and `execute()` method:

```ts
  protected readonly baseUrls: { sdk: string; sdkCloud: string };
  protected readonly authHeader?: string;
  protected readonly userAgent: string;
  protected readonly fetchFn: typeof fetch;
  protected readonly registry: CodecRegistry;
  private readonly executeOptions: { maxErrorBodySize?: number; errorMessageExtractor?: any };

  protected async execute<T = unknown>(spec: {
    operationId: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    params?: { path?: Record<string, unknown>; query?: Record<string, unknown> };
    requestCodec?: string;
    requestCodecConfig?: unknown;
    requestInput?: unknown;
    responseCodec: string;
    responseCodecConfig: unknown;
    baseUrl?: "sdk" | "sdkCloud";
  }): Promise<T> {
    const base = this.baseUrls[spec.baseUrl ?? "sdk"];
    let interpolated = spec.path;
    for (const [k, v] of Object.entries(spec.params?.path ?? {})) {
      interpolated = interpolated.replace(`{${k}}`, encodeURIComponent(String(v)));
    }
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(spec.params?.query ?? {})) {
      if (v == null) continue;
      if (Array.isArray(v)) for (const item of v) qs.append(k, String(item));
      else qs.append(k, String(v));
    }
    const query = qs.toString();
    const url = `${base}${interpolated}${query ? "?" + query : ""}`;
    const headers: Record<string, string> = { "User-Agent": this.userAgent };
    if (this.authHeader) headers["Authorization"] = this.authHeader;
    return executeOperation(
      {
        operationId: spec.operationId, method: spec.method, url,
        headers, registry: this.registry,
        requestCodec: spec.requestCodec, requestCodecConfig: spec.requestCodecConfig, requestInput: spec.requestInput,
        responseCodec: spec.responseCodec, responseCodecConfig: spec.responseCodecConfig,
      },
      this.fetchFn,
      this.executeOptions,
    ) as Promise<T>;
  }
```

- [ ] **Step 4: Run, expect pass**

Run: `pnpm -F @browserstack-client/core test -- api-client-execute`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git commit -am "feat(core): APIClient.execute() with dual base URLs"
```

### Task 7.2: Keep legacy `makeXRequest` helpers

The existing methods already work via `this.sdk`/`this.sdkCloud`. They remain unchanged and will be removed in v7. No task needed beyond verifying typecheck still passes.

- [ ] **Step 1: Verify typecheck**

Run: `pnpm -F @browserstack-client/core typecheck`
Expected: PASS.

---

## Phase 8 — Migrate `automate` package

### Task 8.1: Annotate `automate.yml`

**Files:**
- Modify: `packages/openapi/specs/automate.yml`

For each operation listed in the hand-written client (`packages/automate/src/client.ts`), add the matching annotation. This is a reading + editing task — take it operation-by-operation.

- [ ] **Step 1: List operations needing annotation**

Read `packages/automate/src/client.ts`. For every method that ends with `.then(d => d.project)` or similar envelope unwrap, note the operationId and path. Make an inventory list (save as a scratch file if useful).

- [ ] **Step 2: Annotate single-value unwraps**

Example pattern — for every op that unwraps `{ project: ... }`:

```yaml
/automate/projects/{projectId}.json:
  get:
    operationId: getAutomateProject
    x-response-transform: { codec: json-unwrap, config: { path: "$.project" } }
    # ...rest unchanged
```

Apply to every such operation in `automate.yml`.

- [ ] **Step 3: Annotate array unwraps**

Pattern — `data.map(x => x.automation_build)`:

```yaml
x-response-transform: { codec: json-unwrap, config: { path: "$[*].automation_build" } }
```

- [ ] **Step 4: Annotate composed responses**

`getAutomateBuild` returns `{ build: { automation_build, sessions: [{ automation_session }] } }`:

```yaml
x-response-transform:
  codec: json-compose
  config:
    base: "$.build.automation_build"
    merge:
      sessions: "$.build.sessions[*].automation_session"
```

- [ ] **Step 5: Mark uploads as custom**

File-upload operations (uploadMediaFile, uploadBuildTerminalLogs, uploadSessionTerminalLogs) stay hand-written for v1:

```yaml
x-request-custom: true
x-response-custom: true
```

(Custom request codec covers FormData for these; mark both to be safe.)

- [ ] **Step 6: Regenerate**

Run: `pnpm build:types`
Expected: success; `packages/openapi/generated/automate.client.ts` updated.

Inspect the generated file — every annotated op should now appear as an `execute({ ... })` call with the correct config.

- [ ] **Step 7: Commit**

```bash
git add packages/openapi/specs/automate.yml packages/openapi/generated/automate.client.ts
git commit -m "feat(automate): annotate spec with transforms"
```

### Task 8.2: Switch `AutomateClient` to extend generated base

**Files:**
- Modify: `packages/automate/src/client.ts`
- Modify: `packages/automate/package.json` (ensure generated `.client.ts` resolvable)

- [ ] **Step 1: Import generated base class**

Replace:
```ts
export class AutomateClient extends APIClient<paths> { ... }
```

With:
```ts
import { GeneratedAutomateClient } from "@browserstack-client/openapi/generated/automate.client";
export class AutomateClient extends GeneratedAutomateClient {
  // Only custom methods remain.
}
```

- [ ] **Step 2: Delete methods that are now generated**

Remove every method body whose operationId is annotated in `automate.yml`. Keep only:
- The constructor
- Hand-written overrides for upload operations
- The composed-response methods that don't fit `json-compose`

- [ ] **Step 3: Fix custom methods to use `this.execute()`**

The upload methods stay hand-written but should use the new `execute()` with a custom inline codec reference (or bypass the registry and build FormData locally, calling `this.fetchFn` directly via a helper). Implementation detail — preserve their existing behavior exactly.

- [ ] **Step 4: Run typecheck**

Run: `pnpm -F @browserstack-client/automate typecheck`
Expected: PASS.

If methods now reference undefined types, adjust generated return-type shape or add targeted `as any` casts with TODO comments (flagged in spec as tightened types).

- [ ] **Step 5: Commit**

```bash
git commit -am "refactor(automate): adopt generated base class"
```

### Task 8.3: Run integration tests as the backward-compat gate

- [ ] **Step 1: Ensure credentials set**

```bash
echo "BROWSERSTACK_USERNAME=$BROWSERSTACK_USERNAME"
echo "BROWSERSTACK_ACCESS_KEY=$BROWSERSTACK_ACCESS_KEY"
```

If unset, ask the user to export them before running.

- [ ] **Step 2: Run automate tests**

Run: `pnpm test -- --project automate`
Expected: all pass.

- [ ] **Step 3: If any fail, debug**

Typical failure modes:
- Response shape mismatch → re-check the annotation's `path` against the actual API response
- Hand-written override broken → the migration missed a dependency

Fix, rerun until green.

- [ ] **Step 4: Commit any fixes**

```bash
git commit -am "fix(automate): reconcile transform annotations with live API"
```

---

## Phase 9 — Migrate remaining packages

For each of `app-automate`, `js-testing`, `screenshots`, `local-testing`: repeat Phase 8 sub-tasks exactly. Each becomes its own task + commit.

### Task 9.1: Migrate `app-automate`

- [ ] **Step 1: Annotate `packages/openapi/specs/app-automate.yml`** following the Phase 8.1 sub-steps
- [ ] **Step 2: Regenerate + inspect**
- [ ] **Step 3: Switch `packages/app-automate/src/client.ts` to extend generated base**
- [ ] **Step 4: Delete generated-now methods**
- [ ] **Step 5: Typecheck + integration tests (`pnpm test -- --project app-automate`)**
- [ ] **Step 6: Commit `feat(app-automate): adopt transforms`**

### Task 9.2: Migrate `js-testing`

Same substeps as 9.1 against `js-testing.yml` / `packages/js-testing/`. Integration test: `pnpm test -- --project js-testing`. Commit.

### Task 9.3: Migrate `screenshots`

Same substeps against `screenshots.yml` / `packages/screenshots/`. Commit.

### Task 9.4: Migrate `local-testing`

Same substeps against `local-testing.yml` / `packages/local-testing/`. `local-testing-binary` is unaffected — skip. Commit.

---

## Phase 10 — Back-compat shim: `BrowserStackError`

### Task 10.1: Make `BrowserStackError` catchable for transform errors

**Files:**
- Modify: `packages/core/src/error.ts`
- Modify: `packages/core/src/__tests__/error-compat.test.ts` (new)

- [ ] **Step 1: Failing test**

```ts
// error-compat.test.ts
import { describe, expect, it } from "vitest";
import { BrowserStackError, HttpError } from "../error.js";

describe("backward-compat", () => {
  it("HttpError is instanceof BrowserStackError", () => {
    const e = new HttpError("m", { operationId: "x", method: "GET", url: "u" }, {
      status: 500, statusText: "", headers: new Headers(), body: {}, retryable: true,
    });
    expect(e instanceof BrowserStackError).toBe(true);
  });
  it("legacy BrowserStackError constructor still works", () => {
    const e = new BrowserStackError("msg", { path: "/x" });
    expect(e.message).toBe("msg");
    expect((e as any).context).toEqual({ path: "/x" });
  });
});
```

- [ ] **Step 2: Run, expect fail**

- [ ] **Step 3: Implement**

Restructure `packages/core/src/error.ts` so `BrowserStackError` becomes a superclass of `OpenAPIError`. Since `OpenAPIError` lives in the `openapi-transforms` package, the simplest approach is: keep `BrowserStackError` in core as a class that transforms' errors re-extend via subclass augmentation. A cleaner approach: re-export `OpenAPIError` as `BrowserStackError` alias (they share identity).

```ts
// packages/core/src/error.ts
import { OpenAPIError } from "@browserstack-client/openapi-transforms";

export interface ErrorContext {
  path?: string;
  response?: unknown;
  [key: string]: unknown;
}

// BrowserStackError now IS OpenAPIError with a legacy constructor overload.
export class BrowserStackError extends OpenAPIError {
  readonly code?: string;
  readonly context?: ErrorContext | Error;

  constructor(message: string, context?: ErrorContext | Error) {
    // Synthesize a minimal CodecContext for legacy callers
    super("client", message, { operationId: "legacy", method: "UNKNOWN", url: "" });
    this.name = "BrowserStackError";
    this.context = context;
    if (context instanceof Error) {
      this.name = context.name;
      this.stack = context.stack;
      if ("code" in context && typeof context.code === "string") this.code = context.code;
    }
  }
}

export { OpenAPIError, NetworkError, HttpError, DecodeError, TransformError, ClientError,
  isNetworkError, isHttpError, isDecodeError, isTransformError, isClientError,
} from "@browserstack-client/openapi-transforms";
```

Then, in `packages/openapi-transforms/src/errors.ts`, the classes already extend `OpenAPIError` — but we need `HttpError instanceof BrowserStackError` to be true. That requires BrowserStackError === OpenAPIError at the prototype level. Simplest fix: change the export to

```ts
export { OpenAPIError as BrowserStackError };
```

...and move the legacy 2-arg constructor into `OpenAPIError` itself as a fallback (when given two args where second is ErrorContext, synthesize the CodecContext).

This is a decision point — pick one and stick to it. The cleanest: rename `OpenAPIError` → `BrowserStackError` in transforms (shared base), then `OpenAPIError` is just an alias. Since transforms is meant as reusable, keep `OpenAPIError` as primary and `BrowserStackError` as an alias export from core.

- [ ] **Step 4: Update the subclasses to accept the 2-arg legacy form**

In `openapi-transforms/src/errors.ts`, add an overload to `OpenAPIError`:

```ts
export class OpenAPIError extends Error {
  // ... existing fields
  constructor(kind: ErrorKind, message: string, ctx: CodecContext, cause?: Error);
  constructor(message: string, context?: ErrorContext | Error);
  constructor(...args: any[]) {
    if (typeof args[0] === "string" && (args.length <= 2)) {
      super(args[0]);
      this.name = "OpenAPIError";
      this.kind = "client";
      this.operationId = "legacy"; this.method = "UNKNOWN"; this.url = "";
      (this as any).context = args[1];
      return;
    }
    const [kind, message, ctx, cause] = args;
    super(message);
    this.name = "OpenAPIError";
    this.kind = kind; this.operationId = ctx.operationId; this.method = ctx.method; this.url = ctx.url;
    if (cause) this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface ErrorContext { path?: string; response?: unknown; [k: string]: unknown; }
```

Then in core, `BrowserStackError` is simply `export { OpenAPIError as BrowserStackError } from "@browserstack-client/openapi-transforms"`.

- [ ] **Step 5: Run, expect pass**

Run full test suite:
```bash
pnpm test
```
Expected: all packages pass, including integration tests.

- [ ] **Step 6: Commit**

```bash
git commit -am "feat(core): unify BrowserStackError with OpenAPIError base"
```

---

## Phase 11 — Documentation

### Task 11.1: `packages/openapi-transforms/README.md`

- [ ] **Step 1: Write README**

Cover: package purpose, supported codecs, how to register custom codecs, JSONPath subset, annotation syntax, error classes, how to use `executeOperation` directly, codegen usage (how a third party could point at their own spec).

- [ ] **Step 2: Commit**

```bash
git commit -am "docs(openapi-transforms): README"
```

### Task 11.2: Top-level CHANGELOG

- [ ] **Step 1: Add CHANGELOG entry for 6.x**

Note: new error classes, codec registry option, per-operation error aliases, tightened types. Per-phase versioning per spec §Rollout.

- [ ] **Step 2: Commit**

```bash
git commit -am "docs: CHANGELOG for 6.x transform layer"
```

---

## Self-Review Checklist

Before handing to execution, verify:

- [ ] Every phase of the spec has at least one task: A (errors), 0 (registry), 1 (response codecs), 2 (request codecs), 3 (`execute()`), 4 (codegen), B (type tests), 4 (automate migration), 5 (remaining packages), 6 (docs). ✓
- [ ] No "TBD", "fill in later", or "similar to Task N" placeholders in this plan.
- [ ] Method names match across tasks: `streamExtract`, `extract`, `parsePath`, `executeOperation`, `readAnnotations`, `emitMethod`, `emitErrorAlias`, `emitModule`, `generateClientModule`, `registerAllBuiltins`, `registerBuiltinResponseCodecs`, `registerBuiltinRequestCodecs`, `CodecRegistry` — all referenced consistently.
- [ ] Every step that writes code includes the code.
- [ ] Every TDD sequence is red-green-commit.
- [ ] Custom / escape-hatch operations (uploads) are explicitly handled in Phase 8.1 step 5.

Gap noted and accepted: the precise signature of hand-written upload methods after migration (Phase 8.2 step 3) depends on whether we expose a lower-level escape hatch on `APIClient` or keep uploads using `this.fetchFn` directly. Deferred to implementation time — the skill's guidance says this is acceptable for implementation-time decisions.
