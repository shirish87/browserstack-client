import { CheckCircle2, CircleHelp, Loader2, MinusCircle, XCircle, type LucideIcon } from "lucide-react";
import type { StatusStats } from "@/lib/schemas";
import { normalizeStatus, type NormStatus } from "@/lib/hierarchy";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { totalTests } from "@/lib/format";
import { cn } from "@/lib/utils";

const META: Record<NormStatus, { label: string; tone: BadgeTone; Icon: LucideIcon; bar: string }> = {
  passed: { label: "Passed", tone: "success", Icon: CheckCircle2, bar: "bg-success" },
  failed: { label: "Failed", tone: "danger", Icon: XCircle, bar: "bg-danger" },
  pending: { label: "Running", tone: "warning", Icon: Loader2, bar: "bg-warning" },
  skipped: { label: "Skipped", tone: "neutral", Icon: MinusCircle, bar: "bg-accent" },
  unknown: { label: "Unknown", tone: "neutral", Icon: CircleHelp, bar: "bg-border" },
};

export function statusMeta(status: NormStatus) {
  return META[status];
}

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const norm = normalizeStatus(status);
  const { label, tone, Icon } = META[norm];
  return (
    <Badge tone={tone}>
      <Icon className={cn("size-3.5", norm === "pending" && "animate-spin")} aria-hidden />
      {label}
    </Badge>
  );
}

export function StatusIcon({ status, className }: { status: NormStatus; className?: string }) {
  const { Icon, label } = META[status];
  const color =
    status === "passed" ? "text-success" : status === "failed" ? "text-danger" : status === "pending" ? "text-warning" : "text-accent";
  return <Icon role="img" aria-label={label} className={cn("size-4 shrink-0", color, status === "pending" && "animate-spin", className)} />;
}

const ORDER: NormStatus[] = ["passed", "failed", "pending", "skipped", "unknown"];

export function StatusBar({ stats, className }: { stats: StatusStats | undefined; className?: string }) {
  const total = totalTests(stats);
  if (!stats || total === 0) {
    return <div className={cn("h-2 rounded-full bg-neutral-bg", className)} role="img" aria-label="No test results" />;
  }
  const summary = ORDER.filter((k) => stats[k] > 0)
    .map((k) => `${stats[k]} ${META[k].label.toLowerCase()}`)
    .join(", ");
  return (
    <div className={cn("flex h-2 overflow-hidden rounded-full bg-neutral-bg", className)} role="img" aria-label={summary}>
      {ORDER.map((k) =>
        stats[k] > 0 ? <div key={k} className={META[k].bar} style={{ width: `${(stats[k] / total) * 100}%` }} /> : null,
      )}
    </div>
  );
}

export function StatusLegend({ stats }: { stats: StatusStats | undefined }) {
  if (!stats) return null;
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1">
      {ORDER.map((k) => (
        <li key={k} className="flex items-center gap-2 text-muted">
          <span className={cn("size-2.5 rounded-sm", META[k].bar)} aria-hidden />
          <span className="font-mono text-[12px] font-medium text-text">{stats[k]}</span>
          {META[k].label}
        </li>
      ))}
    </ul>
  );
}

