import { z } from "zod";

/** The Test Management case fields the dashboard reads. Everything else the API sends is ignored. */
const CaseSchema = z.object({
  identifier: z.string(),
  title: z.string().nullish().transform((v) => v ?? ""),
  caseType: z.string().nullish(),
  automationStatus: z.string().nullish(),
  priority: z.string().nullish(),
  status: z.string().nullish(),
  owner: z.string().nullish(),
  createdAt: z.string().nullish(),
  tags: z.array(z.string()).nullish().transform((v) => v ?? []),
  urls: z.object({ self: z.string().nullish() }).nullish(),
});

export const TmCasesSchema = z.array(CaseSchema).transform((cases) => cases.map((c) => ({ ...c, url: c.urls?.self ?? undefined })));
export type TmCase = Omit<z.output<typeof CaseSchema>, "urls"> & { url: string | undefined };

const RunSchema = z.object({
  identifier: z.string(),
  name: z.string().nullish().transform((v) => v ?? ""),
  runState: z.string().nullish(),
  activeState: z.string().nullish(),
  assignee: z.string().nullish(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
  urls: z.object({ self: z.string().nullish() }).nullish(),
});
export const TmRunsSchema = z.array(RunSchema);
export type TmRun = z.output<typeof RunSchema>;

export const TmProjectsSchema = z.array(z.object({ name: z.string(), identifier: z.string() }));

export interface Tally {
  label: string;
  count: number;
}

/** Counts by a field; a missing value is its own "Not set" bucket. Biggest first, then by name. */
export function tallyBy(cases: TmCase[], pick: (c: TmCase) => string | null | undefined): Tally[] {
  const m = new Map<string, number>();
  for (const c of cases) {
    const label = pick(c) || "Not set";
    m.set(label, (m.get(label) ?? 0) + 1);
  }
  return [...m].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export interface Coverage {
  total: number;
  automated: number;
  automatedRatio: number | null;
}

export function coverageOf(cases: TmCase[]): Coverage {
  const automated = cases.filter((c) => c.automationStatus === "automated").length;
  return { total: cases.length, automated, automatedRatio: cases.length ? automated / cases.length : null };
}
