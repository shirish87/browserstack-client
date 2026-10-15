import type { IncomingMessage, ServerResponse } from "node:http";
import { decodeOtlpProtobuf } from "./otlp-protobuf.ts";
import { parseOtlp } from "./parse.ts";
import { OtelSessionStore } from "./session.ts";
import { createTraIngestClient } from "./tra-client.ts";
import {
  DEFAULT_OTEL_TIMEOUTS,
  EXIT_TIMEOUT,
  type OtelTimeouts,
  type TraIngestClient,
  type TraceSnapshot,
} from "./types.ts";

export interface OtelIngestOptions {
  /** Used when `client` is omitted. */
  username?: string;
  /** Used when `client` is omitted. */
  accessKey?: string;
  /** Collector base URL. Defaults to the Test Reporting ingestion host. */
  baseUrl?: string;
  fetchFn?: typeof fetch;
  /** Inject a client in tests. Production uses the HTTP collector client. */
  client?: TraIngestClient;
  now?: () => number;
  hookTimeoutMs?: number;
  testTimeoutMs?: number;
  stepTimeoutMs?: number;
  buildTimeoutMs?: number;
  buildIdleTimeoutMs?: number;
  /** Set to 0 to disable the background sweep. */
  sweepIntervalMs?: number;
  maxBodyBytes?: number;
  maxFinishAttempts?: number;
  schedule?: (fn: () => void, ms: number) => { cancel(): void };
}

export interface OtelIngest {
  handle(request: Request): Promise<Response>;
  sweep(now?: number): Promise<TraceSnapshot[]>;
  shutdown(now?: number): Promise<TraceSnapshot[]>;
}

export interface OtelGateway {
  (req: IncomingMessage, res: ServerResponse, next?: (err?: unknown) => void): Promise<void>;
  sweep(now?: number): Promise<TraceSnapshot[]>;
  shutdown(now?: number): Promise<TraceSnapshot[]>;
}

interface IngestResult {
  status: number;
  body: { traces: TraceSnapshot[] } | { error: string };
  exitCode: number | null;
}

function timeoutsOf(options: OtelIngestOptions): OtelTimeouts {
  return {
    hookTimeoutMs: options.hookTimeoutMs ?? DEFAULT_OTEL_TIMEOUTS.hookTimeoutMs,
    testTimeoutMs: options.testTimeoutMs ?? DEFAULT_OTEL_TIMEOUTS.testTimeoutMs,
    stepTimeoutMs: options.stepTimeoutMs ?? DEFAULT_OTEL_TIMEOUTS.stepTimeoutMs,
    buildTimeoutMs: options.buildTimeoutMs ?? DEFAULT_OTEL_TIMEOUTS.buildTimeoutMs,
    buildIdleTimeoutMs: options.buildIdleTimeoutMs ?? DEFAULT_OTEL_TIMEOUTS.buildIdleTimeoutMs,
    sweepIntervalMs: options.sweepIntervalMs ?? DEFAULT_OTEL_TIMEOUTS.sweepIntervalMs,
    maxBodyBytes: options.maxBodyBytes ?? DEFAULT_OTEL_TIMEOUTS.maxBodyBytes,
    maxFinishAttempts: options.maxFinishAttempts ?? DEFAULT_OTEL_TIMEOUTS.maxFinishAttempts,
  };
}

function clientOf(options: OtelIngestOptions): TraIngestClient {
  if (options.client) return options.client;
  if (!options.username || !options.accessKey) {
    throw new Error("createOtelIngest requires a client or username and accessKey");
  }
  return createTraIngestClient({
    username: options.username,
    accessKey: options.accessKey,
    baseUrl: options.baseUrl,
    fetchFn: options.fetchFn,
  });
}

function severeExit(traces: TraceSnapshot[]): number | null {
  let exitCode: number | null = null;
  for (const trace of traces) {
    if (trace.exitCode === null) continue;
    if (trace.exitCode === EXIT_TIMEOUT) return EXIT_TIMEOUT;
    if (exitCode === null || trace.exitCode > exitCode) exitCode = trace.exitCode;
  }
  return exitCode;
}

function responseOf(traces: TraceSnapshot[], fallbackStatus = 200): IngestResult {
  const blocked = traces.some((trace) => !trace.buildHashedId && trace.errors.some((error) => error.code === "tra_start_failed"));
  return {
    status: blocked ? 502 : fallbackStatus,
    body: { traces },
    exitCode: severeExit(traces),
  };
}

