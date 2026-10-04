import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HarArchiveSchema } from "@dot-slash/browserstack-automate/models";
import {
  buildTimeline,
  commandsFromLog,
  eventsBefore,
  parseAppiumLog,
  parseDeviceLog,
  parseTextLog,
  signalsIn,
  toNetworkRows,
  windowOf,
  type Command,
  type NetworkRow,
} from "./session";
import type { FlatTest } from "./analytics";

const fixture = (name: string): string => readFileSync(new URL(`../../../../packages/contract-tests/fixtures/${name}`, import.meta.url), "utf8");
const T0 = Date.UTC(2026, 9, 4, 16, 28, 3, 343);

describe("parseTextLog (Automate / App Automate text log)", () => {
  const log = [
    "2026-10-4 16:28:3:343 SESSION_SETUP_TIME {\"initialising_device\":2254}",
    "2026-10-4 16:28:8:271 REQUEST [2026-10-4 16:28:8:271] POST /session {\"capabilities\":{}}",
    "2026-10-4 16:28:9:8 RESPONSE {\"value\":null}",
    "continuation of the previous line",
  ].join("\n");
  const lines = parseTextLog(log);

  it("reads the unpadded UTC timestamp and the tag", () => {
    expect(lines[0]).toMatchObject({ ms: T0, tag: "SESSION_SETUP_TIME" });
    expect(lines[2]).toMatchObject({ ms: Date.UTC(2026, 9, 4, 16, 28, 9, 8), tag: "RESPONSE" });
  });
  it("drops the duplicate bracketed stamp App Automate adds to requests", () => {
    expect(lines[1]?.text).toBe('POST /session {"capabilities":{}}');
  });
  it("attaches stamp-less lines to the line before them", () => {
    expect(lines[3]).toMatchObject({ ms: lines[2]?.ms, tag: "", text: "continuation of the previous line" });
  });
  it("ignores blank lines", () => {
    expect(parseTextLog("\n\n")).toEqual([]);
  });
});

describe("parseAppiumLog and parseDeviceLog", () => {
  it("reads the padded Appium stamp", () => {
    expect(parseAppiumLog("2026-10-04 16:28:03:360 - [HTTP] --> POST /wd/hub/session")[0]).toMatchObject({ ms: T0 + 17, tag: "HTTP", text: "--> POST /wd/hub/session" });
  });
  it("reads logcat lines, taking the year from the session", () => {
    const [l] = parseDeviceLog("10-04 16:28:08.959 I/libc    (12766): SetHeapTaggingLevel", 2026);
    expect(l).toMatchObject({ ms: Date.UTC(2026, 9, 4, 16, 28, 8, 959), tag: "I/libc" });
    expect(l?.text).toContain("SetHeapTaggingLevel");
  });
});

describe("commandsFromLog", () => {
  const lines = parseTextLog(
    [
      "2026-10-4 16:28:8:0 REQUEST POST /session/s1/element {\"using\":\"css selector\",\"value\":\"#a\"}",
      "2026-10-4 16:28:8:80 RESPONSE {\"value\":{\"element-6066\":\"e1\"}}",
      "2026-10-4 16:28:9:0 REQUEST POST /session/s1/element {\"using\":\"css selector\",\"value\":\"#b\"}",
      "2026-10-4 16:28:14:0 RESPONSE {\"value\":{\"error\":\"no such element\",\"message\":\"no such element: Unable to locate element\"}}",
      "2026-10-4 16:28:15:0 REQUEST GET /session/s1/title",
    ].join("\n"),
  );
  const cmds = commandsFromLog(lines);

  it("pairs each request with the response that follows it", () => {
    expect(cmds).toHaveLength(3);
    expect(cmds[0]).toMatchObject({ method: "POST", path: "/session/s1/element", failed: false, durationMs: 80 });
  });
  it("marks a WebDriver error response as failed and keeps its message", () => {
    expect(cmds[1]).toMatchObject({ failed: true, error: "no such element: Unable to locate element", durationMs: 5000 });
  });
  it("keeps a request that never got a response", () => {
    expect(cmds[2]).toMatchObject({ method: "GET", path: "/session/s1/title", durationMs: undefined, failed: false });
  });
});

