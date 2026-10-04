import type { StatusStats } from "./schemas";

/** Build durations from TRA are in seconds; test durations in milliseconds. */
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

export function totalTests(stats: StatusStats | undefined): number {
  if (!stats) return 0;
  return stats.passed + stats.failed + stats.pending + stats.skipped + stats.unknown;
}

export function passRate(stats: StatusStats | undefined): number | null {
  const executed = stats ? stats.passed + stats.failed : 0;
  if (!stats || executed === 0) return null;
  return stats.passed / executed;
}

export function formatPercent(ratio: number | null): string {
  return ratio == null ? "—" : `${Math.round(ratio * 1000) / 10}%`;
}
