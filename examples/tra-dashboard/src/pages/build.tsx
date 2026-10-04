import { useMemo, useState, type ReactNode } from "react";
import { useParams, useSearchParams } from "react-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, ExternalLink as ExtIcon, Search } from "lucide-react";
import { z } from "zod";
import { useTraClient } from "@/lib/auth";
import { traApi } from "@/lib/api";
import { formatDate, formatDuration, formatPercent, passRate, totalTests } from "@/lib/format";
import { filterTree, normalizeHierarchy, type TestNode } from "@/lib/hierarchy";
import type { BuildDetails, HierarchyNode, QualityGateStatus } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, StatusBar, StatusIcon, StatusLegend } from "@/components/status";
import { Breadcrumbs, ErrorState, ExternalLink, KeyValue, LoadMore, PageTitle, Stat } from "@/components/common";
import { displayValue, humanize } from "@/lib/utils";

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
  });

  const crumbs = [
    { label: "Projects", to: "/projects" },
    ...(projectId ? [{ label: projectName ?? `Project ${projectId}`, to: `/projects/${projectId}${projectName ? `?name=${encodeURIComponent(projectName)}` : ""}` }] : []),
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
        <BuildContent build={q.data} />
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

function BuildContent({ build }: { build: BuildDetails }) {
  const stats = build.statusStats;
  const total = totalTests(stats);
  const smart = build.smartTags;
  return (
    <div className="space-y-6">
      <PageTitle
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
      {build.tags.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
          {build.tags.map((t) => <li key={t}><Badge tone="outline">{t}</Badge></li>)}
        </ul>
      )}

      <section aria-label="Summary" className="space-y-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Stat label="Tests" value={total} />
          <Stat label="Pass rate" value={formatPercent(passRate(stats))} hint="passed ÷ (passed + failed)" />
          <Stat label="Failed" value={<span className={stats && stats.failed > 0 ? "text-danger" : undefined}>{stats?.failed ?? 0}</span>} />
          <Stat label="Flaky" value={smart?.isFlaky ?? 0} hint={smart ? `${smart.isNewFailure} new failures` : undefined} />
          <Stat label="Duration" value={formatDuration(build.duration != null ? build.duration * 1000 : null)} />
        </div>
        <Card className="space-y-3 px-5 py-4">
          <StatusBar stats={stats} className="h-3" />
          <StatusLegend stats={stats} />
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <FailureCategories categories={build.failureCategories} />
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

      <QualityGate buildId={build.buildId} />
      <SelfHealing buildId={build.buildId} />
      <TestsSection buildId={build.buildId} />
    </div>
  );
}