export function createOtelIngest(options: OtelIngestOptions): OtelIngest {
  const timeouts = timeoutsOf(options);
  const store = new OtelSessionStore(clientOf(options), timeouts, options.now ?? (() => Date.now()));
  let timer: { cancel(): void } | undefined;
  if (timeouts.sweepIntervalMs > 0) {
    const schedule = options.schedule ?? ((fn, ms) => {
      const handle = setInterval(fn, ms);
      return { cancel: () => clearInterval(handle) };
    });
    timer = schedule(() => {
      void store.sweep();
    }, timeouts.sweepIntervalMs);
  }

  async function accept(method: string, url: URL, body: Uint8Array | undefined, contentType: string): Promise<IngestResult> {
    if (method === "GET") {
      const traces = await store.snapshots(url.searchParams.get("traceId"));
      return responseOf(traces);
    }
    if (method !== "POST") {
      return { status: 405, body: { error: "Method not allowed" }, exitCode: null };
    }
    if (!body || body.byteLength === 0) return { status: 400, body: { error: "Invalid JSON" }, exitCode: null };
    if (body.byteLength > timeouts.maxBodyBytes) {
      return { status: 413, body: { error: "Payload too large" }, exitCode: null };
    }
    const payload = decodePayload(body, contentType);
    if (payload === undefined) return { status: 400, body: { error: "Invalid JSON" }, exitCode: null };
    const { events, logs } = parseOtlp(payload);
    const traces = await store.apply(events, logs);
    return responseOf(traces);
  }

  async function handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    let body: Uint8Array | undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      const declared = Number(request.headers.get("content-length") ?? "0");
      if (declared > timeouts.maxBodyBytes) {
        return jsonResponse({ status: 413, body: { error: "Payload too large" }, exitCode: null });
      }
      body = new Uint8Array(await request.arrayBuffer());
    }
    return jsonResponse(await accept(request.method, url, body, request.headers.get("content-type") ?? ""));
  }

  return {
    handle,
    sweep: (now) => store.sweep(now),
    shutdown: async (now) => {
      timer?.cancel();
      timer = undefined;
      return store.shutdown(now);
    },
  };
}

function jsonResponse(result: IngestResult): Response {
  const headers = new Headers({ "content-type": "application/json" });
  if (result.exitCode !== null) headers.set("x-browserstack-exit-code", String(result.exitCode));
  return new Response(JSON.stringify(result.body), { status: result.status, headers });
}

function isProtobuf(contentType: string): boolean {
  const type = contentType.toLowerCase();
  return type.includes("application/x-protobuf") || type.includes("application/protobuf");
}

function decodePayload(body: Uint8Array, contentType: string): unknown | undefined {
  try {
    if (isProtobuf(contentType)) return decodeOtlpProtobuf(body);
    return JSON.parse(new TextDecoder().decode(body)) as unknown;
  } catch {
    return undefined;
  }
}

async function readBody(req: IncomingMessage, limit: number): Promise<Uint8Array> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buf.length;
    if (total > limit) {
      const error = new Error("payload too large");
      (error as Error & { status?: number }).status = 413;
      throw error;
    }
    chunks.push(buf);
  }
  return Buffer.concat(chunks as unknown as Uint8Array[]) as unknown as Uint8Array;
}

export function createOtelGateway(options: OtelIngestOptions): OtelGateway {
  const ingest = createOtelIngest(options);
  const limit = options.maxBodyBytes ?? DEFAULT_OTEL_TIMEOUTS.maxBodyBytes;

  const middleware = async function otelGateway(
    req: IncomingMessage,
    res: ServerResponse,
    next?: (err?: unknown) => void,
  ): Promise<void> {
    try {
      const host = req.headers.host ?? "localhost";
      const url = new URL(req.url ?? "/", `http://${host}`);
      let body: Uint8Array | undefined;
      if (req.method !== "GET" && req.method !== "HEAD") {
        const declared = Number(req.headers["content-length"] ?? "0");
        if (declared > limit) {
          writeJson(res, { status: 413, body: { error: "Payload too large" }, exitCode: null });
          return;
        }
        body = await readBody(req, limit);
      }
      const method = req.method ?? "GET";
      const contentType = typeof req.headers["content-type"] === "string" ? req.headers["content-type"] : "application/json";
      const result = await ingest.handle(new Request(url, {
        method,
        headers: { "content-type": contentType },
        body: method === "GET" || method === "HEAD" ? undefined : (body ?? new Uint8Array()) as unknown as BodyInit,
      }));
      const text = await result.text();
      res.statusCode = result.status;
      const exitCode = result.headers.get("x-browserstack-exit-code");
      res.setHeader("content-type", "application/json");
      if (exitCode) res.setHeader("x-browserstack-exit-code", exitCode);
      res.end(text);
    } catch (error) {
      const status = (error as { status?: number }).status;
      if (status === 413) {
        writeJson(res, { status: 413, body: { error: "Payload too large" }, exitCode: null });
        return;
      }
      if (next) next(error);
      else {
        res.statusCode = 500;
        res.end("Internal Gateway Error");
      }
    }
  } as OtelGateway;

  middleware.sweep = (now) => ingest.sweep(now);
  middleware.shutdown = (now) => ingest.shutdown(now);
  return middleware;
}

function writeJson(res: ServerResponse, result: IngestResult): void {
  res.statusCode = result.status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(result.body));
}
