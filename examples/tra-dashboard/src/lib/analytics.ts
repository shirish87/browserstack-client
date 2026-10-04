import type { Failure, LinkedCase, NormStatus, Platform, TestNode } from "./hierarchy";
import { normalizeStatus } from "./hierarchy";
import { outcomes, type Outcomes } from "./format";
import type { IdentifiedBuild, StatusStats } from "./schemas";

const SEP = " › ";

export interface FlatTest {
  /** Stable identity across runs: the full suite path. */
  key: string;
  name: string;
  path: string[];
  status: NormStatus;
  durationMs: number | null;
  isFlaky: boolean;
  isNewFailure: boolean;
  retries: number | null;
  failures: Failure[];
  /** TRA node type: TEST or HOOK. */
  type: string;
  startedAt: string | undefined;
  /** Automate / App Automate session this test ran in (shared by the tests of one file). */
  sessionId: string | undefined;
  platform: Platform;
  testCases: LinkedCase[];
  muted: boolean;
  runCount: number | null;
  tags: string[];
  autoAnalyzed: boolean;
}

/** A leaf of the normalized tree as a flat row. */
export function toFlatTest(node: TestNode, path: string[]): FlatTest {
  return {
    key: path.join(SEP),
    name: node.name,
    path,
    status: node.status,
    durationMs: node.durationMs,
    isFlaky: node.isFlaky,
    isNewFailure: node.isNewFailure,
    retries: node.retries,
    failures: node.failures,
    type: node.type,
    startedAt: node.startedAt,
    sessionId: node.sessionId,
    platform: node.platform,
    testCases: node.testCases,
    muted: node.muted,
    runCount: node.runCount,
    tags: node.tags,
    autoAnalyzed: node.autoAnalyzed,
  };
}

export function flattenTests(nodes: TestNode[], parents: string[] = []): FlatTest[] {
  const out: FlatTest[] = [];
  for (const node of nodes) {
    const path = [...parents, node.name];
    if (node.children.length === 0) {
      out.push(toFlatTest(node, path));
    } else {
      out.push(...flattenTests(node.children, path));
    }
  }
  return out;
}

// --- run comparison ------------------------------------------------------------------------

export interface TestChange {
  key: string;
  name: string;
  path: string[];
  base: FlatTest | undefined;
  head: FlatTest | undefined;
}

export interface Slowdown extends TestChange {
  deltaMs: number;
  ratio: number;
}

export interface RunDiff {
  newFailures: TestChange[];
  fixed: TestChange[];
  stillFailing: TestChange[];
  newlyFlaky: TestChange[];
  added: FlatTest[];
  removed: FlatTest[];
  slower: Slowdown[];
}

/** A test must be at least this much slower, in both absolute and relative terms, to be reported. */
const SLOWDOWN_MIN_MS = 1000;
const SLOWDOWN_MIN_RATIO = 1.5;

export function diffRuns(base: FlatTest[], head: FlatTest[]): RunDiff {
  const baseByKey = new Map(base.map((t) => [t.key, t]));
  const headByKey = new Map(head.map((t) => [t.key, t]));
  const diff: RunDiff = { newFailures: [], fixed: [], stillFailing: [], newlyFlaky: [], added: [], removed: [], slower: [] };

  for (const h of head) {
    const b = baseByKey.get(h.key);
    const change: TestChange = { key: h.key, name: h.name, path: h.path, base: b, head: h };
    if (!b) diff.added.push(h);
    if (h.status === "failed") {
      if (b?.status === "failed") diff.stillFailing.push(change);
      else diff.newFailures.push(change);
    } else if (b?.status === "failed" && h.status === "passed") {
      diff.fixed.push(change);
    }
    if (b && h.isFlaky && !b.isFlaky) diff.newlyFlaky.push(change);
    if (!b) {
      if (h.isFlaky) diff.newlyFlaky.push(change);
      continue;
    }
    if (b.durationMs != null && h.durationMs != null && b.status === "passed" && h.status === "passed" && b.durationMs > 0) {
      const deltaMs = h.durationMs - b.durationMs;
      const ratio = h.durationMs / b.durationMs;
      if (deltaMs >= SLOWDOWN_MIN_MS && ratio >= SLOWDOWN_MIN_RATIO) diff.slower.push({ ...change, deltaMs, ratio });
    }
  }
  for (const b of base) if (!headByKey.has(b.key)) diff.removed.push(b);
  diff.slower.sort((x, y) => y.deltaMs - x.deltaMs);
  return diff;
}

