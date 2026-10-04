import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useTraClient } from "@/lib/auth";
import { aggregateTestHealth, summarize, toSeries, type FlatTest } from "@/lib/analytics";
import { formatDuration, formatPercent } from "@/lib/format";
import { buildQuery, testsQuery, windowQuery } from "@/lib/queries";
import { traApi } from "@/lib/api";
import { displayValue, errorMessage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabBar } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartCard } from "@/components/charts";
import { BuildsTable, buildHref, toChartPoints } from "@/components/builds";
import { TestDrawer, type DrawerTest } from "@/components/test-drawer";
import { Breadcrumbs, EmptyState, ErrorState, KeyValue, PageTitle, Stat } from "@/components/common";

const RangeSchema = z.coerce.number().pipe(z.union([z.literal(7), z.literal(30), z.literal(90)]));
const SectionSchema = z.enum(["overview", "quality-gate"]);
const RANGES = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
] as const;
const SECTIONS = [
  { value: "overview", label: "Overview" },
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
      {section === "overview" ? <Overview projectId={id.data} projectName={name} days={days} /> : <QualityGate projectName={name} />}
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

  const points = toChartPoints(series).map((p, i) => ({ ...p, value: series[i]?.passRate ?? null }));
  const durationPoints = toChartPoints(series).map((p, i) => ({ ...p, value: series[i]?.durationSec ?? null }));
  const minRate = Math.min(...points.map((p) => p.value ?? 1));
  const lo = Math.max(0, Math.min(0.9, Math.floor((minRate - 0.02) * 20) / 20));
  const delta = summary.passRateDelta;
  const open = (p: { id: string }) => void navigate(buildHref(p.id, project));

  return (
    <div className="space-y-8">
      <section aria-label="Key metrics" className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Pass rate" value={formatPercent(summary.passRate)} hint={delta === null ? "not enough builds for a trend" : `${delta >= 0 ? "▲" : "▼"} ${Math.abs(Math.round(delta * 1000) / 10)} pts vs earlier half`} />
        <Stat label="Builds" value={summary.count} hint={`${summary.failedBuilds} failed`} />
        <Stat label="Build failure rate" value={formatPercent(summary.buildFailRate)} />
        <Stat label="Avg duration" value={formatDuration(summary.avgDurationSec != null ? summary.avgDurationSec * 1000 : null)} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Pass rate"
          subtitle="Per build · click a point to open that build"
          points={points}
          kind="line"
          format={(v) => formatPercent(v)}
          axisFormat={(v) => `${Math.round(v * 100)}%`}
          domain={[lo, 1]}
          valueHeader="Pass rate"
          onSelect={open}
          empty="No executed tests in this range."
        />
        <ChartCard
          title="Duration"
          subtitle="Per build · slower builds stand out"
          points={durationPoints}
          kind="bars"
          format={(v) => formatDuration(v * 1000)}
          axisFormat={(v) => formatDuration(v * 1000)}
          valueHeader="Duration"
          onSelect={open}
          empty="No duration data in this range."
        />
      </div>

      <Hotspots builds={series.filter((p) => p.status !== "pending").slice(-ANALYSIS_BUILDS).reverse().map((p) => p.buildId)} observability={new Map((builds ?? []).map((b) => [b.buildId, b.observabilityUrl]))} labels={new Map(series.map((p) => [p.buildId, `${p.name ?? "Build"} #${p.buildNumber ?? ""}`]))} />

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
}: {
  builds: string[];
  observability: Map<string, string | null | undefined>;
  labels: Map<string, string>;
}) {
  const { client, username } = useTraClient();
  const tests = useQueries({ queries: builds.map((b) => testsQuery(client, username, b)) });
  const details = useQueries({ queries: builds.map((b) => buildQuery(client, username, b)) });
  const [drawer, setDrawer] = useState<DrawerTest | null>(null);

  const loading = tests.some((t) => t.isPending) || details.some((d) => d.isPending);
  const failedLoads = tests.filter((t) => t.isError).length;

  const runs: FlatTest[][] = tests.map((t) => t.data ?? []);
  const health = aggregateTestHealth(runs);

  const categories = new Map<string, number>();
  for (const d of details) for (const [k, v] of Object.entries(d.data?.failureCategories ?? {})) categories.set(k, (categories.get(k) ?? 0) + v);
  const cats = [...categories.entries()].sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(1, ...cats.map(([, n]) => n));

  const openTest = (key: string) => {
    for (let i = 0; i < runs.length; i++) {
      const t = runs[i]?.find((x) => x.key === key && (x.status === "failed" || x.isFlaky)) ?? runs[i]?.find((x) => x.key === key);
      const buildId = builds[i];
      if (t && buildId && (t.status === "failed" || t.isFlaky)) {
        setDrawer({ test: t, extra: {}, buildUrl: observability.get(buildId), buildLabel: labels.get(buildId) ?? buildId });
        return;
      }
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
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

      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Failure categories</CardTitle><span className="text-[12px] text-muted">same builds</span></CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-32" /> : cats.length === 0 ? (
            <p className="text-muted">No categorised failures.</p>
          ) : (
            <ul className="space-y-3">
              {cats.map(([name, n]) => (
                <li key={name}>
                  <div className="mb-1 flex justify-between"><span>{name}</span><span className="font-mono text-[12px]">{n}</span></div>
                  <div className="h-1.5 rounded-full bg-surface-3" role="img" aria-label={`${name}: ${n}`}>
                    <div className="h-full rounded-full bg-danger" style={{ width: `${(n / maxCat) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <TestDrawer item={drawer} onClose={() => setDrawer(null)} />
    </div>
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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
        <CardContent>
          <KeyValue rows={[["Quality gate", <Badge key="e" tone={s.enabled ? "success" : "neutral"}>{s.enabled ? "Enabled" : "Disabled"}</Badge>], ["Overrides build status", s.shouldOverrideBuildStatus == null ? null : displayValue(s.shouldOverrideBuildStatus ? "Yes" : "No")]]} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Profiles</CardTitle><span className="text-muted">{s.qualityProfiles.length}</span></CardHeader>
        {s.qualityProfiles.length === 0 ? (
          <CardContent className="text-muted">No quality gate profiles configured.</CardContent>
        ) : (
          <ul className="divide-y divide-border">
            {s.qualityProfiles.map((p, i) => (
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
