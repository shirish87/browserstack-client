import type { PairKind, TestResult } from "./types.ts";

export interface LiveEvent {
  phase: "start" | "end";
  kind: PairKind;
  logKind: "TEST_STEP" | "HTTP" | "TEST_LOG" | "HOOK_LOG";
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  fileName: string;
  scopes: string[];
  hookType: string;
  location?: string;
  tags?: string[];
  projectName: string;
  buildName: string;
  frameworkName: string;
  frameworkVersion: string;
  startMs: number;
  endMs: number;
  result?: TestResult;
  statusCode: "ok" | "error" | "unset";
  exception?: { error: string; backtrace?: string };
  exitCode?: number;
}

export interface LiveLog {
  traceId: string;
  spanId?: string;
  timeMs: number;
  level: "DEBUG" | "INFO" | "WARN" | "ERROR";
  message: string;
  kind: "TEST_LOG" | "HOOK_LOG" | "HTTP" | "TEST_STEP" | "TEST_SCREENSHOT" | "TEST_ATTACHMENT";
  fileName?: string;
  fileSize?: number;
}

type Attrs = Record<string, string | number | boolean>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function field(obj: Record<string, unknown>, camel: string, snake: string): unknown {
  if (camel in obj) return obj[camel];
  if (snake in obj) return obj[snake];
  return undefined;
}

function list(obj: Record<string, unknown>, camel: string, snake: string): Record<string, unknown>[] {
  const value = field(obj, camel, snake);
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord);
}

function readValue(value: Record<string, unknown>): string | number | boolean | undefined {
  const stringValue = value.stringValue ?? value.string_value;
  if (typeof stringValue === "string") return stringValue;
  const boolValue = value.boolValue ?? value.bool_value;
  if (typeof boolValue === "boolean") return boolValue;
  const intValue = value.intValue ?? value.int_value;
  if (typeof intValue === "number" && Number.isFinite(intValue)) return intValue;
  if (typeof intValue === "string" && /^-?\d+$/.test(intValue)) return Number(intValue);
  const doubleValue = value.doubleValue ?? value.double_value;
  if (typeof doubleValue === "number" && Number.isFinite(doubleValue)) return doubleValue;
  return undefined;
}

function readAttributes(raw: unknown): Attrs {
  if (!Array.isArray(raw)) return {};
  const out: Attrs = {};
  for (const entry of raw) {
    if (!isRecord(entry) || typeof entry.key !== "string" || !isRecord(entry.value)) continue;
    const value = readValue(entry.value);
    if (value !== undefined) out[entry.key] = value;
  }
  return out;
}

function asBigInt(value: unknown): bigint {
  if (typeof value === "bigint") return value;
  if (typeof value === "number" && Number.isFinite(value)) return BigInt(Math.trunc(value));
  if (typeof value === "string" && /^-?\d+$/.test(value)) return BigInt(value);
  return 0n;
}

function nanoToMs(value: unknown): number {
  const nano = asBigInt(value);
  if (nano <= 0n) return 0;
  return Number(nano / 1_000_000n);
}

function str(attrs: Attrs, key: string): string | undefined {
  const value = attrs[key];
  if (typeof value === "string" && value.length > 0) return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
}

function clip(value: string, max: number): string {
  return value.length <= max ? value : value.slice(0, max);
}

function detectKind(name: string, attrs: Attrs): PairKind | "ignore" {
  const explicit = str(attrs, "browserstack.span.kind");
  if (explicit === "build" || explicit === "test" || explicit === "hook" || explicit === "step") return explicit;
  const pytest = str(attrs, "pytest.span_type");
  if (pytest === "run") return "build";
  if (pytest === "fixture") return "hook";
  if (pytest === "test") {
    if (name.endsWith("::call")) return "ignore";
    if (name.endsWith("::setup") || name.endsWith("::teardown")) return "hook";
    return "test";
  }
  if (str(attrs, "http.request.method") || str(attrs, "http.method")) return "step";
  return "ignore";
}