// --- trends --------------------------------------------------------------------------------

export interface BuildPoint {
  buildId: string;
  buildNumber: number | null;
  name: string | null;
  startedAt: string | null;
  status: NormStatus;
  stats: Outcomes;
  total: number;
  failed: number;
  /** passed ÷ (passed + failed); null when nothing executed. */
  passRate: number | null;
  /** Milliseconds. */
  durationMs: number | null;
}

const sum = (s: Outcomes): number => s.passed + s.failed + s.pending + s.skipped + s.unknown;

export function toSeries(builds: IdentifiedBuild[]): BuildPoint[] {
  return builds
    .map<BuildPoint>((b) => {
      const s = outcomes(b.statusStats);
      const executed = s.passed + s.failed;
      return {
        buildId: b.buildId,
        buildNumber: b.buildNumber ?? null,
        name: b.name ?? null,
        startedAt: b.startedAt ?? null,
        status: normalizeStatus(b.status),
        stats: s,
        total: sum(s),
        failed: s.failed,
        passRate: executed > 0 ? s.passed / executed : null,
        durationMs: b.duration ?? null,
      };
    })
    .sort((a, b) => Date.parse(a.startedAt ?? "") - Date.parse(b.startedAt ?? ""));
}

export interface Summary {
  count: number;
  passRate: number | null;
  /** Mean pass rate of the newer half minus the older half (positive = improving). */
  passRateDelta: number | null;
  /** Milliseconds. */
  avgDurationMs: number | null;
  failedBuilds: number;
  buildFailRate: number | null;
}

function pooledPassRate(points: BuildPoint[]): number | null {
  let passed = 0;
  let executed = 0;
  for (const p of points) {
    passed += p.stats.passed;
    executed += p.stats.passed + p.stats.failed;
  }
  return executed > 0 ? passed / executed : null;
}

export function summarize(points: BuildPoint[]): Summary {
  const finished = points.filter((p) => p.status !== "pending");
  const durations = finished.map((p) => p.durationMs).filter((d): d is number => d != null && d >= 0);
  const failedBuilds = finished.filter((p) => p.status === "failed").length;
  const mid = Math.floor(points.length / 2);
  const older = pooledPassRate(points.slice(0, mid));
  const newer = pooledPassRate(points.slice(points.length - mid));
  return {
    count: points.length,
    passRate: pooledPassRate(points),
    passRateDelta: mid > 0 && older != null && newer != null ? newer - older : null,
    avgDurationMs: durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : null,
    failedBuilds,
    buildFailRate: finished.length ? failedBuilds / finished.length : null,
  };
}

export interface TestHealth {
  key: string;
  name: string;
  path: string[];
  runs: number;
  failedRuns: number;
  flakyRuns: number;
  lastError: string | undefined;
}

/** `runs` are ordered newest first; `lastError` is the most recent failure message. */
export function aggregateTestHealth(runs: FlatTest[][]): TestHealth[] {
  const byKey = new Map<string, TestHealth>();
  for (const run of runs) {
    for (const t of run) {
      let h = byKey.get(t.key);
      if (!h) {
        h = { key: t.key, name: t.name, path: t.path, runs: 0, failedRuns: 0, flakyRuns: 0, lastError: undefined };
        byKey.set(t.key, h);
      }
      h.runs += 1;
      if (t.status === "failed") {
        h.failedRuns += 1;
        h.lastError ??= t.failures.find((f) => f.error)?.error ?? undefined;
      }
      if (t.isFlaky) h.flakyRuns += 1;
    }
  }
  return [...byKey.values()]
    .filter((h) => h.failedRuns > 0 || h.flakyRuns > 0)
    .sort((a, b) => b.failedRuns - a.failedRuns || b.flakyRuns - a.flakyRuns || a.key.localeCompare(b.key));
}

/** The longest shared prefix of the names, cut back to a word boundary; empty for fewer than two names. */
function commonPrefix(names: string[]): string {
  if (names.length < 2) return "";
  let p = names[0] ?? "";
  for (const n of names) while (p && !n.startsWith(p)) p = p.slice(0, -1);
  const cut = p.lastIndexOf(" ");
  return cut > 0 ? p.slice(0, cut + 1) : "";
}

