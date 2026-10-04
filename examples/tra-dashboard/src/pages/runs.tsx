import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { GitCompare, Radio } from "lucide-react";
import { useTraClient } from "@/lib/auth";
import { estimateRemainingSec, runProgress } from "@/lib/analytics";
import { formatDuration, outcomes } from "@/lib/format";
import { useNow } from "@/lib/hooks";
import { LIVE_POLL_MS, projectsQuery, windowQuery } from "@/lib/queries";
import { traApi } from "@/lib/api";
import { hasBuildId, mostRecentFirst, type IdentifiedBuild, type NamedProject } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BuildsTable, buildHref, compareHref } from "@/components/builds";
import { EmptyState, ErrorState, PageTitle } from "@/components/common";
import { StatusBar } from "@/components/status";

const DAY_OPTIONS = [7, 30, 90] as const;

export function RunsPage() {
  const { client, username } = useTraClient();
  const projects = useQuery(projectsQuery(client, username));

  if (projects.isPending) return <Skeleton className="h-64" />;
  if (projects.isError) return <ErrorState error={projects.error} onRetry={() => void projects.refetch()} />;

  return (
    <>
      <PageTitle title="Runs" subtitle="What’s running right now, and how any run differs from the one before it." />
      <LiveNow projects={projects.data} />
      <AllRuns projects={projects.data} />
    </>
  );
}

function LiveNow({ projects }: { projects: NamedProject[] }) {
  const { client, username } = useTraClient();
  const results = useQueries({
    queries: projects.map((p) => ({
      queryKey: ["builds-running", username, p.id],
      queryFn: () => traApi.builds(client, p.id, { status: "running" }),
      refetchInterval: LIVE_POLL_MS,
    })),
  });
  const live = results.flatMap((r, i) => {
    const project = projects[i];
    return project ? (r.data?.builds ?? []).filter(hasBuildId).map((b) => ({ build: b, project })) : [];
  });
  const loading = results.some((r) => r.isPending);

  return (
    <section aria-labelledby="live-heading" className="mb-10">
      <div className="mb-3 flex items-center gap-3">
        <h2 id="live-heading" className="text-[22px] font-medium tracking-[-0.4px]">Live now</h2>
        <span className="inline-flex items-center gap-1.5 text-[12px] text-muted">
          <Radio className="size-3.5 text-success" aria-hidden /> refreshing every {LIVE_POLL_MS / 1000}s
        </span>
      </div>
      {loading && live.length === 0 ? (
        <Skeleton className="h-28" />
      ) : live.length === 0 ? (
        <EmptyState title="Nothing is running" hint="Runs in progress show here with live progress and an estimated time remaining." />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {live.map(({ build, project }) => (
            <li key={build.buildId}><LiveRunCard build={build} project={project} /></li>
          ))}
        </ul>
      )}
    </section>
  );
}

function LiveRunCard({ build, project }: { build: IdentifiedBuild; project: NamedProject }) {
  const now = useNow();
  const { done, total, fraction } = runProgress(build.statusStats);
  const started = Date.parse(build.startedAt ?? "");
  const elapsed = Number.isNaN(started) ? null : Math.max(0, Math.round((now - started) / 1000));
  const remaining = elapsed === null ? null : estimateRemainingSec(fraction, elapsed);
  const failed = outcomes(build.statusStats).failed;
  return (
    <Link
      to={buildHref(build.buildId, { id: project.id, name: project.name })}
      className="panel block rounded-lg p-5 t-fast transition-colors hover:border-border-strong hover:bg-surface-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[12px] text-muted">{project.name}</p>
          <h3 className="truncate text-[16px] font-medium tracking-[-0.02em]">
            {build.name ?? "Build"} <span className="font-mono text-[12px] text-muted">#{build.buildNumber ?? ""}</span>
          </h3>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-warning-bg px-2 py-0.5 text-[12px] font-medium text-warning">
          <span className="size-1.5 animate-pulse rounded-full bg-warning" aria-hidden /> Running
        </span>
      </div>
      <div className="mt-4">
        <StatusBar stats={build.statusStats} className="h-2" />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 text-[12px]">
          <span className="font-mono text-ink-muted">{done}/{total} tests · {Math.round(fraction * 100)}%</span>
          <span className={failed > 0 ? "font-medium text-danger" : "text-muted"}>{failed} failed so far</span>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-muted">
        {elapsed !== null && <>Elapsed {formatDuration(elapsed * 1000)}</>}
        {remaining !== null && <> · about {formatDuration(remaining * 1000)} left</>}
        {build.user && <> · {build.user}</>}
      </p>
    </Link>
  );
}

