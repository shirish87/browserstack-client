import type { ReactNode } from "react";
import { Link } from "react-router";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { errorMessage } from "@/lib/utils";

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1 text-muted">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
          {item.to ? (
            <Link to={item.to} className="rounded-sm hover:text-text hover:underline">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-text">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageTitle({ title, subtitle, actions }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[22px] font-bold leading-tight tracking-[-0.22px]">{title}</h1>
        {subtitle && <div className="mt-1 text-muted">{subtitle}</div>}
      </div>
      {actions}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <Card role="alert" className="flex items-start gap-3 border-danger/30 bg-danger-bg p-5">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-bold text-danger">Couldn’t load this data</p>
        <p className="mt-0.5 break-words text-muted">{errorMessage(error)}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Card>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <Card className="px-6 py-12 text-center">
      <p className="font-bold">{title}</p>
      {hint && <p className="mt-1 text-muted">{hint}</p>}
    </Card>
  );
}

export function RowsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Card className="divide-y divide-border" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-2 flex-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </Card>
  );
}

export function LoadMore({
  hasNext,
  loading,
  onClick,
  loaded,
}: {
  hasNext: boolean;
  loading: boolean;
  onClick: () => void;
  loaded: number;
}) {
  return (
    <div className="mt-4 flex items-center justify-between text-muted">
      <span>{loaded} loaded</span>
      {hasNext && (
        <Button variant="outline" onClick={onClick} disabled={loading}>
          {loading ? "Loading…" : "Load more"}
        </Button>
      )}
    </div>
  );
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className="font-semibold underline-offset-2 hover:underline">
      {children}
    </a>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <Card className="px-5 py-4">
      <p className="text-muted">{label}</p>
      <p className="mt-1 text-[22px] font-bold leading-tight tracking-[-0.22px]">{value}</p>
      {hint && <p className="mt-0.5 text-[12px] text-muted">{hint}</p>}
    </Card>
  );
}

export function KeyValue({ rows }: { rows: [string, ReactNode][] }) {
  const visible = rows.filter(([, v]) => v !== null && v !== undefined && v !== "");
  if (visible.length === 0) return <p className="text-muted">No details reported.</p>;
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
      {visible.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-muted">{k}</dt>
          <dd className="min-w-0 break-words font-medium">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
