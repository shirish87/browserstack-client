import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useTmClient, useTraClient } from "@/lib/auth";
import { coverageOf, tallyBy } from "@/lib/tm";
import { aggregateTestHealth, buildLabels, heatmapOf, summarize, toSeries, type FlatTest } from "@/lib/analytics";
import { formatDate, formatDuration, formatPercent } from "@/lib/format";
import { buildQuery, testsQuery, tmCasesQuery, tmProjectQuery, tmRunsQuery, windowQuery } from "@/lib/queries";
import { traApi } from "@/lib/api";
import { displayValue, errorMessage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabBar } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryChart, TallyChart, DurationChart, OutcomesChart, PassRateChart, TestHeatmap } from "@/components/tra-charts";
import { BuildsTable, buildHref } from "@/components/builds";
import { TestDrawer, type DrawerTest } from "@/components/test-drawer";
import { Breadcrumbs, EmptyState, ErrorState, KeyValue, PageTitle, Stat } from "@/components/common";

const RangeSchema = z.coerce.number().pipe(z.union([z.literal(7), z.literal(30), z.literal(90)]));
const SectionSchema = z.enum(["overview", "test-management", "quality-gate"]);
const RANGES = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
] as const;
const SECTIONS = [
  { value: "overview", label: "Overview" },
  { value: "test-management", label: "Test management" },
  { value: "quality-gate", label: "Quality gate" },
] as const;

/** How many of the newest finished builds feed the failing/flaky analysis (one request each). */
const ANALYSIS_BUILDS = 8;

export function InsightsProjectPage() {
  const { projectId: rawId } = useParams();
  const [params, setParams] = useSearchParams();
  const id = z.coerce.number().int().positive().safeParse(rawId);
  const name = params.get("name") ?? undefined;
  const days = RangeSchema.catch(30).parse(params.get("days"));
  const section = SectionSchema.catch("overview").parse(params.get("section"));

  if (!id.success) return <ErrorState error="Invalid project id" />;
  const set = (k: string, v: string) =>
    setParams((p) => {
      const n = new URLSearchParams(p);
      n.set(k, v);
      return n;
    }, { replace: true });

  return (
    <>
      <Breadcrumbs items={[{ label: "Insights", to: "/insights" }, { label: name ?? `Project ${id.data}` }]} />
      <PageTitle
        title={name ?? `Project ${id.data}`}
        subtitle={<span className="font-mono text-[12px]">ID {id.data}</span>}
        actions={
          section === "overview" ? (
            <TabBar label="Time range" tabs={RANGES} value={String(days)} onChange={(v) => set("days", v)} />
          ) : undefined
        }
      />
      <div className="mb-6">
        <TabBar label="Project sections" tabs={SECTIONS} value={section} onChange={(v) => set("section", v)} />
      </div>
      {section === "overview" ? <Overview projectId={id.data} projectName={name} days={days} /> : section === "test-management" ? <TestManagement projectName={name} /> : <QualityGate projectName={name} />}
    </>
  );
}

