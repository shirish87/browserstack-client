/**
 * Turns a session's raw evidence (text log, Appium and device logs, HAR) into things a reader can line up
 * with a test: commands, network rows, a shared timeline, and the facts inside one test's time window.
 *
 * Sessions are per spec file, so one session holds several tests and nothing in the logs says where a test
 * starts or ends. The only link is time: a test's `startedAt` and duration give a window, and everything
 * with a timestamp inside it belongs to that test.
 */
import { z } from "zod";
import type { HarArchive } from "@dot-slash/browserstack-automate/models";
import type { FlatTest } from "./analytics";
import type { NormStatus } from "./hierarchy";

export interface Window {
  startMs: number;
  endMs: number;
}

// --- logs --------------------------------------------------------------------------------------

export interface LogLine {
  /** Epoch ms (UTC); stamp-less continuation lines inherit the previous line's. */
  ms: number | undefined;
  tag: string;
  text: string;
}

/** The numeric parts of a log timestamp, captured as strings by the line patterns below. */
const StampSchema = z.object({ y: z.string(), mo: z.string(), d: z.string(), h: z.string(), mi: z.string(), s: z.string(), ms: z.string() });
const utc = (g: z.infer<typeof StampSchema>): number => Date.UTC(Number(g.y), Number(g.mo) - 1, Number(g.d), Number(g.h), Number(g.mi), Number(g.s), Number(g.ms));

/** Live logs use CRLF; fixtures use LF. */
const LINE_BREAK = /\r?\n/;

/** Matches a line and returns its named groups, validated, or undefined when it doesn't match. */
function groupsOf<T extends z.ZodType>(re: RegExp, schema: T, line: string): z.infer<T> | undefined {
  const parsed = schema.safeParse(re.exec(line)?.groups);
  return parsed.success ? parsed.data : undefined;
}

/** Automate / App Automate text log: `2026-10-4 16:28:3:343 REQUEST POST /session {...}`, unpadded, UTC. */
const TEXT_LINE = /^(?<y>\d{4})-(?<mo>\d{1,2})-(?<d>\d{1,2}) (?<h>\d{1,2}):(?<mi>\d{1,2}):(?<s>\d{1,2}):(?<ms>\d{1,3}) (?<tag>\S+)(?: (?<text>.*))?$/;
const TextLineSchema = StampSchema.extend({ tag: z.string(), text: z.string().optional() });
/** App Automate repeats the stamp in brackets after REQUEST. */
const BRACKET_STAMP = /^\[\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}:\d{1,3}\] /;

export function parseTextLog(text: string): LogLine[] {
  const out: LogLine[] = [];
  for (const raw of text.split(LINE_BREAK)) {
    if (raw.trim() === "") continue;
    const g = groupsOf(TEXT_LINE, TextLineSchema, raw);
    if (g) {
      out.push({ ms: utc(g), tag: g.tag, text: (g.text ?? "").replace(BRACKET_STAMP, "") });
    } else {
      out.push({ ms: out.at(-1)?.ms, tag: "", text: raw });
    }
  }
  return out;
}

/** Appium log: `2026-10-04 16:28:03:360 - [HTTP] --> POST /wd/hub/session`, padded, UTC. */
const APPIUM_LINE = /^(?<y>\d{4})-(?<mo>\d{2})-(?<d>\d{2}) (?<h>\d{2}):(?<mi>\d{2}):(?<s>\d{2}):(?<ms>\d{3}) - (?:\[(?<tag>[^\]]+)\] )?(?<text>.*)$/;
const AppiumLineSchema = StampSchema.extend({ tag: z.string().optional(), text: z.string() });

export function parseAppiumLog(text: string): LogLine[] {
  const out: LogLine[] = [];
  for (const raw of text.split(LINE_BREAK)) {
    if (raw.trim() === "") continue;
    const g = groupsOf(APPIUM_LINE, AppiumLineSchema, raw);
    if (g) out.push({ ms: utc(g), tag: g.tag ?? "", text: g.text });
    else out.push({ ms: out.at(-1)?.ms, tag: "", text: raw });
  }
  return out;
}

/** Android logcat: `10-04 16:28:08.959 I/libc    (12766): message`. It has no year; take it from the session. */
const DEVICE_LINE = /^(?<mo>\d{2})-(?<d>\d{2}) (?<h>\d{2}):(?<mi>\d{2}):(?<s>\d{2})\.(?<ms>\d{3}) (?<tag>\S+)\s+\(\s*\d+\): ?(?<text>.*)$/;
const DeviceLineSchema = StampSchema.omit({ y: true }).extend({ tag: z.string(), text: z.string() });

