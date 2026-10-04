import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { z } from "zod";
import { useTraClient } from "@/lib/auth";
import { traApi } from "@/lib/api";
import { formatDuration, formatPercent, formatRelative, passRate, totalTests } from "@/lib/format";
import { normalizeStatus } from "@/lib/hierarchy";
import type { BuildSummary } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { TabBar } from "@/components/ui/tabs";
import { StatusBadge, StatusBar, statusMeta } from "@/components/status";
import { Breadcrumbs, EmptyState, ErrorState, KeyValue, LoadMore, PageTitle, RowsSkeleton, Stat } from "@/components/common";
import { cn } from "@/lib/utils";

const FIRST_PAGE: string | undefined = undefined;

const TABS = [
  { value: "builds", label: "Builds" },
  { value: "quality-gate", label: "Quality gate" },
] as const;
const TabSchema = z.enum(["builds", "quality-gate"]);

const STATUS_FILTERS = ["all", "passed", "failed", "running", "skipped", "unknown"] as const;
const StatusFilterSchema = z.enum(STATUS_FILTERS);

export function ProjectPage() {
  const { projectId: rawId } = useParams();
  const [params, setParams] = useSearchParams();
  const projectId = z.coerce.number().int().positive().safeParse(rawId);
  const name = params.get("name") ?? undefined;
  const tab = TabSchema.catch("builds").parse(params.get("tab"));

  if (!projectId.success) return <ErrorState error="Invalid project id" />;

  return (
    <>
      <Breadcrumbs items={[{ label: "Projects", to: "/projects" }, { label: name ?? `Project ${projectId.data}` }]} />
      <PageTitle title={name ?? `Project ${projectId.data}`} subtitle={<span className="font-mono text-[12px]">ID {projectId.data}</span>} />
      <TabBar
        label="Project sections"
        tabs={TABS}
        value={tab}
        onChange={(t) => setParams((p) => { const n = new URLSearchParams(p); n.set("tab", t); return n; }, { replace: true })}
      />
      <div className="pt-6">
        {tab === "builds" ? <BuildsTab projectId={projectId.data} projectName={name} /> : <QualityGateTab projectName={name} />}
      </div>
    </>
  );
}

function BuildsTab({ projectId, projectName }: { projectId: number; projectName: string | undefined }) {
  const { client, username } = useTraClient();
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [search, setSearch] = useState("");

  const q = useInfiniteQuery({
    queryKey: ["builds", username, projectId, status],
    queryFn: ({ pageParam }) =>
      traApi.builds(client, projectId, { ...(status !== "all" ? { status } : {}), ...(pageParam ? { nextPage: pageParam } : {}) }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (last) => (last.pagination?.hasNext ? (last.pagination.nextPage ?? undefined) : undefined),
  });

  const all = useMemo(() => q.data?.pages.flatMap((p) => p.builds) ?? [], [q.data]);
  const builds = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return all;
    return all.filter((b) =>
      [b.name, b.user, String(b.buildNumber ?? ""), ...b.tags].some((f) => (f ?? "").toLowerCase().includes(needle)),
    );
  }, [all, search]);

  return (
    <div className="space-y-6">
      {all.length > 0 && <Overview builds={all} />}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent" aria-hidden />
          <Input aria-label="Search loaded builds" placeholder="Search name, user, tag" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-muted">
          Status
          <Select
            value={status}
            onChange={(e) => setStatus(StatusFilterSchema.catch("all").parse(e.target.value))}
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>{s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </Select>
        </label>
      </div>

      {q.isPending ? (
        <RowsSkeleton />
      ) : q.isError ? (
        <ErrorState error={q.error} onRetry={() => void q.refetch()} />
      ) : builds.length === 0 ? (
        <EmptyState title="No builds match" hint="Adjust the status filter or search." />
      ) : (
        <>
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead className="border-b border-border bg-background text-muted">
                <tr>
                  <th scope="col" className="px-5 py-2.5 font-semibold">Build</th>
                  <th scope="col" className="px-5 py-2.5 font-semibold">Status</th>
                  <th scope="col" className="w-64 px-5 py-2.5 font-semibold">Tests</th>
                  <th scope="col" className="px-5 py-2.5 font-semibold">Duration</th>
                  <th scope="col" className="px-5 py-2.5 font-semibold">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {builds.map((b) => (
                  <BuildRow key={b.buildId} build={b} projectId={projectId} projectName={projectName} />
                ))}
              </tbody>
            </table>
          </Card>
          <LoadMore hasNext={q.hasNextPage} loading={q.isFetchingNextPage} onClick={() => void q.fetchNextPage()} loaded={all.length} />
        </>
      )}
    </div>
  );
}

