# OpenTelemetry Test Instrumentation — Design Spec

**Date:** 2026-05-27  
**Status:** Approved for implementation planning

---

## Overview

`browserstack-client otel start -- <command>` is a transparent process wrapper that instruments any Node.js test process with OpenTelemetry — zero changes to the user's repository. It works by injecting a pre-built JS reporter bundle into the child process at boot via `NODE_OPTIONS` and `PLAYWRIGHT_REPORTER`, collecting test lifecycle events as OTEL spans and log records, and shipping everything to a configurable OTLP endpoint. The user's command, stdout, stderr, stdin, and exit code all pass through unchanged.

---

## Subcommands

### `browserstack-client otel use-reporter`

Ensures the embedded reporter bundle is extracted to disk and prints its path to stdout.

- Extraction target: `~/.browserstack/otel/<hash>/register.cjs`
- `<hash>` is a SHA256 of the embedded bundle content — same CLI version = same hash = no re-extraction (idempotent)
- Prints the absolute path to stdout and exits
- Enables manual wiring without the `start` wrapper:
  ```
  NODE_OPTIONS="--require $(browserstack-client otel use-reporter)" npx playwright test
  ```

### `browserstack-client otel start [flags] -- <command> [args...]`

Transparent wrapper around any Node.js test command.

1. Calls `use-reporter` internally to ensure the bundle is extracted
2. Merges environment variables (append, never overwrite — see Env Var Merging)
3. Spawns the child process with merged environment
4. Proxies stdout (scanning for flush sentinel), stderr, and stdin transparently
5. Waits for flush signal or flush timeout after child exits
6. Exits with the child's exit code

**Flags:**

| Flag | Env var | Default | Description |
|------|---------|---------|-------------|
| `--endpoint` | `BROWSERSTACK_OTEL_ENDPOINT` | _(required)_ | OTLP base URL, e.g. `https://otel.example.com` |
| `--headers` | `BROWSERSTACK_OTEL_HEADERS` | _(optional)_ | Auth + custom headers in `key=value,key=value` format |
| `--flush-timeout` | `BROWSERSTACK_OTEL_FLUSH_TIMEOUT` | `30s` | Max wait for reporter flush after child exits |
| `--batch-size` | `BROWSERSTACK_OTEL_BATCH_SIZE` | `512` | Max spans per export batch |
| `--batch-timeout` | `BROWSERSTACK_OTEL_BATCH_TIMEOUT` | `5s` | Max time before flushing a partial batch |
| `--export-timeout` | `BROWSERSTACK_OTEL_EXPORT_TIMEOUT` | `10s` | Per-export-request timeout |
| `--attachment-threshold` | `BROWSERSTACK_OTEL_ATTACHMENT_THRESHOLD` | `5MB` | Max size for inline base64 attachments |

---

## Env Var Merging

The CLI never overwrites existing env vars. It always appends:

| CLI sets | Strategy |
|----------|----------|
| `NODE_OPTIONS` | Append `--require <path>` to existing value |
| `PLAYWRIGHT_REPORTER` | Append `<path>` to existing comma-separated list |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Set from `BROWSERSTACK_OTEL_ENDPOINT` (child env only) |
| `OTEL_EXPORTER_OTLP_HEADERS` | Append `BROWSERSTACK_OTEL_HEADERS` to existing value |

`BROWSERSTACK_OTEL_ENDPOINT` and `BROWSERSTACK_OTEL_HEADERS` are translated into their standard OTEL equivalents in the child environment. The parent process environment is never modified.

---

## Env Var: `BROWSERSTACK_OTEL_HEADERS`

Comma-separated `key=value` pairs. Values containing commas must be percent-encoded.

```
BROWSERSTACK_OTEL_HEADERS=Authorization=Bearer eyJ...,x-custom-header=value
```

The CLI percent-decodes values before forwarding to `OTEL_EXPORTER_OTLP_HEADERS`.

Auth for the OTEL collector is entirely separate from BrowserStack REST API credentials (`BROWSERSTACK_USERNAME` / `BROWSERSTACK_ACCESS_KEY`). The two credential sets are never mixed.

---

## Process I/O and Flush Protocol

```
child stdout → CLI goroutine: proxy verbatim to CLI stdout
                              scan each line for BROWSERSTACK_OTEL_FLUSH: sentinel
                              matching lines are consumed silently (not forwarded)

child stderr → CLI goroutine: proxy verbatim to CLI stderr, no scanning

child stdin  → CLI stdin forwarded to child verbatim

signals (SIGINT, SIGTERM) → forwarded to child process
```

**Flush sentinel format** (written by reporter to stdout when flush completes):
```
BROWSERSTACK_OTEL_FLUSH:{"spans":42,"logs":7,"status":"ok"}
BROWSERSTACK_OTEL_FLUSH:{"spans":38,"logs":4,"status":"error","reason":"export timeout"}
```