/** One unique, human label per build (chart categories must be unique): `#n`, else `name #n`, else `name #n (id)`. */
export function buildLabels(builds: Pick<BuildPoint, "buildId" | "buildNumber" | "name">[]): string[] {
  const prefix = commonPrefix(builds.map((b) => b.name ?? ""));
  const nameOf = (b: (typeof builds)[number]): string => (b.name ?? "").slice(prefix.length).trim();
  const short = (b: (typeof builds)[number]): string => (b.buildNumber != null ? `#${b.buildNumber}` : b.buildId.slice(0, 6));
  const count = (labels: string[]): Map<string, number> => labels.reduce((m, l) => m.set(l, (m.get(l) ?? 0) + 1), new Map<string, number>());
  const first = builds.map(short);
  const dup1 = count(first);
  const second = builds.map((b, i) => ((dup1.get(first[i] ?? "") ?? 0) > 1 && nameOf(b) ? `${nameOf(b)} ${short(b)}` : short(b)));
  const dup2 = count(second);
  return builds.map((b, i) => ((dup2.get(second[i] ?? "") ?? 0) > 1 ? `${second[i]} (${b.buildId.slice(0, 4)})` : (second[i] ?? short(b))));
}

export type HeatState = "Passed" | "Failed" | "Flaky" | "Skipped" | "Not run";

export interface Heatmap {
  /** Columns, oldest first. */
  builds: string[];
  /** Rows, worst first, capped at `limit`. */
  tests: string[];
  cells: { test: string; build: string; state: HeatState }[];
}

/**
 * Tests (rows) by builds (columns). `runs` and `labels` are newest first, like `aggregateTestHealth`; only tests
 * that failed or were flaky somewhere appear, ranked by that history, so a clean suite is not a wall of green.
 */
export function heatmapOf(runs: FlatTest[][], labels: string[], limit: number): Heatmap {
  const health = aggregateTestHealth(runs).slice(0, limit);
  const names = new Map<string, number>();
  for (const h of health) names.set(h.name, (names.get(h.name) ?? 0) + 1);
  /** Rows are named by the test; the full path only when two tests share a name. */
  const rowOf = new Map(health.map((h) => [h.key, (names.get(h.name) ?? 0) > 1 ? h.key : h.name]));
  const tests = health.map((h) => rowOf.get(h.key) ?? h.key);
  const wanted = new Set(health.map((h) => h.key));
  const builds = [...labels].reverse();
  const cells: Heatmap["cells"] = [];
  runs.forEach((run, i) => {
    const build = labels[i];
    if (build === undefined) return;
    const byKey = new Map(run.map((t) => [t.key, t]));
    for (const key of wanted) {
      const test = rowOf.get(key) ?? key;
      const t = byKey.get(key);
      const state: HeatState = !t ? "Not run" : t.status === "failed" ? "Failed" : t.isFlaky ? "Flaky" : t.status === "passed" ? "Passed" : "Skipped";
      cells.push({ test, build, state });
    }
  });
  return { builds, tests, cells };
}

// --- live runs -----------------------------------------------------------------------------

export function runProgress(raw: StatusStats | null | undefined): { done: number; total: number; fraction: number } {
  const stats = outcomes(raw);
  const total = sum(stats);
  const done = total - stats.pending;
  return { done, total, fraction: total > 0 ? done / total : 0 };
}

/** Linear extrapolation; unreliable before ~5% progress, so withheld until then. */
export function estimateRemainingSec(fraction: number, elapsedSec: number): number | null {
  if (fraction < 0.05) return null;
  if (fraction >= 1) return 0;
  return Math.round(elapsedSec / fraction - elapsedSec);
}

/** TRA's `date_range` is "startEpochMs,endEpochMs". */
export function buildDateRange(days: number, now: Date = new Date()): string {
  const end = now.getTime();
  return `${end - days * 86_400_000},${end}`;
}

export type Health = "healthy" | "watch" | "at-risk" | "none";

/** Pass-rate bands used for the portfolio health label. */
export function healthOf(passRate: number | null): Health {
  if (passRate === null) return "none";
  if (passRate >= 0.95) return "healthy";
  if (passRate >= 0.85) return "watch";
  return "at-risk";
}