export function parseDeviceLog(text: string, year: number): LogLine[] {
  const out: LogLine[] = [];
  for (const raw of text.split(LINE_BREAK)) {
    if (raw.trim() === "") continue;
    const g = groupsOf(DEVICE_LINE, DeviceLineSchema, raw);
    if (g) out.push({ ms: utc({ ...g, y: String(year) }), tag: g.tag, text: g.text });
    else out.push({ ms: out.at(-1)?.ms, tag: "", text: raw });
  }
  return out;
}

// --- commands ----------------------------------------------------------------------------------

export interface Command {
  startMs: number;
  endMs: number | undefined;
  durationMs: number | undefined;
  method: string;
  path: string;
  body: string | undefined;
  failed: boolean;
  error: string | undefined;
}

const REQUEST_TEXT = /^(?<method>\S+) (?<path>\S+)(?: (?<body>.*))?$/;
const RequestTextSchema = z.object({ method: z.string(), path: z.string(), body: z.string().optional() });

const WebDriverErrorSchema = z.object({ value: z.object({ error: z.string(), message: z.string().optional() }) });

function errorOf(response: string): string | undefined {
  try {
    const parsed = WebDriverErrorSchema.safeParse(JSON.parse(response));
    return parsed.success ? (parsed.data.value.message ?? parsed.data.value.error) : undefined;
  } catch {
    return undefined;
  }
}

/** Pairs each REQUEST with the RESPONSE that follows it (WebDriver is sequential per session). */
export function commandsFromLog(lines: LogLine[]): Command[] {
  const out: Command[] = [];
  let open: Command | undefined;
  for (const line of lines) {
    if (line.tag === "REQUEST" && line.ms !== undefined) {
      const g = groupsOf(REQUEST_TEXT, RequestTextSchema, line.text);
      if (!g) continue;
      open = { startMs: line.ms, endMs: undefined, durationMs: undefined, method: g.method, path: g.path, body: g.body, failed: false, error: undefined };
      out.push(open);
    } else if (line.tag === "RESPONSE" && open && line.ms !== undefined) {
      const error = errorOf(line.text);
      open.endMs = line.ms;
      open.durationMs = line.ms - open.startMs;
      open.failed = error !== undefined;
      open.error = error;
      open = undefined;
    }
  }
  return out;
}

// --- network -----------------------------------------------------------------------------------

export interface NetworkRow {
  id: number;
  startMs: number;
  durationMs: number;
  method: string;
  host: string;
  /** Path and query. */
  path: string;
  status: number;
  statusText: string;
  mime: string;
  sizeBytes: number;
  /** HTTP error (4xx/5xx) or a request that never completed (status 0). */
  failed: boolean;
  error: string | undefined;
  /** ms: connection setup (blocked + dns + connect + ssl), the server's response time, and transfer (send + receive). */
  phases: { connect: number; wait: number; transfer: number };
}

// The client types HAR `content` and `timings` as loose records; narrow just what the waterfall reads.
const TimingsSchema = z.object({
  blocked: z.number().optional(),
  dns: z.number().optional(),
  connect: z.number().optional(),
  ssl: z.number().optional(),
  send: z.number().optional(),
  wait: z.number().optional(),
  receive: z.number().optional(),
});
const ContentSchema = z.object({ size: z.number().optional(), mimeType: z.string().optional() });

/** HAR uses -1 for "does not apply". */
const ms = (v: number | undefined): number => (v !== undefined && v > 0 ? v : 0);

