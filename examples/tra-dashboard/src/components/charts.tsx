import { useId, useMemo, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TabBar } from "@/components/ui/tabs";
import type { NormStatus } from "@/lib/hierarchy";

export interface ChartPoint {
  id: string;
  /** x-axis / table label (e.g. "#238"). */
  label: string;
  /** Secondary line in the tooltip (e.g. a date). */
  sublabel: string;
  value: number | null;
  status: NormStatus;
}

const W = 560;
const H = 196;
const PAD = { top: 12, right: 12, bottom: 26, left: 48 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

function niceDomain(values: number[], kind: "line" | "bars", fixed: [number, number] | undefined): [number, number] {
  if (fixed) return fixed;
  const max = Math.max(1, ...values);
  if (kind === "bars") return [0, max * 1.1];
  return [0, max];
}

/**
 * Thin-line trend (or bars), one neutral series. Status colour is reserved for the
 * points themselves (failed = danger) and never carries meaning alone: the tooltip,
 * table view and aria label all state it in text.
 */
export function SeriesChart({
  points,
  kind,
  format,
  axisFormat,
  domain,
  ariaLabel,
  onSelect,
}: {
  points: ChartPoint[];
  kind: "line" | "bars";
  format: (v: number) => string;
  axisFormat?: (v: number) => string;
  domain?: [number, number];
  ariaLabel: string;
  onSelect?: (point: ChartPoint) => void;
}) {
  const [active, setActive] = useState<number | null>(null);
  const titleId = useId();
  const values = points.map((p) => p.value).filter((v): v is number => v !== null);
  const [lo, hi] = niceDomain(values, kind, domain);
  const n = points.length;
  const x = (i: number): number => PAD.left + (n <= 1 ? PLOT_W / 2 : kind === "bars" ? ((i + 0.5) / n) * PLOT_W : (i / (n - 1)) * PLOT_W);
  const y = (v: number): number => PAD.top + PLOT_H - ((v - lo) / (hi - lo || 1)) * PLOT_H;
  const ticks = [lo, lo + (hi - lo) / 2, hi];
  const axis = axisFormat ?? format;

  const linePath = useMemo(() => {
    let d = "";
    let pen = false;
    points.forEach((p, i) => {
      if (p.value === null) {
        pen = false;
        return;
      }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`;
      pen = true;
    });
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, lo, hi]);

  const nearest = (clientX: number, el: SVGSVGElement): number => {
    const rect = el.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * W;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < n; i++) {
      const d = Math.abs(x(i) - px);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  };

  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (n === 0) return;
    if (e.key === "ArrowRight") setActive((a) => Math.min(n - 1, (a ?? -1) + 1));
    else if (e.key === "ArrowLeft") setActive((a) => Math.max(0, (a ?? n) - 1));
    else if (e.key === "Enter" && active !== null) {
      const p = points[active];
      if (p) onSelect?.(p);
    } else if (e.key === "Escape") setActive(null);
    else return;
    e.preventDefault();
  };

  const activePoint = active !== null ? points[active] : undefined;
  const tipLeft = active !== null ? (x(active) / W) * 100 : 0;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-none select-none"
        role="img"
        aria-labelledby={titleId}
        tabIndex={0}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
        onPointerMove={(e: PointerEvent<SVGSVGElement>) => setActive(nearest(e.clientX, e.currentTarget))}
        onPointerLeave={() => setActive(null)}
        onClick={(e) => {
          const p = points[nearest(e.clientX, e.currentTarget)];
          if (p) onSelect?.(p);
        }}
        style={{ cursor: onSelect ? "pointer" : "default" }}
      >
        <title id={titleId}>{ariaLabel}</title>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--hairline)" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" fontSize={12} fill="var(--ink-subtle)">
              {axis(t)}
            </text>
          </g>
        ))}
        {points.length > 0 && (
          <>
            <text x={PAD.left} y={H - 7} fontSize={12} fill="var(--ink-subtle)">
              {points[0]?.label}
            </text>
            <text x={W - PAD.right} y={H - 7} fontSize={12} textAnchor="end" fill="var(--ink-subtle)">
              {points[n - 1]?.label}
            </text>
          </>
        )}

        {kind === "line" ? (
          <>
            {linePath && <path d={linePath} fill="none" stroke="var(--ink-muted)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}
            {points.map((p, i) =>
              p.value === null ? null : (
                <circle
                  key={p.id}
                  cx={x(i)}
                  cy={y(p.value)}
                  r={active === i ? 5 : 4}
                  fill={p.status === "failed" ? "var(--danger)" : "var(--ink-muted)"}
                  stroke="var(--surface-1)"
                  strokeWidth={2}
                />
              ),
            )}
          </>
        ) : (
          points.map((p, i) => {
            if (p.value === null) return null;
            const bw = Math.max(2, Math.min(18, (PLOT_W / n) * 0.62));
            const top = y(p.value);
            return (
              <rect
                key={p.id}
                x={x(i) - bw / 2}
                y={top}
                width={bw}
                height={Math.max(1, PAD.top + PLOT_H - top)}
                rx={Math.min(4, bw / 2)}
                fill={active === i ? "var(--ink-muted)" : "var(--ink-tertiary)"}
              />
            );
          })
        )}

        {active !== null && <line x1={x(active)} x2={x(active)} y1={PAD.top} y2={PAD.top + PLOT_H} stroke="var(--hairline-strong)" strokeWidth={1} />}
      </svg>

      {activePoint && (
        <div
          role="status"
          className="panel pointer-events-none absolute top-0 z-10 w-max max-w-[220px] -translate-x-1/2 rounded-md px-3 py-2 text-[12px] shadow-lg"
          style={{ left: `${Math.min(88, Math.max(12, tipLeft))}%` }}
        >
          <p className="font-medium">{activePoint.label}</p>
          <p className="text-muted">{activePoint.sublabel}</p>
          <p className="mt-1 font-mono">{activePoint.value === null ? "No data" : format(activePoint.value)}</p>
          <p className={cn("mt-0.5", activePoint.status === "failed" && "text-danger")}>{statusWord(activePoint.status)}</p>
        </div>
      )}
    </div>
  );
}

function statusWord(s: NormStatus): string {
  return s === "pending" ? "Running" : s.charAt(0).toUpperCase() + s.slice(1);
}

/** Card with a Chart / Table switch so the same numbers are available without hovering. */
export function ChartCard({
  title,
  subtitle,
  points,
  kind,
  format,
  axisFormat,
  domain,
  valueHeader,
  onSelect,
  empty,
}: {
  title: string;
  subtitle?: ReactNode;
  points: ChartPoint[];
  kind: "line" | "bars";
  format: (v: number) => string;
  axisFormat?: (v: number) => string;
  domain?: [number, number];
  valueHeader: string;
  onSelect?: (p: ChartPoint) => void;
  empty: string;
}) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const hasData = points.some((p) => p.value !== null);
  return (
    <section className="panel rounded-lg" aria-label={title}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div>
          <h2 className="text-[14px] font-medium">{title}</h2>
          {subtitle && <p className="text-[12px] text-muted">{subtitle}</p>}
        </div>
        {hasData && (
          <TabBar
            label={`${title} view`}
            tabs={[
              { value: "chart", label: "Chart" },
              { value: "table", label: "Table" },
            ]}
            value={view}
            onChange={setView}
          />
        )}
      </header>
      <div className="px-3 py-4 sm:px-5">
        {!hasData ? (
          <p className="py-10 text-center text-muted">{empty}</p>
        ) : view === "chart" ? (
          <SeriesChart
            points={points}
            kind={kind}
            format={format}
            {...(axisFormat ? { axisFormat } : {})}
            {...(domain ? { domain } : {})}
            ariaLabel={`${title}: ${points.length} builds`}
            {...(onSelect ? { onSelect } : {})}
          />
        ) : (
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-left">
              <thead className="text-[13px] text-muted">
                <tr>
                  <th scope="col" className="py-1.5 pr-4 font-medium">Build</th>
                  <th scope="col" className="py-1.5 pr-4 font-medium">Started</th>
                  <th scope="col" className="py-1.5 pr-4 font-medium">{valueHeader}</th>
                  <th scope="col" className="py-1.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...points].reverse().map((p) => (
                  <tr key={p.id}>
                    <td className="py-1.5 pr-4 font-mono text-[12px]">{p.label}</td>
                    <td className="py-1.5 pr-4 text-muted">{p.sublabel}</td>
                    <td className="py-1.5 pr-4 font-mono text-[12px]">{p.value === null ? "—" : format(p.value)}</td>
                    <td className="py-1.5">{statusWord(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

/** Tiny inline trend for dense lists: pass rate per build, failed builds marked. */
export function Sparkline({ points, label }: { points: { value: number | null; failed: boolean }[]; label: string }) {
  const w = 120;
  const h = 32;
  const vals = points.map((p) => p.value);
  const present = vals.filter((v): v is number => v !== null);
  if (present.length < 2) return <div className="h-8 w-[120px] rounded-md bg-surface-2" role="img" aria-label={`${label}: not enough data`} />;
  const lo = Math.min(...present, 0.9);
  const sx = (i: number): number => 2 + (i / (points.length - 1)) * (w - 4);
  const sy = (v: number): number => h - 3 - ((v - lo) / (1 - lo || 1)) * (h - 6);
  let d = "";
  let pen = false;
  vals.forEach((v, i) => {
    if (v === null) {
      pen = false;
      return;
    }
    d += `${pen ? "L" : "M"}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`;
    pen = true;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={label}>
      <path d={d} fill="none" stroke="var(--ink-muted)" strokeWidth={1.5} strokeLinejoin="round" />
      {points.map((p, i) => (p.failed && p.value !== null ? <circle key={i} cx={sx(i)} cy={sy(p.value)} r={2.5} fill="var(--danger)" /> : null))}
    </svg>
  );
}
