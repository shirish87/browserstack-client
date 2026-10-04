import { Link } from "react-router";
import { GitCompare } from "lucide-react";
import { formatDuration, formatPercent, formatRelative, passRate, totalTests } from "@/lib/format";
import type { IdentifiedBuild } from "@/lib/schemas";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusBadge, StatusBar } from "@/components/status";

export function buildHref(buildId: string, project?: { id: number; name?: string | undefined }): string {
  const q = new URLSearchParams();
  if (project) {
    q.set("project", String(project.id));
    if (project.name) q.set("name", project.name);
  }
  const qs = q.toString();
  return `/builds/${encodeURIComponent(buildId)}${qs ? `?${qs}` : ""}`;
}

export function compareHref(baseId: string, headId: string, project?: { id: number; name?: string | undefined }): string {
  const q = new URLSearchParams({ base: baseId, head: headId });
  if (project) {
    q.set("project", String(project.id));
    if (project.name) q.set("name", project.name);
  }
  return `/runs/compare?${q.toString()}`;
}

/** The build before `buildId` in a newest-first or unordered list (by start time), skipping live runs. */
export function previousBuild<T extends { buildId: string; startedAt?: string | null | undefined; status?: string | null | undefined }>(
  builds: T[],
  buildId: string,
): T | undefined {
  const current = builds.find((b) => b.buildId === buildId);
  const t = Date.parse(current?.startedAt ?? "");
  if (Number.isNaN(t)) return undefined;
  return builds
    .filter((b) => b.buildId !== buildId && b.status !== "running" && Date.parse(b.startedAt ?? "") < t)
    .sort((a, b) => Date.parse(b.startedAt ?? "") - Date.parse(a.startedAt ?? ""))[0];
}

export interface BuildsTableProps {
  builds: IdentifiedBuild[];
  project?: { id: number; name?: string | undefined };
  /** When set, rows get a checkbox (max two selectable) and a "vs previous" action. */
  selection?: { selected: string[]; onToggle: (buildId: string) => void };
  /** All builds of the project, used to resolve "previous run". Defaults to `builds`. */
  allBuilds?: IdentifiedBuild[];
  projectLabel?: (b: IdentifiedBuild) => string;
}

export function BuildsTable({ builds, project, selection, allBuilds, projectLabel }: BuildsTableProps) {
  const pool = allBuilds ?? builds;
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left">
        <thead className="border-b border-border bg-surface-2 text-[13px] text-muted">
          <tr>
            {selection && <th scope="col" className="w-10 px-4 py-2.5"><span className="sr-only">Select</span></th>}
            <th scope="col" className="px-4 py-2.5 font-medium">Run</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
            <th scope="col" className="w-64 px-4 py-2.5 font-medium">Tests</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Duration</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Started</th>
            <th scope="col" className="px-4 py-2.5"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {builds.map((b) => {
            const prev = previousBuild(pool, b.buildId);
            const checked = selection?.selected.includes(b.buildId) ?? false;
            const full = (selection?.selected.length ?? 0) >= 2;
            return (
              <tr key={b.buildId} className="align-top t-fast transition-colors hover:bg-surface-2">
                {selection && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="size-4 accent-primary"
                      checked={checked}
                      disabled={!checked && full}
                      onChange={() => selection.onToggle(b.buildId)}
                      aria-label={`Select ${b.name ?? "build"} #${b.buildNumber ?? ""} to compare`}
                    />
                  </td>
                )}
                <td className="px-4 py-3">
                  <Link to={buildHref(b.buildId, project)} className="font-medium underline-offset-2 hover:underline">
                    {b.name ?? "Untitled build"}
                    {b.buildNumber != null && <span className="ml-1.5 font-mono text-[12px] text-muted">#{b.buildNumber}</span>}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-muted">
                    {projectLabel && <span className="text-ink-muted">{projectLabel(b)}</span>}
                    {b.user && <span>{b.user}</span>}
                    {(b.tags ?? []).map((t) => <Badge key={t} tone="outline">{t}</Badge>)}
                  </div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="px-4 py-3">
                  <StatusBar stats={b.statusStats} />
                  <p className="mt-1.5 whitespace-nowrap font-mono text-[12px] text-muted">
                    {totalTests(b.statusStats)} tests · {formatPercent(passRate(b.statusStats))} pass
                  </p>
                </td>
                <td className="px-4 py-3 font-mono text-[12px]">{formatDuration(b.duration)}</td>
                <td className="px-4 py-3 text-muted">{formatRelative(b.startedAt)}</td>
                <td className="px-4 py-3 text-right">
                  {prev && b.status !== "running" && (
                    <Link
                      to={compareHref(prev.buildId, b.buildId, project)}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-[13px] text-muted t-fast transition-colors hover:bg-surface-3 hover:text-text"
                      title={`Compare with #${prev.buildNumber ?? "previous"}`}
                    >
                      <GitCompare className="size-3.5" aria-hidden /> vs previous
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