export function toNetworkRows(har: HarArchive): NetworkRow[] {
  const rows: NetworkRow[] = [];
  (har.log?.entries ?? []).forEach((e, id) => {
    const start = Date.parse(e.startedDateTime ?? "");
    if (Number.isNaN(start) || !e.request) return;
    let host = "";
    let path = e.request.url ?? "";
    try {
      const u = new URL(path);
      host = u.host;
      path = `${u.pathname}${u.search}`;
    } catch {
      // keep the raw url as the path
    }
    const t = TimingsSchema.safeParse(e.timings ?? {});
    const timings = t.success ? t.data : {};
    const content = ContentSchema.safeParse(e.response?.content ?? {});
    const status = e.response?.status ?? 0;
    rows.push({
      id,
      startMs: start,
      durationMs: ms(e.time ?? undefined),
      method: e.request.method ?? "GET",
      host,
      path,
      status,
      statusText: e.response?.statusText ?? "",
      mime: content.success ? (content.data.mimeType ?? "") : "",
      sizeBytes: content.success ? (content.data.size ?? 0) : 0,
      failed: status === 0 || status >= 400,
      error: e.response?.ErrorMessage ?? undefined,
      phases: { connect: ms(timings.blocked) + ms(timings.dns) + ms(timings.connect) + ms(timings.ssl), wait: ms(timings.wait), transfer: ms(timings.send) + ms(timings.receive) },
    });
  });
  return rows.sort((a, b) => a.startMs - b.startMs);
}

/** "12.3 kB"; HAR reports -1 when the size is unknown. */
export function formatBytes(n: number): string {
  if (n < 0 || !Number.isFinite(n)) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} kB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export interface WaterfallBar {
  /** All in percent of the whole capture's span. */
  left: number;
  connect: number;
  wait: number;
  transfer: number;
}

/** One bar per row, positioned on a shared time axis and split into connect / server wait / transfer. */
export function waterfallOf(rows: NetworkRow[]): WaterfallBar[] {
  if (rows.length === 0) return [];
  const start = Math.min(...rows.map((r) => r.startMs));
  const span = Math.max(1, Math.max(...rows.map((r) => r.startMs + r.durationMs)) - start);
  const pct = (ms: number): number => (ms / span) * 100;
  return rows.map((r) => ({ left: pct(r.startMs - start), connect: pct(r.phases.connect), wait: pct(r.phases.wait), transfer: pct(r.phases.transfer) }));
}

// --- a test's window ---------------------------------------------------------------------------

export function windowOf(test: Pick<FlatTest, "startedAt" | "durationMs">): Window | undefined {
  const start = Date.parse(test.startedAt ?? "");
  if (Number.isNaN(start)) return undefined;
  return { startMs: start, endMs: start + (test.durationMs ?? 0) };
}

export const inWindow = (t: number, w: Window): boolean => t >= w.startMs && t <= w.endMs;

/** A slow request, in ms. */
export const SLOW_REQUEST_MS = 3000;

export interface Signal {
  kind: "request-failed" | "request-slow" | "command-failed";
  atMs: number;
  text: string;
}

const requestText = (r: NetworkRow): string => `${r.method} ${r.path.split("?")[0]} → ${r.status === 0 ? (r.error ?? "no response") : r.status} (${Math.round(r.durationMs)} ms)`;

/** The facts a reader should see first about a window: failed and slow requests, failed commands. */
export function signalsIn(w: Window, commands: Command[], rows: NetworkRow[]): Signal[] {
  const out: Signal[] = [];
  for (const r of rows) {
    if (!inWindow(r.startMs, w)) continue;
    if (r.failed) out.push({ kind: "request-failed", atMs: r.startMs, text: requestText(r) });
    else if (r.durationMs >= SLOW_REQUEST_MS) out.push({ kind: "request-slow", atMs: r.startMs, text: `${r.method} ${r.path.split("?")[0]} took ${(r.durationMs / 1000).toFixed(1)} s` });
  }
  // Repeated identical errors (a polling wait) are one fact with a count.
  const groups = new Map<string, { first: number; count: number }>();
  for (const c of commands) {
    if (!c.failed || !inWindow(c.startMs, w)) continue;
    const key = c.error ?? "command failed";
    const g = groups.get(key);
    if (g) g.count += 1;
    else groups.set(key, { first: c.startMs, count: 1 });
  }
  for (const [error, g] of groups) out.push({ kind: "command-failed", atMs: g.first, text: g.count > 1 ? `${g.count}× ${error}` : error });
  return out.sort((a, b) => a.atMs - b.atMs);
}

export interface SessionEvent {
  kind: "command" | "request";
  atMs: number;
  text: string;
  failed: boolean;
}

/** The last `n` commands and requests that started in the window, oldest first: what led up to the end. */
export function eventsBefore(w: Window, commands: Command[], rows: NetworkRow[], n: number): SessionEvent[] {
  const all: SessionEvent[] = [
    ...commands.filter((c) => inWindow(c.startMs, w)).map<SessionEvent>((c) => ({ kind: "command", atMs: c.startMs, text: `${c.method} ${c.path}${c.error ? ` — ${c.error}` : ""}`, failed: c.failed })),
    ...rows.filter((r) => inWindow(r.startMs, w)).map<SessionEvent>((r) => ({ kind: "request", atMs: r.startMs, text: requestText(r), failed: r.failed })),
  ].sort((a, b) => a.atMs - b.atMs);
  return all.slice(-n);
}