describe("toNetworkRows on a real HAR capture", () => {
  const har = HarArchiveSchema.parse(JSON.parse(fixture("automate-network-logs.har.json")));
  const rows = toNetworkRows(har);
  it("has one row per entry, ordered by start", () => {
    expect(rows).toHaveLength(2);
    expect(rows[0]!.startMs).toBeLessThanOrEqual(rows[1]!.startMs);
  });
  it("splits time into connect, server wait and transfer", () => {
    const r = rows[0]!;
    // blocked 0 + dns 0 + connect 48 + ssl 42 | wait 21 | send 0 + receive 0 (the first entry of the capture)
    expect(r.phases).toEqual({ connect: 90, wait: 21, transfer: 0 });
    expect(r.durationMs).toBe(69);
  });
  it("reads method, status and a host/path split", () => {
    expect(rows[0]).toMatchObject({ method: "GET", status: 200 });
    expect(rows[0]?.host).toMatch(/\./);
    expect(rows[0]?.path.startsWith("/")).toBe(true);
  });
});

describe("toNetworkRows edge cases", () => {
  const entry = (over: Record<string, unknown>) => ({
    startedDateTime: "2026-10-04T16:00:00.000Z",
    time: 10,
    request: { method: "GET", url: "https://x.test/a?b=1", headers: [], queryString: [] },
    response: { status: 200, statusText: "OK", headers: [], content: { size: 5, mimeType: "text/plain" } },
    timings: { blocked: -1, dns: -1, connect: -1, ssl: -1, send: 0, wait: 10, receive: 0 },
    ...over,
  });
  const rowsOf = (entries: unknown[]) => toNetworkRows(HarArchiveSchema.parse({ log: { version: "1.2", entries } }));

  it("treats HAR's -1 ('not applicable') as zero", () => {
    expect(rowsOf([entry({})])[0]?.phases).toEqual({ connect: 0, wait: 10, transfer: 0 });
  });
  it("flags HTTP errors and requests that never completed (status 0)", () => {
    const rows = rowsOf([entry({ response: { status: 500, statusText: "Internal Server Error", headers: [], content: { size: 0, mimeType: "" } } }), entry({ response: { status: 0, statusText: "", headers: [], content: { size: 0, mimeType: "" }, ErrorMessage: "net::ERR_CONNECTION_RESET" } })]);
    expect(rows.map((r) => r.failed)).toEqual([true, true]);
    expect(rows[1]?.error).toBe("net::ERR_CONNECTION_RESET");
  });
  it("keeps the path with its query and no body", () => {
    const [r] = rowsOf([entry({})]);
    expect(r).toMatchObject({ host: "x.test", path: "/a?b=1" });
    expect(r).not.toHaveProperty("content");
    expect(r).not.toHaveProperty("text");
  });
});

const test = (over: Partial<FlatTest> = {}): FlatTest => ({
  key: "f › s › t",
  name: "t",
  path: ["f", "s", "t"],
  status: "failed",
  durationMs: 2000,
  isFlaky: false,
  isNewFailure: false,
  retries: null,
  failures: [],
  type: "TEST",
  startedAt: "2026-10-04T16:00:10.000Z",
  sessionId: "s1",
  platform: {},
  ...over,
});
const at = (offsetMs: number): number => Date.parse("2026-10-04T16:00:10.000Z") + offsetMs;
const row = (offsetMs: number, over: Partial<NetworkRow> = {}): NetworkRow => ({ id: offsetMs, startMs: at(offsetMs), durationMs: 50, method: "GET", host: "h", path: "/p", status: 200, statusText: "OK", mime: "", sizeBytes: 100, failed: false, error: undefined, phases: { connect: 0, wait: 50, transfer: 0 }, ...over });
const cmd = (offsetMs: number, over: Partial<Command> = {}): Command => ({ startMs: at(offsetMs), endMs: at(offsetMs + 20), durationMs: 20, method: "POST", path: "/element", body: undefined, failed: false, error: undefined, ...over });

