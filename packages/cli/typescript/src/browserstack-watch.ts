#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import process from "node:process";

const FLUSH_SENTINEL_PREFIX = "BROWSERSTACK_WATCH_FLUSH:";

interface FlushResult {
  spans: number;
  logs: number;
  status: "ok" | "error";
  reason?: string;
}

function defaultCacheDir(): string {
  return join(homedir() ?? tmpdir(), ".browserstack", "watch");
}

function resolveReporterBundle(): string {
  // Locate register.cjs relative to this file's package boundary.
  // Works both from source (packages/cli/typescript/src/) and from dist/.
  const candidates = [
    // From source: ../../otel-reporter/dist/register.cjs
    join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "otel-reporter", "dist", "register.cjs"),
    // From dist: ../../../otel-reporter/dist/register.cjs
    join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..", "otel-reporter", "dist", "register.cjs"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  throw new Error(
    "Could not locate reporter bundle (dist/register.cjs). Run `pnpm build:otel-reporter` first."
  );
}

function ensureReporter(cacheDir: string): string {
  const bundle = readFileSync(resolveReporterBundle());
  const hash = createHash("sha256").update(bundle).digest("hex").slice(0, 16);
  const outDir = join(cacheDir, hash);
  const outPath = join(outDir, "register.cjs");
  if (!existsSync(outPath)) {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(outPath, bundle);
  }
  return outPath;
}

function injectPlaywrightReporter(args: string[], reporterPath: string): string[] {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (
      (arg === "playwright" || arg.endsWith("/playwright")) &&
      args[i + 1] === "test"
    ) {
      return [
        ...args.slice(0, i + 2),
        "--reporter",
        `list,${reporterPath}`,
        ...args.slice(i + 2),
      ];
    }
  }
  return args;
}

function runPassthrough(cmdArgs: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const [cmd, ...rest] = cmdArgs;
    const child = spawn(cmd, rest, { stdio: "inherit" });

    for (const sig of ["SIGINT", "SIGTERM"] as NodeJS.Signals[]) {
      process.on(sig, () => child.kill(sig));
    }

    child.on("error", reject);
    child.on("close", (code, signal) => {
      if (signal) {
        resolve(128 + (signal === "SIGINT" ? 2 : 15));
      } else {
        resolve(code ?? 0);
      }
    });
  });
}

