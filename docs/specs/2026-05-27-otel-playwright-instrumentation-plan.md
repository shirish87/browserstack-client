# OTel Test Instrumentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `browserstack-client otel use-reporter` and `browserstack-client otel start -- <cmd>` subcommands to the Go CLI, backed by an embedded self-contained JS reporter bundle that instruments any Node.js test process with OpenTelemetry — zero changes to the user's repository.

**Architecture:** A new `packages/otel-reporter` TypeScript package builds a single `register.cjs` bundle (esbuild, self-contained) containing the OTEL SDK and framework adapters for Playwright, Mocha, Jest, and Vitest. The Go CLI embeds this bundle via `//go:embed`, exposes `otel use-reporter` (extract + print path) and `otel start` (transparent process wrapper with env var merging, stdout sentinel scanning, and flush coordination). The reporter signals flush completion by writing `BROWSERSTACK_OTEL_FLUSH:{...}` to stdout; the CLI intercepts this line before it reaches the terminal.

**Tech Stack:** Go 1.24 + Cobra, `//go:embed`, `crypto/sha256`, `os/exec`; TypeScript + esbuild; `@opentelemetry/sdk-node`, `@opentelemetry/exporter-trace-otlp-http`, `@opentelemetry/exporter-logs-otlp-http`, `@opentelemetry/api`

---

## File Map

### New files — `packages/otel-reporter/`
| File | Purpose |
|------|---------|
| `packages/otel-reporter/package.json` | Package manifest, esbuild build script |
| `packages/otel-reporter/src/config.ts` | Read + validate all `BROWSERSTACK_OTEL_*` env vars |
| `packages/otel-reporter/src/sdk.ts` | Initialize OTEL SDK: TracerProvider, BatchSpanProcessor, OTLP exporter |
| `packages/otel-reporter/src/adapters/playwright.ts` | Playwright reporter class (official interface) |
| `packages/otel-reporter/src/adapters/mocha.ts` | Mocha Runner prototype patch |
| `packages/otel-reporter/src/adapters/jest.ts` | Jest circus / jasmine2 patch |
| `packages/otel-reporter/src/adapters/vitest.ts` | Vitest reporter patch |
| `packages/otel-reporter/src/flush.ts` | `sdk.shutdown()` + write `BROWSERSTACK_OTEL_FLUSH:` sentinel to stdout |
| `packages/otel-reporter/src/register.ts` | Entry point: boot sequence, activate all adapters, register beforeExit backstop |
| `packages/otel-reporter/build.mjs` | esbuild script → `dist/register.cjs` |
| `packages/otel-reporter/src/__tests__/config.test.ts` | Unit tests for config parsing |
| `packages/otel-reporter/src/__tests__/flush.test.ts` | Unit tests for flush sentinel format |
| `packages/otel-reporter/src/__tests__/adapters/playwright.test.ts` | Unit tests for Playwright adapter span output |

### New files — Go CLI
| File | Purpose |
|------|---------|
| `packages/cli/golang/cmd/browserstack/otel.go` | `otel` Cobra command group: `use-reporter` + `start` subcommands |
| `packages/cli/golang/internal/otel/embed.go` | `//go:embed assets/register.cjs` + `BundleBytes()` accessor |
| `packages/cli/golang/internal/otel/reporter.go` | `EnsureReporter(cacheDir) (string, error)` — SHA256 hash, extract if missing |
| `packages/cli/golang/internal/otel/env.go` | `MergeEnv(base []string, cfg Config) []string` — append-only env var merging |
| `packages/cli/golang/internal/otel/runner.go` | `Run(reporterPath string, cfg Config, cmd []string) (exitCode int, err error)` — child process, stdout/stderr proxy, sentinel scan |
| `packages/cli/golang/internal/otel/assets/register.cjs` | Embedded bundle (copied from `packages/otel-reporter/dist/register.cjs`) |
| `packages/cli/golang/internal/otel/reporter_test.go` | Tests for EnsureReporter idempotency and hash-based caching |
| `packages/cli/golang/internal/otel/env_test.go` | Tests for env var merging (NODE_OPTIONS, PLAYWRIGHT_REPORTER, headers) |
| `packages/cli/golang/internal/otel/runner_test.go` | Tests for stdout sentinel scanning and exit code passthrough |

### Modified files
| File | Change |
|------|--------|
| `packages/cli/golang/cmd/browserstack/main.go` | Add `otelCmd` to root command |
| `packages/cli/golang/go.mod` | No new deps needed (stdlib only for otel package) |
| `pnpm-workspace.yaml` | Already includes `packages/*` — no change needed |
| `package.json` | Add `build:otel-reporter` script |

---

## Task 1: `otel-reporter` package scaffold

