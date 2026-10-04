import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ExternalLink as ExtIcon, Search } from "lucide-react";
import { useTraClient } from "@/lib/auth";
import { traApi } from "@/lib/api";
import { formatDate, formatRelative } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState, ErrorState, LoadMore, PageTitle, RowsSkeleton } from "@/components/common";

const FIRST_PAGE: string | undefined = undefined;

export function ProjectsPage() {
  const { client, username } = useTraClient();
  const [query, setQuery] = useState("");

  const q = useInfiniteQuery({
    queryKey: ["projects", username],
    queryFn: ({ pageParam }) => traApi.projects(client, pageParam),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (last) => (last.pagination?.hasNext ? (last.pagination.nextPage ?? undefined) : undefined),
  });

  const projects = useMemo(() => {
    const all = q.data?.pages.flatMap((p) => p.projects) ?? [];
    const needle = query.trim().toLowerCase();
    const filtered = needle ? all.filter((p) => p.name.toLowerCase().includes(needle)) : all;
    return [...filtered].sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
  }, [q.data, query]);

  return (
    <>
      <PageTitle title="Projects" subtitle="Everything reporting into Test Reporting & Analytics, most recently active first." />
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-accent" aria-hidden />
        <Input aria-label="Filter projects" placeholder="Filter projects" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {q.isPending ? (
        <RowsSkeleton />
      ) : q.isError ? (
        <ErrorState error={q.error} onRetry={() => void q.refetch()} />
      ) : projects.length === 0 ? (
        <EmptyState title="No projects found" hint={query ? "Try a different filter." : "Report a build to see it here."} />
      ) : (
        <>
          <Card className="overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-border bg-surface-2 text-[13px] text-muted">
                <tr>
                  <th scope="col" className="px-5 py-2.5 font-medium">Project</th>
                  <th scope="col" className="px-5 py-2.5 font-medium">ID</th>
                  <th scope="col" className="px-5 py-2.5 font-medium">Last activity</th>
                  <th scope="col" className="px-5 py-2.5 font-medium">Created</th>
                  <th scope="col" className="px-5 py-2.5"><span className="sr-only">Open in BrowserStack</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((p) => (
                  <tr key={p.id} className="t-fast transition-colors hover:bg-surface-2">
                    <td className="px-5 py-3">
                      <Link
                        to={`/projects/${p.id}?name=${encodeURIComponent(p.name)}`}
                        className="font-semibold underline-offset-2 hover:underline"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 font-mono text-[12px] font-medium text-muted">{p.id}</td>
                    <td className="px-5 py-3" title={formatDate(p.updatedAt)}>{formatRelative(p.updatedAt)}</td>
                    <td className="px-5 py-3 text-muted">{formatDate(p.createdAt)}</td>
                    <td className="px-5 py-3 text-right">
                      {p.observabilityUrl && (
                        <a href={p.observabilityUrl} target="_blank" rel="noreferrer noopener" aria-label={`Open ${p.name} in BrowserStack`} className="text-muted hover:text-text">
                          <ExtIcon className="inline size-4" aria-hidden />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <LoadMore hasNext={q.hasNextPage} loading={q.isFetchingNextPage} onClick={() => void q.fetchNextPage()} loaded={projects.length} />
        </>
      )}
    </>
  );
}
