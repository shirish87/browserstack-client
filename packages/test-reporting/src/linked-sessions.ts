import type { AppAutomateClient } from "@dot-slash/browserstack-app-automate";
import type { AutomateClient } from "@dot-slash/browserstack-automate";
import type { GeneratedTestReportingClient } from "@dot-slash/browserstack-openapi/test-reporting/client";

// Types come straight from the generated clients, so they follow the OpenAPI spec.
export type TestRunsPage = Awaited<ReturnType<GeneratedTestReportingClient["getTestRuns"]>>;
/** A node of the TRA test tree: ROOT (file + platform) → DESCRIBE groups → TEST/HOOK leaves. */
export type TestRunNode = NonNullable<TestRunsPage["hierarchy"]>[number];
export type AutomateSession = Awaited<ReturnType<AutomateClient["getSession"]>>;
export type AppAutomateSession = Awaited<ReturnType<AppAutomateClient["getSession"]>>;
export type NetworkLog = Awaited<ReturnType<AutomateClient["getSessionNetworkLogs"]>>;

/** A TEST or HOOK from a TRA build, with the pieces needed to reach its Automate session. */
export interface BuildTest {
  /** Stable identity across builds: the display names from ROOT down, joined with " › ". */
  key: string;
  path: string[];
  name: string;
  kind: "TEST" | "HOOK";
  status: string | undefined;
  /** TRA durations are milliseconds. */
  durationMs: number | undefined;
  startedAt: string | undefined;
  /** Automate session `hashed_id`. Shared by every test that ran in the same session (per file/worker). */
  sessionId: string | undefined;
  attempts: number;
  /** Error message and stack trace lines of the last failed attempt. */
  failure: string[];
  /** Presigned URLs of log files uploaded for the attempts (TRA `TEST_LOG`). */
  logFiles: string[];
  file: string | undefined;
  platform: { os?: string; browser?: string; device?: string };
  observabilityUrl: string | undefined;
  node: TestRunNode;
}

export interface BuildTestSession {
  sessionId: string;
  tests: BuildTest[];
}

export type LinkedSession =
  | { product: "automate"; session: AutomateSession }
  | { product: "app-automate"; session: AppAutomateSession };

/** What a caller knows about the test, used to try the more likely product first. */
export interface SessionHint {
  /** TRA reports a device for mobile tests (e.g. "Google Pixel 7"). */
  device?: string | undefined;
}

export type LogKind = "text" | "selenium" | "console" | "network" | "playwright" | "appium" | "device";

/** Outcome of fetching one log. "missing" is expected (e.g. no Selenium log for a Playwright session). */
export type LogResult<T> = { status: "ok"; data: T } | { status: "missing"; reason: string } | { status: "error"; error: Error };

export interface SessionLogs {
  text?: LogResult<string>;
  selenium?: LogResult<string>;
  console?: LogResult<string>;
  network?: LogResult<NetworkLog>;
  playwright?: LogResult<string>;
  appium?: LogResult<string>;
  /** App Automate only. */
  device?: LogResult<string>;
}

const hasNumericStatus = (e: unknown): e is { status: number; message: string } =>
  typeof e === "object" && e !== null && "status" in e && typeof e.status === "number" && "message" in e && typeof e.message === "string";

/** App Automate answers 400 with a coded message when a log was never captured (e.g. network logs). */
const NOT_CAPTURED = /\[BROWSERSTACK_[A-Z_]*NOT_CAPTURED\]/;
const isMissingLog = (e: unknown): e is { status: number; message: string } =>
  hasNumericStatus(e) && (e.status === 404 || (e.status === 400 && NOT_CAPTURED.test(e.message)));

async function attempt<T>(run: () => Promise<T>): Promise<LogResult<T>> {
  try {
    return { status: "ok", data: await run() };
  } catch (e) {
    if (isMissingLog(e)) return { status: "missing", reason: e.message };
    return { status: "error", error: e instanceof Error ? e : new Error(String(e)) };
  }
}

const unsupported = <T>(reason: string): Promise<LogResult<T>> => Promise.resolve({ status: "missing", reason });

/** The session id of a test node, or undefined when it ran without a session. */
export function extractSessionId(node: { details?: { sessionId?: string | null } | null }): string | undefined {
  const id = node.details?.sessionId;
  return typeof id === "string" && id.length > 0 ? id : undefined;
}

export const isNotFound = (e: unknown): boolean => hasNumericStatus(e) && e.status === 404;

export function flattenTests(node: TestRunNode, parents: string[], root: TestRunNode): BuildTest[] {
  const name = node.displayName ?? "(unnamed)";
  const path = [...parents, name];
  if (node.type === "TEST" || node.type === "HOOK") return [toTest(node, path, root)];
  return (node.children ?? []).flatMap((child) => flattenTests(child, path, root));
}

