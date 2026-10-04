import { describe, expect, it } from "vitest";
import {
  aggregateTestHealth,
  buildDateRange,
  diffRuns,
  healthOf,
  heatmapOf,
  buildLabels,
  estimateRemainingSec,
  flattenTests,
  runProgress,
  summarize,
  toSeries,
  type FlatTest,
} from "./analytics";
import { normalizeHierarchy } from "./hierarchy";
import { BuildSummarySchema, TestRunNodeSchema } from "@dot-slash/browserstack-test-reporting/models";
import { hasBuildId } from "./schemas";

/** TRA nodes as the client returns them (camelCase): ROOT → DESCRIBE → TEST. */
const node = (type: string, displayName: string, children: unknown[] = [], details: Record<string, unknown> = {}) => ({ type, displayName, children, details });
const leaf = (name: string, status: string, extra: Record<string, unknown> = {}) => node("TEST", name, [], { status, duration: 1000, ...extra });
// Parsed one node at a time: the dashboard and the client may resolve different zod patch versions, which can
// parse the same data but cannot be composed in one schema.
const tree = (nodes: unknown[]) => normalizeHierarchy(nodes.map((n) => TestRunNodeSchema.parse(n)));
const failedAttempt = (...lines: string[]) => ({ retries: [{ status: "failed", duration: 1000, logs: { TEST_FAILURE: lines } }] });

describe("flattenTests", () => {
  it("yields leaves keyed by their path and parses failures", () => {
    const flat = flattenTests(
      tree([node("ROOT", "a.spec", [node("DESCRIBE", "Suite", [leaf("t1", "failed", failedAttempt("boom", "at x"))])])]),
    );
    expect(flat).toHaveLength(1);
    expect(flat[0]?.key).toBe("a.spec › Suite › t1");
    expect(flat[0]?.name).toBe("t1");
    expect(flat[0]?.failures).toEqual([{ error: "boom", backtrace: "at x" }]);
  });
});

const ft = (key: string, status: FlatTest["status"], over: Partial<FlatTest> = {}): FlatTest => ({
  key,
  name: key,
  path: [key],
  status,
  durationMs: 1000,
  isFlaky: false,
  isNewFailure: false,
  retries: null,
  failures: [],
  type: "TEST",
  startedAt: undefined,
  sessionId: undefined,
  platform: {},
  ...over,
});

describe("diffRuns", () => {
  const base = [ft("a", "passed"), ft("b", "failed"), ft("c", "failed"), ft("d", "passed", { durationMs: 1000 }), ft("gone", "passed")];
  const head = [
    ft("a", "failed"),
    ft("b", "passed"),
    ft("c", "failed"),
    ft("d", "passed", { durationMs: 4000 }),
    ft("fresh", "failed"),
    ft("flaky", "passed", { isFlaky: true }),
  ];
  const d = diffRuns(base, head);

  it("classifies regressions and fixes", () => {
    expect(d.newFailures.map((c) => c.key).sort()).toEqual(["a", "fresh"]);
    expect(d.fixed.map((c) => c.key)).toEqual(["b"]);
    expect(d.stillFailing.map((c) => c.key)).toEqual(["c"]);
  });
  it("tracks added/removed tests and new flakiness", () => {
    expect(d.added.map((t) => t.key).sort()).toEqual(["flaky", "fresh"]);
    expect(d.removed.map((t) => t.key)).toEqual(["gone"]);
    expect(d.newlyFlaky.map((c) => c.key)).toEqual(["flaky"]);
  });
  it("finds slowdowns above both thresholds, worst first", () => {
    expect(d.slower).toHaveLength(1);
    expect(d.slower[0]).toMatchObject({ key: "d", deltaMs: 3000, ratio: 4 });
  });
});

describe("series and summary", () => {
  /** Build durations are milliseconds. */
  const mk = (n: number, passed: number, failed: number, started: string, duration = 600_000) =>
    BuildSummarySchema.parse({
      buildId: `b${n}`,
      buildNumber: n,
      status: failed ? "failed" : "passed",
      duration,
      startedAt: started,
      statusStats: { passed, failed, pending: 0, skipped: 0, unknown: 0 },
    });
  const identified = (list: ReturnType<typeof mk>[]) => list.filter(hasBuildId);
  const builds = [mk(3, 90, 10, "2026-10-03T00:00:00Z"), mk(1, 100, 0, "2026-10-01T00:00:00Z"), mk(2, 100, 0, "2026-10-02T00:00:00Z")];
  const series = toSeries(identified(builds));

  it("orders oldest to newest and computes pass rate", () => {
    expect(series.map((p) => p.buildNumber)).toEqual([1, 2, 3]);
    expect(series[2]?.passRate).toBeCloseTo(0.9);
  });
  it("summarizes with a trend delta between halves", () => {
    const s = summarize(series);
    expect(s.count).toBe(3);
    expect(s.failedBuilds).toBe(1);
    expect(s.avgDurationMs).toBe(600_000);
    expect(s.passRate).toBeCloseTo(290 / 300);
    expect(s.passRateDelta).toBeLessThan(0);
  });
  it("handles an empty window", () => {
    expect(summarize([])).toMatchObject({ count: 0, passRate: null, avgDurationMs: null, passRateDelta: null });
  });
});

