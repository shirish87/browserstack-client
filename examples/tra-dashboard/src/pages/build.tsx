import { useMemo, useState, type ReactNode } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, ExternalLink as ExtIcon, GitCompare, Radio, Search } from "lucide-react";
import { z } from "zod";
import { useTraClient } from "@/lib/auth";
import { traApi } from "@/lib/api";
import { estimateRemainingSec, runProgress, toFlatTest } from "@/lib/analytics";
import { formatDate, formatDuration, formatPercent, outcomes, passRate, totalTests } from "@/lib/format";
import { LIVE_POLL_MS, windowQuery } from "@/lib/queries";
import { useNow } from "@/lib/hooks";
import { TestDrawer, type DrawerTest } from "@/components/test-drawer";
import { compareHref, previousBuild } from "@/components/builds";
import { normalizeStatus } from "@/lib/hierarchy";
import { filterTree, normalizeHierarchy, type TestNode } from "@/lib/hierarchy";
import type { BuildDetails, QualityGateStatus, TestRunNode } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TabBar } from "@/components/ui/tabs";
import { StatusBadge, StatusBar, StatusIcon, StatusLegend } from "@/components/status";
import { Breadcrumbs, ErrorState, ExternalLink, KeyValue, LoadMore, PageTitle, Stat } from "@/components/common";
import { detailRows, errorMessage, humanize } from "@/lib/utils";
import { TallyChart } from "@/components/tra-charts";
import { RulesTable } from "@/components/rules-table";

const FIRST_PAGE: string | undefined = undefined;

export function BuildPage() {
  const { buildId } = useParams();
  const [params] = useSearchParams();
  const { client, username } = useTraClient();
  const projectId = params.get("project");
  const projectName = params.get("name");

  const q = useQuery({
    queryKey: ["build", username, buildId],
    queryFn: () => traApi.build(client, buildId ?? ""),
    enabled: !!buildId,
    refetchInterval: (query) => (normalizeStatus(query.state.data?.status) === "pending" ? LIVE_POLL_MS : false),
  });

  const crumbs = [
    { label: "Insights", to: "/insights" },
    ...(projectId ? [{ label: projectName ?? `Project ${projectId}`, to: `/insights/projects/${projectId}${projectName ? `?name=${encodeURIComponent(projectName)}` : ""}` }] : []),
    { label: q.data?.name ?? "Build" },
  ];

  if (!buildId) return <ErrorState error="Missing build id" />;

  return (
    <>
      <Breadcrumbs items={crumbs} />
      {q.isPending ? (
        <BuildSkeleton />
      ) : q.isError ? (
        <ErrorState error={q.error} onRetry={() => void q.refetch()} />
      ) : (
        <BuildContent buildId={buildId} build={q.data} project={projectId ? { id: Number(projectId), name: projectName ?? undefined } : undefined} />
      )}
    </>
  );
}

function BuildSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading build">
      <Skeleton className="h-8 w-1/3" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-48" />
    </div>
  );
}

