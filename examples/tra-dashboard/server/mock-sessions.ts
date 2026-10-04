/**
 * Mock Automate / App Automate session endpoints, derived from the same model as the Test Reporting mock.
 * Log formats follow what the real APIs return (verified live): the Automate text log, App Automate's
 * text / Appium / device logs, and a HAR 1.1 archive for network logs. Nothing here marks where a test
 * starts or ends: like the real logs, they can only be lined up with tests by time.
 */
import { LATEST_N, buildEndMs, buildStartMs, liveProgress, modelFor, parseSessionId, rand, type ModelFile, type ModelTest, type Project } from "./mock-model";

const textRes = (body: string, status = 200): Response => new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8" } });
const jsonRes = (body: unknown, status = 200): Response => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
const notFound = (): Response => new Response("<html><head><title>404 Not Found</title></head><body><center><h1>404 Not Found</h1></center></body></html>", { status: 404, headers: { "content-type": "text/html" } });

const SETUP_MS = 7000;
const HOST = "https://staging.example.com";

// --- timestamps in the three formats the real logs use ---------------------------------------

const p2 = (n: number): string => String(n).padStart(2, "0");
const p3 = (n: number): string => String(n).padStart(3, "0");
/** Automate / App Automate text log: unpadded, UTC. `2026-10-4 16:28:3:343` */
const stamp = (ms: number): string => {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()} ${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}:${d.getUTCMilliseconds()}`;
};
/** Appium log: padded. `2026-10-04 16:28:03:360` */
const stampAppium = (ms: number): string => {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}:${p2(d.getUTCSeconds())}:${p3(d.getUTCMilliseconds())}`;
};
/** Android logcat: `10-04 16:28:08.959` */
const stampDevice = (ms: number): string => {
  const d = new Date(ms);
  return `${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}:${p2(d.getUTCSeconds())}.${p3(d.getUTCMilliseconds())}`;
};

// --- one test's activity ---------------------------------------------------------------------

interface Step {
  /** Offset from the test's start, ms. */
  at: number;
  method: string;
  path: string;
  body?: string;
  /** What the driver answered, and how long it took. */
  response: string;
  tookMs: number;
  failed?: boolean;
}

/** The WebDriver conversation of one test; failing tests leave the cause in it. */
function stepsFor(t: ModelTest, sid: string): Step[] {
  const dur = Math.max(t.durationMs, 400);
  const s = `/session/${sid}`;
  const found = '{"value":{"element-6066-11e4-a52e-4f735466cecf":"e1"}}';
  const gone = '{"value":{"error":"no such element","message":"no such element: Unable to locate element: {\\"method\\":\\"css selector\\",\\"selector\\":\\"[name=pay]\\"}"}}';
  const navigate: Step = { at: 40, method: "POST", path: `${s}/url`, body: `{"url":"${HOST}/"}`, response: '{"value":null}', tookMs: Math.min(900, dur * 0.3) };
  if (t.error?.cause === "connection-reset") {
    return [{ ...navigate, response: '{"value":{"error":"unknown error","message":"unknown error: net::ERR_CONNECTION_RESET"}}', failed: true }];
  }
  const out: Step[] = [navigate];
  out.push({ at: dur * 0.35, method: "POST", path: `${s}/element`, body: '{"using":"css selector","value":"[data-testid=cta]"}', response: found, tookMs: 60 });
  out.push({ at: dur * 0.4, method: "POST", path: `${s}/element/e1/click`, body: "{}", response: '{"value":null}', tookMs: 80 });
  if (t.error?.cause === "missing-element") {
    out.push({ at: dur * 0.6, method: "POST", path: `${s}/element`, body: '{"using":"css selector","value":"[name=pay]"}', response: gone, tookMs: 5000, failed: true });
    return out;
  }
  if (t.error?.cause === "timeout") {
    for (let at = dur * 0.45; at < dur - 600; at += 1500) {
      out.push({ at, method: "POST", path: `${s}/element`, body: '{"using":"css selector","value":"[data-testid=submit]"}', response: gone, tookMs: 1400, failed: true });
    }
    return out;
  }
  out.push({ at: dur * 0.7, method: "GET", path: `${s}/element/e1/text`, response: '{"value":"Order placed"}', tookMs: 40 });
  return out;
}

interface Req {
  at: number;
  method: string;
  path: string;
  status: number;
  mime: string;
  size: number;
  /** ms per phase */
  phases: { blocked: number; dns: number; connect: number; ssl: number; send: number; wait: number; receive: number };
  error?: string;
}