describe("aggregateTestHealth", () => {
  it("ranks by failing then flaky runs", () => {
    const runs = [
      [ft("x", "failed", { failures: [{ error: "e1" }] }), ft("y", "passed", { isFlaky: true })],
      [ft("x", "failed", { failures: [{ error: "e2" }] }), ft("y", "passed", { isFlaky: true })],
      [ft("x", "passed"), ft("y", "passed")],
    ];
    const h = aggregateTestHealth(runs);
    expect(h[0]).toMatchObject({ key: "x", failedRuns: 2, runs: 3, lastError: "e1" });
    expect(h.find((t) => t.key === "y")).toMatchObject({ flakyRuns: 2, failedRuns: 0 });
  });
});

describe("buildLabels", () => {
  const point = (buildId: string, buildNumber: number | null, name: string | null) => ({ buildId, buildNumber, name });
  it("uses #number when numbers are unique", () => {
    expect(buildLabels([point("a", 1, "x"), point("b", 2, "x")])).toEqual(["#1", "#2"]);
  });
  it("adds the build name when numbers repeat across builds, and never repeats a label", () => {
    const l = buildLabels([point("a", 1, "selenium"), point("b", 1, "playwright"), point("c", 1, "playwright")]);
    expect(l[0]).toBe("selenium #1");
    expect(new Set(l).size).toBe(3);
  });
  it("drops the words every build name shares", () => {
    expect(buildLabels([point("a", 1, "proj selenium"), point("b", 1, "proj appium")])).toEqual(["selenium #1", "appium #1"]);
  });
  it("falls back to a short id without a number", () => {
    expect(buildLabels([point("abcdef123", null, null)])).toEqual(["abcdef"]);
  });
});

describe("heatmapOf", () => {
  const runs = [
    [ft("x", "failed"), ft("y", "passed", { isFlaky: true }), ft("z", "passed")],
    [ft("x", "passed"), ft("y", "passed")],
  ];
  const labels = ["#2", "#1"];

  it("lays out columns oldest to newest and one row per test that ever failed or flaked", () => {
    const h = heatmapOf(runs, labels, 10);
    expect(h.builds).toEqual(["#1", "#2"]);
    expect(h.tests).toEqual(["x", "y"]);
  });

  it("marks flaky before passed, and a test absent from a build as Not run", () => {
    const h = heatmapOf(runs, labels, 10);
    const at = (test: string, build: string) => h.cells.find((c) => c.test === test && c.build === build)?.state;
    expect(at("x", "#2")).toBe("Failed");
    expect(at("y", "#2")).toBe("Flaky");
    expect(at("y", "#1")).toBe("Passed");
    expect(at("x", "#1")).toBe("Passed");
    expect(heatmapOf([[ft("x", "failed")], []], ["#2", "#1"], 10).cells.find((c) => c.build === "#1")?.state).toBe("Not run");
  });

  it("keeps only the worst tests when there are more than the limit", () => {
    const many = [[ft("a", "failed"), ft("b", "failed"), ft("c", "passed", { isFlaky: true })]];
    expect(heatmapOf(many, ["#1"], 2).tests).toHaveLength(2);
  });
});

describe("live run helpers", () => {
  it("computes progress from stats", () => {
    expect(runProgress({ passed: 40, failed: 10, pending: 20, "in progress": 30 })).toEqual({ done: 50, total: 100, fraction: 0.5 });
    expect(runProgress(undefined).fraction).toBe(0);
  });
  it("estimates remaining time only with enough progress", () => {
    expect(estimateRemainingSec(0.5, 120)).toBe(120);
    expect(estimateRemainingSec(0.01, 120)).toBeNull();
    expect(estimateRemainingSec(1, 120)).toBe(0);
  });
  it("builds an epoch-ms date range for the API", () => {
    const now = new Date("2026-10-04T00:00:00Z");
    expect(buildDateRange(7, now)).toBe(`${now.getTime() - 7 * 86_400_000},${now.getTime()}`);
  });
});

describe("healthOf", () => {
  it("bands pass rate", () => {
    expect(healthOf(null)).toBe("none");
    expect(healthOf(0.97)).toBe("healthy");
    expect(healthOf(0.9)).toBe("watch");
    expect(healthOf(0.5)).toBe("at-risk");
  });
});
