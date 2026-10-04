import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useTraClient } from "@/lib/auth";
import { linkedSessionQuery, sessionLogsQuery, testsQuery } from "@/lib/queries";
import { buildTimeline, eventsBefore, formatBytes, sessionEvidence, signalsIn, waterfallOf, windowOf, type SessionEvidence } from "@/lib/session";
import { formatDuration } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TabBar } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status";
import { Breadcrumbs, EmptyState, ErrorState, ExternalLink, KeyValue, PageTitle } from "@/components/common";
import { cn } from "@/lib/utils";

type Tab = "commands" | "network" | "console" | "log";
const TABS = [
  { value: "commands", label: "Commands" },
  { value: "network", label: "Network" },
  { value: "console", label: "Console" },
  { value: "log", label: "Raw log" },
] as const;

const clock = (ms: number): string => new Date(ms).toISOString().slice(11, 23);

export function SessionPage() {
  const { buildId = "", sessionId = "" } = useParams();
  const [params] = useSearchParams();
  const { client, username } = useTraClient();
  const testKey = params.get("test");
  const [tab, setTab] = useState<Tab>("commands");

  const tests = useQuery(testsQuery(client, username, buildId));
  const sessionTests = useMemo(() => (tests.data ?? []).filter((t) => t.sessionId === sessionId), [tests.data, sessionId]);
  const selected = sessionTests.find((t) => t.key === testKey);
  const device = sessionTests.find((t) => t.platform.device)?.platform.device;

  const linked = useQuery(linkedSessionQuery(client, username, sessionId, device));
  const logs = useQuery({ ...sessionLogsQuery(client, username, sessionId, device), enabled: !!linked.data });
  const evidence = useMemo(() => (logs.data ? sessionEvidence(logs.data) : undefined), [logs.data]);

  const crumbs = [{ label: "Insights", to: "/insights" }, { label: "Build", to: `/builds/${encodeURIComponent(buildId)}` }, { label: "Session" }];

  if (linked.isPending) return <Skeleton className="h-64" />;
  if (linked.isError) return <ErrorState error={linked.error} onRetry={() => void linked.refetch()} />;
  if (!linked.data) {
    return (
      <>
        <Breadcrumbs items={crumbs} />
        <EmptyState title="Session not found" hint="Neither Automate nor App Automate knows this session. It may belong to another account or have expired." />
      </>
    );
  }

  const s = linked.data.session;
  const window = selected ? windowOf(selected) : undefined;
  return (
    <div className="space-y-6">
      <Breadcrumbs items={crumbs} />
      <PageTitle
        title={s.name ?? sessionId}
        subtitle={
          <span className="inline-flex flex-wrap items-center gap-2">
            <StatusBadge status={s.status} />
            <Badge tone="outline">{linked.data.product === "automate" ? "Automate" : "App Automate"}</Badge>
            {s.duration ? <span>{formatDuration(s.duration * 1000)}</span> : null}
            {s.publicUrl && <ExternalLink href={s.publicUrl}>Open in BrowserStack</ExternalLink>}
          </span>
        }
      />
      <Card>
        <CardContent className="py-4">
          <KeyValue
            rows={[
              ["Platform", [s.os, s.osVersion].filter(Boolean).join(" ") || "—"],
              ["Browser / device", [s.browser ?? s.device, s.browserVersion].filter(Boolean).join(" ") || "—"],
              ["Build", s.buildName ?? "—"],
              ["Tests in this session", String(sessionTests.length)],
            ]}
          />
        </CardContent>
      </Card>

      {selected && window && evidence && <TestWindow name={selected.name} status={selected.status} evidence={evidence} startMs={window.startMs} endMs={window.endMs} />}
      {evidence && <TimelineCard tests={sessionTests} evidence={evidence} />}

      <div className="space-y-3">
        <TabBar tabs={TABS} value={tab} onChange={setTab} label="Session evidence" />
        {logs.isPending && <Skeleton className="h-48" />}
        {logs.isError && <ErrorState error={logs.error} onRetry={() => void logs.refetch()} />}
        {evidence && <Evidence tab={tab} evidence={evidence} />}
      </div>
    </div>
  );
}

