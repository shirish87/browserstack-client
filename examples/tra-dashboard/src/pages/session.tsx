import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useTraClient } from "@/lib/auth";
import { linkedSessionQuery, profilingQuery, sessionLogsQuery, telemetryAvailableQuery, testsQuery } from "@/lib/queries";
import { type ProfilingRow, profilingSeries, telemetryDownloadUrl, profilingV2Rows, sessionInsights, videoOffsetSec } from "@/lib/extras";
import { MetricChart } from "@/components/tra-charts";
import { buildTimeline, eventsBefore, formatBytes, isLiveSession, LIVE_LOG_POLL_MS, sessionEvidence, signalsIn, waterfallOf, windowOf, type SessionEvidence } from "@/lib/session";
import { formatDuration } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TabBar } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/status";
import { Breadcrumbs, EmptyState, ErrorState, ExternalLink, KeyValue, PageTitle } from "@/components/common";
import { cn } from "@/lib/utils";

type MetricSeries = { key: keyof ProfilingRow & string; label: string };
type Tab = "commands" | "network" | "console" | "log" | "device" | "selenium" | "playwright" | "profiling";
const BASE_TABS: { value: Tab; label: string }[] = [
  { value: "commands", label: "Commands" },
  { value: "network", label: "Network" },
  { value: "console", label: "Console" },
  { value: "log", label: "Raw log" },
];
/** The base tabs plus a tab for each extra log the session actually has, and Profiling for App Automate. */
function tabsFor(evidence: SessionEvidence | undefined, mobile: boolean): { value: Tab; label: string }[] {
  const extra: { value: Tab; label: string }[] = [];
  if (evidence?.extra.device !== undefined) extra.push({ value: "device", label: "Device log" });
  if (evidence?.extra.selenium !== undefined) extra.push({ value: "selenium", label: "Selenium" });
  if (evidence?.extra.playwright !== undefined) extra.push({ value: "playwright", label: "Playwright" });
  if (mobile) extra.push({ value: "profiling", label: "Profiling" });
  return [...BASE_TABS, ...extra];
}

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
  const live = isLiveSession(linked.data?.session.status);
  const logs = useQuery({ ...sessionLogsQuery(client, username, sessionId, device, live), enabled: !!linked.data });
  const evidence = useMemo(() => (logs.data ? sessionEvidence(logs.data) : undefined), [logs.data]);

  const telemetry = useQuery({ ...telemetryAvailableQuery(username, sessionId), enabled: linked.data?.product === "automate" });
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekVideo = (ms: number) => {
    const at = videoOffsetSec(ms, linked.data?.session.createdAt);
    const el = videoRef.current;
    if (el && at !== undefined) {
      el.currentTime = at;
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  };
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
  const mobile = linked.data.product === "app-automate";
  const insights = sessionInsights("insights" in s ? s.insights : undefined);
  const tabs = tabsFor(evidence, mobile);
  const window = selected ? windowOf(selected) : undefined;
  return (
    <div className="space-y-6">
      <Breadcrumbs items={crumbs} />
      <PageTitle
        title={s.name ?? sessionId}
        subtitle={
          <span className="inline-flex flex-wrap items-center gap-2">
            <StatusBadge status={s.status} />
            {live && <Badge tone="warning"><span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-current motion-reduce:animate-none" aria-hidden />Live · refreshing every {LIVE_LOG_POLL_MS / 1000}s</Badge>}
            <Badge tone="outline">{linked.data.product === "automate" ? "Automate" : "App Automate"}</Badge>
            {s.duration ? <span>{formatDuration(s.duration * 1000)}</span> : null}
            {s.publicUrl && <ExternalLink href={s.publicUrl}>Open in BrowserStack</ExternalLink>}
            {telemetry.data && <a href={telemetryDownloadUrl(sessionId)} download={`telemetrylogs-${sessionId}.gz`} className="text-primary underline-offset-2 hover:underline">Download telemetry logs (.gz)</a>}
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
              ["Ended because", s.reason && s.status !== "passed" ? <span className="whitespace-pre-wrap break-words">{s.reason}</span> : s.reason],
              ...("appDetails" in s && s.appDetails ? ([["App", [s.appDetails.appName, s.appDetails.appVersion].filter(Boolean).join(" ")], ["App file", s.appDetails.appFilename]] as [string, string | undefined][]) : []),
            ]}
          />
        </CardContent>
      </Card>

      {insights && (
        <Card>
          <CardHeader><CardTitle>Where the time went</CardTitle></CardHeader>
          <CardContent className="space-y-3 py-4">
            <div className="flex h-3 overflow-hidden rounded-full bg-neutral-bg" role="img" aria-label={insights.parts.map((p) => `${p.label} ${p.seconds}s`).join(", ")}>
              {insights.parts.map((p, i) => <div key={p.label} className={i === 0 ? "bg-primary" : "bg-warning"} style={{ width: `${(p.seconds / Math.max(1, insights.parts.reduce((a, x) => a + x.seconds, 0))) * 100}%` }} />)}
            </div>
            <p className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-muted">
              {insights.parts.map((p, i) => <span key={p.label}><i className={cn("mr-1.5 inline-block size-2 rounded-full", i === 0 ? "bg-primary" : "bg-warning")} />{p.label} {p.seconds}s</span>)}
            </p>
            {insights.capabilities.length > 0 && (
              <p className="text-[12px] text-muted">Capabilities slowing the session: {insights.capabilities.map((c) => `${c.name} (${c.impact})`).join(", ")}.</p>
            )}
          </CardContent>
        </Card>
      )}

      {s.videoUrl && (
        <Card>
          <CardHeader><CardTitle>Session video</CardTitle></CardHeader>
          <CardContent className="py-4">
            <video ref={videoRef} src={s.videoUrl} controls preload="metadata" className="max-h-[420px] w-full rounded-md bg-black" aria-label="Session video" />
            <p className="mt-2 text-[12px] text-muted">Select a time in the Commands tab to jump here. Positions are approximate: the video starts when the session is created, before the first command.</p>
          </CardContent>
        </Card>
      )}

      {selected && window && evidence && <TestWindow name={selected.name} status={selected.status} evidence={evidence} startMs={window.startMs} endMs={window.endMs} />}
      {evidence && <TimelineCard tests={sessionTests} evidence={evidence} />}

      <div className="space-y-3">
        <div className="overflow-x-auto"><TabBar tabs={tabs} value={tab} onChange={setTab} label="Session evidence" /></div>
        {tab === "profiling" && mobile && s.buildHashedId ? <ProfilingPanel buildId={s.buildHashedId} sessionId={sessionId} live={live} /> : (
          <>
            {logs.isPending && <Skeleton className="h-48" />}
            {logs.isError && <ErrorState error={logs.error} onRetry={() => void logs.refetch()} />}
            {evidence && <Evidence tab={tab} evidence={evidence} live={live} onSeek={s.videoUrl ? seekVideo : undefined} />}
          </>
        )}
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

/**
 * A bounded, thin-scrollbar pane. While `follow` is on (a running session) it sticks to the newest line, stops
 * following as soon as the reader scrolls up, and offers a button to jump back to the tail.
 */
function ScrollPane({ children, label, follow = false, version }: { children: React.ReactNode; label: string; follow?: boolean; version?: number | string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (follow && pinned && el) el.scrollTop = el.scrollHeight;
  }, [follow, pinned, version]);
  const onScroll = () => {
    const el = ref.current;
    if (el) setPinned(el.scrollHeight - el.scrollTop - el.clientHeight < 24);
  };
  return (
    <div className="relative">
      <div ref={ref} onScroll={onScroll} className="scroll-thin max-h-[560px] overflow-auto" role="region" aria-label={label} tabIndex={0}>{children}</div>
      {follow && !pinned && (
        <button type="button" onClick={() => setPinned(true)} className="absolute bottom-3 right-4 cursor-pointer rounded-full bg-primary px-3 py-1 text-[12px] font-medium text-white shadow-lg">Jump to latest ↓</button>
      )}
    </div>
  );
}

const TH = "sticky top-0 bg-surface-1 px-3 py-1.5 text-left text-[11px] font-medium uppercase tracking-wide text-muted";

function Evidence({ tab, evidence, live, onSeek }: { tab: Tab; evidence: SessionEvidence; live: boolean; onSeek: ((ms: number) => void) | undefined }) {
  const note = evidence.notes.find((n) => (tab === "commands" || tab === "log" ? n.kind === "text" : n.kind === tab));
  if (tab === "commands") {
    return evidence.commands.length === 0 ? <EmptyState title="No commands" {...(note ? { hint: note.message } : {})} /> : (
      <Card><ScrollPane label="Commands" follow={live} version={evidence.commands.length}><table className="w-full text-[12px]">
        <thead><tr><th className={TH}>Time</th><th className={TH}>Command</th><th className={cn(TH, "text-right")}>Took</th><th className={TH}>Error</th></tr></thead>
        <tbody>
        {evidence.commands.map((c, i) => (
          <tr key={i} className={cn("border-b border-border last:border-0", c.failed && "bg-danger-bg")}>
            <td className="whitespace-nowrap px-3 py-1.5 font-mono text-muted">
              {onSeek ? <button type="button" onClick={() => onSeek(c.startMs)} className="cursor-pointer underline-offset-2 hover:text-foreground hover:underline" title="Jump to this moment in the video">▶ {clock(c.startMs)}</button> : clock(c.startMs)}
            </td>
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
        <ScrollPane label="Network requests" follow={live} version={evidence.rows.length}><table className="w-full text-[12px]">
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
                      <i className="absolute h-full bg-border" style={{ left: `${bar.left}%`, width: `max(3px, ${bar.connect}%)` }} />
                      <i className={cn("absolute h-full", r.failed ? "bg-danger" : "bg-primary")} style={{ left: `${bar.left + bar.connect}%`, width: `max(4px, ${bar.wait}%)` }} />
                      <i className="absolute h-full bg-success" style={{ left: `${bar.left + bar.connect + bar.wait}%`, width: `max(3px, ${bar.transfer}%)` }} />
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
  if (tab === "device" || tab === "selenium" || tab === "playwright") {
    const text = evidence.extra[tab];
    const names = { device: "Device log", selenium: "Selenium log", playwright: "Playwright log" } as const;
    return text === undefined ? <EmptyState title={`No ${names[tab].toLowerCase()}`} {...(note ? { hint: note.message } : {})} /> : <LogBlock text={text} label={names[tab]} live={live} />;
  }
  if (tab === "console") {
    return evidence.consoleText === undefined ? <EmptyState title="No console log" {...(note ? { hint: note.message } : {})} /> : <LogBlock text={evidence.consoleText} label="Console log" live={live} />;
  }
  return evidence.lines.length === 0 ? <EmptyState title="No session log" {...(note ? { hint: note.message } : {})} /> : <LogBlock label="Raw session log" live={live} text={evidence.lines.map((l) => `${l.ms === undefined ? "" : clock(l.ms) + " "}${l.tag} ${l.text}`.trim()).join("\n")} />;
}

function LogBlock({ text, label, live }: { text: string; label: string; live: boolean }) {
  return (
    <div className="panel rounded-lg">
      <ScrollPane label={label} follow={live} version={text.length}>
        <pre className="whitespace-pre-wrap break-all p-4 font-mono text-[12px] leading-[1.5]">{text}</pre>
      </ScrollPane>
    </div>
  );
}

/** App Automate resource profiling: device and app CPU, memory, battery and temperature, plus network and v2's measured values. */
function ProfilingPanel({ buildId, sessionId, live }: { buildId: string; sessionId: string; live: boolean }) {
  const { username } = useTraClient();
  const q = useQuery(profilingQuery(username, buildId, sessionId, live));
  const series = useMemo(() => (q.data ? profilingSeries(q.data.samples) : undefined), [q.data]);
  if (q.isPending) return <Skeleton className="h-64" />;
  if (q.isError) return <EmptyState title="No profiling data" hint="Resource profiling wasn't captured for this session. Enable it with the appProfiling capability." />;
  if (!series || series.rows.length === 0) return <EmptyState title="No profiling samples" hint="The session reported no resource samples." />;
  const v2 = q.data.v2 ? profilingV2Rows(q.data.v2) : [];
  const hasApp = series.app !== undefined;
  const hasNet = series.rows.some((r) => r.netReceived !== null || r.netSent !== null);
  const last = series.rows[series.rows.length - 1];
  const cpuSeries: MetricSeries[] = [{ key: "cpu", label: "Device" }, ...(hasApp ? [{ key: "appCpu" as const, label: "App" }] : [])];
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>CPU</CardTitle></CardHeader><CardContent><MetricChart rows={series.rows} yLabel="CPU %" series={cpuSeries} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Device memory</CardTitle></CardHeader><CardContent><MetricChart rows={series.rows} yLabel="Available MB" series={[{ key: "memFreeMb", label: "Available" }]} /></CardContent></Card>
        {hasApp && <Card><CardHeader><CardTitle>App memory</CardTitle></CardHeader><CardContent><MetricChart rows={series.rows} yLabel="App memory MB" series={[{ key: "appMemMb", label: "App" }]} /></CardContent></Card>}
        <Card><CardHeader><CardTitle>Battery</CardTitle></CardHeader><CardContent><MetricChart rows={series.rows} yLabel="Battery %" series={[{ key: "battery", label: "Battery" }]} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Temperature</CardTitle></CardHeader><CardContent><MetricChart rows={series.rows} yLabel="Temperature °C" series={[{ key: "temp", label: "Device" }]} /></CardContent></Card>
        {hasNet && <Card className="lg:col-span-2"><CardHeader><CardTitle>App network</CardTitle></CardHeader><CardContent><MetricChart rows={series.rows} yLabel="Network KB" series={[{ key: "netReceived", label: "Received" }, { key: "netSent", label: "Sent" }]} /></CardContent></Card>}
      </div>
      <Card>
        <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
        <CardContent className="py-4">
          <KeyValue rows={[["App", series.app], ["Samples", `${series.rows.length} over ${Math.round(last?.t ?? 0)}s`], ["Device memory", last?.memTotalMb != null ? `${Math.round(last.memTotalMb)} MB` : undefined], ...v2]} />
        </CardContent>
      </Card>
    </div>
  );
}