function runWithInstrumentation(
  cmdArgs: string[],
  reporterPath: string,
  watchEnv: Record<string, string>,
  flushTimeoutMs: number,
): Promise<number> {
  return new Promise((resolve, reject) => {
    const injected = injectPlaywrightReporter(cmdArgs, reporterPath);
    const [cmd, ...rest] = injected;

    const nodeOptions = [
      process.env.NODE_OPTIONS,
      `--require ${reporterPath}`,
    ]
      .filter(Boolean)
      .join(" ");

    const env: Record<string, string> = {
      ...process.env as Record<string, string>,
      NODE_OPTIONS: nodeOptions,
      ...watchEnv,
    };

    const child = spawn(cmd, rest, { stdio: ["inherit", "pipe", "inherit"], env });

    for (const sig of ["SIGINT", "SIGTERM"] as NodeJS.Signals[]) {
      process.on(sig, () => child.kill(sig));
    }

    let flushResult: FlushResult | null = null;
    let stdoutBuf = "";
    let stdoutEnded = false;
    let childExitCode: number | null = null;

    const tryResolve = () => {
      if (childExitCode === null || !stdoutEnded) return;
      const exitCode = childExitCode;

      if (flushResult) {
        if (flushResult.status === "error") {
          process.stderr.write(
            `browserstack-watch: reporter flush error: ${flushResult.reason ?? ""}\n`
          );
        }
        resolve(exitCode);
        return;
      }

      const deadline = Date.now() + flushTimeoutMs;
      const poll = setInterval(() => {
        if (flushResult || Date.now() >= deadline) {
          clearInterval(poll);
          if (!flushResult) {
            process.stderr.write(
              `browserstack-watch: flush timeout after ${flushTimeoutMs}ms\n`
            );
          } else if (flushResult.status === "error") {
            process.stderr.write(
              `browserstack-watch: reporter flush error: ${flushResult.reason ?? ""}\n`
            );
          }
          resolve(exitCode);
        }
      }, 100);
    };

    child.stdout!.on("data", (chunk: Buffer) => {
      stdoutBuf += chunk.toString();
      const lines = stdoutBuf.split("\n");
      stdoutBuf = lines.pop() ?? "";
      for (const line of lines) {
        if (line.startsWith(FLUSH_SENTINEL_PREFIX)) {
          try {
            flushResult = JSON.parse(line.slice(FLUSH_SENTINEL_PREFIX.length)) as FlushResult;
          } catch {
            // malformed sentinel — ignore
          }
        } else {
          process.stdout.write(line + "\n");
        }
      }
    });

    child.stdout!.on("end", () => {
      if (stdoutBuf) {
        if (stdoutBuf.startsWith(FLUSH_SENTINEL_PREFIX)) {
          try {
            flushResult = JSON.parse(stdoutBuf.slice(FLUSH_SENTINEL_PREFIX.length)) as FlushResult;
          } catch {
            // ignore
          }
        } else {
          process.stdout.write(stdoutBuf);
        }
        stdoutBuf = "";
      }
      stdoutEnded = true;
      tryResolve();
    });

    child.on("error", reject);
    child.on("close", (code, signal) => {
      childExitCode = signal ? 128 + (signal === "SIGINT" ? 2 : 15) : (code ?? 0);
      tryResolve();
    });
  });
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

function parseFlag(args: string[], flag: string): string | undefined {
  const i = args.indexOf(flag);
  if (i !== -1 && i + 1 < args.length) return args[i + 1];
  return undefined;
}

const USAGE = `Usage: browserstack-client test-reporting watch <action> [options] -- <command>

Wrap your test command to collect OpenTelemetry spans and ship them to any
OTLP-compatible backend. The embedded reporter is injected automatically — no
changes to your project config are needed.

When no endpoint is configured the command runs unchanged and its exit code is
always propagated, so this wrapper is safe to leave in CI pipelines.

Actions:
  start      Wrap a test command with OpenTelemetry instrumentation
  reporter   Print the path to the extracted reporter bundle

Options for start:
  --endpoint <url>               OTLP base URL (or BROWSERSTACK_WATCH_ENDPOINT)
  --headers <key=val,key=val>    Auth headers (or BROWSERSTACK_WATCH_HEADERS)
  --flush-timeout <duration>     Max wait for reporter flush after exit (default 30s)
  --batch-size <n>               Max spans per export batch (default 512)
  --batch-timeout <duration>     Max time before flushing a partial batch (default 5s)
  --export-timeout <duration>    Per-export-request timeout (default 10s)
  --attachment-threshold <size>  Max inline attachment size (default 5MB)

Environment variables (all optional — flags take precedence):
  BROWSERSTACK_WATCH_ENDPOINT, BROWSERSTACK_WATCH_HEADERS,
  BROWSERSTACK_WATCH_FLUSH_TIMEOUT, BROWSERSTACK_WATCH_BATCH_SIZE,
  BROWSERSTACK_WATCH_BATCH_TIMEOUT, BROWSERSTACK_WATCH_EXPORT_TIMEOUT,
  BROWSERSTACK_WATCH_ATTACHMENT_THRESHOLD

Playwright examples:
  browserstack-client test-reporting watch start -- npx playwright test
  browserstack-client test-reporting watch start \\
    --endpoint https://otlp.example.com \\
    --headers "Authorization=Basic <base64>" \\
    -- npx playwright test`;

export async function main(inputArgs: string[] = process.argv.slice(2)): Promise<void> {
  const action = inputArgs[0]?.toLowerCase().trim();

  if (!action || action === "help") {
    process.stdout.write(USAGE + "\n");
    return;
  }

  if (action === "reporter") {
    const cacheDir = defaultCacheDir();
    const reporterPath = ensureReporter(cacheDir);
    process.stdout.write(reporterPath + "\n");
    return;
  }

  if (action !== "start") {
    process.stderr.write(`Unknown watch action: ${action}\n${USAGE}\n`);
    process.exit(1);
  }

  // Split on -- separator
  const sepIdx = inputArgs.indexOf("--");
  if (sepIdx === -1) {
    process.stderr.write(`browserstack-client test-reporting watch start requires -- before the command\n${USAGE}\n`);
    process.exit(1);
  }

  const flagArgs = inputArgs.slice(1, sepIdx);
  const cmdArgs = inputArgs.slice(sepIdx + 1);

  if (cmdArgs.length === 0) {
    process.stderr.write("No command provided after --\n");
    process.exit(1);
  }

  // Resolve endpoint
  const endpoint =
    parseFlag(flagArgs, "--endpoint") ??
    process.env.BROWSERSTACK_WATCH_ENDPOINT ??
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
    "";

  if (!endpoint) {
    // No endpoint — run without instrumentation; always propagate exit code
    const code = await runPassthrough(cmdArgs);
    process.exit(code);
  }

  // Resolve other config
  const headers =
    parseFlag(flagArgs, "--headers") ??
    process.env.BROWSERSTACK_WATCH_HEADERS ??
    process.env.OTEL_EXPORTER_OTLP_HEADERS ??
    "";

  const flushTimeoutStr =
    parseFlag(flagArgs, "--flush-timeout") ??
    process.env.BROWSERSTACK_WATCH_FLUSH_TIMEOUT ??
    "30s";
  const flushTimeoutMs = parseDurationMs(flushTimeoutStr);

  const watchEnv: Record<string, string> = {
    BROWSERSTACK_WATCH_ENDPOINT: endpoint,
  };
  if (headers) watchEnv.BROWSERSTACK_WATCH_HEADERS = headers;

  const batchSize = parseFlag(flagArgs, "--batch-size") ?? process.env.BROWSERSTACK_WATCH_BATCH_SIZE;
  const batchTimeout = parseFlag(flagArgs, "--batch-timeout") ?? process.env.BROWSERSTACK_WATCH_BATCH_TIMEOUT;
  const exportTimeout = parseFlag(flagArgs, "--export-timeout") ?? process.env.BROWSERSTACK_WATCH_EXPORT_TIMEOUT;
  const attachmentThreshold = parseFlag(flagArgs, "--attachment-threshold") ?? process.env.BROWSERSTACK_WATCH_ATTACHMENT_THRESHOLD;

  if (batchSize) watchEnv.BROWSERSTACK_WATCH_BATCH_SIZE = batchSize;
  if (batchTimeout) watchEnv.BROWSERSTACK_WATCH_BATCH_TIMEOUT = batchTimeout;
  if (exportTimeout) watchEnv.BROWSERSTACK_WATCH_EXPORT_TIMEOUT = exportTimeout;
  if (attachmentThreshold) watchEnv.BROWSERSTACK_WATCH_ATTACHMENT_THRESHOLD = attachmentThreshold;

  const cacheDir = defaultCacheDir();
  const reporterPath = ensureReporter(cacheDir);

  const exitCode = await runWithInstrumentation(cmdArgs, reporterPath, watchEnv, flushTimeoutMs);
  process.exit(exitCode);
}
