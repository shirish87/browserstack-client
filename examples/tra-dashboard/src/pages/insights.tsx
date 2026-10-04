import { Link } from "react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Activity, AlertTriangle, CheckCircle2, Eye, MinusCircle } from "lucide-react";
import { useTraClient } from "@/lib/auth";
import { healthOf, summarize, toSeries, type Health } from "@/lib/analytics";
import { formatDuration, formatPercent, formatRelative } from "@/lib/format";
import { projectsQuery, windowQuery } from "@/lib/queries";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkline } from "@/components/charts";
import { StatusBadge } from "@/components/status";
import { EmptyState, ErrorState, PageTitle, Stat } from "@/components/common";

const DAYS = 30;

const HEALTH: Record<Health, { label: string; tone: BadgeTone; Icon: typeof CheckCircle2 }> = {
  healthy: { label: "Healthy", tone: "success", Icon: CheckCircle2 },
  watch: { label: "Watch", tone: "warning", Icon: Eye },
  "at-risk": { label: "At risk", tone: "danger", Icon: AlertTriangle },
  none: { label: "No builds", tone: "neutral", Icon: MinusCircle },
};

export function InsightsPage() {
  const { client, username } = useTraClient();
  const projects = useQuery(projectsQuery(client, username));
  const list = projects.data ?? [];
  const windows = useQueries({ queries: list.map((p) => windowQuery(client, username, p.id, DAYS)) });

  if (projects.isPending) return <PortfolioSkeleton />;
  if (projects.isError) return <ErrorState error={projects.error} onRetry={() => void projects.refetch()} />;

  const rows = list.map((p, i) => {
    const q = windows[i];
    const builds = q?.data ?? [];
    const series = toSeries(builds);
    const last10 = series.slice(-10);
    return { project: p, loading: q?.isPending ?? true, error: q?.error ?? null, series, summary: summarize(series), recent: summarize(last10), latest: series[series.length - 1] };
  });

  const all = rows.flatMap((r) => r.series);
  const overall = summarize(all);
  const attention = rows.filter((r) => ["watch", "at-risk"].includes(healthOf(r.recent.passRate))).length;
  const running = all.filter((p) => p.status === "pending").length;
  const stillLoading = rows.some((r) => r.loading);

  return (
    <>
      <PageTitle title="Insights" subtitle={`Quality across all projects over the last ${DAYS} days. Pick a project to drill into trends, failing tests and individual outcomes.`} />

      <section aria-label="Portfolio summary" className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Projects" value={list.length} hint={`${rows.filter((r) => r.series.length > 0).length} with builds`} />
        <Stat label={`Builds · ${DAYS}d`} value={stillLoading ? "…" : overall.count} hint={running > 0 ? `${running} running now` : "none running"} />
        <Stat label="Pass rate" value={stillLoading ? "…" : formatPercent(overall.passRate)} hint="passed ÷ (passed + failed)" />
        <Stat label="Needs attention" value={stillLoading ? "…" : attention} hint="projects on Watch or At risk" />
      </section>

      {list.length === 0 ? (
        <EmptyState title="No projects yet" hint="Projects appear once a build is reported to Test Reporting & Analytics." />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Projects">
          {rows.map((r) => {
            const health = healthOf(r.recent.passRate);
            const { label, tone, Icon } = HEALTH[health];
            return (
              <li key={r.project.id}>
                <Link
                  to={`/insights/projects/${r.project.id}?name=${encodeURIComponent(r.project.name)}`}
                  className="panel block h-full rounded-lg p-5 t-fast transition-colors hover:border-border-strong hover:bg-surface-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 truncate text-[16px] font-medium tracking-[-0.02em]">{r.project.name}</h2>
                    {r.loading ? <Skeleton className="h-5 w-16" /> : (
                      <Badge tone={tone}><Icon className="size-3.5" aria-hidden />{label}</Badge>
                    )}
                  </div>
                  {r.error ? (
                    <p className="mt-6 text-danger">Couldn’t load builds</p>
                  ) : r.loading ? (
                    <Skeleton className="mt-6 h-16" />
                  ) : r.series.length === 0 ? (
                    <p className="mt-6 text-muted">No builds in the last {DAYS} days.</p>
                  ) : (
                    <>
                      <div className="mt-5 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-[28px] font-semibold leading-none tracking-[-0.6px]">{formatPercent(r.summary.passRate)}</p>
                          <p className="mt-1.5 text-[12px] text-muted">pass rate · {r.summary.count} builds</p>
                        </div>
                        <Sparkline
                          label={`${r.project.name} pass rate per build`}
                          points={r.series.slice(-30).map((p) => ({ value: p.passRate, failed: p.status === "failed" }))}
                        />
                      </div>
                      <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-[13px]">
                        <div><dt className="text-muted">Failed builds</dt><dd className="font-mono text-[12px]">{r.summary.failedBuilds}</dd></div>
                        <div><dt className="text-muted">Avg duration</dt><dd className="font-mono text-[12px]">{formatDuration(r.summary.avgDurationMs)}</dd></div>
                        <div>
                          <dt className="text-muted">Latest</dt>
                          <dd>{r.latest ? <StatusBadge status={r.latest.status === "pending" ? "running" : r.latest.status} /> : "—"}</dd>
                        </div>
                      </dl>
                      {r.latest?.startedAt && <p className="mt-3 text-[12px] text-muted"><Activity className="mr-1 inline size-3" aria-hidden />Last run {formatRelative(r.latest.startedAt)}</p>}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function PortfolioSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading projects" className="space-y-6">
      <Skeleton className="h-9 w-48" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24" />)}</div>
      <div className="grid gap-4 md:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <Card key={i}><Skeleton className="h-44" /></Card>)}</div>
    </div>
  );
}