function Overview({ projectId, projectName, days }: { projectId: number; projectName: string | undefined; days: 7 | 30 | 90 }) {
  const { client, username } = useTraClient();
  const navigate = useNavigate();
  const q = useQuery(windowQuery(client, username, projectId, days));
  const project = { id: projectId, name: projectName };

  const builds = q.data;
  const series = useMemo(() => toSeries(builds ?? []), [builds]);
  const summary = useMemo(() => summarize(series), [series]);

  if (q.isPending) return <OverviewSkeleton />;
  if (q.isError) return <ErrorState error={q.error} onRetry={() => void q.refetch()} />;
  if (series.length === 0) {
    return <EmptyState title={`No builds in the last ${days} days`} hint="Try a longer range, or report a build to this project." />;
  }

  const unique = buildLabels(series);
  const heatLabels = new Map(series.map((p, i) => [p.buildId, unique[i] ?? p.buildId]));
  const delta = summary.passRateDelta;
  const open = (buildId: string) => void navigate(buildHref(buildId, project));

  return (
    <div className="space-y-8">
      <section aria-label="Key metrics" className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Pass rate" value={formatPercent(summary.passRate)} hint={delta === null ? "not enough builds for a trend" : `${delta >= 0 ? "▲" : "▼"} ${Math.abs(Math.round(delta * 1000) / 10)} pts vs earlier half`} />
        <Stat label="Builds" value={summary.count} hint={`${summary.failedBuilds} failed`} />
        <Stat label="Build failure rate" value={formatPercent(summary.buildFailRate)} />
        <Stat label="Avg duration" value={formatDuration(summary.avgDurationMs)} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <VizCard title="Pass rate" subtitle="Per build · click a point to open that build"><PassRateChart series={series} onOpen={open} /></VizCard>
        <VizCard title="Test outcomes" subtitle="Passed, failed and skipped per build"><OutcomesChart series={series} onOpen={open} /></VizCard>
      </div>
      <VizCard title="Duration" subtitle="Per build · dashed line is the average"><DurationChart series={series} onOpen={open} /></VizCard>

      <Hotspots builds={series.filter((p) => p.status !== "pending").slice(-ANALYSIS_BUILDS).reverse().map((p) => p.buildId)} observability={new Map((builds ?? []).map((b) => [b.buildId, b.observabilityUrl]))} labels={new Map(series.map((p) => [p.buildId, `${p.name ?? "Build"} #${p.buildNumber ?? ""}`]))} heatLabels={heatLabels} />

      <section aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="mb-3 text-[22px] font-medium tracking-[-0.4px]">Recent builds</h2>
        <BuildsTable builds={(builds ?? []).slice(0, 10)} project={project} allBuilds={builds ?? []} />
      </section>
    </div>
  );
}