const phases = (wait: number, receive = 12, fresh = false): Req["phases"] => ({ blocked: 2, dns: fresh ? 14 : 0, connect: fresh ? 38 : 0, ssl: fresh ? 41 : 0, send: 1, wait, receive });

/** The page's network traffic during one test. Failures leave their mark here too. */
function requestsFor(t: ModelTest): Req[] {
  const dur = Math.max(t.durationMs, 400);
  const r = (k: string): number => rand(`${t.name}|${k}`);
  const out: Req[] = [
    { at: 60, method: "GET", path: "/", status: 200, mime: "text/html", size: 38_200, phases: phases(90 + r("d") * 120, 24, true) },
    { at: 260, method: "GET", path: "/static/app.js", status: 200, mime: "application/javascript", size: 412_000, phases: phases(40, 150 + r("js") * 120) },
    { at: 270, method: "GET", path: "/static/app.css", status: 200, mime: "text/css", size: 58_000, phases: phases(35, 30) },
    { at: 420, method: "GET", path: "/api/cart", status: 200, mime: "application/json", size: 1_800, phases: phases(110 + r("c") * 90) },
  ];
  if (t.slow) out.push({ at: dur * 0.5, method: "POST", path: "/api/payments/authorize", status: 200, mime: "application/json", size: 940, phases: phases(2300 + r("s") * 700) });
  else out.push({ at: dur * 0.5, method: "POST", path: "/api/orders", status: t.error?.cause === "server-error" ? 500 : 201, mime: "application/json", size: t.error?.cause === "server-error" ? 212 : 640, phases: phases(t.error?.cause === "server-error" ? 640 : 150 + r("o") * 110) });
  if (t.error?.cause === "connection-reset") out.push({ at: dur * 0.5, method: "POST", path: "/api/orders", status: 0, mime: "", size: 0, phases: { blocked: 1, dns: 0, connect: 36, ssl: 0, send: 0, wait: 0, receive: 0 }, error: "net::ERR_CONNECTION_RESET" });
  if (t.error?.cause === "timeout") out.push({ at: dur * 0.45, method: "GET", path: "/api/inventory", status: 200, mime: "application/json", size: 20_400, phases: phases(7400 + r("t") * 900) });
  out.push({ at: dur * 0.8, method: "GET", path: "/img/hero.webp", status: 200, mime: "image/webp", size: 96_000, phases: phases(30, 85) });
  return out.filter((q) => q.at < dur);
}

// --- the session --------------------------------------------------------------------------

interface Session {
  project: Project;
  n: number;
  file: ModelFile;
  buildId: string;
  startMs: number;
  endMs: number;
}

function sessionOf(id: string, now: number): Session | undefined {
  const ref = parseSessionId(id);
  if (!ref) return undefined;
  const i = LATEST_N - ref.n;
  if (i < 0 || i >= ref.project.builds) return undefined;
  const buildStart = buildStartMs(ref.project, i, now);
  const files = modelFor(ref.project, ref.n, buildStart, liveProgress(ref.project, i, buildStart, now));
  const file = files[ref.fileIndex];
  if (!file) return undefined;
  const started = file.tests.filter((t) => t.startMs !== undefined);
  const first = started[0]?.startMs ?? buildStart;
  return { project: ref.project, n: ref.n, file, buildId: `bld${ref.project.id}-${ref.n}`, startMs: first - SETUP_MS, endMs: buildEndMs([file], first) };
}