// --- timeline ----------------------------------------------------------------------------------

export interface Bucket {
  startMs: number;
  endMs: number;
  total: number;
  bad: number;
}

export interface TimelineTest {
  key: string;
  name: string;
  status: NormStatus;
  startMs: number;
  endMs: number;
}

export interface Timeline {
  startMs: number;
  endMs: number;
  tests: TimelineTest[];
  network: Bucket[];
  commands: Bucket[];
}

function bucketize(items: { ms: number; bad: boolean }[], startMs: number, endMs: number, n: number): Bucket[] {
  const width = (endMs - startMs) / n;
  const buckets: Bucket[] = Array.from({ length: n }, (_, i) => ({ startMs: startMs + i * width, endMs: startMs + (i + 1) * width, total: 0, bad: 0 }));
  for (const it of items) {
    const b = buckets[Math.min(n - 1, Math.max(0, Math.floor((it.ms - startMs) / width)))];
    if (!b) continue;
    b.total += 1;
    if (it.bad) b.bad += 1;
  }
  return buckets;
}

export function buildTimeline(input: { tests: FlatTest[]; rows: NetworkRow[]; commands: Command[]; buckets: number }): Timeline {
  const tests: TimelineTest[] = [];
  for (const t of input.tests) {
    const w = windowOf(t);
    if (w) tests.push({ key: t.key, name: t.name, status: t.status, startMs: w.startMs, endMs: Math.max(w.endMs, w.startMs + 1) });
  }
  tests.sort((a, b) => a.startMs - b.startMs);
  const starts = [...tests.map((t) => t.startMs), ...input.rows.map((r) => r.startMs), ...input.commands.map((c) => c.startMs)];
  const ends = [...tests.map((t) => t.endMs), ...input.rows.map((r) => r.startMs + r.durationMs), ...input.commands.map((c) => c.endMs ?? c.startMs)];
  let startMs = starts.length ? Math.min(...starts) : 0;
  let endMs = ends.length ? Math.max(...ends) : 1;
  const pad = Math.max(500, (endMs - startMs) * 0.02);
  startMs -= pad;
  endMs += pad;
  return {
    startMs,
    endMs,
    tests,
    network: bucketize(input.rows.map((r) => ({ ms: r.startMs, bad: r.failed })), startMs, endMs, input.buckets),
    commands: bucketize(input.commands.map((c) => ({ ms: c.startMs, bad: c.failed })), startMs, endMs, input.buckets),
  };
}

// --- assembling fetched logs -------------------------------------------------------------------

type LogOutcome<T> = { status: "ok"; data: T } | { status: "missing"; reason: string } | { status: "error"; error: Error };

/** The logs `TestReportingClient.getTestSessionLogs` returns, as far as the deep-dive reads them. */
export interface FetchedLogs {
  text?: LogOutcome<string>;
  appium?: LogOutcome<string>;
  console?: LogOutcome<string>;
  network?: LogOutcome<HarArchive>;
}

export interface LogNote {
  kind: string;
  message: string;
}

export interface SessionEvidence {
  lines: LogLine[];
  commands: Command[];
  rows: NetworkRow[];
  consoleText: string | undefined;
  /** Why a log is absent. A missing log is normal (e.g. network logs not captured); it is shown, not hidden. */
  notes: LogNote[];
}

export function sessionEvidence(logs: FetchedLogs): SessionEvidence {
  const notes: LogNote[] = [];
  const read = <T>(kind: string, result: LogOutcome<T> | undefined): T | undefined => {
    if (!result) return undefined;
    if (result.status === "ok") return result.data;
    notes.push({ kind, message: result.status === "missing" ? result.reason : result.error.message });
    return undefined;
  };
  const text = read("text", logs.text);
  const appium = read("appium", logs.appium);
  const har = read("network", logs.network);
  const consoleText = read("console", logs.console);
  const lines = text !== undefined ? parseTextLog(text) : appium !== undefined ? parseAppiumLog(appium) : [];
  return { lines, commands: commandsFromLog(lines), rows: har ? toNetworkRows(har) : [], consoleText, notes };
}