/** Failing/flaky tests and failure categories across the newest finished builds (newest first). */
function Hotspots({
  builds,
  observability,
  labels,
  heatLabels,
}: {
  builds: string[];
  observability: Map<string, string | null | undefined>;
  labels: Map<string, string>;
  heatLabels: Map<string, string>;
}) {
  const { client, username } = useTraClient();
  const tests = useQueries({ queries: builds.map((b) => testsQuery(client, username, b)) });
  const details = useQueries({ queries: builds.map((b) => buildQuery(client, username, b)) });
  const [drawer, setDrawer] = useState<DrawerTest | null>(null);

  const loading = tests.some((t) => t.isPending) || details.some((d) => d.isPending);
  const failedLoads = tests.filter((t) => t.isError).length;

  const runs: FlatTest[][] = tests.map((t) => t.data ?? []);
  const health = aggregateTestHealth(runs);
  const heat = heatmapOf(runs, builds.map((b) => heatLabels.get(b) ?? b.slice(0, 6)), 12);

  const categories = new Map<string, number>();
  for (const d of details) for (const [k, v] of Object.entries(d.data?.failureCategories ?? {})) categories.set(k, (categories.get(k) ?? 0) + v);
  const cats = [...categories.entries()].sort((a, b) => b[1] - a[1]);

  const openTest = (key: string) => {
    for (let i = 0; i < runs.length; i++) {
      const t = runs[i]?.find((x) => x.key === key && (x.status === "failed" || x.isFlaky)) ?? runs[i]?.find((x) => x.key === key);
      const buildId = builds[i];
      if (t && buildId && (t.status === "failed" || t.isFlaky)) {
        setDrawer({ test: t, buildId, buildUrl: observability.get(buildId), buildLabel: labels.get(buildId) ?? buildId });
        return;
      }
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className={cats.length > 0 || loading ? "lg:col-span-3" : "lg:col-span-5"}>
        <CardHeader>
          <CardTitle>Failing &amp; flaky tests</CardTitle>
          <span className="text-[12px] text-muted">last {builds.length} finished builds</span>
        </CardHeader>
        {loading ? (
          <CardContent><Skeleton className="h-40" /></CardContent>
        ) : health.length === 0 ? (
          <CardContent className="text-muted">No failing or flaky tests in the analysed builds.</CardContent>
        ) : (
          <ul className="divide-y divide-border">
            {health.slice(0, 8).map((h) => (
              <li key={h.key}>
                <button type="button" onClick={() => openTest(h.key)} className="flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-3 text-left t-fast transition-colors hover:bg-surface-2">
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{h.name}</span>
                    <span className="block truncate text-[12px] text-muted">{h.path.slice(0, -1).join(" › ")}</span>
                    {h.lastError && <span className="mt-1 block truncate font-mono text-[12px] text-danger">{h.lastError}</span>}
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    {h.failedRuns > 0 && <Badge tone="danger">Failed {h.failedRuns}/{h.runs}</Badge>}
                    {h.flakyRuns > 0 && <Badge tone="warning">Flaky {h.flakyRuns}/{h.runs}</Badge>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {failedLoads > 0 && <p className="border-t border-border px-5 py-2 text-[12px] text-muted">{failedLoads} build(s) couldn’t be analysed.</p>}
      </Card>

      {(loading || cats.length > 0) && <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Failure categories</CardTitle><span className="text-[12px] text-muted">same builds</span></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-32" /> : cats.length === 0 ? <p className="text-muted">No categorised failures.</p> : <CategoryChart categories={cats} />}
        </CardContent>
      </Card>}
      <Card className="lg:col-span-5">
        <CardHeader><CardTitle>Test history</CardTitle><span className="text-[12px] text-muted">failing or flaky tests across the same builds</span></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-40" /> : heat.tests.length === 0 ? <p className="text-muted">Nothing failed or flaked in the analysed builds.</p> : <TestHeatmap {...heat} />}
        </CardContent>
      </Card>
      <TestDrawer item={drawer} onClose={() => setDrawer(null)} />
    </div>
  );
}

function VizCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle><span className="text-[12px] text-muted">{subtitle}</span></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="Loading">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24" />)}</div>
      <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>
    </div>
  );
}

function QualityGate({ projectName }: { projectName: string | undefined }) {
  const { client, username } = useTraClient();
  const q = useQuery({
    queryKey: ["qg-settings", username, projectName],
    queryFn: () => traApi.qualityGateSettings(client, projectName ?? ""),
    enabled: !!projectName,
    retry: false,
  });
  if (!projectName) return <EmptyState title="Project name unavailable" hint="Open this project from Insights to view quality gate settings." />;
  if (q.isPending) return <Skeleton className="h-40" />;
  if (q.isError) {
    return <EmptyState title="Quality gates aren’t available" hint={errorMessage(q.error)} />;
  }
  const s = q.data;
  const profiles = s.qualityProfiles ?? [];
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
        <CardContent>
          <KeyValue rows={[["Quality gate", <Badge key="e" tone={s.enabled ? "success" : "neutral"}>{s.enabled ? "Enabled" : "Disabled"}</Badge>], ["Overrides build status", s.shouldOverrideBuildStatus == null ? null : displayValue(s.shouldOverrideBuildStatus ? "Yes" : "No")]]} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Profiles</CardTitle><span className="text-muted">{profiles.length}</span></CardHeader>
        {profiles.length === 0 ? (
          <CardContent className="text-muted">No quality gate profiles configured.</CardContent>
        ) : (
          <ul className="divide-y divide-border">
            {profiles.map((p, i) => (
              <li key={p.id ?? i} className="flex items-center justify-between gap-4 px-5 py-3">
                <div><p className="font-medium">{p.name ?? "Untitled profile"}</p><p className="text-muted">{p.rulesCount ?? 0} rules{p.isGlobalProfile ? " · Global" : ""}</p></div>
                <Badge tone={p.enabled ? "success" : "neutral"}>{p.enabled ? "Enabled" : "Disabled"}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

/** The project's Test Management side: the case library (how much is automated, by type and priority) and its runs. */
function TestManagement({ projectName }: { projectName: string | undefined }) {
  const { client, username } = useTmClient();
  const project = useQuery({ ...tmProjectQuery(client, username, projectName ?? ""), enabled: !!projectName });
  const tmId = project.data;
  const cases = useQuery({ ...tmCasesQuery(client, username, tmId ?? ""), enabled: !!tmId });
  const runs = useQuery({ ...tmRunsQuery(client, username, tmId ?? ""), enabled: !!tmId });

  if (!projectName) return <EmptyState title="Project name unavailable" hint="Open this project from Insights to view Test Management." />;
  if (project.isPending) return <Skeleton className="h-40" />;
  if (project.isError) return <EmptyState title="Test Management isn’t available" hint={errorMessage(project.error)} />;
  if (!tmId) return <EmptyState title="No matching Test Management project" hint={`No Test Management project is named “${projectName}”.`} />;
  if (cases.isPending || runs.isPending) return <Skeleton className="h-64" />;
  if (cases.isError) return <ErrorState error={cases.error} onRetry={() => void cases.refetch()} />;

  const list = cases.data;
  const cov = coverageOf(list);
  const runList = runs.data ?? [];
  return (
    <div className="space-y-8">
      <section aria-label="Test management metrics" className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Test cases" value={cov.total} hint={`project ${tmId}`} />
        <Stat label="Automated" value={formatPercent(cov.automatedRatio)} hint={`${cov.automated} of ${cov.total} cases`} />
        <Stat label="Test runs" value={runList.length} hint={`${runList.filter((r) => r.runState === "done").length} done`} />
        <Stat label="Owners" value={new Set(list.map((c) => c.owner).filter(Boolean)).size} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card><CardHeader><CardTitle>Automation status</CardTitle></CardHeader><CardContent><TallyChart tally={tallyBy(list, (c) => c.automationStatus)} label="Cases by automation status" /></CardContent></Card>
        <Card><CardHeader><CardTitle>Case type</CardTitle></CardHeader><CardContent><TallyChart tally={tallyBy(list, (c) => c.caseType)} label="Cases by type" /></CardContent></Card>
        <Card><CardHeader><CardTitle>Priority</CardTitle></CardHeader><CardContent><TallyChart tally={tallyBy(list, (c) => c.priority)} label="Cases by priority" /></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Test runs</CardTitle><span className="text-[12px] text-muted">{runList.length}</span></CardHeader>
        <div className="scroll-thin max-h-72 overflow-auto">
          <table className="w-full text-[13px]">
            <thead><tr className="text-left text-[11px] uppercase tracking-wide text-muted"><th className="sticky top-0 bg-surface-1 px-5 py-2">Run</th><th className="sticky top-0 bg-surface-1 px-3 py-2">State</th><th className="sticky top-0 bg-surface-1 px-3 py-2">Assignee</th><th className="sticky top-0 bg-surface-1 px-3 py-2">Created</th></tr></thead>
            <tbody>
              {runList.map((r) => (
                <tr key={r.identifier} className="border-t border-border">
                  <td className="px-5 py-2"><span className="font-mono text-[12px] text-muted">{r.identifier}</span> {r.urls?.self ? <a className="hover:underline" href={r.urls.self} target="_blank" rel="noreferrer noopener">{r.name}</a> : r.name}</td>
                  <td className="px-3 py-2"><Badge tone={r.runState === "done" ? "success" : "neutral"}>{r.runState ?? "—"}</Badge></td>
                  <td className="px-3 py-2 text-muted">{r.assignee ?? "—"}</td>
                  <td className="px-3 py-2 text-muted">{formatDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>Test cases</CardTitle><span className="text-[12px] text-muted">{list.length}</span></CardHeader>
        <div className="scroll-thin max-h-96 overflow-auto">
          <table className="w-full text-[13px]">
            <thead><tr className="text-left text-[11px] uppercase tracking-wide text-muted"><th className="sticky top-0 bg-surface-1 px-5 py-2">Case</th><th className="sticky top-0 bg-surface-1 px-3 py-2">Type</th><th className="sticky top-0 bg-surface-1 px-3 py-2">Automation</th><th className="sticky top-0 bg-surface-1 px-3 py-2">Priority</th><th className="sticky top-0 bg-surface-1 px-3 py-2">Owner</th></tr></thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.identifier} className="border-t border-border">
                  <td className="px-5 py-2"><span className="font-mono text-[12px] text-muted">{c.identifier}</span> {c.url ? <a className="hover:underline" href={c.url} target="_blank" rel="noreferrer noopener">{c.title}</a> : c.title}</td>
                  <td className="px-3 py-2 text-muted">{c.caseType ?? "—"}</td>
                  <td className="px-3 py-2"><Badge tone={c.automationStatus === "automated" ? "success" : "neutral"}>{c.automationStatus ?? "—"}</Badge></td>
                  <td className="px-3 py-2 text-muted">{c.priority ?? "—"}</td>
                  <td className="px-3 py-2 text-muted">{c.owner ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