function TestWindow({ name, status, evidence, startMs, endMs }: { name: string; status: string; evidence: SessionEvidence; startMs: number; endMs: number }) {
  const w = { startMs, endMs };
  const signals = signalsIn(w, evidence.commands, evidence.rows);
  const lead = eventsBefore(w, evidence.commands, evidence.rows, 8);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <StatusBadge status={status} />
      </CardHeader>
      <CardContent className="space-y-4 py-4">
        <section aria-label="Signals">
          <h3 className="mb-2 text-[13px] font-medium text-muted">What went wrong in this test’s window</h3>
          {signals.length === 0 ? <p className="text-muted">No failed or slow requests or commands.</p> : (
            <ul className="space-y-1">
              {signals.map((x, i) => <li key={i} className="font-mono text-[12px] text-danger"><span className="text-muted">{clock(x.atMs)}</span> {x.text}</li>)}
            </ul>
          )}
        </section>
        <section aria-label="Leading up to the end">
          <h3 className="mb-2 text-[13px] font-medium text-muted">Last events before it ended</h3>
          <ul className="space-y-1">
            {lead.map((e, i) => (
              <li key={i} className={cn("font-mono text-[12px]", e.failed && "text-danger")}><span className="text-muted">{clock(e.atMs)} {e.kind}</span> {e.text}</li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

function TimelineCard({ tests, evidence }: { tests: Parameters<typeof buildTimeline>[0]["tests"]; evidence: SessionEvidence }) {
  const tl = buildTimeline({ tests, rows: evidence.rows, commands: evidence.commands, buckets: 60 });
  const span = tl.endMs - tl.startMs;
  const pct = (ms: number): string => `${(((ms - tl.startMs) / span) * 100).toFixed(2)}%`;
  const strip = (label: string, buckets: typeof tl.network) => {
    const max = Math.max(1, ...buckets.map((b) => b.total));
    return (
      <div className="flex items-center gap-3">
        <span className="w-20 shrink-0 text-[12px] text-muted">{label}</span>
        <div className="flex h-8 flex-1 items-end gap-px" role="img" aria-label={`${label} over time`}>
          {buckets.map((b, i) => (
            <div key={i} className={cn("flex-1 rounded-[1px]", b.bad ? "bg-danger" : "bg-accent")} style={{ height: `${Math.max(b.total ? 8 : 0, (b.total / max) * 100)}%` }} title={`${b.total} (${b.bad} failed)`} />
          ))}
        </div>
      </div>
    );
  };
  return (
    <Card>
      <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
      <CardContent className="space-y-2 py-4">
        {strip("Commands", tl.commands)}
        {strip("Network", tl.network)}
        <div className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-[12px] text-muted">Tests</span>
          <div className="relative h-6 flex-1">
            {tl.tests.map((t) => (
              <div key={t.key} title={`${t.name} · ${t.status}`} className={cn("absolute top-0 h-full rounded-sm", t.status === "failed" ? "bg-danger" : t.status === "passed" ? "bg-success" : "bg-border")} style={{ left: pct(t.startMs), width: `max(3px, calc(${pct(t.endMs)} - ${pct(t.startMs)}))` }} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/** A bounded, thin-scrollbar pane: long logs scroll inside the card instead of stretching the page. */
function ScrollPane({ children, label }: { children: React.ReactNode; label: string }) {
  return <div className="scroll-thin max-h-[560px] overflow-auto" role="region" aria-label={label} tabIndex={0}>{children}</div>;
}

const TH = "sticky top-0 bg-surface-1 px-3 py-1.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted";

function Evidence({ tab, evidence }: { tab: Tab; evidence: SessionEvidence }) {
  const note = evidence.notes.find((n) => (tab === "commands" || tab === "log" ? n.kind === "text" : n.kind === tab));
  if (tab === "commands") {
    return evidence.commands.length === 0 ? <EmptyState title="No commands" {...(note ? { hint: note.message } : {})} /> : (
      <Card><ScrollPane label="Commands"><table className="w-full text-[12px]">
        <thead><tr><th className={TH}>Time</th><th className={TH}>Command</th><th className={cn(TH, "text-right")}>Took</th><th className={TH}>Error</th></tr></thead>
        <tbody>
        {evidence.commands.map((c, i) => (
          <tr key={i} className={cn("border-b border-border last:border-0", c.failed && "bg-danger-bg")}>
            <td className="whitespace-nowrap px-3 py-1.5 font-mono text-muted">{clock(c.startMs)}</td>
            <td className="break-all px-3 py-1.5 font-mono">{c.method} {c.path}</td>
            <td className="whitespace-nowrap px-3 py-1.5 text-right text-muted">{c.durationMs === undefined ? "" : `${c.durationMs} ms`}</td>
            <td className="px-3 py-1.5 text-danger">{c.error}</td>
          </tr>
        ))}
        </tbody></table></ScrollPane></Card>
    );
  }
  if (tab === "network") {
    const bars = waterfallOf(evidence.rows);
    return evidence.rows.length === 0 ? <EmptyState title="No network log" {...(note ? { hint: note.message } : {})} /> : (
      <Card>
        <div className="flex gap-4 border-b border-border px-3 py-2 text-[11px] text-muted" aria-hidden>
          <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2 w-3 rounded-[1px] bg-border" />Connect</span>
          <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2 w-3 rounded-[1px] bg-primary" />Server wait</span>
          <span className="inline-flex items-center gap-1.5"><i className="inline-block h-2 w-3 rounded-[1px] bg-success" />Transfer</span>
        </div>
        <ScrollPane label="Network requests"><table className="w-full text-[12px]">
          <thead><tr><th className={TH}>Time</th><th className={TH}>Method</th><th className={TH}>Request</th><th className={TH}>Status</th><th className={cn(TH, "text-right")}>Size</th><th className={TH}>Waterfall</th><th className={cn(TH, "text-right")}>Took</th></tr></thead>
          <tbody>
          {evidence.rows.map((r, i) => {
            const bar = bars[i];
            return (
              <tr key={r.id} className={cn("border-b border-border last:border-0", r.failed && "bg-danger-bg")}>
                <td className="whitespace-nowrap px-3 py-1.5 font-mono text-muted">{clock(r.startMs)}</td>
                <td className="px-3 py-1.5 font-mono">{r.method}</td>
                <td className="max-w-[360px] truncate px-3 py-1.5 font-mono" title={`${r.host}${r.path}`}><span className="text-muted">{r.host}</span>{r.path}</td>
                <td className={cn("whitespace-nowrap px-3 py-1.5", r.failed && "text-danger")}>{r.status || r.error || "—"}</td>
                <td className="whitespace-nowrap px-3 py-1.5 text-right text-muted">{formatBytes(r.sizeBytes)}</td>
                <td className="w-[28%] min-w-[160px] px-3 py-1.5">
                  {bar && (
                    <div className="relative h-2 rounded-[1px] bg-hairline/40" role="img" aria-label={`connect ${Math.round(r.phases.connect)} ms, wait ${Math.round(r.phases.wait)} ms, transfer ${Math.round(r.phases.transfer)} ms`}>
                      <div className="absolute flex h-full" style={{ left: `${bar.left}%`, minWidth: 2 }}>
                        <i className="h-full bg-border" style={{ width: `${bar.connect}%` }} />
                        <i className={cn("h-full", r.failed ? "bg-danger" : "bg-primary")} style={{ width: `${bar.wait}%` }} />
                        <i className="h-full bg-success" style={{ width: `${bar.transfer}%` }} />
                      </div>
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-1.5 text-right text-muted">{Math.round(r.durationMs)} ms</td>
              </tr>
            );
          })}
          </tbody></table></ScrollPane>
      </Card>
    );
  }
  if (tab === "console") {
    return evidence.consoleText === undefined ? <EmptyState title="No console log" {...(note ? { hint: note.message } : {})} /> : <LogBlock text={evidence.consoleText} label="Console log" />;
  }
  return evidence.lines.length === 0 ? <EmptyState title="No session log" {...(note ? { hint: note.message } : {})} /> : <LogBlock label="Raw session log" text={evidence.lines.map((l) => `${l.ms === undefined ? "" : clock(l.ms) + " "}${l.tag} ${l.text}`.trim()).join("\n")} />;
}

function LogBlock({ text, label }: { text: string; label: string }) {
  return <pre className="panel scroll-thin max-h-[560px] overflow-auto whitespace-pre-wrap break-all rounded-lg p-4 font-mono text-[12px] leading-[1.5]" role="region" aria-label={label} tabIndex={0}>{text}</pre>;
}