function statusCodeOf(span: Record<string, unknown>): "ok" | "error" | "unset" {
  const status = span.status;
  if (!isRecord(status)) return "unset";
  const code = status.code;
  if (code === 2 || code === "ERROR" || code === "STATUS_CODE_ERROR") return "error";
  if (code === 1 || code === "OK" || code === "STATUS_CODE_OK") return "ok";
  return "unset";
}

function shortType(type: string): string {
  const part = type.split(".").pop();
  return part && part.length > 0 ? part : type;
}

function formatError(type: string | undefined, message: string | undefined): string {
  if (type && message && !message.startsWith(type) && !message.startsWith(`${shortType(type)}:`)) {
    return `${shortType(type)}: ${message}`;
  }
  return message || (type ? shortType(type) : "exception");
}

function statusMessage(span: Record<string, unknown>): string | undefined {
  const status = span.status;
  if (!isRecord(status) || typeof status.message !== "string") return undefined;
  const message = status.message.trim();
  return message.length > 0 ? message : undefined;
}

function exceptionOf(span: Record<string, unknown>): { error: string; backtrace?: string } | undefined {
  const found: { error: string; backtrace?: string }[] = [];
  for (const event of list(span, "events", "events")) {
    if (found.length >= 8 || event.name !== "exception") continue;
    const attributes = readAttributes(field(event, "attributes", "attributes"));
    const backtrace = str(attributes, "exception.stacktrace") ?? str(attributes, "exception.stack_trace");
    found.push({
      error: clip(formatError(str(attributes, "exception.type"), str(attributes, "exception.message")), 5000),
      backtrace: backtrace ? clip(backtrace, 5000) : undefined,
    });
  }
  if (found.length === 0) {
    const message = statusCodeOf(span) === "error" ? statusMessage(span) : undefined;
    return message ? { error: clip(message, 5000) } : undefined;
  }
  if (found.length === 1) return found[0];
  const backtrace = found.map((item) => item.backtrace).filter((item): item is string => !!item).join("\n\n");
  return {
    error: clip(found.map((item) => item.error).join("\n"), 5000),
    backtrace: backtrace.length > 0 ? clip(backtrace, 5000) : undefined,
  };
}

function resultOf(attrs: Attrs, status: "ok" | "error" | "unset", exception?: { error: string }): TestResult | undefined {
  const explicit = str(attrs, "browserstack.test.result");
  if (explicit === "passed" || explicit === "failed" || explicit === "skipped" || explicit === "timeout") return explicit;
  const semconv = str(attrs, "test.case.result.status");
  if (semconv === "fail") return "failed";
  if (semconv === "pass") return "passed";
  if (attrs["browserstack.test.skipped"] === true) return "skipped";
  if (status === "error" || exception) return "failed";
  if (status === "ok") return "passed";
  return undefined;
}

function scopesOf(attrs: Attrs, name: string): string[] {
  const explicit = str(attrs, "browserstack.test.scopes");
  if (explicit) {
    const scopes = explicit.split(",").map((part) => part.trim()).filter(Boolean);
    return (scopes.length > 0 ? scopes : ["test"]).slice(0, 20).map((part) => clip(part, 100));
  }
  const parts = (str(attrs, "pytest.nodeid") ?? name).split("::").map((part) => part.trim()).filter(Boolean);
  const withoutTest = parts.length > 1 ? parts.slice(0, -1) : parts;
  const scopes = (withoutTest.length > 0 ? withoutTest : ["test"]).slice(0, 20).map((part) => clip(part, 100));
  return scopes;
}

function hookTypeOf(name: string, attrs: Attrs): string {
  const explicit = str(attrs, "browserstack.hook_type");
  if (explicit) return clip(explicit, 50);
  if (str(attrs, "pytest.span_type") === "fixture") return "fixture";
  if (name.endsWith("::setup")) return "setup";
  if (name.endsWith("::teardown")) return "teardown";
  return "hook";
}