function sessionJson(s: Session, id: string): unknown {
  const mobile = s.project.product === "app-automate";
  const p = s.file.platform;
  const failed = s.file.tests.some((t) => t.status === "failed");
  const first = s.file.tests.find((t) => t.error);
  const durationSec = Math.round((s.endMs - s.startMs) / 1000);
  const base = mobile ? "https://app-automate.browserstack.com" : "https://automate.browserstack.com";
  const api = `https://api.browserstack.com/${mobile ? "app-automate" : "automate"}`;
  const bh = s.buildId.replace(/\W/g, "0").padEnd(40, "0").slice(0, 40);
  const user = Math.round(durationSec * 0.14);
  const common = {
    name: s.file.file,
    duration: durationSec,
    os: p.os.name,
    os_version: p.os.version,
    browser_version: mobile ? null : p.browser.version,
    browser: mobile ? null : p.browser.name,
    device: mobile ? p.device : null,
    status: failed ? "failed" : "passed",
    hashed_id: id,
    reason: failed ? (first?.error?.message ?? "") : "",
    build_name: `${s.project.name} #${s.n}`,
    project_name: s.project.name,
    build_hashed_id: bh,
    test_priority: null,
    logs: `${base}/builds/${bh}/sessions/${id}/logs`,
    browserstack_status: failed ? "failed" : "passed",
    created_at: new Date(s.startMs).toISOString(),
    browser_url: `${base}/builds/${bh}/sessions/${id}`,
    public_url: `${base}/builds/${bh}/sessions/${id}`,
    video_url: `${base}/sessions/${id}/video`,
    insights: {
      summary: {
        totals: { duration: durationSec, browserstack_time: durationSec - user, user_time: user, browserstack_percentage: 100 - Math.round((user / durationSec) * 100), user_percentage: Math.round((user / durationSec) * 100) },
        time_breakdown: {
          browserstack_time: { components: { setup: { duration: Math.round(SETUP_MS / 1000) }, execution: { duration: durationSec - user - Math.round(SETUP_MS / 1000) } } },
          user_time: { duration: user },
          capabilities_impact: { top_capabilities: [{ name: "networkLogs", impact: "high" }, { name: "video", impact: "high" }, { name: "console", impact: "low" }] },
        },
      },
    },
  };
  if (mobile) {
    return { automation_session: { ...common, app_details: { app_name: "checkout.apk", app_version: "2.4.1", app_url: "bs://mock", app_custom_id: "checkout", uploaded_at: new Date(s.startMs - 3600_000).toISOString() }, device_logs_url: `${api}/builds/${bh}/sessions/${id}/devicelogs`, appium_logs_url: `${api}/builds/${bh}/sessions/${id}/appiumlogs` } };
  }
  return { automation_session: { ...common, har_logs_url: `${api}/sessions/${id}/networklogs`, browser_console_logs_url: `${api}/sessions/${id}/consolelogs`, selenium_logs_url: `${api}/sessions/${id}/seleniumlogs` } };
}