function BuildRow({ build: b, projectId, projectName }: { build: BuildSummary; projectId: number; projectName: string | undefined }) {
  const total = totalTests(b.statusStats);
  const link = `/builds/${encodeURIComponent(b.buildId)}?project=${projectId}${projectName ? `&name=${encodeURIComponent(projectName)}` : ""}`;
  return (
    <tr className="align-top t-fast transition-colors hover:bg-background">
      <td className="px-5 py-3">
        <Link to={link} className="font-bold underline-offset-2 hover:underline">
          {b.name ?? "Untitled build"}
          {b.buildNumber != null && <span className="ml-1.5 font-mono text-[12px] font-medium text-muted">#{b.buildNumber}</span>}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-muted">
          {b.user && <span>{b.user}</span>}
          {b.tags.map((t) => <Badge key={t} tone="outline">{t}</Badge>)}
        </div>
      </td>
      <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
      <td className="px-5 py-3">
        <StatusBar stats={b.statusStats} />
        <p className="mt-1.5 whitespace-nowrap font-mono text-[12px] font-medium text-muted">
          {total} tests · {formatPercent(passRate(b.statusStats))} pass
        </p>
      </td>
      <td className="px-5 py-3 font-mono text-[12px] font-medium">{formatDuration(b.duration != null ? b.duration * 1000 : null)}</td>
      <td className="px-5 py-3 text-muted">{formatRelative(b.startedAt)}</td>
    </tr>
  );
}

/** Summary across the builds loaded so far, plus a timeline of recent outcomes. */
function Overview({ builds }: { builds: BuildSummary[] }) {
  const finished = builds.filter((b) => normalizeStatus(b.status) !== "pending");
  const passed = finished.filter((b) => normalizeStatus(b.status) === "passed").length;
  const durations = finished.map((b) => b.duration).filter((d): d is number => typeof d === "number");
  const avg = durations.length ? (durations.reduce((a, b) => a + b, 0) / durations.length) * 1000 : null;
  const timeline = [...builds].slice(0, 30).reverse();
  return (
    <section aria-label="Overview" className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Builds loaded" value={builds.length} />
        <Stat label="Build pass rate" value={formatPercent(finished.length ? passed / finished.length : null)} hint={`${passed} of ${finished.length} finished`} />
        <Stat label="Avg duration" value={formatDuration(avg)} />
        <Stat label="Latest" value={<StatusBadge status={builds[0]?.status} />} hint={formatRelative(builds[0]?.startedAt)} />
      </div>
      <Card className="px-5 py-4">
        <p className="mb-2 font-semibold">Recent builds <span className="font-normal text-muted">(oldest → newest)</span></p>
        <ul className="flex items-end gap-1" aria-label="Recent build outcomes">
          {timeline.map((b) => {
            const s = normalizeStatus(b.status);
            const total = totalTests(b.statusStats);
            return (
              <li
                key={b.buildId}
                title={`#${b.buildNumber ?? "?"} · ${statusMeta(s).label} · ${total} tests`}
                className={cn("h-7 flex-1 rounded-sm", statusMeta(s).bar)}
              >
                <span className="sr-only">Build {b.buildNumber ?? ""}: {statusMeta(s).label}</span>
              </li>
            );
          })}
        </ul>
      </Card>
    </section>
  );
}

function QualityGateTab({ projectName }: { projectName: string | undefined }) {
  const { client, username } = useTraClient();
  const q = useQuery({
    queryKey: ["qg-settings", username, projectName],
    queryFn: () => traApi.qualityGateSettings(client, projectName ?? ""),
    enabled: !!projectName,
  });

  if (!projectName) return <EmptyState title="Project name unavailable" hint="Open this project from the Projects list to view quality gate settings." />;
  if (q.isPending) return <RowsSkeleton rows={3} />;
  if (q.isError) return <ErrorState error={q.error} onRetry={() => void q.refetch()} />;

  const s = q.data;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
        <CardContent>
          <KeyValue
            rows={[
              ["Quality gate", <Badge key="e" tone={s.enabled ? "success" : "neutral"}>{s.enabled ? "Enabled" : "Disabled"}</Badge>],
              ["Overrides build status", s.shouldOverrideBuildStatus == null ? null : s.shouldOverrideBuildStatus ? "Yes" : "No"],
            ]}
          />
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
                <div>
                  <p className="font-bold">{p.name ?? "Untitled profile"}</p>
                  <p className="text-muted">{p.rulesCount ?? 0} rules{p.isGlobalProfile ? " · Global" : ""}</p>
                </div>
                <Badge tone={p.enabled ? "success" : "neutral"}>{p.enabled ? "Enabled" : "Disabled"}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