**Files:**
- Create: `packages/otel-reporter/package.json`
- Create: `packages/otel-reporter/build.mjs`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@dot-slash/browserstack-otel-reporter",
  "version": "7.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node build.mjs",
    "test": "vitest run"
  },
  "devDependencies": {
    "@opentelemetry/api": "^1.9.0",
    "@opentelemetry/sdk-node": "^0.57.0",
    "@opentelemetry/exporter-trace-otlp-http": "^0.57.0",
    "@opentelemetry/exporter-logs-otlp-http": "^0.57.0",
    "@opentelemetry/sdk-logs": "^0.57.0",
    "@opentelemetry/resources": "^1.30.0",
    "esbuild": "^0.27.0",
    "vitest": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create build.mjs**

```js
import { build } from "esbuild";
import { readFileSync } from "node:fs";

await build({
  entryPoints: ["src/register.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  outfile: "dist/register.cjs",
  minify: false,
  sourcemap: false,
  // Bundle everything — this file must be self-contained
  external: [],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

console.log("Built dist/register.cjs");
```

- [ ] **Step 3: Install dependencies**

```bash
cd packages/otel-reporter && pnpm install
```

Expected: lock file updated, `node_modules` populated.

- [ ] **Step 4: Commit scaffold**

```bash
git add packages/otel-reporter/package.json packages/otel-reporter/build.mjs
git commit -m "feat(otel-reporter): scaffold package with esbuild config"
```

---

## Task 2: Config reader

**Files:**
- Create: `packages/otel-reporter/src/config.ts`
- Create: `packages/otel-reporter/src/__tests__/config.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// packages/otel-reporter/src/__tests__/config.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { readConfig, parseBytes } from "../config.js";

describe("parseBytes", () => {
  it("parses MB", () => expect(parseBytes("5MB")).toBe(5 * 1024 * 1024));
  it("parses KB", () => expect(parseBytes("64KB")).toBe(64 * 1024));
  it("parses plain bytes", () => expect(parseBytes("1024")).toBe(1024));
  it("throws on invalid", () => expect(() => parseBytes("abc")).toThrow());
});

describe("readConfig", () => {
  beforeEach(() => {
    delete process.env.BROWSERSTACK_OTEL_ENDPOINT;
    delete process.env.BROWSERSTACK_OTEL_BATCH_SIZE;
    delete process.env.BROWSERSTACK_OTEL_BATCH_TIMEOUT;
    delete process.env.BROWSERSTACK_OTEL_EXPORT_TIMEOUT;
    delete process.env.BROWSERSTACK_OTEL_ATTACHMENT_THRESHOLD;
  });

  it("returns defaults when env is empty", () => {
    const cfg = readConfig();
    expect(cfg.batchSize).toBe(512);
    expect(cfg.batchTimeoutMs).toBe(5000);
    expect(cfg.exportTimeoutMs).toBe(10000);
    expect(cfg.attachmentThresholdBytes).toBe(5 * 1024 * 1024);
    expect(cfg.endpoint).toBe("");
  });

  it("reads BROWSERSTACK_OTEL_ENDPOINT", () => {
    process.env.BROWSERSTACK_OTEL_ENDPOINT = "https://otel.example.com";
    expect(readConfig().endpoint).toBe("https://otel.example.com");
  });

  it("reads BROWSERSTACK_OTEL_BATCH_SIZE", () => {
    process.env.BROWSERSTACK_OTEL_BATCH_SIZE = "256";
    expect(readConfig().batchSize).toBe(256);
  });

  it("reads BROWSERSTACK_OTEL_ATTACHMENT_THRESHOLD in MB", () => {
    process.env.BROWSERSTACK_OTEL_ATTACHMENT_THRESHOLD = "10MB";
    expect(readConfig().attachmentThresholdBytes).toBe(10 * 1024 * 1024);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd packages/otel-reporter && pnpm test
```

Expected: FAIL — `config.js` not found.

- [ ] **Step 3: Implement config.ts**

```typescript
// packages/otel-reporter/src/config.ts

export interface OtelConfig {
  endpoint: string;
  batchSize: number;
  batchTimeoutMs: number;
  exportTimeoutMs: number;
  attachmentThresholdBytes: number;
}

export function parseBytes(s: string): number {
  const mb = s.match(/^(\d+(?:\.\d+)?)\s*MB$/i);
  if (mb) return Math.floor(parseFloat(mb[1]) * 1024 * 1024);
  const kb = s.match(/^(\d+(?:\.\d+)?)\s*KB$/i);
  if (kb) return Math.floor(parseFloat(kb[1]) * 1024);
  const bytes = s.match(/^(\d+)$/);
  if (bytes) return parseInt(bytes[1], 10);
  throw new Error(`Cannot parse byte size: "${s}"`);
}

function parseDurationMs(s: string): number {
  const sec = s.match(/^(\d+(?:\.\d+)?)s$/);
  if (sec) return Math.floor(parseFloat(sec[1]) * 1000);
  const ms = s.match(/^(\d+)ms$/);
  if (ms) return parseInt(ms[1], 10);
  const plain = s.match(/^(\d+)$/);
  if (plain) return parseInt(plain[1], 10);
  throw new Error(`Cannot parse duration: "${s}"`);
}

export function readConfig(): OtelConfig {
  return {
    endpoint: process.env.BROWSERSTACK_OTEL_ENDPOINT ?? "",
    batchSize: process.env.BROWSERSTACK_OTEL_BATCH_SIZE
      ? parseInt(process.env.BROWSERSTACK_OTEL_BATCH_SIZE, 10)
      : 512,
    batchTimeoutMs: process.env.BROWSERSTACK_OTEL_BATCH_TIMEOUT
      ? parseDurationMs(process.env.BROWSERSTACK_OTEL_BATCH_TIMEOUT)
      : 5000,
    exportTimeoutMs: process.env.BROWSERSTACK_OTEL_EXPORT_TIMEOUT
      ? parseDurationMs(process.env.BROWSERSTACK_OTEL_EXPORT_TIMEOUT)
      : 10000,
    attachmentThresholdBytes: process.env.BROWSERSTACK_OTEL_ATTACHMENT_THRESHOLD
      ? parseBytes(process.env.BROWSERSTACK_OTEL_ATTACHMENT_THRESHOLD)
      : 5 * 1024 * 1024,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd packages/otel-reporter && pnpm test
```

Expected: all 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/otel-reporter/src/config.ts packages/otel-reporter/src/__tests__/config.test.ts
git commit -m "feat(otel-reporter): add config reader with env var parsing"
```

---

## Task 3: OTEL SDK initializer

**Files:**
- Create: `packages/otel-reporter/src/sdk.ts`

- [ ] **Step 1: Create sdk.ts**

```typescript
// packages/otel-reporter/src/sdk.ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { Resource } from "@opentelemetry/resources";
import { trace, type Tracer } from "@opentelemetry/api";
import type { OtelConfig } from "./config.js";

let _sdk: NodeSDK | null = null;

export function initSDK(cfg: OtelConfig): void {
  if (_sdk) return; // idempotent

  const resource = new Resource({ "service.name": "browserstack-otel-reporter" });

  // OTEL_EXPORTER_OTLP_ENDPOINT and OTEL_EXPORTER_OTLP_HEADERS are already
  // set in the environment by the CLI before the process starts — the exporters
  // pick them up automatically via the OTEL env var spec.
  const traceExporter = new OTLPTraceExporter({
    url: cfg.endpoint ? `${cfg.endpoint}/v1/traces` : undefined,
    timeoutMillis: cfg.exportTimeoutMs,
  });

  const logExporter = new OTLPLogExporter({
    url: cfg.endpoint ? `${cfg.endpoint}/v1/logs` : undefined,
    timeoutMillis: cfg.exportTimeoutMs,
  });

  _sdk = new NodeSDK({
    resource,
    spanProcessor: new BatchSpanProcessor(traceExporter, {
      maxExportBatchSize: cfg.batchSize,
      scheduledDelayMillis: cfg.batchTimeoutMs,
      exportTimeoutMillis: cfg.exportTimeoutMs,
    }),
    logRecordProcessor: new BatchLogRecordProcessor(logExporter, {
      maxExportBatchSize: cfg.batchSize,
      scheduledDelayMillis: cfg.batchTimeoutMs,
      exportTimeoutMillis: cfg.exportTimeoutMs,
    }),
  });

  _sdk.start();
}

export function getTracer(): Tracer {
  return trace.getTracer("browserstack-otel-reporter");
}

export async function shutdownSDK(): Promise<void> {
  if (_sdk) {
    await _sdk.shutdown();
    _sdk = null;
  }
}
```

- [ ] **Step 2: Build to verify no type errors**

```bash
cd packages/otel-reporter && node build.mjs
```

Expected: `Built dist/register.cjs` (even though register.ts doesn't exist yet, esbuild will error — that's fine, verify sdk.ts at least type-checks):

```bash
cd packages/otel-reporter && npx tsc --noEmit --strict --moduleResolution bundler --module esnext src/sdk.ts
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/otel-reporter/src/sdk.ts
git commit -m "feat(otel-reporter): add OTEL SDK initializer with BatchSpanProcessor"
```

---

## Task 4: Flush module

**Files:**
- Create: `packages/otel-reporter/src/flush.ts`
- Create: `packages/otel-reporter/src/__tests__/flush.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// packages/otel-reporter/src/__tests__/flush.test.ts
import { describe, it, expect, vi } from "vitest";
import { buildFlushSentinel } from "../flush.js";

describe("buildFlushSentinel", () => {
  it("formats ok sentinel", () => {
    const line = buildFlushSentinel({ spans: 42, logs: 7, status: "ok" });
    expect(line).toBe('BROWSERSTACK_OTEL_FLUSH:{"spans":42,"logs":7,"status":"ok"}');
  });

  it("formats error sentinel with reason", () => {
    const line = buildFlushSentinel({ spans: 3, logs: 0, status: "error", reason: "timeout" });
    expect(line).toBe('BROWSERSTACK_OTEL_FLUSH:{"spans":3,"logs":0,"status":"error","reason":"timeout"}');
  });

  it("omits reason when ok", () => {
    const line = buildFlushSentinel({ spans: 0, logs: 0, status: "ok" });
    expect(line).not.toContain("reason");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd packages/otel-reporter && pnpm test
```

Expected: FAIL — `flush.js` not found.

- [ ] **Step 3: Implement flush.ts**

```typescript
// packages/otel-reporter/src/flush.ts
import { shutdownSDK } from "./sdk.js";

export interface FlushResult {
  spans: number;
  logs: number;
  status: "ok" | "error";
  reason?: string;
}

export function buildFlushSentinel(result: FlushResult): string {
  const payload: Record<string, unknown> = {
    spans: result.spans,
    logs: result.logs,
    status: result.status,
  };
  if (result.reason !== undefined) payload.reason = result.reason;
  return `BROWSERSTACK_OTEL_FLUSH:${JSON.stringify(payload)}`;
}

let _spanCount = 0;
let _logCount = 0;

export function incrementSpanCount(): void { _spanCount++; }
export function incrementLogCount(): void { _logCount++; }

export async function flush(): Promise<void> {
  let result: FlushResult;
  try {
    await shutdownSDK();
    result = { spans: _spanCount, logs: _logCount, status: "ok" };
  } catch (err) {
    result = {
      spans: _spanCount,
      logs: _logCount,
      status: "error",
      reason: err instanceof Error ? err.message : String(err),
    };
  }
  // Write sentinel to stdout — CLI intercepts this line before it reaches the terminal.
  process.stdout.write(buildFlushSentinel(result) + "\n");
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd packages/otel-reporter && pnpm test
```

Expected: all 3 flush tests + 8 config tests PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/otel-reporter/src/flush.ts packages/otel-reporter/src/__tests__/flush.test.ts
git commit -m "feat(otel-reporter): add flush module with BROWSERSTACK_OTEL_FLUSH sentinel"
```

---

## Task 5: Playwright adapter

**Files:**
- Create: `packages/otel-reporter/src/adapters/playwright.ts`
- Create: `packages/otel-reporter/src/__tests__/adapters/playwright.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// packages/otel-reporter/src/__tests__/adapters/playwright.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PlaywrightAdapter } from "../../adapters/playwright.js";
import { incrementSpanCount } from "../../flush.js";

// Mock OTEL tracer
vi.mock("../../sdk.js", () => ({
  getTracer: () => ({
    startSpan: vi.fn(() => ({
      setAttribute: vi.fn(),
      setStatus: vi.fn(),
      addEvent: vi.fn(),
      end: vi.fn(),
    })),
  }),
}));
vi.mock("../../flush.js", () => ({
  incrementSpanCount: vi.fn(),
  incrementLogCount: vi.fn(),
}));

describe("PlaywrightAdapter", () => {
  let adapter: PlaywrightAdapter;

  beforeEach(() => {
    adapter = new PlaywrightAdapter();
  });

  it("starts root span on onBegin", () => {
    const { getTracer } = require("../../sdk.js");
    adapter.onBegin({ title: "root" } as any, [] as any);
    expect(getTracer().startSpan).toHaveBeenCalledWith("test.run");
  });

  it("increments span count on onTestEnd", () => {
    adapter.onBegin({ title: "root" } as any, [] as any);
    adapter.onTestBegin({ title: "my test", titlePath: () => ["suite", "my test"], location: { file: "test.spec.ts", line: 1, column: 1 } } as any, { retry: 0 } as any);
    adapter.onTestEnd({ title: "my test", titlePath: () => ["suite", "my test"], location: { file: "test.spec.ts", line: 1, column: 1 }, outcome: () => "passed" } as any, { status: "passed", duration: 123, retry: 0, attachments: [], errors: [] } as any);
    expect(incrementSpanCount).toHaveBeenCalled();
  });

  it("sets test.status passed on passed test", () => {
    const mockSpan = { setAttribute: vi.fn(), setStatus: vi.fn(), addEvent: vi.fn(), end: vi.fn() };
    const { getTracer } = require("../../sdk.js");
    getTracer().startSpan.mockReturnValueOnce(mockSpan).mockReturnValueOnce(mockSpan);
    adapter.onBegin({ title: "root" } as any, [] as any);
    adapter.onTestBegin({ title: "my test", titlePath: () => ["suite", "my test"], location: { file: "test.spec.ts", line: 1, column: 1 } } as any, { retry: 0 } as any);
    adapter.onTestEnd({ title: "my test", titlePath: () => ["suite", "my test"], location: { file: "test.spec.ts", line: 1, column: 1 }, outcome: () => "passed" } as any, { status: "passed", duration: 123, retry: 0, attachments: [], errors: [] } as any);
    expect(mockSpan.setAttribute).toHaveBeenCalledWith("test.status", "passed");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd packages/otel-reporter && pnpm test
```

Expected: FAIL — `adapters/playwright.js` not found.

- [ ] **Step 3: Implement playwright.ts**

```typescript
// packages/otel-reporter/src/adapters/playwright.ts
import type { Reporter, Suite, TestCase, TestResult, TestStep } from "@playwright/test/reporter";
import { context, SpanStatusCode, type Span } from "@opentelemetry/api";
import { getTracer } from "../sdk.js";
import { incrementSpanCount, incrementLogCount } from "../flush.js";
import { readConfig } from "../config.js";

export class PlaywrightAdapter implements Reporter {
  private rootSpan: Span | null = null;
  private testSpans = new Map<string, Span>();
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private total = 0;

  onBegin(_config: unknown, _suite: Suite): void {
    this.rootSpan = getTracer().startSpan("test.run");
    this.rootSpan.setAttribute("test.framework", "playwright");
  }

  onTestBegin(test: TestCase, result: TestResult): void {
    if (!this.rootSpan) return;
    this.total++;
    const ctx = context.with(
      context.active(),
      () => context.active()
    );
    const span = getTracer().startSpan("test.case", undefined, ctx);
    const titlePath = test.titlePath();
    span.setAttribute("test.name", test.title);
    span.setAttribute("test.suite", titlePath.slice(0, -1).join(" > "));
    span.setAttribute("test.file", test.location.file);
    span.setAttribute("test.retry", result.retry);
    this.testSpans.set(test.title + result.retry, span);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const key = test.title + result.retry;
    const span = this.testSpans.get(key);
    if (!span) return;

    span.setAttribute("test.status", result.status);
    span.setAttribute("test.duration_ms", result.duration);
    if (result.status === "passed") this.passed++;
    else if (result.status === "failed" || result.status === "timedOut") {
      this.failed++;
      if (result.errors.length > 0) {
        span.setAttribute("test.error.message", result.errors[0].message ?? "");
        span.setAttribute("test.error.stack", result.errors[0].stack ?? "");
      }
      span.setStatus({ code: SpanStatusCode.ERROR });
    } else {
      this.skipped++;
    }

    const cfg = readConfig();
    for (const attachment of result.attachments) {
      if (attachment.body) {
        const sizeBytes = attachment.body.length;
        if (sizeBytes <= cfg.attachmentThresholdBytes) {
          // Inline: add as span event with base64 body
          span.addEvent("attachment", {
            "attachment.name": attachment.name,
            "attachment.content_type": attachment.contentType,
            "attachment.encoding": "base64",
            "attachment.body": attachment.body.toString("base64"),
          });
          incrementLogCount();
        } else {
          // Over threshold: reference only (blob upload TBD)
          span.setAttribute("attachment.name", attachment.name);
          span.setAttribute("attachment.size_bytes", sizeBytes);
          span.setAttribute("attachment.url", attachment.path ?? "");
        }
      } else if (attachment.path) {
        span.addEvent("attachment", {
          "attachment.name": attachment.name,
          "attachment.content_type": attachment.contentType,
          "attachment.path": attachment.path,
        });
      }
    }

    span.end();
    this.testSpans.delete(key);
    incrementSpanCount();
  }

  onStepBegin(_test: TestCase, _result: TestResult, step: TestStep): void {
    // Steps are tracked as events on the parent test span for simplicity.
    // Full step spans would require context propagation across async boundaries.
  }

  onEnd(): void {
    if (!this.rootSpan) return;
    this.rootSpan.setAttribute("test.total", this.total);
    this.rootSpan.setAttribute("test.passed", this.passed);
    this.rootSpan.setAttribute("test.failed", this.failed);
    this.rootSpan.setAttribute("test.skipped", this.skipped);
    this.rootSpan.end();
    incrementSpanCount();
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd packages/otel-reporter && pnpm test
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/otel-reporter/src/adapters/playwright.ts packages/otel-reporter/src/__tests__/adapters/playwright.test.ts
git commit -m "feat(otel-reporter): add Playwright adapter using official reporter interface"
```

---

## Task 6: Mocha, Jest, Vitest adapters (no-op stubs with self-activation)

**Files:**
- Create: `packages/otel-reporter/src/adapters/mocha.ts`
- Create: `packages/otel-reporter/src/adapters/jest.ts`
- Create: `packages/otel-reporter/src/adapters/vitest.ts`

These adapters attempt to resolve the framework from `process.cwd()` and patch its runner if found. If the framework is not present, they are silent no-ops.

- [ ] **Step 1: Create mocha.ts**

```typescript
// packages/otel-reporter/src/adapters/mocha.ts
import { getTracer } from "../sdk.js";
import { incrementSpanCount } from "../flush.js";
import { SpanStatusCode, type Span } from "@opentelemetry/api";

export function activateMocha(): void {
  let Mocha: { Runner: { prototype: Record<string, unknown> } };
  try {
    Mocha = require(require.resolve("mocha", { paths: [process.cwd()] }));
  } catch {
    return; // mocha not present — no-op
  }

  const runner = Mocha.Runner.prototype;
  const originalRun = runner.run as (...args: unknown[]) => unknown;
  let rootSpan: Span | null = null;
  const testSpans = new Map<string, Span>();

  runner.run = function (...args: unknown[]) {
    rootSpan = getTracer().startSpan("test.run");
    rootSpan.setAttribute("test.framework", "mocha");

    this.on("test", (test: { fullTitle(): string; file?: string }) => {
      const span = getTracer().startSpan("test.case");
      span.setAttribute("test.name", test.fullTitle());
      span.setAttribute("test.file", test.file ?? "");
      testSpans.set(test.fullTitle(), span);
    });

    this.on("pass", (test: { fullTitle(): string }) => {
      const span = testSpans.get(test.fullTitle());
      if (span) {
        span.setAttribute("test.status", "passed");
        span.end();
        testSpans.delete(test.fullTitle());
        incrementSpanCount();
      }
    });

    this.on("fail", (test: { fullTitle(): string }, err: Error) => {
      const span = testSpans.get(test.fullTitle());
      if (span) {
        span.setAttribute("test.status", "failed");
        span.setAttribute("test.error.message", err.message);
        span.setAttribute("test.error.stack", err.stack ?? "");
        span.setStatus({ code: SpanStatusCode.ERROR });
        span.end();
        testSpans.delete(test.fullTitle());
        incrementSpanCount();
      }
    });

    this.on("pending", (test: { fullTitle(): string }) => {
      const span = testSpans.get(test.fullTitle());
      if (span) {
        span.setAttribute("test.status", "skipped");
        span.end();
        testSpans.delete(test.fullTitle());
        incrementSpanCount();
      }
    });

    this.on("end", () => {
      if (rootSpan) { rootSpan.end(); incrementSpanCount(); }
    });

    return originalRun.apply(this, args);
  };
}
```

- [ ] **Step 2: Create jest.ts**

```typescript
// packages/otel-reporter/src/adapters/jest.ts
import { getTracer } from "../sdk.js";
import { incrementSpanCount } from "../flush.js";
import { SpanStatusCode } from "@opentelemetry/api";

export function activateJest(): void {
  // Jest circus: patch globalThis.__jestCircusCurrentTestState if available.
  // We install a jest reporter by patching the circus event handler.
  try {
    const circusPath = require.resolve("jest-circus/runner", { paths: [process.cwd()] });
    const circus = require(circusPath);
    const originalRunner = circus.default ?? circus;
    if (typeof originalRunner !== "function") return;

    // Wrap jest-circus runner to observe test events via its state
    // Jest fires events through jest-circus's dispatch — we hook the global event handler.
    const origDispatch = (globalThis as Record<string, unknown>).__jestCircusDispatch;
    if (typeof origDispatch !== "function") return;

    let rootSpan = getTracer().startSpan("test.run");
    rootSpan.setAttribute("test.framework", "jest");

    (globalThis as Record<string, unknown>).__jestCircusDispatch = async (event: { name: string; test?: { name: string; parent?: { name: string } }; error?: Error }, state: unknown) => {
      if (event.name === "test_started" && event.test) {
        const span = getTracer().startSpan("test.case");
        span.setAttribute("test.name", event.test.name);
        span.setAttribute("test.suite", event.test.parent?.name ?? "");
        (event.test as Record<string, unknown>).__otelSpan = span;
      }
      if (event.name === "test_done" && event.test) {
        const span = (event.test as Record<string, unknown>).__otelSpan;
        if (span) {
          const status = event.error ? "failed" : "passed";
          (span as ReturnType<typeof getTracer>["startSpan"]).setAttribute("test.status", status);
          if (event.error) {
            (span as ReturnType<typeof getTracer>["startSpan"]).setAttribute("test.error.message", event.error.message);
            (span as ReturnType<typeof getTracer>["startSpan"]).setStatus({ code: SpanStatusCode.ERROR });
          }
          (span as ReturnType<typeof getTracer>["startSpan"]).end();
          incrementSpanCount();
        }
      }
      if (event.name === "run_finish") {
        rootSpan.end();
        incrementSpanCount();
      }
      return origDispatch(event, state);
    };
  } catch {
    return; // jest-circus not present — no-op
  }
}
```

- [ ] **Step 3: Create vitest.ts**

```typescript
// packages/otel-reporter/src/adapters/vitest.ts
import { getTracer } from "../sdk.js";
import { incrementSpanCount } from "../flush.js";
import { SpanStatusCode, type Span } from "@opentelemetry/api";

export function activateVitest(): void {
  try {
    require.resolve("vitest", { paths: [process.cwd()] });
  } catch {
    return; // vitest not present — no-op
  }

  // Vitest exposes a reporter interface. Since we're loaded via --require before
  // Vitest initializes, we patch Vitest's runner by hooking into its reporter
  // registration. The safest hook point is process.env-based — Vitest reads
  // VITEST_REPORTER to load additional reporters.
  // This adapter installs itself as a Vitest reporter object on the global
  // __vitest_reporters__ array if present (Vitest >= 1.0 internal API).
  const reporters = ((globalThis as Record<string, unknown>).__vitest_reporters__ ??= []) as object[];

  let rootSpan: Span | null = null;
  const testSpans = new Map<string, Span>();

  reporters.push({
    onInit() {
      rootSpan = getTracer().startSpan("test.run");
      rootSpan.setAttribute("test.framework", "vitest");
    },
    onTestBegin(test: { name: string; suite?: { name: string }; file?: { name: string } }) {
      const span = getTracer().startSpan("test.case");
      span.setAttribute("test.name", test.name);
      span.setAttribute("test.suite", test.suite?.name ?? "");
      span.setAttribute("test.file", test.file?.name ?? "");
      testSpans.set(test.name, span);
    },
    onTestEnd(test: { name: string }, result: { state: string; duration?: number; error?: Error }) {
      const span = testSpans.get(test.name);
      if (!span) return;
      const status = result.state === "pass" ? "passed" : result.state === "skip" ? "skipped" : "failed";
      span.setAttribute("test.status", status);
      if (result.duration) span.setAttribute("test.duration_ms", result.duration);
      if (result.error) {
        span.setAttribute("test.error.message", result.error.message);
        span.setStatus({ code: SpanStatusCode.ERROR });
      }
      span.end();
      testSpans.delete(test.name);
      incrementSpanCount();
    },
    onFinished() {
      if (rootSpan) { rootSpan.end(); incrementSpanCount(); }
    },
  });
}
```

- [ ] **Step 4: Build to verify no errors**

```bash
cd packages/otel-reporter && npx tsc --noEmit --strict --moduleResolution bundler --module esnext src/adapters/mocha.ts src/adapters/jest.ts src/adapters/vitest.ts
```

Expected: no errors (some `any` casts are expected given runtime patching).

- [ ] **Step 5: Commit**

```bash
git add packages/otel-reporter/src/adapters/
git commit -m "feat(otel-reporter): add Mocha, Jest, Vitest adapters with self-activation"
```

---

## Task 7: Entry point and full bundle build

**Files:**
- Create: `packages/otel-reporter/src/register.ts`

- [ ] **Step 1: Create register.ts**

```typescript
// packages/otel-reporter/src/register.ts
// Entry point loaded via NODE_OPTIONS=--require
// Boots OTEL SDK, activates all framework adapters, registers flush backstop.

import { readConfig } from "./config.js";
import { initSDK } from "./sdk.js";
import { flush } from "./flush.js";
import { PlaywrightAdapter } from "./adapters/playwright.js";
import { activateMocha } from "./adapters/mocha.js";
import { activateJest } from "./adapters/jest.js";
import { activateVitest } from "./adapters/vitest.js";

const cfg = readConfig();
initSDK(cfg);

// Playwright: export the adapter class as module.exports so that
// PLAYWRIGHT_REPORTER=<this file> invokes it via the official reporter interface.
// When loaded via --require, this also self-registers via the exports assignment.
(module as NodeModule & { exports: unknown }).exports = PlaywrightAdapter;

// Activate non-Playwright framework adapters (each is a no-op if framework absent).
activateMocha();
activateJest();
activateVitest();

// Last-resort backstop: if the framework doesn't trigger flush explicitly,
// flush on process exit. This runs AFTER framework teardown in most cases.
process.on("beforeExit", () => {
  flush().catch(() => {});
});
```

- [ ] **Step 2: Build the full bundle**

```bash
cd packages/otel-reporter && node build.mjs
```

Expected:
```
Built dist/register.cjs
```

Verify the output file exists and is a valid CJS module:
```bash
ls -lh packages/otel-reporter/dist/register.cjs
node -e "require('./packages/otel-reporter/dist/register.cjs')" 2>&1 | head -5
```

Expected: file exists (expect ~1-3MB), node loads without crashing (may warn about missing OTEL endpoint — that's fine).

- [ ] **Step 3: Smoke test — flush sentinel is emitted**

```bash
BROWSERSTACK_OTEL_ENDPOINT=http://localhost:4318 node -e "
  require('./dist/register.cjs');
  // Simulate immediate exit
" 2>&1
```

Expected: `BROWSERSTACK_OTEL_FLUSH:{"spans":0,"logs":0,"status":...}` appears on stdout (export will fail since no collector is running, but the sentinel must still appear).

- [ ] **Step 4: Commit**

```bash
git add packages/otel-reporter/src/register.ts packages/otel-reporter/dist/register.cjs
git commit -m "feat(otel-reporter): add register.ts entry point and built bundle"
```

---

## Task 8: Copy bundle into Go CLI assets

**Files:**
- Create: `packages/cli/golang/internal/otel/assets/register.cjs` (copy)
- Create: `packages/cli/golang/internal/otel/embed.go`

- [ ] **Step 1: Copy bundle**

```bash
mkdir -p packages/cli/golang/internal/otel/assets
cp packages/otel-reporter/dist/register.cjs packages/cli/golang/internal/otel/assets/register.cjs
```

- [ ] **Step 2: Create embed.go**

```go
// packages/cli/golang/internal/otel/embed.go
package otel

import _ "embed"

//go:embed assets/register.cjs
var bundleBytes []byte

// BundleBytes returns the embedded register.cjs content.
func BundleBytes() []byte {
	return bundleBytes
}
```

- [ ] **Step 3: Verify embed compiles**

```bash
cd packages/cli/golang && go build ./internal/otel/...
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/cli/golang/internal/otel/
git commit -m "feat(go-cli): embed otel reporter bundle via go:embed"
```

---

## Task 9: Go `reporter.go` — extraction and caching

**Files:**
- Create: `packages/cli/golang/internal/otel/reporter.go`
- Create: `packages/cli/golang/internal/otel/reporter_test.go`

- [ ] **Step 1: Write failing tests**

```go
// packages/cli/golang/internal/otel/reporter_test.go
package otel_test

import (
	"os"
	"path/filepath"
	"testing"

	internalotel "github.com/browserstack/browserstack-client/internal/otel"
)

func TestEnsureReporter_ExtractsFile(t *testing.T) {
	dir := t.TempDir()
	path, err := internalotel.EnsureReporter(dir)
	if err != nil {
		t.Fatalf("EnsureReporter: %v", err)
	}
	if _, err := os.Stat(path); err != nil {
		t.Fatalf("reporter file not found at %s: %v", path, err)
	}
}

func TestEnsureReporter_Idempotent(t *testing.T) {
	dir := t.TempDir()
	path1, err := internalotel.EnsureReporter(dir)
	if err != nil {
		t.Fatal(err)
	}
	path2, err := internalotel.EnsureReporter(dir)
	if err != nil {
		t.Fatal(err)
	}
	if path1 != path2 {
		t.Fatalf("paths differ: %s != %s", path1, path2)
	}
}

func TestEnsureReporter_UsesHashSubdir(t *testing.T) {
	dir := t.TempDir()
	path, err := internalotel.EnsureReporter(dir)
	if err != nil {
		t.Fatal(err)
	}
	// Path must be <dir>/<hash>/register.cjs
	parent := filepath.Dir(path)
	if filepath.Dir(parent) != dir {
		t.Fatalf("expected <dir>/<hash>/register.cjs, got %s", path)
	}
	if filepath.Base(path) != "register.cjs" {
		t.Fatalf("expected register.cjs, got %s", filepath.Base(path))
	}
}
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd packages/cli/golang && go test ./internal/otel/... 2>&1
```

Expected: FAIL — `EnsureReporter` not defined.

- [ ] **Step 3: Implement reporter.go**

```go
// packages/cli/golang/internal/otel/reporter.go
package otel

import (
	"crypto/sha256"
	"fmt"
	"os"
	"path/filepath"
)

// EnsureReporter extracts the embedded register.cjs to cacheDir/<hash>/register.cjs
// if not already present. Returns the absolute path to the file.
func EnsureReporter(cacheDir string) (string, error) {
	bundle := BundleBytes()
	hash := fmt.Sprintf("%x", sha256.Sum256(bundle))[:16]
	outDir := filepath.Join(cacheDir, hash)
	outPath := filepath.Join(outDir, "register.cjs")

	if _, err := os.Stat(outPath); err == nil {
		return outPath, nil // already extracted
	}

	if err := os.MkdirAll(outDir, 0755); err != nil {
		return "", fmt.Errorf("create cache dir: %w", err)
	}
	if err := os.WriteFile(outPath, bundle, 0644); err != nil {
		return "", fmt.Errorf("write reporter: %w", err)
	}
	return outPath, nil
}

// DefaultCacheDir returns ~/.browserstack/otel as the cache directory.
func DefaultCacheDir() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("home dir: %w", err)
	}
	return filepath.Join(home, ".browserstack", "otel"), nil
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd packages/cli/golang && go test ./internal/otel/... -run TestEnsureReporter -v
```

Expected:
```
--- PASS: TestEnsureReporter_ExtractsFile
--- PASS: TestEnsureReporter_Idempotent
--- PASS: TestEnsureReporter_UsesHashSubdir
```

- [ ] **Step 5: Commit**

```bash
git add packages/cli/golang/internal/otel/reporter.go packages/cli/golang/internal/otel/reporter_test.go
git commit -m "feat(go-cli): add EnsureReporter with SHA256 hash-based idempotent extraction"
```

---

## Task 10: Go `env.go` — env var merging

**Files:**
- Create: `packages/cli/golang/internal/otel/env.go`
- Create: `packages/cli/golang/internal/otel/env_test.go`

- [ ] **Step 1: Write failing tests**

```go
// packages/cli/golang/internal/otel/env_test.go
package otel_test

import (
	"testing"

	internalotel "github.com/browserstack/browserstack-client/internal/otel"
)

func TestMergeEnv_AppendsNodeOptions(t *testing.T) {
	base := []string{"NODE_OPTIONS=--max-old-space-size=4096", "PATH=/usr/bin"}
	cfg := internalotel.Config{ReporterPath: "/tmp/register.cjs"}
	env := internalotel.MergeEnv(base, cfg)
	nodeOpts := findEnv(env, "NODE_OPTIONS")
	expected := "--max-old-space-size=4096 --require /tmp/register.cjs"
	if nodeOpts != expected {
		t.Fatalf("NODE_OPTIONS = %q, want %q", nodeOpts, expected)
	}
}

func TestMergeEnv_SetsNodeOptionsWhenAbsent(t *testing.T) {
	base := []string{"PATH=/usr/bin"}
	cfg := internalotel.Config{ReporterPath: "/tmp/register.cjs"}
	env := internalotel.MergeEnv(base, cfg)
	nodeOpts := findEnv(env, "NODE_OPTIONS")
	if nodeOpts != "--require /tmp/register.cjs" {
		t.Fatalf("NODE_OPTIONS = %q", nodeOpts)
	}
}

func TestMergeEnv_AppendsPlaywrightReporter(t *testing.T) {
	base := []string{"PLAYWRIGHT_REPORTER=my-reporter.ts"}
	cfg := internalotel.Config{ReporterPath: "/tmp/register.cjs"}
	env := internalotel.MergeEnv(base, cfg)
	pr := findEnv(env, "PLAYWRIGHT_REPORTER")
	expected := "my-reporter.ts,/tmp/register.cjs"
	if pr != expected {
		t.Fatalf("PLAYWRIGHT_REPORTER = %q, want %q", pr, expected)
	}
}

func TestMergeEnv_SetsOtelEndpoint(t *testing.T) {
	base := []string{}
	cfg := internalotel.Config{ReporterPath: "/tmp/r.cjs", Endpoint: "https://otel.example.com"}
	env := internalotel.MergeEnv(base, cfg)
	if findEnv(env, "OTEL_EXPORTER_OTLP_ENDPOINT") != "https://otel.example.com" {
		t.Fatal("OTEL_EXPORTER_OTLP_ENDPOINT not set")
	}
}

func TestMergeEnv_AppendsOtelHeaders(t *testing.T) {
	base := []string{"OTEL_EXPORTER_OTLP_HEADERS=x-existing=val"}
	cfg := internalotel.Config{ReporterPath: "/tmp/r.cjs", Headers: "Authorization=Bearer tok"}
	env := internalotel.MergeEnv(base, cfg)
	h := findEnv(env, "OTEL_EXPORTER_OTLP_HEADERS")
	expected := "x-existing=val,Authorization=Bearer tok"
	if h != expected {
		t.Fatalf("OTEL_EXPORTER_OTLP_HEADERS = %q, want %q", h, expected)
	}
}

func TestMergeEnv_PassesBatchConfig(t *testing.T) {
	base := []string{}
	cfg := internalotel.Config{
		ReporterPath: "/tmp/r.cjs",
		BatchSize:    "256",
		BatchTimeout: "3s",
		ExportTimeout: "8s",
		AttachmentThreshold: "10MB",
	}
	env := internalotel.MergeEnv(base, cfg)
	if findEnv(env, "BROWSERSTACK_OTEL_BATCH_SIZE") != "256" {
		t.Fatal("BROWSERSTACK_OTEL_BATCH_SIZE not set")
	}
}

func findEnv(env []string, key string) string {
	prefix := key + "="
	for _, e := range env {
		if len(e) > len(prefix) && e[:len(prefix)] == prefix {
			return e[len(prefix):]
		}
	}
	return ""
}
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd packages/cli/golang && go test ./internal/otel/... -run TestMergeEnv -v 2>&1
```

Expected: FAIL — `Config` and `MergeEnv` not defined.

- [ ] **Step 3: Implement env.go**

```go
// packages/cli/golang/internal/otel/env.go
package otel

import (
	"fmt"
	"strings"
)

// Config holds all values the CLI passes to the child process.
type Config struct {
	ReporterPath        string
	Endpoint            string
	Headers             string
	FlushTimeout        string
	BatchSize           string
	BatchTimeout        string
	ExportTimeout       string
	AttachmentThreshold string
}

// MergeEnv takes a base environment (os.Environ() format: "KEY=VALUE" strings)
// and returns a new slice with OTEL-related vars merged in (append, never overwrite).
func MergeEnv(base []string, cfg Config) []string {
	env := make([]string, len(base))
	copy(env, base)

	// NODE_OPTIONS: append --require <path>
	env = appendEnv(env, "NODE_OPTIONS", "--require "+cfg.ReporterPath, " ")

	// PLAYWRIGHT_REPORTER: append path to comma-separated list
	env = appendEnv(env, "PLAYWRIGHT_REPORTER", cfg.ReporterPath, ",")

	// OTEL standard vars (set from BROWSERSTACK_OTEL_* equivalents)
	if cfg.Endpoint != "" {
		env = setEnv(env, "OTEL_EXPORTER_OTLP_ENDPOINT", cfg.Endpoint)
	}
	if cfg.Headers != "" {
		env = appendEnv(env, "OTEL_EXPORTER_OTLP_HEADERS", cfg.Headers, ",")
	}

	// Pass batch config as BROWSERSTACK_OTEL_* so the reporter reads them
	if cfg.BatchSize != "" {
		env = setEnv(env, "BROWSERSTACK_OTEL_BATCH_SIZE", cfg.BatchSize)
	}
	if cfg.BatchTimeout != "" {
		env = setEnv(env, "BROWSERSTACK_OTEL_BATCH_TIMEOUT", cfg.BatchTimeout)
	}
	if cfg.ExportTimeout != "" {
		env = setEnv(env, "BROWSERSTACK_OTEL_EXPORT_TIMEOUT", cfg.ExportTimeout)
	}
	if cfg.AttachmentThreshold != "" {
		env = setEnv(env, "BROWSERSTACK_OTEL_ATTACHMENT_THRESHOLD", cfg.AttachmentThreshold)
	}
	if cfg.Endpoint != "" {
		env = setEnv(env, "BROWSERSTACK_OTEL_ENDPOINT", cfg.Endpoint)
	}

	return env
}

// appendEnv appends value to the existing value of key using sep,
// or sets key=value if the key is not present.
func appendEnv(env []string, key, value, sep string) []string {
	prefix := key + "="
	for i, e := range env {
		if strings.HasPrefix(e, prefix) {
			existing := e[len(prefix):]
			if existing == "" {
				env[i] = fmt.Sprintf("%s=%s", key, value)
			} else {
				env[i] = fmt.Sprintf("%s=%s%s%s", key, existing, sep, value)
			}
			return env
		}
	}
	return append(env, fmt.Sprintf("%s=%s", key, value))
}

// setEnv sets key=value, overwriting any existing value for key.
func setEnv(env []string, key, value string) []string {
	prefix := key + "="
	for i, e := range env {
		if strings.HasPrefix(e, prefix) {
			env[i] = fmt.Sprintf("%s=%s", key, value)
			return env
		}
	}
	return append(env, fmt.Sprintf("%s=%s", key, value))
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd packages/cli/golang && go test ./internal/otel/... -run TestMergeEnv -v
```

Expected: all 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/golang/internal/otel/env.go packages/cli/golang/internal/otel/env_test.go
git commit -m "feat(go-cli): add MergeEnv for append-only environment variable merging"
```

---

## Task 11: Go `runner.go` — child process with stdout scanning

**Files:**
- Create: `packages/cli/golang/internal/otel/runner.go`
- Create: `packages/cli/golang/internal/otel/runner_test.go`

- [ ] **Step 1: Write failing tests**

```go
// packages/cli/golang/internal/otel/runner_test.go
package otel_test

import (
	"strings"
	"testing"
	"time"

	internalotel "github.com/browserstack/browserstack-client/internal/otel"
)

func TestScanForSentinel_DetectsSentinel(t *testing.T) {
	lines := []string{
		"test output line 1",
		`BROWSERSTACK_OTEL_FLUSH:{"spans":5,"logs":2,"status":"ok"}`,
		"test output line 2",
	}
	result, filtered := internalotel.ScanLines(lines)
	if result == nil {
		t.Fatal("expected sentinel to be detected")
	}
	if result.Spans != 5 || result.Logs != 2 || result.Status != "ok" {
		t.Fatalf("unexpected result: %+v", result)
	}
	if len(filtered) != 2 {
		t.Fatalf("expected 2 filtered lines, got %d", len(filtered))
	}
	for _, l := range filtered {
		if strings.Contains(l, "BROWSERSTACK_OTEL_FLUSH") {
			t.Fatal("sentinel line leaked into filtered output")
		}
	}
}

func TestScanForSentinel_NoSentinel(t *testing.T) {
	lines := []string{"line 1", "line 2"}
	result, filtered := internalotel.ScanLines(lines)
	if result != nil {
		t.Fatal("expected no sentinel")
	}
	if len(filtered) != 2 {
		t.Fatalf("expected 2 lines, got %d", len(filtered))
	}
}

func TestRunnerExitCode(t *testing.T) {
	cfg := internalotel.Config{ReporterPath: "/dev/null"}
	// Run a simple command that exits with code 42
	code, err := internalotel.Run(cfg, []string{"sh", "-c", "exit 42"}, time.Second*5)
	if err != nil {
		t.Fatalf("Run error: %v", err)
	}
	if code != 42 {
		t.Fatalf("expected exit code 42, got %d", code)
	}
}

func TestRunnerPassesThroughStdout(t *testing.T) {
	// This test verifies that non-sentinel lines are proxied.
	// We capture by redirecting — for unit test purposes verify Run completes cleanly.
	cfg := internalotel.Config{ReporterPath: "/dev/null"}
	code, err := internalotel.Run(cfg, []string{"echo", "hello"}, time.Second*5)
	if err != nil {
		t.Fatalf("Run error: %v", err)
	}
	if code != 0 {
		t.Fatalf("expected exit code 0, got %d", code)
	}
}
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd packages/cli/golang && go test ./internal/otel/... -run "TestScan|TestRunner" -v 2>&1
```

Expected: FAIL — `ScanLines` and `Run` not defined.

- [ ] **Step 3: Implement runner.go**

```go
// packages/cli/golang/internal/otel/runner.go
package otel

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"os/signal"
	"strings"
	"sync"
	"syscall"
	"time"
)

const flushSentinelPrefix = "BROWSERSTACK_OTEL_FLUSH:"

// FlushResult is parsed from the BROWSERSTACK_OTEL_FLUSH sentinel line.
type FlushResult struct {
	Spans  int    `json:"spans"`
	Logs   int    `json:"logs"`
	Status string `json:"status"`
	Reason string `json:"reason,omitempty"`
}

// ScanLines partitions lines into (flush result, non-sentinel lines).
// Returns nil FlushResult if no sentinel is found.
func ScanLines(lines []string) (*FlushResult, []string) {
	var result *FlushResult
	var filtered []string
	for _, line := range lines {
		if strings.HasPrefix(line, flushSentinelPrefix) {
			payload := line[len(flushSentinelPrefix):]
			var r FlushResult
			if err := json.Unmarshal([]byte(payload), &r); err == nil {
				result = &r
			}
			continue // consume sentinel — do not forward
		}
		filtered = append(filtered, line)
	}
	return result, filtered
}

// Run spawns cmd with the environment from MergeEnv(os.Environ(), cfg),
// proxies stdout/stderr/stdin transparently, scans stdout for the flush
// sentinel, waits up to flushTimeout after child exit for the sentinel,
// and returns the child's exit code.
func Run(cfg Config, cmdArgs []string, flushTimeout time.Duration) (int, error) {
	if len(cmdArgs) == 0 {
		return 0, fmt.Errorf("no command provided")
	}

	env := MergeEnv(os.Environ(), cfg)
	cmd := exec.Command(cmdArgs[0], cmdArgs[1:]...)
	cmd.Env = env
	cmd.Stdin = os.Stdin

	stdoutPipe, err := cmd.StdoutPipe()
	if err != nil {
		return 0, fmt.Errorf("stdout pipe: %w", err)
	}
	stderrPipe, err := cmd.StderrPipe()
	if err != nil {
		return 0, fmt.Errorf("stderr pipe: %w", err)
	}

	if err := cmd.Start(); err != nil {
		return 0, fmt.Errorf("start command: %w", err)
	}

	// Forward signals to child
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		for sig := range sigCh {
			if cmd.Process != nil {
				_ = cmd.Process.Signal(sig)
			}
		}
	}()
	defer signal.Stop(sigCh)

	flushCh := make(chan *FlushResult, 1)
	var wg sync.WaitGroup

	// Stdout goroutine: scan for sentinel, proxy everything else
	wg.Add(1)
	go func() {
		defer wg.Done()
		scanner := bufio.NewScanner(stdoutPipe)
		for scanner.Scan() {
			line := scanner.Text()
			if strings.HasPrefix(line, flushSentinelPrefix) {
				payload := line[len(flushSentinelPrefix):]
				var r FlushResult
				if err := json.Unmarshal([]byte(payload), &r); err == nil {
					select {
					case flushCh <- &r:
					default:
					}
				}
				continue // consume sentinel — do not forward to our stdout
			}
			fmt.Println(line)
		}
	}()

	// Stderr goroutine: proxy verbatim
	wg.Add(1)
	go func() {
		defer wg.Done()
		_, _ = io.Copy(os.Stderr, stderrPipe)
	}()

	wg.Wait()
	cmdErr := cmd.Wait()

	// Determine exit code
	exitCode := 0
	if cmdErr != nil {
		if exitErr, ok := cmdErr.(*exec.ExitError); ok {
			exitCode = exitErr.ExitCode()
		} else {
			return 0, cmdErr
		}
	}

	// Wait for flush sentinel up to flushTimeout
	if flushTimeout > 0 {
		select {
		case result := <-flushCh:
			if result.Status == "error" {
				_, _ = fmt.Fprintf(os.Stderr, "browserstack-otel: reporter flush error: %s\n", result.Reason)
			}
		case <-time.After(flushTimeout):
			_, _ = fmt.Fprintf(os.Stderr, "browserstack-otel: flush timeout after %s\n", flushTimeout)
		}
	}

	return exitCode, nil
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd packages/cli/golang && go test ./internal/otel/... -v
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/golang/internal/otel/runner.go packages/cli/golang/internal/otel/runner_test.go
git commit -m "feat(go-cli): add Run with stdout sentinel scanning and flush coordination"
```

---

## Task 12: Go `otel.go` — Cobra subcommands wired to root

**Files:**
- Create: `packages/cli/golang/cmd/browserstack/otel.go`
- Modify: `packages/cli/golang/cmd/browserstack/main.go`

- [ ] **Step 1: Create otel.go**

```go
// packages/cli/golang/cmd/browserstack/otel.go
package main

import (
	"fmt"
	"os"
	"time"

	"github.com/spf13/cobra"
	internalotel "github.com/browserstack/browserstack-client/internal/otel"
)

func buildOtelCommand() *cobra.Command {
	otel := &cobra.Command{
		Use:   "otel",
		Short: "OpenTelemetry test instrumentation",
	}
	otel.AddCommand(buildUseReporterCommand())
	otel.AddCommand(buildOtelStartCommand())
	return otel
}

func buildUseReporterCommand() *cobra.Command {
	return &cobra.Command{
		Use:   "use-reporter",
		Short: "Extract the embedded OTEL reporter bundle and print its path",
		Long: `Extracts the embedded register.cjs reporter bundle to
~/.browserstack/otel/<hash>/register.cjs (idempotent) and prints the
absolute path to stdout.

Use this to wire the reporter manually:

  NODE_OPTIONS="--require $(browserstack-client otel use-reporter)" npx playwright test`,
		RunE: func(cmd *cobra.Command, args []string) error {
			cacheDir, err := internalotel.DefaultCacheDir()
			if err != nil {
				return err
			}
			path, err := internalotel.EnsureReporter(cacheDir)
			if err != nil {
				return err
			}
			fmt.Println(path)
			return nil
		},
	}
}

func buildOtelStartCommand() *cobra.Command {
	var (
		endpoint            string
		headers             string
		flushTimeout        string
		batchSize           string
		batchTimeout        string
		exportTimeout       string
		attachmentThreshold string
	)

	cmd := &cobra.Command{
		Use:                "start -- <command> [args...]",
		Short:              "Wrap a test command with OTEL instrumentation",
		Long: `Transparent process wrapper. Sets NODE_OPTIONS and PLAYWRIGHT_REPORTER
to inject the embedded reporter, then runs your command with all stdout,
stderr, stdin, and exit codes passed through unchanged.

Example:
  browserstack-client otel start -- npx playwright test
  browserstack-client otel start -- npx mocha test/**/*.spec.js`,
		DisableFlagParsing: false,
		Args:               cobra.ArbitraryArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			// Resolve endpoint from flag or env
			ep := endpoint
			if ep == "" {
				ep = os.Getenv("BROWSERSTACK_OTEL_ENDPOINT")
			}
			if ep == "" {
				return fmt.Errorf("--endpoint or BROWSERSTACK_OTEL_ENDPOINT is required")
			}

			// Resolve headers from flag or env
			hdrs := headers
			if hdrs == "" {
				hdrs = os.Getenv("BROWSERSTACK_OTEL_HEADERS")
			}

			// Resolve flush timeout
			ft := flushTimeout
			if ft == "" {
				ft = os.Getenv("BROWSERSTACK_OTEL_FLUSH_TIMEOUT")
			}
			if ft == "" {
				ft = "30s"
			}
			flushDur, err := time.ParseDuration(ft)
			if err != nil {
				return fmt.Errorf("invalid --flush-timeout %q: %w", ft, err)
			}

			// Ensure reporter is extracted
			cacheDir, err := internalotel.DefaultCacheDir()
			if err != nil {
				return err
			}
			reporterPath, err := internalotel.EnsureReporter(cacheDir)
			if err != nil {
				return fmt.Errorf("ensure reporter: %w", err)
			}

			cfg := internalotel.Config{
				ReporterPath:        reporterPath,
				Endpoint:            ep,
				Headers:             hdrs,
				FlushTimeout:        ft,
				BatchSize:           batchSize,
				BatchTimeout:        batchTimeout,
				ExportTimeout:       exportTimeout,
				AttachmentThreshold: attachmentThreshold,
			}

			if len(args) == 0 {
				return fmt.Errorf("no command provided after --")
			}

			exitCode, err := internalotel.Run(cfg, args, flushDur)
			if err != nil {
				return err
			}
			os.Exit(exitCode)
			return nil
		},
	}

	cmd.Flags().StringVar(&endpoint, "endpoint", "", "OTLP base URL (or set BROWSERSTACK_OTEL_ENDPOINT)")
	cmd.Flags().StringVar(&headers, "headers", "", "Auth headers: key=value,key=value (or set BROWSERSTACK_OTEL_HEADERS)")
	cmd.Flags().StringVar(&flushTimeout, "flush-timeout", "", "Max wait for reporter flush after exit (default 30s)")
	cmd.Flags().StringVar(&batchSize, "batch-size", "", "Max spans per export batch (default 512)")
	cmd.Flags().StringVar(&batchTimeout, "batch-timeout", "", "Max time before flushing partial batch (default 5s)")
	cmd.Flags().StringVar(&exportTimeout, "export-timeout", "", "Per-export-request timeout (default 10s)")
	cmd.Flags().StringVar(&attachmentThreshold, "attachment-threshold", "", "Max inline attachment size (default 5MB)")

	return cmd
}
```

- [ ] **Step 2: Add otelCmd to root in main.go**

In `packages/cli/golang/cmd/browserstack/main.go`, find the line that adds `localCmd`:
```go
root.AddCommand(localCmd)
```

Add the otel command directly after it:
```go
root.AddCommand(localCmd)
root.AddCommand(buildOtelCommand())
```

- [ ] **Step 3: Build**

```bash
cd packages/cli/golang && go build ./cmd/browserstack/... 2>&1
```

Expected: clean build.

- [ ] **Step 4: Smoke test subcommands**

```bash
./dist/browserstack-client-linux-amd64 otel --help
./dist/browserstack-client-linux-amd64 otel use-reporter --help
./dist/browserstack-client-linux-amd64 otel start --help
```

Expected: all three print help without error.

- [ ] **Step 5: Test use-reporter**

```bash
./dist/browserstack-client-linux-amd64 otel use-reporter
```

Expected: prints a path like `/home/user/.browserstack/otel/<hash>/register.cjs` and the file exists.

- [ ] **Step 6: Rebuild dist binaries**

```bash
cd packages/cli/golang && make
```

Expected: all 5 platform binaries built successfully.

- [ ] **Step 7: Commit**

```bash
git add packages/cli/golang/cmd/browserstack/otel.go packages/cli/golang/cmd/browserstack/main.go
git commit -m "feat(go-cli): add otel use-reporter and otel start subcommands"
```

---

## Task 13: Wire otel-reporter build into monorepo

**Files:**
- Modify: `package.json` (root)

- [ ] **Step 1: Add build:otel-reporter script to root package.json**

In `package.json`, find the `"scripts"` section and add:
```json
"build:otel-reporter": "pnpm --filter @dot-slash/browserstack-otel-reporter run build",
```

Also update the `"build"` script to include it before `build:go`:
```json
"build": "pnpm build:types && pnpm build:otel-reporter && pnpm build:go && pnpm build:ts && pnpm build:cli:ts",
```

- [ ] **Step 2: Add a copy step to Makefile**

In `packages/cli/golang/Makefile`, add a `copy-reporter` target and make `build` depend on it:

```makefile
copy-reporter:
	cp ../otel-reporter/dist/register.cjs internal/otel/assets/register.cjs

build: copy-reporter
	GOOS=linux GOARCH=amd64 go build ...
```

Replace the existing `build:` line with:
```makefile
.PHONY: build build-all-platforms test lint integration-test copy-reporter

VERSION := $(shell node -e "process.stdout.write(require('../typescript/package.json').version)")

copy-reporter:
	mkdir -p internal/otel/assets
	cp ../otel-reporter/dist/register.cjs internal/otel/assets/register.cjs

build: copy-reporter
	GOOS=linux GOARCH=amd64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-linux-amd64 ./cmd/browserstack
	GOOS=linux GOARCH=arm64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-linux-arm64 ./cmd/browserstack
	GOOS=darwin GOARCH=amd64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-darwin-amd64 ./cmd/browserstack
	GOOS=darwin GOARCH=arm64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-darwin-arm64 ./cmd/browserstack
	GOOS=windows GOARCH=amd64 go build -ldflags "-X main.version=$(VERSION)" -o dist/browserstack-client-windows-amd64.exe ./cmd/browserstack
```

- [ ] **Step 3: Full build from root**

```bash
cd /data/repository/browserstack-client && pnpm build:otel-reporter && pnpm build:go
```

Expected: reporter built, bundle copied, Go binaries built successfully.

- [ ] **Step 4: Commit**

```bash
git add package.json packages/cli/golang/Makefile
git commit -m "build: wire otel-reporter bundle into Go CLI build pipeline"
```

---

## Task 14: End-to-end smoke test

No new files — manual verification only.

- [ ] **Step 1: Run use-reporter and verify output**

```bash
./packages/cli/golang/dist/browserstack-client-linux-amd64 otel use-reporter
# → /home/<user>/.browserstack/otel/<hash>/register.cjs

# Run again — should return same path (idempotent)
./packages/cli/golang/dist/browserstack-client-linux-amd64 otel use-reporter
```

Expected: same path printed both times.

- [ ] **Step 2: Verify manual wiring works**

```bash
REPORTER=$(./packages/cli/golang/dist/browserstack-client-linux-amd64 otel use-reporter)
NODE_OPTIONS="--require $REPORTER" node -e "console.log('loaded ok')" 2>&1
```

Expected: `loaded ok` printed, no crash. May see OTEL connection errors (no collector running) — that's fine.

- [ ] **Step 3: Verify start proxies exit code**

```bash
BROWSERSTACK_OTEL_ENDPOINT=http://localhost:4318 \
  ./packages/cli/golang/dist/browserstack-client-linux-amd64 otel start -- sh -c "exit 7"
echo "Exit code: $?"
```

Expected: `Exit code: 7`.

- [ ] **Step 4: Verify start proxies stdout transparently**

```bash
BROWSERSTACK_OTEL_ENDPOINT=http://localhost:4318 \
  ./packages/cli/golang/dist/browserstack-client-linux-amd64 otel start -- echo "hello world"
```

Expected: `hello world` printed to terminal. Flush timeout warning after 30s (no collector) — acceptable for smoke test, or reduce with `--flush-timeout 1s`.

- [ ] **Step 5: Verify PLAYWRIGHT_REPORTER is appended not overwritten**

```bash
PLAYWRIGHT_REPORTER=existing-reporter.ts \
BROWSERSTACK_OTEL_ENDPOINT=http://localhost:4318 \
  ./packages/cli/golang/dist/browserstack-client-linux-amd64 otel start -- \
  node -e "console.log(process.env.PLAYWRIGHT_REPORTER)"
```

Expected output contains both: `existing-reporter.ts,/home/.../.browserstack/otel/<hash>/register.cjs`

- [ ] **Step 6: Final commit**

```bash
git add -p  # stage any incidental fixes from smoke testing
git commit -m "test(otel): smoke test verification complete"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|-----------------|------|
| `use-reporter` subcommand, idempotent, prints path | Task 9, 12 |
| `start` transparent wrapper, all I/O proxied | Task 11, 12 |
| Env var merging — append not overwrite | Task 10 |
| `NODE_OPTIONS` append | Task 10 |
| `PLAYWRIGHT_REPORTER` append | Task 10 |
| `BROWSERSTACK_OTEL_ENDPOINT` → `OTEL_EXPORTER_OTLP_ENDPOINT` | Task 10 |
| `BROWSERSTACK_OTEL_HEADERS` → `OTEL_EXPORTER_OTLP_HEADERS` (appended) | Task 10 |
| All batch/timeout flags configurable | Task 10, 12 |
| SHA256 hash-based extraction cache key | Task 9 |
| `BROWSERSTACK_OTEL_FLUSH:` sentinel, stdout only | Task 4 |
| Flush timeout with warning on expiry | Task 11, 12 |
| Exit code passthrough | Task 11 |
| Signal forwarding | Task 11 |
| OTEL SDK: BatchSpanProcessor, configurable batch | Task 3 |
| Playwright adapter via official reporter interface | Task 5 |
| Mocha/Jest/Vitest adapters, self-activating no-ops | Task 6 |
| `test.run`, `test.case` span hierarchy + attributes | Task 5 |
| Attachments: inline base64 under threshold | Task 5 |
| Attachments: reference-only over threshold | Task 5 |
| Bundle embedded via `//go:embed` | Task 8 |
| Build pipeline: otel-reporter → copy → go build | Task 13 |
| `beforeExit` backstop flush | Task 7 |

All spec requirements covered. Blob storage upload (over-threshold attachments) is marked TBD in the spec and correctly left as a reference-only path attribute in Task 5.
