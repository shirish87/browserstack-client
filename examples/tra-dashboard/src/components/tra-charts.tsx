import { useMemo } from "react";
import { areaY, barX, barY, cell, colorLegend, defineChart, dot, lineY, ruleY, stack } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { tooltip } from "@tanstack/charts/tooltip";
import { Chart } from "@tanstack/charts/react";
import { buildLabels, type BuildPoint } from "@/lib/analytics";
import { formatDuration, formatPercent } from "@/lib/format";
import type { NormStatus } from "@/lib/hierarchy";

/** Outcome colours used everywhere a chart encodes pass/fail; the legend and tooltip always say it in words too. */
export const OUTCOME_COLORS = { Passed: "var(--success)", Failed: "var(--danger)", Skipped: "var(--ink-subtle, #8a8f98)", Running: "var(--warning)" } as const;
const OUTCOMES = Object.keys(OUTCOME_COLORS);
const OUTCOME_RANGE = Object.values(OUTCOME_COLORS);

export function statusWord(s: NormStatus): string {
  return s === "pending" ? "Running" : s.charAt(0).toUpperCase() + s.slice(1);
}

interface BuildRow {
  id: string;
  label: string;
  startedAt: string;
  passRate: number | null;
  durationS: number;
  status: string;
}

const rowsOf = (series: BuildPoint[]): BuildRow[] => {
  const labels = buildLabels(series);
  return series.map((p, i) => ({
    id: p.buildId,
    label: labels[i] ?? p.buildId.slice(0, 6),
    startedAt: p.startedAt ?? "",
    passRate: p.passRate,
    durationS: (p.durationMs ?? 0) / 1000,
    status: statusWord(p.status),
  }));
};

/** Pass rate per build: an area under a line, with every build a point coloured by its status. */
export function PassRateChart({ series, onOpen }: { series: BuildPoint[]; onOpen: (buildId: string) => void }) {
  const rows = useMemo(() => rowsOf(series).filter((r) => r.passRate !== null), [series]);
  const definition = useMemo(
    () =>
      defineChart({
        marks: [
          areaY(rows, { x: "label", y: "passRate", fillOpacity: 0.12 }),
          lineY(rows, { x: "label", y: "passRate", strokeWidth: 1.5 }),
          dot(rows, { x: "label", y: "passRate", color: "status", r: 4 }),
        ],
        scales: {
          x: { scale: () => scalePoint<string>().padding(0.3) },
          y: { scale: scaleLinear, nice: true, grid: true, axis: { label: "Pass rate", ticks: { format: (v: number) => formatPercent(v) } } },
        },
        color: { domain: OUTCOMES, range: OUTCOME_RANGE, legend: colorLegend({ label: "Build status" }) },
        tooltip,
      }),
    [rows],
  );
  return <Chart definition={definition} height={240} ariaLabel={`Pass rate across ${rows.length} builds`} onSelect={(p) => { if (p) onOpen(p.datum.id); }} />;
}

/** Passed / failed / skipped tests per build, stacked, so volume and mix read together. */
export function OutcomesChart({ series, onOpen }: { series: BuildPoint[]; onOpen: (buildId: string) => void }) {
  const labels = useMemo(() => buildLabels(series), [series]);
  const rows = useMemo(
    () =>
      series.flatMap((p, i) => {
        const label = labels[i] ?? p.buildId.slice(0, 6);
        return [
          { id: p.buildId, label, outcome: "Passed", tests: p.stats.passed },
          { id: p.buildId, label, outcome: "Failed", tests: p.stats.failed },
          { id: p.buildId, label, outcome: "Skipped", tests: p.stats.skipped },
        ];
      }),
    [series, labels],
  );
  const definition = useMemo(
    () =>
      defineChart({
        marks: [barY(rows, { x: "label", y: "tests", color: "outcome", layout: stack({ order: ["Passed", "Failed", "Skipped"] }) }), ruleY([0])],
        scales: {
          x: { scale: () => scaleBand<string>().padding(0.25) },
          y: { scale: scaleLinear, grid: true, axis: { label: "Tests" } },
        },
        color: { domain: OUTCOMES, range: OUTCOME_RANGE, legend: colorLegend({ label: "Outcome" }) },
        tooltip,
      }),
    [rows],
  );
  return <Chart definition={definition} height={240} ariaLabel={`Test outcomes for ${series.length} builds`} onSelect={(p) => { if (p) onOpen(p.datum.id); }} />;
}

/** Duration per build; a dashed rule marks the average, and failed builds are red. */
export function DurationChart({ series, onOpen }: { series: BuildPoint[]; onOpen: (buildId: string) => void }) {
  const rows = useMemo(() => rowsOf(series), [series]);
  const avg = rows.length ? rows.reduce((a, r) => a + r.durationS, 0) / rows.length : 0;
  const definition = useMemo(
    () =>
      defineChart({
        marks: [barY(rows, { x: "label", y: "durationS", color: "status" }), ruleY([avg], { strokeDasharray: "4 4" })],
        scales: {
          x: { scale: () => scaleBand<string>().padding(0.25) },
          y: { scale: scaleLinear, nice: true, grid: true, axis: { label: "Duration", ticks: { format: (v: number) => formatDuration(v * 1000) } } },
        },
        color: { domain: OUTCOMES, range: OUTCOME_RANGE, legend: colorLegend({ label: "Build status" }) },
        tooltip,
      }),
    [rows, avg],
  );
  return <Chart definition={definition} height={240} ariaLabel={`Duration of ${rows.length} builds, average ${formatDuration(avg * 1000)}`} onSelect={(p) => { if (p) onOpen(p.datum.id); }} />;
}

