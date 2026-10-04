import { useMemo } from "react";
import { areaY, barX, barY, cell, colorLegend, defineChart, dot, lineY, ruleY, stack } from "@tanstack/charts";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { scalePoint } from "@tanstack/charts/scales/point";
import { tooltip } from "@tanstack/charts/tooltip";
import { Chart } from "@tanstack/charts/react";
import { buildLabels, type BuildPoint } from "@/lib/analytics";
import { formatDuration, formatPercent } from "@/lib/format";
import { statusWord } from "@/components/charts";

/** Outcome colours used everywhere a chart encodes pass/fail; the legend and tooltip always say it in words too. */
export const OUTCOME_COLORS = { Passed: "var(--success)", Failed: "var(--danger)", Skipped: "var(--ink-subtle, #8a8f98)", Running: "var(--warning)" } as const;
const OUTCOMES = Object.keys(OUTCOME_COLORS);
const OUTCOME_RANGE = Object.values(OUTCOME_COLORS);

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
