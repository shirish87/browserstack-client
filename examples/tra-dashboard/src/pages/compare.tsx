import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowLeftRight } from "lucide-react";
import { useTraClient } from "@/lib/auth";
import { diffRuns, type FlatTest, type RunDiff, type TestChange } from "@/lib/analytics";
import { formatDate, formatDuration, formatPercent, passRate, totalTests } from "@/lib/format";
import { buildQuery, testsQuery } from "@/lib/queries";
import type { BuildDetails } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TallyChart } from "@/components/tra-charts";
import { TabBar } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, StatusIcon } from "@/components/status";
import { TestDrawer, type DrawerTest } from "@/components/test-drawer";
import { buildHref, compareHref } from "@/components/builds";
import { Breadcrumbs, EmptyState, ErrorState, PageTitle } from "@/components/common";

type Category = "newFailures" | "fixed" | "stillFailing" | "slower" | "newlyFlaky" | "added" | "removed";
const LABELS: Record<Category, string> = {
  newFailures: "New failures",
  fixed: "Fixed",
  stillFailing: "Still failing",
  slower: "Slower",
  newlyFlaky: "Newly flaky",
  added: "Added",
  removed: "Removed",
};
const ORDER: Category[] = ["newFailures", "fixed", "stillFailing", "slower", "newlyFlaky", "added", "removed"];

export function ComparePage() {
  const { client, username } = useTraClient();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const baseId = params.get("base");
  const headId = params.get("head");
  const projectId = Number(params.get("project"));
  const projectName = params.get("name") ?? undefined;
  const project = Number.isInteger(projectId) && projectId > 0 ? { id: projectId, name: projectName } : undefined;

  const baseBuild = useQuery({ ...buildQuery(client, username, baseId ?? ""), enabled: !!baseId });
  const headBuild = useQuery({ ...buildQuery(client, username, headId ?? ""), enabled: !!headId });
  const baseTests = useQuery({ ...testsQuery(client, username, baseId ?? ""), enabled: !!baseId });
  const headTests = useQuery({ ...testsQuery(client, username, headId ?? ""), enabled: !!headId });

  const diff = useMemo(
    () => (baseTests.data && headTests.data ? diffRuns(baseTests.data, headTests.data) : undefined),
    [baseTests.data, headTests.data],
  );
  const [picked, setPicked] = useState<Category | null>(null);
  const [drawer, setDrawer] = useState<DrawerTest | null>(null);

  const crumbs = [
    { label: "Runs", to: "/runs" },
    ...(project?.name ? [{ label: project.name, to: `/insights/projects/${project.id}?name=${encodeURIComponent(project.name)}` }] : []),
    { label: "Compare" },
  ];

  if (!baseId || !headId) {
    return (
      <>
        <Breadcrumbs items={crumbs} />
        <EmptyState title="Pick two runs to compare" hint="Select two runs on the Runs page, or use “vs previous” on any run." />
      </>
    );
  }
  const error = baseBuild.error ?? headBuild.error ?? baseTests.error ?? headTests.error;
  if (error) return <><Breadcrumbs items={crumbs} /><ErrorState error={error} /></>;

  const counts = diff ? countsOf(diff) : undefined;
  const active: Category = picked ?? ORDER.find((c) => (counts?.[c] ?? 0) > 0) ?? "newFailures";

  const open = (item: FlatTest, build: BuildDetails | undefined, buildId: string) =>
    setDrawer({ test: item, buildId, buildUrl: build?.observabilityUrl, buildLabel: `${build?.name ?? "Build"} #${build?.buildNumber ?? ""}` });

  return (
    <>
      <Breadcrumbs items={crumbs} />
      <PageTitle
        title="Compare runs"
        subtitle="What changed between a baseline run and a newer one."
        actions={
          <Button variant="outline" size="sm" onClick={() => void navigate(compareHref(headId, baseId, project))}>
            <ArrowLeftRight className="size-3.5" aria-hidden /> Swap
          </Button>
        }
      />

      <div className="mb-6 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
        <RunCard role="Baseline" buildId={baseId} build={baseBuild.data} project={project} />
        <ArrowRight className="hidden self-center text-muted md:block" aria-hidden />
        <RunCard role="Compared" buildId={headId} build={headBuild.data} project={project} />
      </div>

      {baseBuild.data && headBuild.data && <Deltas base={baseBuild.data} head={headBuild.data} />}

      {!diff || !counts ? (
        <Skeleton className="mt-6 h-64" />
      ) : (
        <section className="mt-8" aria-label="Changes">
          <Card className="mb-6">
            <CardHeader><CardTitle>What changed</CardTitle></CardHeader>
            <CardContent><TallyChart label="Changes between the two runs" tally={ORDER.map((c) => ({ label: LABELS[c], count: counts[c] }))} /></CardContent>
          </Card>
          <div className="mb-4 overflow-x-auto">
            <TabBar
              label="Change type"
              tabs={ORDER.map((c) => ({ value: c, label: `${LABELS[c]} ${counts[c]}` }))}
              value={active}
              onChange={setPicked}
            />
          </div>
          <ChangeList
            category={active}
            diff={diff}
            onOpen={(t, side) => open(t, side === "base" ? baseBuild.data : headBuild.data, side === "base" ? baseId : headId)}
          />
        </section>
      )}
      <TestDrawer item={drawer} onClose={() => setDrawer(null)} />
    </>
  );
}

function countsOf(d: RunDiff): Record<Category, number> {
  return {
    newFailures: d.newFailures.length,
    fixed: d.fixed.length,
    stillFailing: d.stillFailing.length,
    slower: d.slower.length,
    newlyFlaky: d.newlyFlaky.length,
    added: d.added.length,
    removed: d.removed.length,
  };
}