function logKindOf(kind: PairKind, attrs: Attrs): LiveEvent["logKind"] {
  if (kind === "hook") return "HOOK_LOG";
  if (str(attrs, "http.request.method") || str(attrs, "http.method")) return "HTTP";
  if (kind === "step") return "TEST_STEP";
  return "TEST_LOG";
}

function tagsOf(attrs: Attrs, key: string): string[] | undefined {
  const raw = str(attrs, key);
  if (!raw) return undefined;
  const tags = raw.split(",").map((part) => part.trim()).filter(Boolean).slice(0, 50);
  return tags.length > 0 ? tags : undefined;
}

function exitCodeOf(attrs: Attrs): number | undefined {
  const value = attrs["browserstack.exit_code"];
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^-?\d+$/.test(value)) return Number(value);
  return undefined;
}

function expand(span: Record<string, unknown>, resource: Attrs): LiveEvent[] {
  const spanAttrs = readAttributes(field(span, "attributes", "attributes"));
  const inherited: Attrs = { ...resource };
  delete inherited["browserstack.span.kind"];
  delete inherited["pytest.span_type"];
  delete inherited["browserstack.span.phase"];
  const attrs: Attrs = { ...inherited, ...spanAttrs };
  const name = typeof span.name === "string" && span.name.length > 0 ? span.name : "span";
  const localKindAttrs: Attrs = { ...attrs };
  if ("browserstack.span.kind" in spanAttrs) localKindAttrs["browserstack.span.kind"] = spanAttrs["browserstack.span.kind"]!;
  else delete localKindAttrs["browserstack.span.kind"];
  if ("pytest.span_type" in spanAttrs) localKindAttrs["pytest.span_type"] = spanAttrs["pytest.span_type"]!;
  else delete localKindAttrs["pytest.span_type"];
  const resolved = detectKind(name, localKindAttrs);
  if (resolved === "ignore") return [];

  const traceId = typeof span.traceId === "string" ? span.traceId : typeof span.trace_id === "string" ? span.trace_id : "";
  const spanId = typeof span.spanId === "string" ? span.spanId : typeof span.span_id === "string" ? span.span_id : "";
  if (!traceId || !spanId) return [];
  const parentRaw = typeof span.parentSpanId === "string" ? span.parentSpanId : typeof span.parent_span_id === "string" ? span.parent_span_id : "";
  const startMs = nanoToMs(field(span, "startTimeUnixNano", "start_time_unix_nano"));
  const endMs = nanoToMs(field(span, "endTimeUnixNano", "end_time_unix_nano"));
  const explicitPhase = str(spanAttrs, "browserstack.span.phase");
  let phase: "start" | "end" | "both";
  if (explicitPhase === "start") phase = "start";
  else if (explicitPhase === "end") phase = "end";
  else if (endMs > 0) phase = "both";
  else phase = "start";

  const fileName = clip(str(attrs, "browserstack.test.file") ?? str(attrs, "code.filepath") ?? str(attrs, "code.file.path") ?? name, 1000);
  const line = str(attrs, "code.lineno") ?? str(attrs, "code.line.number");
  const location = line ? clip(`${fileName}:${line}`, 1000) : undefined;
  const displayName = clip(str(attrs, "code.function") ?? str(attrs, "code.function.name") ?? str(attrs, "test.case.name") ?? name, 500);
  const statusCode = statusCodeOf(span);
  const exception = exceptionOf(span);
  const event: Omit<LiveEvent, "phase"> = {
    kind: resolved,
    logKind: logKindOf(resolved, localKindAttrs),
    traceId,
    spanId,
    parentSpanId: parentRaw || undefined,
    name: resolved === "build" ? clip(str(attrs, "browserstack.build.name") ?? name, 255) : displayName,
    fileName,
    scopes: scopesOf(attrs, name),
    hookType: hookTypeOf(name, localKindAttrs),
    location,
    tags: tagsOf(attrs, resolved === "build" ? "browserstack.build.tags" : "browserstack.test.tags"),
    projectName: clip(str(attrs, "browserstack.project_name") ?? str(attrs, "service.name") ?? "opentelemetry", 255),
    buildName: clip(str(attrs, "browserstack.build.name") ?? name, 255),
    frameworkName: clip(str(attrs, "browserstack.framework.name") ?? (str(spanAttrs, "pytest.span_type") ? "pytest" : "opentelemetry"), 100),
    frameworkVersion: clip(str(attrs, "browserstack.framework.version") ?? "0", 50),
    startMs,
    endMs,
    result: resultOf(attrs, statusCode, exception),
    statusCode,
    exception,
    exitCode: exitCodeOf(attrs),
  };
  if (phase === "both") return [{ ...event, phase: "start" }, { ...event, phase: "end" }];
  return [{ ...event, phase }];
}