**CLI flush wait logic:**
1. Child process exits with code N
2. CLI waits for `BROWSERSTACK_OTEL_FLUSH:` line, up to `--flush-timeout`
3. If sentinel received before timeout: log span/log counts internally, proceed
4. If timeout expires without sentinel: log warning, proceed
5. CLI exits with child's exit code N in all cases

---

## Reporter Bundle (`register.cjs`)

A single self-contained CommonJS bundle built with esbuild. Embedded in both the Go CLI and TypeScript CLI as a binary asset. Loaded via `NODE_OPTIONS=--require`.

**Boot sequence:**
1. Read config from env (`BROWSERSTACK_OTEL_*`)
2. Initialize OTEL SDK: `BatchSpanProcessor` + OTLP HTTP exporter
3. Activate all framework adapters unconditionally (each self-activates only if its framework is present)
4. Register `process.on('beforeExit')` as last-resort flush backstop

**Framework adapters:**

| Adapter | Activation mechanism | Hooks used |
|---------|---------------------|------------|
| Playwright | Invoked via `PLAYWRIGHT_REPORTER` (official reporter interface) | `onBegin`, `onTestBegin`, `onTestEnd`, `onEnd` |
| Mocha | Patches `Mocha.Runner.prototype` if `mocha` is resolvable from cwd | `suite`, `test`, `pass`, `fail`, `pending`, `end` |
| Jest | Patches circus event handlers or jasmine2 globals if resolvable | `test_started`, `test_done`, `run_finish` |
| Vitest | Patches Vitest reporter interface if `vitest` is resolvable from cwd | `onTestBegin`, `onTestEnd`, `onFinished` |

If no framework is detected, the bundle is a no-op — no spans emitted, flush sentinel still written.

---

## OTEL Data Model

**Span hierarchy:**

```
test.run  (root span)
  └── test.case  (one per test)
        └── test.step  (one per step/hook, if framework exposes them)
```

**`test.run` span attributes:**
- `test.framework` — `playwright` | `mocha` | `jest` | `vitest`
- `test.total` — total test count
- `test.passed`, `test.failed`, `test.skipped`

**`test.case` span attributes:**
- `test.name` — full test title
- `test.suite` — suite/describe block name
- `test.file` — source file path
- `test.status` — `passed` | `failed` | `skipped` | `timedOut`
- `test.duration_ms`
- `test.retry` — retry index (0 = first attempt)
- `test.error.message`, `test.error.stack` — on failure

**`test.step` span attributes:**
- `test.step.title`
- `test.step.category` — `hook` | `step`

---

## Attachment Handling

Attachments are collected per test (Playwright `TestResult.attachments`, Mocha/Jest custom attach APIs).

**Size <= `BROWSERSTACK_OTEL_ATTACHMENT_THRESHOLD` (default 5MB):**
- Emitted as an OTEL log record attached to the `test.case` span
- Log record body: base64-encoded file content
- Log record attributes: `attachment.name`, `attachment.content_type`, `attachment.encoding=base64`

**Size > threshold:**
- Uploaded to the configured blob endpoint (TBD — endpoint and auth to be specified)
- Span attribute added to `test.case`: `attachment.name`, `attachment.url`, `attachment.size_bytes`
- Upload happens before `sdk.shutdown()` so the URL is available on the span

---

## OTLP Endpoint Convention

`BROWSERSTACK_OTEL_ENDPOINT` is the base URL. The reporter appends standard OTLP HTTP sub-paths:

```
<BROWSERSTACK_OTEL_ENDPOINT>/v1/traces   ← spans
<BROWSERSTACK_OTEL_ENDPOINT>/v1/logs     ← attachment log records
```

---

## Embedded Bundle: Build and Embedding

**Build:**
- Source: `packages/otel-reporter/` (new TypeScript package)
- Output: single `register.cjs`, built with esbuild, bundling `@opentelemetry/sdk-node`, `@opentelemetry/exporter-trace-otlp-http`, `@opentelemetry/exporter-logs-otlp-http`
- Built as part of `pnpm build:types` or a dedicated `pnpm build:otel-reporter` step

**Embedding:**
- Go CLI: `//go:embed assets/register.cjs` in the `otel` subcommand package
- TypeScript CLI: `fs.readFileSync(new URL('./assets/register.cjs', import.meta.url))` at build time, bundled by tsup

**Extraction cache key:** SHA256 of the embedded bytes → `~/.browserstack/otel/<hash>/register.cjs`

---

## Out of Scope

- Non-Node.js projects (Python, Java, .NET) — future work
- Metrics and traces from the browser (Playwright browser-side tracing) — future work
- Blob storage endpoint for large attachments — endpoint and auth TBD (separate spec)
- OTEL endpoint and auth credentials — TBD (to be specified separately)
- TypeScript CLI implementation — mirrors Go CLI, same design, separate implementation task