function RunCard({ role, buildId, build, project }: { role: string; buildId: string; build: BuildDetails | undefined; project: { id: number; name: string | undefined } | undefined }) {
  if (!build) return <Skeleton className="h-32" />;
  return (
    <Card className="p-5">
      <p className="text-[12px] text-muted">{role}</p>
      <Link to={buildHref(buildId, project)} className="mt-1 block truncate text-[16px] font-medium tracking-[-0.02em] hover:underline">
        {build.name ?? "Build"} <span className="font-mono text-[12px] text-muted">#{build.buildNumber ?? ""}</span>
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
        <StatusBadge status={build.status} />
        <span>{formatDate(build.startedAt)}</span>
        {build.vcsInfo?.branch && <code className="font-mono text-[12px]">{build.vcsInfo.branch}</code>}
        {build.vcsInfo?.sha && <code className="font-mono text-[12px]">{build.vcsInfo.sha.slice(0, 7)}</code>}
      </div>
    </Card>
  );
}

function Delta({ label, base, head, format, deltaFormat, goodWhen }: { label: string; base: number | null; head: number | null; format: (n: number) => string; deltaFormat?: (n: number) => string; goodWhen: "up" | "down" }) {
  const d = base !== null && head !== null ? head - base : null;
  const better = d === null || d === 0 ? null : goodWhen === "up" ? d > 0 : d < 0;
  return (
    <Card className="px-5 py-4">
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-1.5 flex items-baseline gap-2 text-[22px] font-medium tracking-[-0.4px]">
        {head === null ? "—" : format(head)}
        {d !== null && d !== 0 && (
          <span className={`text-[13px] font-medium ${better ? "text-success" : "text-danger"}`}>
            {d > 0 ? "▲" : "▼"} {(deltaFormat ?? format)(Math.abs(d))} {better ? "better" : "worse"}
          </span>
        )}
      </p>
      <p className="mt-0.5 text-[12px] text-muted">was {base === null ? "—" : format(base)}</p>
    </Card>
  );
}

function Deltas({ base, head }: { base: BuildDetails; head: BuildDetails }) {
  return (
    <section aria-label="Run deltas" className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Delta label="Pass rate" base={passRate(base.statusStats)} head={passRate(head.statusStats)} goodWhen="up" format={(n) => formatPercent(n)} deltaFormat={(n) => `${Math.round(n * 1000) / 10} pts`} />
      <Delta label="Failed tests" base={base.statusStats?.failed ?? null} head={head.statusStats?.failed ?? null} goodWhen="down" format={(n) => String(n)} />
      <Delta label="Total tests" base={totalTests(base.statusStats)} head={totalTests(head.statusStats)} goodWhen="up" format={(n) => String(n)} />
      <Delta label="Duration" base={base.duration ?? null} head={head.duration ?? null} goodWhen="down" format={(n) => formatDuration(n * 1000)} />
    </section>
  );
}

function ChangeList({ category, diff, onOpen }: { category: Category; diff: RunDiff; onOpen: (t: FlatTest, side: "base" | "head") => void }) {
  if (category === "added" || category === "removed") {
    const items = category === "added" ? diff.added : diff.removed;
    if (items.length === 0) return <EmptyState title={`No ${LABELS[category].toLowerCase()} tests`} />;
    return (
      <Card>
        <ul className="divide-y divide-border">
          {items.map((t) => (
            <li key={t.key}>
              <Row name={t.name} path={t.path} onClick={() => onOpen(t, category === "added" ? "head" : "base")}
                right={<><StatusIcon status={t.status} /><span className="font-mono text-[12px] text-muted">{formatDuration(t.durationMs)}</span></>}
                sub={t.failures[0]?.error ?? undefined} />
            </li>
          ))}
        </ul>
      </Card>
    );
  }
  const items: TestChange[] | undefined = category === "slower" ? diff.slower : diff[category];
  if (!items || items.length === 0) return <EmptyState title={`No ${LABELS[category].toLowerCase()} tests`} hint="Nothing in this category between the two runs." />;
  return (
    <Card>
      <ul className="divide-y divide-border">
        {items.map((c) => {
          const head = c.head;
          const base = c.base;
          const slow = diff.slower.find((s) => s.key === c.key);
          return (
            <li key={c.key}>
              <Row
                name={c.name}
                path={c.path}
                onClick={() => head && onOpen(head, "head")}
                sub={head?.failures[0]?.error ?? undefined}
                right={
                  <>
                    <span className="flex items-center gap-1.5">
                      {base ? <StatusIcon status={base.status} /> : <Badge tone="outline">new</Badge>}
                      <ArrowRight className="size-3 text-muted" aria-hidden />
                      {head && <StatusIcon status={head.status} />}
                    </span>
                    <span className="w-36 text-right font-mono text-[12px] text-muted">
                      {formatDuration(base?.durationMs ?? null)} → {formatDuration(head?.durationMs ?? null)}
                      {slow && <span className="ml-1 text-warning">+{formatDuration(slow.deltaMs)}</span>}
                    </span>
                  </>
                }
              />
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function Row({ name, path, sub, right, onClick }: { name: string; path: string[]; sub: string | undefined; right: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full cursor-pointer items-start justify-between gap-4 px-5 py-3 text-left t-fast transition-colors hover:bg-surface-2">
      <span className="min-w-0">
        <span className="block truncate font-medium">{name}</span>
        <span className="block truncate text-[12px] text-muted">{path.slice(0, -1).join(" › ")}</span>
        {sub && <span className="mt-1 block truncate font-mono text-[12px] text-danger">{sub}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-4">{right}</span>
    </button>
  );
}