function toTest(node: TestRunNode, path: string[], root: TestRunNode): BuildTest {
  const d = node.details;
  const retries = d?.retries ?? [];
  const lastFailed = [...retries].reverse().find((r) => (r.logs?.TEST_FAILURE ?? []).length > 0);
  const rd = root.details;
  const label = (e: { name?: string | undefined; version?: string | undefined } | null | undefined): string | undefined =>
    e?.name ? [e.name, e.version].filter(Boolean).join(" ") : undefined;
  const platform: BuildTest["platform"] = {};
  const os = label(rd?.os);
  const browser = label(rd?.browser);
  if (os) platform.os = os;
  if (browser) platform.browser = browser;
  if (rd?.device) platform.device = rd.device;
  return {
    key: path.join(" › "),
    path,
    name: path[path.length - 1] ?? "(unnamed)",
    kind: node.type === "HOOK" ? "HOOK" : "TEST",
    status: d?.status,
    durationMs: d?.duration,
    startedAt: d?.startedAt,
    sessionId: extractSessionId(node),
    attempts: retries.length,
    failure: lastFailed?.logs?.TEST_FAILURE ?? [],
    logFiles: retries.flatMap((r) => r.logs?.TEST_LOG ?? []),
    file: rd?.filePath,
    platform,
    observabilityUrl: d?.observabilityUrl,
    node,
  };
}

/** The text log, plus each kind the session reports a URL for. */
export function defaultKinds(linked: LinkedSession): LogKind[] {
  const kinds: LogKind[] = ["text"];
  if (linked.product === "automate") {
    const s = linked.session;
    if (s.browserConsoleLogsUrl) kinds.push("console");
    if (s.harLogsUrl) kinds.push("network");
    if (s.seleniumLogsUrl) kinds.push("selenium");
    if (s.appiumLogsUrl) kinds.push("appium");
    if (s.playwrightLogsUrl) kinds.push("playwright");
  } else {
    const s = linked.session;
    if (s.appiumLogsUrl) kinds.push("appium");
    if (s.deviceLogsUrl) kinds.push("device");
    if (s.harLogsUrl) kinds.push("network");
  }
  return kinds;
}

/** Fetches the wanted log kinds for an Automate (web) session. */
export async function fetchAutomateLogs(a: AutomateClient, sessionId: string, wanted: LogKind[]): Promise<SessionLogs> {
  const logs: SessionLogs = {};
  await Promise.all(
    wanted.map(async (kind) => {
      switch (kind) {
        case "text":
          logs.text = await attempt(() => a.getSessionLogs(sessionId));
          return;
        case "selenium":
          logs.selenium = await attempt(() => a.getSessionSeleniumLogs(sessionId));
          return;
        case "console":
          logs.console = await attempt(() => a.getSessionConsoleLogs(sessionId));
          return;
        case "network":
          logs.network = await attempt(() => a.getSessionNetworkLogs(sessionId));
          return;
        case "playwright":
          logs.playwright = await attempt(() => a.getSessionPlaywrightLogs(sessionId));
          return;
        case "appium":
          logs.appium = await attempt(() => a.getSessionAppiumLogs(sessionId));
          return;
        case "device":
          logs.device = await unsupported("Device logs exist only for App Automate sessions.");
          return;
      }
    }),
  );
  return logs;
}

/** Fetches the wanted log kinds for an App Automate session. Its logs live under the App Automate build id. */
export async function fetchAppAutomateLogs(app: AppAutomateClient, session: AppAutomateSession, sessionId: string, wanted: LogKind[]): Promise<SessionLogs> {
  const buildId = session.buildHashedId;
  const logs: SessionLogs = {};
  if (!buildId) {
    const error = new Error(`App Automate session ${sessionId} reports no build id.`);
    for (const kind of wanted) logs[kind] = { status: "error", error };
    return logs;
  }
  const web = (kind: string) => unsupported<never>(`${kind} logs exist only for Automate (web) sessions, not App Automate.`);
  await Promise.all(
    wanted.map(async (kind) => {
      switch (kind) {
        case "text":
          logs.text = await attempt(() => app.getSessionLogs(buildId, sessionId));
          return;
        case "appium":
          logs.appium = await attempt(() => app.getAppiumLogs(buildId, sessionId));
          return;
        case "device":
          logs.device = await attempt(() => app.getDeviceLogs(buildId, sessionId));
          return;
        case "network":
          logs.network = await attempt(() => app.getNetworkLogs(buildId, sessionId));
          return;
        case "selenium":
          logs.selenium = await web("Selenium");
          return;
        case "console":
          logs.console = await web("Console");
          return;
        case "playwright":
          logs.playwright = await web("Playwright");
          return;
      }
    }),
  );
  return logs;
}
