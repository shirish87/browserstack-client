import type { StatusStats } from "./schemas";

/** TRA durations (builds and tests) are milliseconds. */
export function formatDuration(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms)) return "—";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const totalSeconds = Math.round(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function formatRelative(iso: string | null | undefined, now: Date = new Date()): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Math.round((now.getTime() - d.getTime()) / 1000);
  const abs = Math.abs(diff);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [2592000, "day"],
    [31536000, "month"],
  ];
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  let divisor = 1;
  for (const [limit, unit] of units) {
    if (abs < limit) return rtf.format(-Math.round(diff / divisor), unit);
    divisor = limit;
  }
  return rtf.format(-Math.round(diff / 31536000), "year");
}

/** Test counts folded into the five outcomes the UI shows. */
export interface Outcomes {
  passed: number;
  failed: number;
  pending: number;
  skipped: number;
  unknown: number;
}

/**
 * TRA reports a wider vocabulary than the UI draws: unfinished work (`in progress`, `untested`, `retest`)
 * counts as pending, `timeout` as a failure and `blocked` as skipped.
 */
export function outcomes(s: StatusStats | null | undefined): Outcomes {
  const n = (v: number | null | undefined): number => v ?? 0;
  return {
    passed: n(s?.passed),
    failed: n(s?.failed) + n(s?.timeout),
    pending: n(s?.pending) + n(s?.["in progress"]) + n(s?.untested) + n(s?.retest),
    skipped: n(s?.skipped) + n(s?.blocked),
    unknown: n(s?.unknown),
  };
}

export function totalTests(stats: StatusStats | null | undefined): number {
  const o = outcomes(stats);
  return o.passed + o.failed + o.pending + o.skipped + o.unknown;
}

export function passRate(stats: StatusStats | null | undefined): number | null {
  const o = outcomes(stats);
  const executed = o.passed + o.failed;
  return executed === 0 ? null : o.passed / executed;
}

export function formatPercent(ratio: number | null): string {
  return ratio == null ? "—" : `${Math.round(ratio * 1000) / 10}%`;
}