function depthOf(spanId: string, parents: Map<string, string | undefined>): number {
  let depth = 0;
  let current = parents.get(spanId);
  const seen = new Set<string>();
  while (current && depth < 32 && !seen.has(current)) {
    seen.add(current);
    depth += 1;
    current = parents.get(current);
  }
  return depth;
}

function levelOf(value: unknown): LiveLog["level"] {
  const text = typeof value === "string" ? value.toUpperCase() : "";
  if (text === "DEBUG" || text === "INFO" || text === "WARN" || text === "ERROR") return text;
  return "INFO";
}

function parseLogs(payload: Record<string, unknown>): LiveLog[] {
  const logs: LiveLog[] = [];
  for (const resourceLog of list(payload, "resourceLogs", "resource_logs")) {
    for (const scopeLog of list(resourceLog, "scopeLogs", "scope_logs")) {
      for (const record of list(scopeLog, "logRecords", "log_records")) {
        const traceId = typeof record.traceId === "string" ? record.traceId : typeof record.trace_id === "string" ? record.trace_id : "";
        if (!traceId) continue;
        const spanId = typeof record.spanId === "string" ? record.spanId : typeof record.span_id === "string" ? record.span_id : undefined;
        const body = field(record, "body", "body");
        let message = "";
        if (typeof body === "string") message = body;
        else if (isRecord(body)) {
          const stringValue = body.stringValue ?? body.string_value;
          if (typeof stringValue === "string") message = stringValue;
        }
        const attributes = readAttributes(field(record, "attributes", "attributes"));
        const kind = logKind(str(attributes, "browserstack.log.kind"));
        logs.push({
          traceId,
          spanId,
          timeMs: nanoToMs(field(record, "timeUnixNano", "time_unix_nano")) || Date.now(),
          level: levelOf(field(record, "severityText", "severity_text")),
          message: clip(message || "(empty log)", 10000),
          kind,
          fileName: fileNameOf(attributes),
          fileSize: fileSizeOf(attributes),
        });
      }
    }
  }
  return logs;
}

function logKind(kindRaw: string | undefined): LiveLog["kind"] {
  if (kindRaw === "HOOK_LOG" || kindRaw === "HTTP" || kindRaw === "TEST_STEP" || kindRaw === "TEST_SCREENSHOT" || kindRaw === "TEST_ATTACHMENT") {
    return kindRaw;
  }
  return "TEST_LOG";
}

function fileNameOf(attributes: Attrs): string | undefined {
  const name = str(attributes, "browserstack.attachment.name") ?? str(attributes, "browserstack.attachment.path");
  if (!name) return undefined;
  const base = name.split(/[/\\]/).pop() || name;
  return clip(base, 1000);
}

function fileSizeOf(attributes: Attrs): number | undefined {
  const size = attributes["browserstack.attachment.size"];
  if (typeof size === "number" && Number.isFinite(size) && size >= 0) return Math.round(size);
  return undefined;
}

function attachmentKind(kindRaw: string | undefined): LiveLog["kind"] | undefined {
  if (kindRaw === "screenshot") return "TEST_SCREENSHOT";
  if (kindRaw === "video" || kindRaw === "trace") return "TEST_ATTACHMENT";
  return undefined;
}