function FailureCategories({ categories }: { categories: Record<string, number> }) {
  const entries = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map(([, n]) => n));
  return (
    <Card>
      <CardHeader><CardTitle>Failure categories</CardTitle></CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-muted">No failure categories reported.</p>
        ) : (
          <ul className="space-y-3">
            {entries.map(([name, n]) => (
              <li key={name}>
                <div className="mb-1 flex justify-between">
                  <span>{name}</span>
                  <span className="font-mono text-[12px] font-medium">{n}</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-bg" role="img" aria-label={`${name}: ${n}`}>
                  <div className="h-full rounded-full bg-danger" style={{ width: `${(n / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function SmartTags({ tags }: { tags: BuildDetails["smartTags"] }) {
  const rows: [string, number | undefined, string][] = [
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
                <p className="font-semibold">{label}</p>
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

const RuleSchema = z.record(z.string(), z.unknown());

function RulesTable({ rules }: { rules: z.infer<typeof RuleSchema>[] }) {
  const columns = [...new Set(rules.flatMap((r) => Object.keys(r)))];
  if (columns.length === 0) return <p className="px-5 py-3 text-muted">No rules.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-y border-border bg-background text-muted">
          <tr>{columns.map((c) => <th key={c} scope="col" className="px-5 py-2 font-semibold">{humanize(c)}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rules.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c} className="px-5 py-2">
                  {c.toLowerCase() === "result" ? <StatusBadge status={displayValue(r[c])} /> : displayValue(r[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
        <CardContent className="text-muted">No quality gate result for this build.</CardContent>
      ) : (
        <QualityGateBody status={q.data} />
      )}
    </Card>
  );
}

function QualityGateBody({ status }: { status: QualityGateStatus }) {
  if (status.qualityProfiles.length === 0) return <CardContent className="text-muted">No profiles evaluated.</CardContent>;
  return (
    <div className="divide-y divide-border">
      {status.qualityProfiles.map((p, i) => (
        <div key={p.id ?? i} className="pb-1 pt-3">
          <div className="flex items-center justify-between px-5 pb-2">
            <p className="font-bold">{p.name ?? "Profile"}{p.type && <span className="ml-2 font-normal text-muted">{p.type}</span>}</p>
            {p.result && <StatusBadge status={p.result} />}
          </div>
          <RulesTable rules={p.rules} />
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

function TestsSection({ buildId }: { buildId: string }) {
  const { client, username } = useTraClient();
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("all");
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
  });

  const tree = useMemo(() => {
    const nodes: HierarchyNode[] = q.data?.pages.flatMap((p) => p.hierarchy) ?? [];
    return filterTree(normalizeHierarchy(nodes), search);
  }, [q.data, search]);
  const summary = q.data?.pages[0]?.testSummary;

  return (
    <section aria-labelledby="tests-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="tests-heading" className="text-[18px] font-bold tracking-[-0.18px]">Tests</h2>
        {summary && <StatusLegend stats={summary} />}
      </div>
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
              {tree.map((n) => <TreeNode key={n.id} node={n} depth={0} forceOpen={search.trim().length > 0} />)}
            </ul>
          </Card>
          <LoadMore hasNext={q.hasNextPage} loading={q.isFetchingNextPage} onClick={() => void q.fetchNextPage()} loaded={q.data.pages.reduce((n, p) => n + p.hierarchy.length, 0)} />
        </>
      )}
    </section>
  );
}

function TreeNode({ node, depth, forceOpen }: { node: TestNode; depth: number; forceOpen: boolean }) {
  const isLeaf = node.children.length === 0;
  const [openState, setOpen] = useState(depth < 2 && !isLeaf);
  const open = forceOpen || openState;
  const hasDetail = isLeaf && Object.keys(node.extra).length > 0;
  const expandable = !isLeaf || hasDetail;
  const failedHere = node.counts.failed;

  const header: ReactNode = (
    <>
      {expandable ? (open ? <ChevronDown className="size-4 shrink-0 text-muted" aria-hidden /> : <ChevronRight className="size-4 shrink-0 text-muted" aria-hidden />) : <span className="size-4 shrink-0" />}
      {isLeaf ? <StatusIcon status={node.status} /> : failedHere > 0 ? <StatusIcon status="failed" /> : <StatusIcon status="passed" />}
      <span className={isLeaf ? "min-w-0 flex-1 truncate" : "min-w-0 flex-1 truncate font-bold"}>{node.name}</span>
      {isLeaf ? (
        <span className="flex shrink-0 items-center gap-2">
          {node.isFlaky && <Badge tone="warning">Flaky</Badge>}
          {node.isNewFailure && <Badge tone="danger">New failure</Badge>}
          {node.retries ? <Badge tone="outline">{node.retries} retries</Badge> : null}
          <span className="w-16 text-right font-mono text-[12px] font-medium text-muted">{formatDuration(node.durationMs)}</span>
        </span>
      ) : (
        <span className="flex shrink-0 items-center gap-3">
          {failedHere > 0 && <span className="font-mono text-[12px] font-medium text-danger">{failedHere} failed</span>}
          <span className="font-mono text-[12px] font-medium text-muted">{node.leafCount} tests</span>
        </span>
      )}
    </>
  );

  return (
    <li role="treeitem" aria-expanded={expandable ? open : undefined} aria-selected={false} className="border-b border-border last:border-b-0">
      {expandable ? (
        <button
          type="button"
          onClick={() => setOpen(!openState)}
          style={{ paddingLeft: 12 + depth * 20 }}
          className="flex w-full cursor-pointer items-center gap-2 py-2.5 pr-5 text-left t-fast transition-colors hover:bg-background"
        >
          {header}
        </button>
      ) : (
        <div style={{ paddingLeft: 12 + depth * 20 }} className="flex items-center gap-2 py-2.5 pr-5">{header}</div>
      )}
      {open && !isLeaf && (
        <ul role="group">
          {node.children.map((c) => <TreeNode key={c.id} node={c} depth={depth + 1} forceOpen={forceOpen} />)}
        </ul>
      )}
      {open && hasDetail && <TestDetail extra={node.extra} depth={depth} />}
    </li>
  );
}

const FailureSchema = z.array(z.object({ error: z.string().nullish(), backtrace: z.string().nullish() }));

function TestDetail({ extra, depth }: { extra: Record<string, unknown>; depth: number }) {
  const failures = FailureSchema.safeParse(extra["failure"]);
  const rest = Object.entries(extra).filter(([k]) => !(k === "failure" && failures.success));
  return (
    <div style={{ marginLeft: 12 + depth * 20 + 24 }} className="mb-3 mr-5 space-y-3 rounded-lg bg-background p-4">
      {failures.success && failures.data.map((f, i) => (
        <div key={i} className="rounded-md border border-danger/30 bg-danger-bg p-3">
          {f.error && <p className="font-semibold text-danger">{f.error}</p>}
          {f.backtrace && <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[12px] font-medium leading-[1.33] text-muted">{f.backtrace}</pre>}
        </div>
      ))}
      {rest.length > 0 && <KeyValue rows={rest.map(([k, v]) => [humanize(k), <span key={k} className="font-mono text-[12px]">{displayValue(v)}</span>])} />}
    </div>
  );
}
