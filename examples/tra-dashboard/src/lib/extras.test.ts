import { describe, expect, it } from "vitest";
import { parallelUsage, profilingSeries, telemetryDownloadUrl, profilingV2Rows, sessionInsights, videoOffsetSec } from "./extras";
import { sessionEvidence } from "./session";

const sample = (ts: number, over: Record<string, unknown> = {}) => ({ ts, cpu: 10, mem: 7000, mema: 4000, batt: 84, temp: 22.6, ...over });

describe("profilingSeries", () => {
  it("makes seconds-from-start rows for device CPU, memory, battery and temperature", () => {
    const s = profilingSeries([sample(1000, { cpu: 28 }), sample(1002, { cpu: 47, batt: 83 })]);
    expect(s.rows.map((r) => r.t)).toEqual([0, 2]);
    expect(s.rows[1]).toMatchObject({ cpu: 47, battery: 83, temp: 22.6, memFreeMb: 4000, memTotalMb: 7000 });
  });
  it("finds the app under test from `<package>_cpu` keys and reads its CPU, memory and network", () => {
    const s = profilingSeries([
      sample(1, { orgapp_cpu: null, orgapp_mem: null }),
      sample(2, { orgapp_cpu: 13, orgapp_mem: 48.2, orgapp_netr: 5, orgapp_nets: 2 }),
    ]);
    expect(s.app).toBe("orgapp");
    expect(s.rows[0]).toMatchObject({ appCpu: null, appMemMb: null });
    expect(s.rows[1]).toMatchObject({ appCpu: 13, appMemMb: 48.2, netReceived: 5, netSent: 2 });
  });
  it("reports no app when the samples carry none, and an empty series for no samples", () => {
    expect(profilingSeries([sample(1)]).app).toBeUndefined();
    expect(profilingSeries([]).rows).toEqual([]);
  });
});

describe("profilingV2Rows", () => {
  it("shows measured values with their units, skipping the units table itself", () => {
    const rows = profilingV2Rows({ metadata: { device: "Pixel 7" }, data: { units: { app_size: "MB", app_start_time: "ms" }, app_size: 41.5, app_start_time: 820 } });
    expect(rows).toEqual([["App size", "41.5 MB"], ["App start time", "820 ms"]]);
  });
  it("is empty when only units are reported", () => {
    expect(profilingV2Rows({ metadata: {}, data: { units: { cpu: "%" } } })).toEqual([]);
  });
});

describe("parallelUsage", () => {
  it("reports sessions running and queued against their limits", () => {
    expect(parallelUsage({ parallel_sessions_running: 3, parallel_sessions_max_allowed: 5, queued_sessions: 2, queued_sessions_max_allowed: 5 })).toEqual({
      running: 3, maxRunning: 5, queued: 2, maxQueued: 5, saturated: false,
    });
  });
  it("flags saturation when every parallel slot is busy", () => {
    expect(parallelUsage({ parallel_sessions_running: 5, parallel_sessions_max_allowed: 5, queued_sessions: 0, queued_sessions_max_allowed: 5 }).saturated).toBe(true);
  });
});

describe("videoOffsetSec", () => {
  it("is seconds from the session start, never negative", () => {
    expect(videoOffsetSec(Date.parse("2026-10-04T16:00:10Z"), "2026-10-04T16:00:00Z")).toBe(10);
    expect(videoOffsetSec(Date.parse("2026-10-04T15:59:00Z"), "2026-10-04T16:00:00Z")).toBe(0);
  });
  it("is undefined without a usable session start", () => {
    expect(videoOffsetSec(1, undefined)).toBeUndefined();
    expect(videoOffsetSec(1, "nope")).toBeUndefined();
  });
});

describe("sessionInsights", () => {
  it("splits session time into BrowserStack and your own, and ranks capabilities by impact", () => {
    const r = sessionInsights({
      summary: {
        totals: { duration: 19, browserstackTime: 12, userTime: 7 },
        timeBreakdown: { capabilitiesImpact: { topCapabilities: [{ name: "console", impact: "low" }, { name: "networkLogs", impact: "high" }] } },
      },
    });
    expect(r?.parts).toEqual([{ label: "BrowserStack", seconds: 12 }, { label: "Your tests", seconds: 7 }]);
    expect(r?.capabilities.map((c) => c.name)).toEqual(["networkLogs", "console"]);
  });
  it("is undefined when the session has no insights", () => {
    expect(sessionInsights(undefined)).toBeUndefined();
    expect(sessionInsights({})).toBeUndefined();
  });
});

describe("sessionEvidence extra logs", () => {
  it("keeps device, Selenium and Playwright logs for their own tabs", () => {
    const e = sessionEvidence({ device: { status: "ok", data: "d" }, selenium: { status: "ok", data: "s" }, playwright: { status: "missing", reason: "none" } });
    expect(e.extra).toEqual({ device: "d", selenium: "s" });
    expect(e.notes).toContainEqual({ kind: "playwright", message: "none" });
  });
});

describe("telemetryDownloadUrl", () => {
  it("points at the read-only gateway for the session's telemetry archive", () => {
    const url = telemetryDownloadUrl("abc123");
    expect(url.startsWith("/gateway?url=")).toBe(true);
    expect(decodeURIComponent(url.slice("/gateway?url=".length))).toBe("https://api.browserstack.com/automate/sessions/abc123/telemetrylogs");
  });
});
