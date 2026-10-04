import { z } from "zod";
import { humanize } from "./utils";

// --- app profiling (App Automate) ---------------------------------------------------------

/** v1 samples: one object per couple of seconds, with `ts` plus device and per-app metrics under varying keys. */
export const ProfilingSamplesSchema = z.array(z.record(z.string(), z.unknown()));

/** v2: measured values next to a `units` table. */
export const ProfilingV2Schema = z.object({
  metadata: z.record(z.string(), z.unknown()).optional(),
  data: z.object({ units: z.record(z.string(), z.string()).optional() }).catchall(z.unknown()),
});

export interface ProfilingRow {
  /** Seconds since the first sample. */
  t: number;
  cpu: number | null;
  memFreeMb: number | null;
  memTotalMb: number | null;
  battery: number | null;
  temp: number | null;
  appCpu: number | null;
  appMemMb: number | null;
  netReceived: number | null;
  netSent: number | null;
}

const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

export function profilingSeries(samples: Record<string, unknown>[]): { app: string | undefined; rows: ProfilingRow[] } {
  const keys = new Set(samples.flatMap((s) => Object.keys(s)));
  const app = [...keys].find((k) => k.endsWith("_cpu") && k !== "cpu")?.slice(0, -4);
  const t0 = num(samples[0]?.["ts"]) ?? 0;
  const rows = samples.map((s): ProfilingRow => ({
    t: (num(s["ts"]) ?? t0) - t0,
    cpu: num(s["cpu"]),
    memFreeMb: num(s["mema"]),
    memTotalMb: num(s["mem"]),
    battery: num(s["batt"]),
    temp: num(s["temp"]),
    appCpu: app ? num(s[`${app}_cpu`]) : null,
    appMemMb: app ? num(s[`${app}_mem`]) : null,
    netReceived: app ? num(s[`${app}_netr`]) : null,
    netSent: app ? num(s[`${app}_nets`]) : null,
  }));
  return { app, rows };
}

/** v2's measured values (app size, start time, rendering, ...) as labelled rows; nothing when only units came back. */
export function profilingV2Rows(v2: z.infer<typeof ProfilingV2Schema>): [string, string][] {
  const units = v2.data.units ?? {};
  return Object.entries(v2.data)
    .filter(([k, v]) => k !== "units" && (typeof v === "number" || typeof v === "string"))
    .map(([k, v]) => [humanize(k), [String(v), units[k]].filter(Boolean).join(" ")]);
}

// --- account plan ---------------------------------------------------------------------------

export const PlanSchema = z.object({
  parallel_sessions_running: z.number(),
  parallel_sessions_max_allowed: z.number(),
  queued_sessions: z.number(),
  queued_sessions_max_allowed: z.number(),
});

export function parallelUsage(plan: z.infer<typeof PlanSchema>) {
  return {
    running: plan.parallel_sessions_running,
    maxRunning: plan.parallel_sessions_max_allowed,
    queued: plan.queued_sessions,
    maxQueued: plan.queued_sessions_max_allowed,
    saturated: plan.parallel_sessions_max_allowed > 0 && plan.parallel_sessions_running >= plan.parallel_sessions_max_allowed,
  };
}

// --- video ----------------------------------------------------------------------------------

/** Where in a session's video a moment falls: seconds after the session was created. Approximate; setup precedes the first command. */
export function videoOffsetSec(ms: number, sessionStart: string | undefined): number | undefined {
  const start = Date.parse(sessionStart ?? "");
  if (Number.isNaN(start)) return undefined;
  return Math.max(0, Math.round((ms - start) / 1000));
}

// --- Automate session insights ---------------------------------------------------------------

const IMPACT_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };

const InsightsSchema = z.object({
  summary: z.object({
    totals: z.object({ browserstackTime: z.number().optional(), userTime: z.number().optional() }).optional(),
    timeBreakdown: z
      .object({
        capabilitiesImpact: z.object({ topCapabilities: z.array(z.object({ name: z.string(), impact: z.string() })).optional() }).optional(),
      })
      .optional(),
  }).optional(),
});

/** Where an Automate session's time went and which capabilities slow it down, or undefined when none reported. */
export function sessionInsights(raw: unknown) {
  const parsed = InsightsSchema.safeParse(raw);
  const summary = parsed.success ? parsed.data.summary : undefined;
  const totals = summary?.totals;
  if (totals?.browserstackTime === undefined && totals?.userTime === undefined) return undefined;
  const capabilities = [...(summary?.timeBreakdown?.capabilitiesImpact?.topCapabilities ?? [])].sort(
    (a, b) => (IMPACT_RANK[a.impact] ?? 3) - (IMPACT_RANK[b.impact] ?? 3),
  );
  return {
    parts: [
      { label: "BrowserStack", seconds: totals?.browserstackTime ?? 0 },
      { label: "Your tests", seconds: totals?.userTime ?? 0 },
    ],
    capabilities,
  };
}