function BuildContent({ buildId, build, project }: { buildId: string; build: BuildDetails; project: { id: number; name: string | undefined } | undefined }) {
  const { client, username } = useTraClient();
  const live = normalizeStatus(build.status) === "pending";
  const recent = useQuery({ ...windowQuery(client, username, project?.id ?? 0, 90), enabled: !!project && Number.isInteger(project.id) });
  const previous = recent.data ? previousBuild(recent.data, buildId) : undefined;
  const stats = build.statusStats;
  const total = totalTests(stats);
  const failed = outcomes(stats).failed;
  const smart = build.smartTags;
  return (
    <div className="space-y-6">
      {live && <LiveBanner build={build} />}
      <PageTitle
        actions={
          previous && !live ? (
            <Button asChild variant="outline">
              <Link to={compareHref(previous.buildId, buildId, project)}>
                <GitCompare className="size-4" aria-hidden /> Compare with #{previous.buildNumber ?? "previous"}
              </Link>
            </Button>
          ) : undefined
        }
        title={
          <span className="flex flex-wrap items-center gap-3">
            {build.name ?? "Untitled build"}
            {build.buildNumber != null && <span className="font-mono text-[15px] font-medium text-muted">#{build.buildNumber}</span>}
            <StatusBadge status={build.status} />
            {build.isArchived && <Badge>Archived</Badge>}
          </span>
        }
        subtitle={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {build.user && <span>by {build.user}</span>}
            <span>Started {formatDate(build.startedAt)}</span>
            {build.finishedAt && <span>Finished {formatDate(build.finishedAt)}</span>}
            {build.observabilityUrl && (
              <ExternalLink href={build.observabilityUrl}>
                Open in BrowserStack <ExtIcon className="inline size-3.5" aria-hidden />
              </ExternalLink>
            )}
          </span>
        }
      />
      {build.description && <p className="max-w-3xl text-muted">{build.description}</p>}
      {(build.tags ?? []).length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
          {(build.tags ?? []).map((t) => <li key={t}><Badge tone="outline">{t}</Badge></li>)}
        </ul>
      )}

      <section aria-label="Summary" className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Stat label="Tests" value={total} />
          <Stat label="Pass rate" value={formatPercent(passRate(stats))} hint="passed ÷ (passed + failed)" />
          <Stat label="Failed" value={<span className={failed > 0 ? "text-danger" : undefined}>{failed}</span>} />
          <Stat label="Flaky" value={smart?.isFlaky ?? 0} hint={smart ? `${smart.isNewFailure} new failures` : undefined} />
          <Stat label="Duration" value={formatDuration(build.duration)} />
        </div>
        <Card className="space-y-3 px-5 py-4">
          <StatusBar stats={stats} className="h-3" />
          <StatusLegend stats={stats} />
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <FailureCategories categories={build.failureCategories ?? {}} />
        <SmartTags tags={smart} />
        <Card>
          <CardHeader><CardTitle>Source control</CardTitle></CardHeader>
          <CardContent>
            <KeyValue
              rows={[
                ["Branch", build.vcsInfo?.branch ? <code className="font-mono text-[12px]">{build.vcsInfo.branch}</code> : null],
                ["Commit", build.vcsInfo?.sha ? <code className="font-mono text-[12px]" title={build.vcsInfo.sha}>{build.vcsInfo.sha.slice(0, 10)}</code> : null],
                ["VCS", build.vcsInfo?.name],
              ]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>CI &amp; host</CardTitle></CardHeader>
          <CardContent>
            <KeyValue
              rows={[
                ["CI", build.ciInfo?.name],
                ["Job", build.ciInfo?.jobName],
                ["CI build", build.ciInfo?.buildUrl ? <ExternalLink href={build.ciInfo.buildUrl}>{build.ciInfo.buildNumber ? `#${build.ciInfo.buildNumber}` : "Open"}</ExternalLink> : build.ciInfo?.buildNumber ? `#${build.ciInfo.buildNumber}` : null],
                ["Host", build.hostInfo?.hostname],
                ["OS", build.hostInfo?.os],
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <BuildExtras build={build} />
      <QualityGate buildId={buildId} />
      <SelfHealing buildId={buildId} />
      <TestsSection buildId={buildId} buildLabel={`${build.name ?? "Build"} #${build.buildNumber ?? ""}`} buildUrl={build.observabilityUrl} live={live} initialFailures={failed > 0} />
    </div>
  );
}

function FailureCategories({ categories }: { categories: Record<string, number> }) {
  const tally = Object.entries(categories).map(([label, count]) => ({ label, count })).sort((x, y) => y.count - x.count);
  return (
    <Card>
      <CardHeader><CardTitle>Failure categories</CardTitle></CardHeader>
      <CardContent>
        {tally.length === 0 ? <p className="text-muted">No failure categories reported.</p> : <TallyChart tally={tally} label="Failures by category" />}
      </CardContent>
    </Card>
  );
}

/** Free-form TRA objects the API reports for a build: why it errored, re-run info, the app under test, SDK runs. */
function BuildExtras({ build }: { build: BuildDetails }) {
  const error = detailRows(build.buildError);
  const rerun = detailRows(build.reRun);
  const app = detailRows(build.appDetails);
  const runs = build.runInformation ?? [];
  if (error.length + rerun.length + app.length + runs.length === 0) return null;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {error.length > 0 && (
        <Card className="border-danger/40 lg:col-span-2">
          <CardHeader><CardTitle>Build error</CardTitle></CardHeader>
          <CardContent><KeyValue rows={error} /></CardContent>
        </Card>
      )}
      {rerun.length > 0 && (
        <Card><CardHeader><CardTitle>Re-run</CardTitle></CardHeader><CardContent><KeyValue rows={rerun} /></CardContent></Card>
      )}
      {app.length > 0 && (
        <Card><CardHeader><CardTitle>App under test</CardTitle></CardHeader><CardContent><KeyValue rows={app} /></CardContent></Card>
      )}
      {runs.length > 0 && (
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Run information</CardTitle></CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-y border-border bg-surface-2 text-[13px] text-muted">
                <tr>{["Run", "Passed", "Failed", "Skipped", "Unknown"].map((c) => <th key={c} scope="col" className="px-5 py-2 font-medium">{c}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {runs.map((r, i) => (
                  <tr key={r.id ?? i}>
                    <td className="px-5 py-2 font-mono text-[12px]">{r.id ?? `#${i + 1}`}</td>
                    <td className="px-5 py-2">{r.passed ?? 0}</td>
                    <td className="px-5 py-2">{r.failed ?? 0}</td>
                    <td className="px-5 py-2">{r.skipped ?? 0}</td>
                    <td className="px-5 py-2">{r.unknown ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function SmartTags({ tags }: { tags: BuildDetails["smartTags"] }) {
  const rows: [string, number | null | undefined, string][] = [
    ["Flaky", tags?.isFlaky, "Pass and fail intermittently"],
    ["New failures", tags?.isNewFailure, "Started failing in this build"],
    ["Always failing", tags?.isAlwaysFailing, "Failed in every recent run"],
    ["Performance anomalies", tags?.isPerformanceAnomaly, "Duration far from the norm"],
  ];
  return (
    <Card>
      <CardHeader><CardTitle>Smart tags</CardTitle></CardHeader>
      {tags ? (
        <ul className="divide-y divide-border">
          {rows.map(([label, n, hint]) => (
            <li key={label} className="flex items-center justify-between gap-4 px-5 py-3">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-[12px] text-muted">{hint}</p>
              </div>
              <span className="font-mono text-[15px] font-medium">{n ?? 0}</span>
            </li>
          ))}
        </ul>
      ) : (
        <CardContent className="text-muted">No smart tags reported.</CardContent>
      )}
    </Card>
  );
}

function QualityGate({ buildId }: { buildId: string }) {
  const { client, username } = useTraClient();
  const q = useQuery({ queryKey: ["qg-status", username, buildId], queryFn: () => traApi.qualityGateStatus(client, buildId), retry: false });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality gate</CardTitle>
        {q.data?.qualityGateResult && <StatusBadge status={q.data.qualityGateResult} />}
      </CardHeader>
      {q.isPending ? (
        <CardContent><Skeleton className="h-10" /></CardContent>
      ) : q.isError ? (
        <CardContent className="text-muted">{errorMessage(q.error)}</CardContent>
      ) : (
        <QualityGateBody status={q.data} />
      )}
    </Card>
  );
}

function QualityGateBody({ status }: { status: QualityGateStatus }) {
  const profiles = status.qualityProfiles ?? [];
  if (profiles.length === 0) return <CardContent className="text-muted">No profiles evaluated.</CardContent>;
  return (
    <div className="divide-y divide-border">
      {profiles.map((p, i) => (
        <div key={p.id ?? i} className="pb-1 pt-3">
          <div className="flex items-center justify-between px-5 pb-2">
            <p className="font-semibold">{p.name ?? "Profile"}{p.type && <span className="ml-2 font-normal text-muted">{p.type}</span>}</p>
            {p.result && <StatusBadge status={p.result} />}
          </div>
          <RulesTable rules={p.rules ?? []} />
        </div>
      ))}
    </div>
  );
}

function SelfHealing({ buildId }: { buildId: string }) {
  const { client, username } = useTraClient();
  const q = useQuery({
    queryKey: ["self-healing", username, buildId],
    queryFn: () => traApi.selfHealingReport(client, buildId),
    enabled: false,
    retry: false,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Self-healing report</CardTitle>
        <Button variant="outline" size="sm" onClick={() => void q.refetch()} disabled={q.isFetching}>
          {q.isFetching ? "Fetching…" : q.data ? "Refresh link" : "Get report link"}
        </Button>
      </CardHeader>
      <CardContent>
        {q.isError ? (
          <p className="text-muted">No self-healing report is available for this build.</p>
        ) : q.data?.presignedUrl ? (
          <p>
            <ExternalLink href={q.data.presignedUrl}>Download report</ExternalLink>
            {q.data.expiresAt && <span className="ml-2 text-muted">link expires {formatDate(q.data.expiresAt)}</span>}
          </p>
        ) : (
          <p className="text-muted">Generated on request. The download link is short-lived.</p>
        )}
      </CardContent>
    </Card>
  );
}

const SORTS = [
  { value: "EXECUTION_ORDER", label: "Execution order" },
  { value: "TOP_LEVEL_NAME", label: "Name" },
  { value: "DURATION", label: "Duration" },
  { value: "FAILED_TEST", label: "Failures first" },
  { value: "PLATFORM", label: "Platform" },
] as const;
const SortSchema = z.enum(["EXECUTION_ORDER", "TOP_LEVEL_NAME", "DURATION", "FAILED_TEST", "PLATFORM"]);
const STATUS_OPTIONS = ["all", "passed", "failed", "skipped", "pending"] as const;
const StatusOptionSchema = z.enum(STATUS_OPTIONS);

function TestsSection({ buildId, buildLabel, buildUrl, live, initialFailures }: { buildId: string; buildLabel: string; buildUrl: string | null | undefined; live: boolean; initialFailures: boolean }) {
  const { client, username } = useTraClient();
  const [drawer, setDrawer] = useState<DrawerTest | null>(null);
  // Failures first: that's what a reader of a failing build wants to see.
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>(initialFailures ? "failed" : "all");
  const [sort, setSort] = useState<(typeof SORTS)[number]["value"]>("EXECUTION_ORDER");
  const [flaky, setFlaky] = useState(false);
  const [newFailure, setNewFailure] = useState(false);
  const [search, setSearch] = useState("");

  const q = useInfiniteQuery({
    queryKey: ["test-runs", username, buildId, status, sort, flaky, newFailure],
    queryFn: ({ pageParam }) =>
      traApi.testRuns(client, buildId, {
        ...(status !== "all" ? { statuses: status } : {}),
        flaky,
        newFailure,
        sort,
        ...(pageParam ? { nextPage: pageParam } : {}),
      }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (last) => (last.pagination?.hasNext ? (last.pagination.nextPage ?? undefined) : undefined),
    ...(live ? { refetchInterval: LIVE_POLL_MS } : {}),
  });

  const tree = useMemo(() => {
    const nodes: TestRunNode[] = q.data?.pages.flatMap((p) => p.hierarchy ?? []) ?? [];
    return filterTree(normalizeHierarchy(nodes), search);
  }, [q.data, search]);
  const summary = q.data?.pages[0]?.testSummary;

  return (
    <section aria-labelledby="tests-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="tests-heading" className="text-[22px] font-medium tracking-[-0.4px]">Tests</h2>
        {summary && <StatusLegend stats={summary} />}
      </div>
      <TabBar
        label="Which tests"
        tabs={[{ value: "failed", label: "Failures" }, { value: "all", label: "All tests" }]}
        value={status === "failed" ? "failed" : "all"}
        onChange={(v) => setStatus(v)}
      />
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent" aria-hidden />
          <Input aria-label="Search loaded tests" placeholder="Search tests" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-muted">
          Status
          <Select value={status} onChange={(e) => setStatus(StatusOptionSchema.catch("all").parse(e.target.value))}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === "all" ? "All" : humanize(s)}</option>)}
          </Select>
        </label>
        <label className="flex items-center gap-2 text-muted">
          Sort
          <Select value={sort} onChange={(e) => setSort(SortSchema.catch("EXECUTION_ORDER").parse(e.target.value))}>
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </Select>
        </label>
        <label className="flex items-center gap-2"><input type="checkbox" className="size-4 accent-primary" checked={flaky} onChange={(e) => setFlaky(e.target.checked)} /> Flaky only</label>
        <label className="flex items-center gap-2"><input type="checkbox" className="size-4 accent-primary" checked={newFailure} onChange={(e) => setNewFailure(e.target.checked)} /> New failures only</label>
      </div>

      {q.isPending ? (
        <Skeleton className="h-64" />
      ) : q.isError ? (
        <ErrorState error={q.error} onRetry={() => void q.refetch()} />
      ) : tree.length === 0 ? (
        <Card className="px-6 py-10 text-center text-muted">No tests match these filters.</Card>
      ) : (
        <>
          <Card>
            <ul role="tree" aria-label="Tests">
              {tree.map((n) => (
                <TreeNode
                  key={n.id}
                  node={n}
                  depth={0}
                  forceOpen={search.trim().length > 0}
                  parents={[]}
                  onSelect={(leaf, path) => setDrawer({ test: toFlatTest(leaf, path), buildId, buildUrl, buildLabel })}
                />
              ))}
            </ul>
          </Card>
          <TestDrawer item={drawer} onClose={() => setDrawer(null)} />
          <LoadMore hasNext={q.hasNextPage} loading={q.isFetchingNextPage} onClick={() => void q.fetchNextPage()} loaded={q.data.pages.reduce((n, p) => n + (p.hierarchy ?? []).length, 0)} />
        </>
      )}
    </section>
  );
}

function TreeNode({ node, depth, forceOpen, parents, onSelect }: { node: TestNode; depth: number; forceOpen: boolean; parents: string[]; onSelect: (node: TestNode, path: string[]) => void }) {
  const isLeaf = node.children.length === 0;
  const [openState, setOpen] = useState(depth < 2 && !isLeaf);
  const open = forceOpen || openState;
  const failedHere = node.counts.failed;
  const path = [...parents, node.name];

  const header: ReactNode = (
    <>
      {isLeaf ? <span className="size-4 shrink-0" /> : open ? <ChevronDown className="size-4 shrink-0 text-muted" aria-hidden /> : <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden />}
      {isLeaf ? <StatusIcon status={node.status} /> : failedHere > 0 ? <StatusIcon status="failed" /> : <StatusIcon status="passed" />}
      <span className={isLeaf ? "min-w-0 flex-1 truncate" : "min-w-0 flex-1 truncate font-medium"}>{node.name}</span>
      {isLeaf ? (
        <span className="flex shrink-0 items-center gap-2">
          {node.isFlaky && <Badge tone="warning">Flaky</Badge>}
          {node.isNewFailure && <Badge tone="danger">New failure</Badge>}
          {node.retries ? <Badge tone="outline">{node.retries} retries</Badge> : null}
          <span className="w-16 text-right font-mono text-[12px] text-muted">{formatDuration(node.durationMs)}</span>
        </span>
      ) : (
        <span className="flex shrink-0 items-center gap-3">
          {failedHere > 0 && <span className="font-mono text-[12px] font-medium text-danger">{failedHere} failed</span>}
          <span className="font-mono text-[12px] text-muted">{node.leafCount} tests</span>
        </span>
      )}
    </>
  );

  return (
    <li role="treeitem" aria-expanded={isLeaf ? undefined : open} aria-selected={false} className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => (isLeaf ? onSelect(node, path) : setOpen(!openState))}
        style={{ paddingLeft: 12 + depth * 20 }}
        className="flex w-full cursor-pointer items-center gap-2 py-2.5 pr-5 text-left t-fast transition-colors hover:bg-surface-2"
        {...(isLeaf ? { "aria-haspopup": "dialog" as const } : {})}
      >
        {header}
      </button>
      {open && !isLeaf && (
        <ul role="group">
          {node.children.map((c) => <TreeNode key={c.id} node={c} depth={depth + 1} forceOpen={forceOpen} parents={path} onSelect={onSelect} />)}
        </ul>
      )}
    </li>
  );
}

/** Banner for a build that's still executing: progress, failures so far, ETA. Data refreshes on its own. */
function LiveBanner({ build }: { build: BuildDetails }) {
  const now = useNow();
  const { done, total, fraction } = runProgress(build.statusStats);
  const started = Date.parse(build.startedAt ?? "");
  const elapsed = Number.isNaN(started) ? null : Math.max(0, Math.round((now - started) / 1000));
  const remaining = elapsed === null ? null : estimateRemainingSec(fraction, elapsed);
  const failed = build.statusStats?.failed ?? 0;
  return (
    <div role="status" className="panel rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 font-medium"><Radio className="size-4 animate-pulse text-warning" aria-hidden /> Running — updating every {LIVE_POLL_MS / 1000}s</span>
        <span className="text-[13px] text-muted">
          {elapsed !== null && <>Elapsed {formatDuration(elapsed * 1000)}</>}
          {remaining !== null && <> · about {formatDuration(remaining * 1000)} left</>}
        </span>
      </div>
      <div className="mt-3"><StatusBar stats={build.statusStats} className="h-2" /></div>
      <p className="mt-2 flex justify-between text-[12px]">
        <span className="font-mono text-ink-muted">{done}/{total} tests · {Math.round(fraction * 100)}%</span>
        <span className={failed > 0 ? "font-medium text-danger" : "text-muted"}>{failed} failed so far</span>
      </p>
    </div>
  );
}