function AllRuns({ projects }: { projects: NamedProject[] }) {
  const { client, username } = useTraClient();
  const navigate = useNavigate();
  const withBuilds = mostRecentFirst(projects);
  const [projectId, setProjectId] = useState<number | undefined>(withBuilds[0]?.id);
  const [days, setDays] = useState<(typeof DAY_OPTIONS)[number]>(30);
  const [status, setStatus] = useState<string>("all");
  const [user, setUser] = useState<string>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [shown, setShown] = useState(25);

  const project = projects.find((p) => p.id === projectId);
  const q = useQuery({
    ...windowQuery(client, username, projectId ?? 0, days),
    enabled: projectId !== undefined,
    refetchInterval: (query) => ((query.state.data ?? []).some((b) => b.status === "running") ? LIVE_POLL_MS * 3 : false),
  });

  const builds = q.data ?? [];
  const users = useMemo(() => [...new Set(builds.map((b) => b.user).filter((u): u is string => !!u))].sort(), [builds]);
  const visible = builds.filter((b) => (status === "all" || b.status === status) && (user === "all" || b.user === user));

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 2 ? s : [...s, id]));
  const compareSelected = () => {
    const [a, b] = selected.map((id) => builds.find((x) => x.buildId === id));
    if (!a || !b || !project) return;
    const [base, head] = Date.parse(a.startedAt ?? "") <= Date.parse(b.startedAt ?? "") ? [a, b] : [b, a];
    void navigate(compareHref(base.buildId, head.buildId, { id: project.id, name: project.name }));
  };

  return (
    <section aria-labelledby="all-runs-heading">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 id="all-runs-heading" className="text-[22px] font-medium tracking-[-0.4px]">All runs</h2>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-muted">Project
            <Select value={projectId ?? ""} onChange={(e) => { setProjectId(Number(e.target.value)); setSelected([]); }}>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </label>
          <label className="flex items-center gap-2 text-muted">Range
            <Select value={days} onChange={(e) => setDays(e.target.value === "7" ? 7 : e.target.value === "90" ? 90 : 30)}>
              {DAY_OPTIONS.map((d) => <option key={d} value={d}>{d} days</option>)}
            </Select>
          </label>
          <label className="flex items-center gap-2 text-muted">Status
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All</option><option value="passed">Passed</option><option value="failed">Failed</option><option value="running">Running</option>
            </Select>
          </label>
          <label className="flex items-center gap-2 text-muted">User
            <Select value={user} onChange={(e) => setUser(e.target.value)}>
              <option value="all">Anyone</option>{users.map((u) => <option key={u} value={u}>{u}</option>)}
            </Select>
          </label>
        </div>
      </div>

      {selected.length > 0 && (
        <Card className="mb-4 flex items-center justify-between gap-3 px-5 py-3" role="status">
          <span>{selected.length === 1 ? "Select one more run to compare" : "2 runs selected"}</span>
          <span className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelected([])}>Clear</Button>
            <Button size="sm" disabled={selected.length !== 2} onClick={compareSelected}><GitCompare className="size-3.5" aria-hidden /> Compare</Button>
          </span>
        </Card>
      )}

      {!project ? (
        <EmptyState title="No projects" />
      ) : q.isPending ? (
        <Skeleton className="h-64" />
      ) : q.isError ? (
        <ErrorState error={q.error} onRetry={() => void q.refetch()} />
      ) : visible.length === 0 ? (
        <EmptyState title="No runs match" hint={builds.length === 0 ? `No builds in ${project.name} in the last ${days} days.` : "Adjust the filters."} />
      ) : (
        <>
          <BuildsTable builds={visible.slice(0, shown)} project={{ id: project.id, name: project.name }} allBuilds={builds} selection={{ selected, onToggle: toggle }} />
          <div className="mt-4 flex items-center justify-between text-muted">
            <span>Showing {Math.min(shown, visible.length)} of {visible.length}</span>
            {visible.length > shown && <Button variant="outline" onClick={() => setShown((n) => n + 25)}>Show more</Button>}
          </div>
        </>
      )}
    </section>
  );
}