function attachmentLogs(span: Record<string, unknown>): LiveLog[] {
  const traceId = typeof span.traceId === "string" ? span.traceId : typeof span.trace_id === "string" ? span.trace_id : "";
  const spanId = typeof span.spanId === "string" ? span.spanId : typeof span.span_id === "string" ? span.span_id : "";
  if (!traceId || !spanId) return [];
  const logs: LiveLog[] = [];
  for (const event of list(span, "events", "events")) {
    if (event.name !== "browserstack.attachment") continue;
    const attributes = readAttributes(field(event, "attributes", "attributes"));
    const kind = attachmentKind(str(attributes, "browserstack.attachment.kind"));
    if (!kind) continue;
    const path = str(attributes, "browserstack.attachment.path") ?? "";
    const fileName = fileNameOf(attributes);
    if (!fileName) continue;
    logs.push({
      traceId,
      spanId,
      timeMs: nanoToMs(field(event, "timeUnixNano", "time_unix_nano")) || Date.now(),
      level: "INFO",
      message: clip(path || fileName, 10000),
      kind,
      fileName,
      fileSize: fileSizeOf(attributes),
    });
  }
  return logs;
}

function carryFromCall(span: Record<string, unknown>): { parentSpanId: string; status: "ok" | "error" | "unset"; exception?: { error: string; backtrace?: string } } | undefined {
  const name = typeof span.name === "string" ? span.name : "";
  if (!name.endsWith("::call")) return undefined;
  const spanAttrs = readAttributes(field(span, "attributes", "attributes"));
  if (str(spanAttrs, "pytest.span_type") !== "test") return undefined;
  const parentRaw = typeof span.parentSpanId === "string" ? span.parentSpanId : typeof span.parent_span_id === "string" ? span.parent_span_id : "";
  if (!parentRaw) return undefined;
  return { parentSpanId: parentRaw, status: statusCodeOf(span), exception: exceptionOf(span) };
}

export function parseOtlp(payload: unknown): { events: LiveEvent[]; logs: LiveLog[] } {
  if (!isRecord(payload)) return { events: [], logs: [] };
  const events: LiveEvent[] = [];
  const logs = parseLogs(payload);
  const callCarry = new Map<string, { status: "ok" | "error" | "unset"; exception?: { error: string; backtrace?: string } }>();
  for (const resourceSpan of list(payload, "resourceSpans", "resource_spans")) {
    const resource = readAttributes(field(isRecord(resourceSpan.resource) ? resourceSpan.resource : {}, "attributes", "attributes"));
    for (const scopeSpan of list(resourceSpan, "scopeSpans", "scope_spans")) {
      for (const span of list(scopeSpan, "spans", "spans")) {
        logs.push(...attachmentLogs(span));
        const carried = carryFromCall(span);
        if (carried) {
          callCarry.set(carried.parentSpanId, carried);
          continue;
        }
        events.push(...expand(span, resource));
      }
    }
  }
  for (const event of events) {
    const carried = callCarry.get(event.spanId);
    if (!carried) continue;
    if (!event.exception && carried.exception) event.exception = carried.exception;
    if (!event.result) {
      if (carried.status === "error" || carried.exception) event.result = "failed";
      else if (carried.status === "ok") event.result = "passed";
    }
  }
  const parents = new Map<string, string | undefined>();
  for (const event of events) {
    if (!parents.has(event.spanId)) parents.set(event.spanId, event.parentSpanId);
  }
  events.sort((a, b) => {
    if (a.phase !== b.phase) return a.phase === "start" ? -1 : 1;
    const depthA = depthOf(a.spanId, parents);
    const depthB = depthOf(b.spanId, parents);
    if (depthA !== depthB) return a.phase === "start" ? depthA - depthB : depthB - depthA;
    const kindOrder = { build: 0, test: 1, hook: 2, step: 3 };
    return a.phase === "start" ? kindOrder[a.kind] - kindOrder[b.kind] : kindOrder[b.kind] - kindOrder[a.kind];
  });
  return { events, logs };
}