/** Failure categories, ranked. */
export function CategoryChart({ categories }: { categories: [string, number][] }) {
  const rows = useMemo(() => categories.map(([category, failures]) => ({ category, failures })), [categories]);
  const definition = useMemo(
    () =>
      defineChart({
        marks: [barX(rows, { x: "failures", y: "category", fill: "var(--danger)" })],
        scales: {
          x: { scale: scaleLinear, grid: true, axis: { label: "Failures" } },
          y: { scale: () => scaleBand<string>().domain(rows.map((r) => r.category)).padding(0.3) },
        },
        tooltip,
      }),
    [rows],
  );
  return <Chart definition={definition} height={Math.max(120, rows.length * 36 + 48)} ariaLabel={`Failures across ${rows.length} categories`} />;
}

export interface HeatCell {
  test: string;
  build: string;
  state: "Passed" | "Failed" | "Flaky" | "Skipped" | "Not run";
}

const HEAT_STATES = ["Passed", "Flaky", "Failed", "Skipped", "Not run"];
const HEAT_RANGE = ["var(--success)", "var(--warning)", "var(--danger)", "var(--ink-subtle, #8a8f98)", "transparent"];

/** Tests (rows) by builds (columns): where failures and flakiness cluster, and whether they started at one build. */
export function TestHeatmap({ cells, tests, builds }: { cells: HeatCell[]; tests: string[]; builds: string[] }) {
  const definition = useMemo(
    () =>
      defineChart({
        marks: [cell(cells, { x: "build", y: "test", color: "state", inset: 1 })],
        scales: {
          x: { scale: () => scaleBand<string>().domain(builds).padding(0.04), axis: { label: "Build (oldest → newest)" } },
          y: { scale: () => scaleBand<string>().domain(tests).padding(0.04) },
        },
        color: { domain: HEAT_STATES, range: HEAT_RANGE, legend: colorLegend({ label: "Result" }) },
        tooltip,
      }),
    [cells, tests, builds],
  );
  return <Chart definition={definition} height={Math.max(160, tests.length * 28 + 90)} ariaLabel={`Result of ${tests.length} tests across ${builds.length} builds`} />;
}

/** A ranked tally (cases by status, type, priority) as horizontal bars. */
export function TallyChart({ tally, label }: { tally: { label: string; count: number }[]; label: string }) {
  const definition = useMemo(
    () =>
      defineChart({
        marks: [barX(tally, { x: "count", y: "label", fill: "var(--primary)" })],
        scales: {
          x: { scale: scaleLinear, grid: true, axis: { label: "Count", ticks: { format: (v: number) => (Number.isInteger(v) ? String(v) : "") } } },
          y: { scale: () => scaleBand<string>().domain(tally.map((t) => t.label)).padding(0.3) },
        },
        tooltip,
      }),
    [tally],
  );
  return <Chart definition={definition} height={Math.max(120, tally.length * 34 + 48)} ariaLabel={label} />;
}

/** Compact pass-rate trend for a project card: no axes, failed builds marked in red. */
export function PassSparkline({ points, label }: { points: { value: number | null; failed: boolean }[]; label: string }) {
  const rows = useMemo(
    () => points.flatMap((p, i) => (p.value === null ? [] : [{ n: i + 1, passRate: p.value, status: p.failed ? "Failed" : "Passed" }])),
    [points],
  );
  const definition = useMemo(
    () =>
      defineChart({
        marks: [lineY(rows, { x: "n", y: "passRate", strokeWidth: 1.5 }), dot(rows, { x: "n", y: "passRate", color: "status", r: 2.5 })],
        scales: {
          x: { scale: () => scalePoint<number>().padding(0.2), axis: false },
          y: { scale: scaleLinear, domain: [0, 1], axis: false },
        },
        color: { domain: OUTCOMES, range: OUTCOME_RANGE },
        tooltip,
      }),
    [rows],
  );
  return (
    <div className="w-32">
      <Chart definition={definition} height={44} ariaLabel={label} />
    </div>
  );
}

const SERIES_COLORS = ["var(--primary)", "var(--warning)", "var(--success)", "var(--danger)"];

/** One or more metrics over seconds-since-start. `null` samples are skipped, so a gap is a gap and never a zero. */
export function MetricChart<T extends { t: number }>({
  rows,
  series,
  yLabel,
  height = 200,
}: {
  rows: T[];
  series: { key: keyof T & string; label: string }[];
  yLabel: string;
  height?: number;
}) {
  const long = useMemo(
    () => series.flatMap((s) => rows.flatMap((r) => { const value = r[s.key]; return typeof value === "number" ? [{ t: r.t, value, series: s.label }] : []; })),
    [rows, series],
  );
  const definition = useMemo(
    () =>
      defineChart({
        marks: series.map((s) => lineY(long.filter((d) => d.series === s.label), { x: "t", y: "value", color: "series", strokeWidth: 1.5 })),
        scales: {
          x: { scale: scaleLinear, axis: { label: "Seconds into the session" } },
          y: { scale: scaleLinear, nice: true, grid: true, axis: { label: yLabel } },
        },
        color: { domain: series.map((s) => s.label), range: SERIES_COLORS.slice(0, series.length), legend: colorLegend({ label: yLabel }) },
        tooltip,
      }),
    [long, series, yLabel],
  );
  return <Chart definition={definition} height={height} ariaLabel={`${yLabel} over the session`} />;
}