function textLog(s: Session, id: string): string {
  const lines: string[] = [];
  if (s.project.product === "app-automate") {
    lines.push(`${stamp(s.startMs)} SESSION_SETUP_TIME {"initialising_device":2254}`);
    lines.push(`${stamp(s.startMs + 2300)} SESSION_SETUP_TIME {"downloading_app":418,"installing_app":2952,"setting_up_appium":1376,"setting_up_network_connection":0}`);
    lines.push(`${stamp(s.startMs + SETUP_MS - 100)} SESSION_SETUP_TIME {"launching_app":420}`);
  }
  lines.push(`${stamp(s.startMs + SETUP_MS)} REQUEST POST /session {"capabilities":{"alwaysMatch":{"browserName":"chrome"}}}`);
  for (const t of s.file.tests) {
    if (t.startMs === undefined) continue;
    for (const step of stepsFor(t, id)) {
      const at = t.startMs + step.at;
      lines.push(`${stamp(at)} REQUEST ${step.method} ${step.path}${step.body ? ` ${step.body}` : ""}`);
      lines.push(`${stamp(at + step.tookMs)} RESPONSE ${step.response}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

function appiumLog(s: Session, id: string): string {
  const lines: string[] = [`${stampAppium(s.startMs + 3000)} - [HTTP] --> POST /wd/hub/session`, `${stampAppium(s.startMs + 3010)} - [Appium] Appium v1.22.0 creating new AndroidUiautomator2Driver session`];
  for (const t of s.file.tests) {
    if (t.startMs === undefined) continue;
    for (const step of stepsFor(t, id)) {
      lines.push(`${stampAppium(t.startMs + step.at)} - [HTTP] --> ${step.method} /wd/hub${step.path}${step.body ? ` ${step.body}` : ""}`);
      lines.push(`${stampAppium(t.startMs + step.at + step.tookMs)} - [HTTP] <-- ${step.method} /wd/hub${step.path} ${step.failed ? 404 : 200} ${step.tookMs} ms`);
    }
  }
  return `${lines.join("\n")}\n`;
}

function deviceLog(s: Session): string {
  const lines: string[] = [];
  for (const t of s.file.tests) {
    if (t.startMs === undefined) continue;
    lines.push(`${stampDevice(t.startMs + 50)} I/ActivityTaskManager (1234): START u0 {cmp=org.example.checkout/.MainActivity}`);
    if (t.status === "failed") lines.push(`${stampDevice(t.startMs + t.durationMs * 0.6)} E/AndroidRuntime (5821): ${t.error?.message ?? "error"}`);
    lines.push(`${stampDevice(t.startMs + t.durationMs)} D/ViewRootImpl (5821): Skipping stale frame`);
  }
  return `${lines.join("\n")}\n`;
}

function consoleLog(s: Session): string {
  const failing = s.file.tests.filter((t) => t.error);
  if (failing.length === 0) return "// No messages were logged in this Session.\n";
  return `${failing.map((t) => `ERROR ${t.error?.cause === "server-error" ? "Failed to load resource: the server responded with a status of 500 ()" : (t.error?.message ?? "error")}`).join("\n")}\n`;
}

function harLog(s: Session): unknown {
  const entries: unknown[] = [];
  for (const t of s.file.tests) {
    if (t.startMs === undefined) continue;
    for (const q of requestsFor(t)) {
      const ph = q.phases;
      const time = q.error ? 40 : ph.blocked + ph.dns + ph.connect + ph.send + ph.wait + ph.receive;
      entries.push({
        pageref: "page_1",
        startedDateTime: new Date(t.startMs + q.at).toISOString(),
        time,
        request: { method: q.method, url: `${HOST}${q.path}`, httpVersion: "h2", cookies: [], headers: [{ name: "Accept", value: "*/*" }], queryString: [], headersSize: -1, bodySize: q.method === "POST" ? 120 : 0 },
        response: {
          status: q.status,
          statusText: q.status === 0 ? "" : q.status >= 500 ? "Internal Server Error" : "OK",
          httpVersion: "h2",
          cookies: [],
          headers: [{ name: "Content-Type", value: q.mime }],
          content: { size: q.size, mimeType: q.mime },
          redirectURL: "",
          headersSize: -1,
          bodySize: q.size,
          ...(q.error ? { _error: q.error } : {}),
        },
        cache: {},
        timings: { comment: "", ...ph, blocked: ph.blocked, ssl: ph.ssl },
        serverIPAddress: "203.0.113.10",
      });
    }
  }
  return { log: { version: "1.1", creator: { name: "BrowserUp Proxy", version: "${project.version}" }, pages: [{ id: "page_1", startedDateTime: new Date(s.startMs + SETUP_MS).toISOString(), title: "checkout", pageTimings: {} }], entries } };
}

const NOT_CAPTURED = { message: "[BROWSERSTACK_NETWORK_LOGS_NOT_CAPTURED] Your app is not configured to view network logs on this device.", status: 400 };

/** Handles the Automate and App Automate session routes; undefined for any other path. */
export function sessionRoutes(path: string, now: number): Response | undefined {
  const web = path.match(/^\/automate\/sessions\/([0-9a-f]{40})(\.json|\/(logs|consolelogs|networklogs|seleniumlogs|playwrightlogs|appiumlogs))$/);
  if (web?.[1]) {
    const s = sessionOf(web[1], now);
    if (!s || s.project.product !== "automate") return notFound();
    switch (web[3]) {
      case undefined:
        return jsonRes(sessionJson(s, web[1]));
      case "logs":
        return textLog(s, web[1]) ? textRes(textLog(s, web[1])) : notFound();
      case "consolelogs":
        return textRes(consoleLog(s));
      case "networklogs":
        return jsonRes(harLog(s));
      default:
        return new Response('<?xml version="1.0" encoding="UTF-8"?><Error><Code>NoSuchKey</Code><Message>The specified key does not exist.</Message></Error>', { status: 404, headers: { "content-type": "application/xml" } });
    }
  }
  const app = path.match(/^\/app-automate\/(?:builds\/[^/]+\/)?sessions\/([0-9a-f]{40})(\.json|\/(logs|appiumlogs|devicelogs|networklogs))$/);
  if (app?.[1]) {
    const s = sessionOf(app[1], now);
    if (!s || s.project.product !== "app-automate") return notFound();
    switch (app[3]) {
      case undefined:
        return jsonRes(sessionJson(s, app[1]));
      case "logs":
        return textRes(textLog(s, app[1]));
      case "appiumlogs":
        return textRes(appiumLog(s, app[1]));
      case "devicelogs":
        return textRes(deviceLog(s));
      default:
        return jsonRes(NOT_CAPTURED, 400);
    }
  }
  return undefined;
}