describe("windowOf", () => {
  it("is the test's start to start + duration", () => {
    expect(windowOf(test())).toEqual({ startMs: at(0), endMs: at(2000) });
  });
  it("is undefined for a test that never started", () => {
    expect(windowOf(test({ startedAt: undefined }))).toBeUndefined();
    expect(windowOf(test({ startedAt: "nonsense" }))).toBeUndefined();
  });
});

describe("signalsIn: the facts inside a test's window", () => {
  const w = { startMs: at(0), endMs: at(2000) };
  it("lists HTTP errors, never-completed requests and slow requests, in time order", () => {
    const sig = signalsIn(w, [], [row(500, { status: 500, failed: true, method: "POST", path: "/api/orders", durationMs: 640 }), row(100, { status: 0, error: "net::ERR_CONNECTION_RESET", failed: true }), row(300, { durationMs: 4200 }), row(900)]);
    expect(sig.map((s) => s.kind)).toEqual(["request-failed", "request-slow", "request-failed"]);
    expect(sig[2]?.text).toBe("POST /api/orders → 500 (640 ms)");
    expect(sig[0]?.text).toContain("net::ERR_CONNECTION_RESET");
  });
  it("collapses repeated identical command errors into one with a count", () => {
    const e = { failed: true, error: "no such element" };
    const sig = signalsIn(w, [cmd(100, e), cmd(600, e), cmd(1100, e), cmd(1500, { failed: true, error: "stale element" })], []);
    expect(sig.map((s) => s.text)).toEqual(["3× no such element", "stale element"]);
  });
  it("ignores everything outside the window", () => {
    expect(signalsIn(w, [cmd(-5000, { failed: true, error: "x" })], [row(9000, { status: 500, failed: true })])).toEqual([]);
  });
});

describe("eventsBefore: what happened just before a test ended", () => {
  it("merges commands and requests, newest last, limited to the last n in the window", () => {
    const w = { startMs: at(0), endMs: at(2000) };
    const ev = eventsBefore(w, [cmd(100), cmd(1900, { failed: true, error: "boom" })], [row(1000), row(1500)], 3);
    expect(ev.map((e) => e.kind)).toEqual(["request", "request", "command"]);
    expect(ev.at(-1)).toMatchObject({ failed: true, text: expect.stringContaining("boom") });
  });
});

describe("buildTimeline", () => {
  const tests = [test({ key: "a", name: "a", status: "passed", startedAt: "2026-10-04T16:00:10.000Z", durationMs: 1000 }), test({ key: "b", name: "b", status: "failed", startedAt: "2026-10-04T16:00:12.000Z", durationMs: 3000 })];
  const tl = buildTimeline({ tests, rows: [row(0), row(2500, { status: 500, failed: true })], commands: [cmd(10), cmd(2600, { failed: true })], buckets: 10 });

  it("spans the earliest to the latest activity, with one test span each", () => {
    expect(tl.startMs).toBeLessThanOrEqual(at(0));
    expect(tl.endMs).toBeGreaterThanOrEqual(at(5000));
    expect(tl.tests.map((t) => [t.key, t.status])).toEqual([["a", "passed"], ["b", "failed"]]);
  });
  it("buckets requests and commands, counting the failed ones separately", () => {
    expect(tl.network).toHaveLength(10);
    expect(tl.network.reduce((n, b) => n + b.total, 0)).toBe(2);
    expect(tl.network.reduce((n, b) => n + b.bad, 0)).toBe(1);
    expect(tl.commands.reduce((n, b) => n + b.bad, 0)).toBe(1);
  });
  it("copes with no data at all", () => {
    const empty = buildTimeline({ tests: [], rows: [], commands: [], buckets: 4 });
    expect(empty.tests).toEqual([]);
    expect(empty.endMs).toBeGreaterThan(empty.startMs);
  });
});
