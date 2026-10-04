import { BrowserStackError, BrowserStackOptions } from "@dot-slash/browserstack-core";
import { AppAutomateClient } from "@dot-slash/browserstack-app-automate";
import { AutomateClient } from "@dot-slash/browserstack-automate";
import { HttpError, NetworkError } from "@dot-slash/browserstack-openapi-transforms";
import { GeneratedTestReportingClient } from "@dot-slash/browserstack-openapi/test-reporting/client";
import {
  buildStartBody,
  failureFields,
  logFields,
  runFields,
  sessionIntegrations,
  type LogEntry,
  type RunSession,
  type RunStart,
} from "./ingestion";
import {
  defaultKinds,
  fetchAppAutomateLogs,
  fetchAutomateLogs,
  flattenTests,
  isNotFound,
  extractSessionId,
  type BuildTest,
  type BuildTestSession,
  type LinkedSession,
  type LogKind,
  type SessionHint,
  type SessionLogs,
} from "./linked-sessions";

export type * from "./linked-sessions";
export type { LogEntry, RunSession } from "./ingestion";

export interface TestReportingClientOptions extends BrowserStackOptions {
  uploadBaseUrl?: string;
  /** Base URL of the live ingestion API (build start/stop, test and hook events, logs). */
  ingestBaseUrl?: string;
  /**
   * Used to resolve a test's session and fetch its logs (see `getTestSession`). Defaults to a client built from
   * these same options, minus the Test Reporting base URLs. Pass one to customise it (base URL, timeout, ...).
   */
  automate?: AutomateClient;
  /** Same, for mobile (Appium) tests, whose TRA session id resolves in App Automate rather than Automate. */
  appAutomate?: AppAutomateClient;
}

export class TestReportingClient extends GeneratedTestReportingClient {
  private readonly siblingOptions: BrowserStackOptions;
  private automateClient: AutomateClient | undefined;
  private appAutomateClient: AppAutomateClient | undefined;
  private readonly ingestBaseUrl: string;
  /** Per started build: its ingestion JWT, framework, and the runs that have started but not finished. */
  private readonly builds = new Map<string, { jwt: string; framework?: string; runs: Map<string, RunStart> }>();
  private readonly sessionCache = new Map<string, Promise<LinkedSession | undefined>>();

  constructor(options?: TestReportingClientOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api-automation.browserstack.com/ext/v1",
      options?.uploadBaseUrl ?? "https://upload-automation.browserstack.com",
      "@dot-slash/browserstack-test-reporting",
      __PKG_VERSION__
    );
    this.ingestBaseUrl = (options?.ingestBaseUrl ?? "https://collector-observability.browserstack.com").replace(/\/$/, "");
    const shared: TestReportingClientOptions = { ...options };
    this.automateClient = shared.automate;
    this.appAutomateClient = shared.appAutomate;
    // Those base URLs are Test Reporting's, so the sibling clients keep their own.
    delete shared.baseUrl;
    delete shared.uploadBaseUrl;
    delete shared.ingestBaseUrl;
    delete shared.automate;
    delete shared.appAutomate;
    this.siblingOptions = shared;
  }

  /** The session id of a test node, or undefined when it ran without a session. */
  static extractSessionId = extractSessionId;

  private get automate(): AutomateClient {
    return (this.automateClient ??= new AutomateClient(this.siblingOptions));
  }

  private get appAutomate(): AppAutomateClient {
    return (this.appAutomateClient ??= new AppAutomateClient(this.siblingOptions));
  }

  /**
   * Every TEST/HOOK of a build, following pagination, flattened from the ROOT → DESCRIBE → TEST tree. Each carries
   * `sessionId`, the `hashed_id` of its Automate (web) or App Automate (mobile) session.
   */
  async getBuildTests(buildId: string): Promise<BuildTest[]> {
    const out: BuildTest[] = [];
    let next: string | undefined;
    for (let page = 0; page < 50; page++) {
      const res = await this.getTestRuns(buildId, undefined, undefined, undefined, undefined, undefined, undefined, next);
      for (const root of res.hierarchy ?? []) out.push(...flattenTests(root, [], root));
      const cursor = res.pagination?.nextPage;
      if (!res.pagination?.hasNext || !cursor) break;
      next = cursor;
    }
    return out;
  }

  /** The build's tests grouped by session, in first-seen order. Sessions are per worker/file. Tests without a session are omitted. */
  async getBuildTestSessions(buildId: string): Promise<BuildTestSession[]> {
    const groups = new Map<string, BuildTest[]>();
    for (const test of await this.getBuildTests(buildId)) {
      if (!test.sessionId) continue;
      const list = groups.get(test.sessionId);
      if (list) list.push(test);
      else groups.set(test.sessionId, [test]);
    }
    return [...groups].map(([sessionId, tests]) => ({ sessionId, tests }));
  }

  /**
   * The Automate or App Automate session behind a test's session id, or undefined when neither knows it. Pass
   * `hint.device` for tests TRA reports a device for, to ask App Automate first. Cached per client.
   */
  getTestSession(sessionId: string, hint?: SessionHint): Promise<LinkedSession | undefined> {
    let cached = this.sessionCache.get(sessionId);
    if (!cached) {
      cached = this.lookupSession(sessionId, hint).catch((e: unknown) => {
        this.sessionCache.delete(sessionId);
        throw e;
      });
      this.sessionCache.set(sessionId, cached);
    }
    return cached;
  }

  /**
   * Fetches a test session's logs from whichever product owns it. Without `kinds`, fetches the text log plus every
   * kind the session reports a URL for. A log that doesn't exist (or, on App Automate, was never captured) comes
   * back as `{ status: "missing" }` rather than throwing, and so does a kind the owning product doesn't have. An
   * unknown session yields `{}`. Tests in one file share a session, so logs are not split per test.
   */
  async getTestSessionLogs(sessionId: string, kinds?: LogKind[], hint?: SessionHint): Promise<SessionLogs> {
    const linked = await this.getTestSession(sessionId, hint);
    if (!linked) return {};
    const wanted = kinds ?? defaultKinds(linked);
    return linked.product === "automate"
      ? fetchAutomateLogs(this.automate, sessionId, wanted)
      : fetchAppAutomateLogs(this.appAutomate, linked.session, sessionId, wanted);
  }

  // ── Live ingestion ────────────────────────────────────────────────────────────────────────────────────────────
  // These override the generated ingestion methods (same signatures) so they work against the live service, which
  // is the protocol BrowserStack's SDKs use: start a build with basic auth (returns a build id and a JWT), stream
  // events with that JWT, stop the build. A client must start a build before reporting runs or logs into it.

  private async ingest<T>(operationId: string, method: "POST" | "PUT", path: string, authorization: string, body: unknown): Promise<T> {
    const url = `${this.ingestBaseUrl}${path}`;
    const ctx = { operationId, method, url };
    let res: Response;
    try {
      res = await this.fetchFn(url, {
        method,
        headers: { "content-type": "application/json", authorization, "user-agent": this.userAgent },
        body: JSON.stringify(body),
      });
    } catch (cause) {
      throw new NetworkError((cause as Error).message || "network error", ctx, cause as Error);
    }
    const text = await res.text();
    if (!res.ok) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = undefined;
      }
      const message = (parsed as { message?: string } | undefined)?.message ?? `HTTP ${res.status} ${res.statusText}`;
      throw new HttpError(message, ctx, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        body: { text, parsed, truncated: false } as never,
        retryable: res.status >= 500 || res.status === 429,
      });
    }
    return (text ? JSON.parse(text) : {}) as T;
  }

  private buildState(buildHashedId: string) {
    const b = this.builds.get(buildHashedId);
    if (!b) throw new BrowserStackError(`Build ${buildHashedId} was not started by this client; call startBuild() first`);
    return b;
  }

  private async sendEvents(buildHashedId: string, events: unknown[], path = "/api/v1/batch"): Promise<void> {
    await this.ingest("sendTestReportingEvents", "POST", path, `Bearer ${this.buildState(buildHashedId).jwt}`, events);
  }

  override async startBuild(body: Parameters<GeneratedTestReportingClient["startBuild"]>[0]): ReturnType<GeneratedTestReportingClient["startBuild"]> {
    const res = await this.ingest<{ build_hashed_id?: string; jwt?: string }>("startTestReportingBuild", "POST", "/api/v2/builds", this.authHeader ?? "", buildStartBody(body as Parameters<typeof buildStartBody>[0]));
    if (!res.build_hashed_id || !res.jwt) throw new BrowserStackError("Build start returned no build id or JWT (is Test Reporting enabled for this account?)");
    this.builds.set(res.build_hashed_id, { jwt: res.jwt, framework: (body as { framework?: { name: string } }).framework?.name, runs: new Map() });
    return { success: true, buildHashedId: res.build_hashed_id } as Awaited<ReturnType<GeneratedTestReportingClient["startBuild"]>>;
  }

  override async startTestRun(buildHashedId: string, body: Parameters<GeneratedTestReportingClient["startTestRun"]>[1]): ReturnType<GeneratedTestReportingClient["startTestRun"]> {
    return this.startRun("test", buildHashedId, body) as ReturnType<GeneratedTestReportingClient["startTestRun"]>;
  }

  override async finishTestRun(buildHashedId: string, testRunUuid: string, body: Parameters<GeneratedTestReportingClient["finishTestRun"]>[2]): ReturnType<GeneratedTestReportingClient["finishTestRun"]> {
    return this.finishRun("test", buildHashedId, testRunUuid, body) as ReturnType<GeneratedTestReportingClient["finishTestRun"]>;
  }

  override async startHookRun(buildHashedId: string, body: Parameters<GeneratedTestReportingClient["startHookRun"]>[1]): ReturnType<GeneratedTestReportingClient["startHookRun"]> {
    return this.startRun("hook", buildHashedId, body) as ReturnType<GeneratedTestReportingClient["startHookRun"]>;
  }

  override async finishHookRun(buildHashedId: string, hookRunUuid: string, body: Parameters<GeneratedTestReportingClient["finishHookRun"]>[2]): ReturnType<GeneratedTestReportingClient["finishHookRun"]> {
    return this.finishRun("hook", buildHashedId, hookRunUuid, body) as ReturnType<GeneratedTestReportingClient["finishHookRun"]>;
  }

  private async startRun(type: "test" | "hook", buildHashedId: string, body: Record<string, any>) {
    const build = this.buildState(buildHashedId);
    const run: RunStart = {
      type,
      uuid: crypto.randomUUID(),
      name: body.name,
      fileName: body.fileName,
      scopes: body.scopes,
      startedAt: body.startedAt,
      tags: body.tags,
      location: body.location,
      hookType: body.hookType,
      framework: build.framework,
    };
    const data = runFields(run, { result: body.result ?? "pending", environment: body.environment, custom_metadata: body.customMetadata, test_run_id: body.testRunId });
    await this.sendEvents(buildHashedId, [{ event_type: type === "test" ? "TestRunStarted" : "HookRunStarted", [type === "test" ? "test_run" : "hook_run"]: data }]);
    build.runs.set(run.uuid, run);
    return { success: true, uuid: run.uuid };
  }

  private async finishRun(type: "test" | "hook", buildHashedId: string, uuid: string, body: Record<string, any>) {
    const build = this.buildState(buildHashedId);
    const run = build.runs.get(uuid);
    if (!run) throw new BrowserStackError(`${type} run ${uuid} was not started by this client`);
    const data = runFields(
      { ...run, fileName: body.fileName ?? run.fileName, scopes: body.scopes ?? run.scopes },
      { finished_at: body.finishedAt, result: body.result, duration_in_ms: body.durationInMs, environment: body.environment, custom_metadata: body.customMetadata, ...failureFields(body.failure) }
    );
    await this.sendEvents(buildHashedId, [{ event_type: type === "test" ? "TestRunFinished" : "HookRunFinished", [type === "test" ? "test_run" : "hook_run"]: data }]);
    build.runs.delete(uuid);
    return { success: true, message: `${type === "test" ? "Test" : "Hook"} run updated successfully.` };
  }

  override async addBuildLogs(buildHashedId: string, body: Parameters<GeneratedTestReportingClient["addBuildLogs"]>[1]): ReturnType<GeneratedTestReportingClient["addBuildLogs"]> {
    const logs = (body.logs as unknown as LogEntry[]).map(logFields);
    await this.sendEvents(buildHashedId, [{ event_type: "LogCreated", logs }]);
    return { success: true, message: "Logs ingested successfully." } as Awaited<ReturnType<GeneratedTestReportingClient["addBuildLogs"]>>;
  }

  override async finishBuild(buildHashedId: string, body: Parameters<GeneratedTestReportingClient["finishBuild"]>[1]): ReturnType<GeneratedTestReportingClient["finishBuild"]> {
    const build = this.buildState(buildHashedId);
    await this.ingest("finishTestReportingBuild", "PUT", `/api/v1/builds/${encodeURIComponent(buildHashedId)}/stop`, `Bearer ${build.jwt}`, { stop_time: body.finishedAt });
    this.builds.delete(buildHashedId);
    return { success: true, message: "Build finished successfully." } as Awaited<ReturnType<GeneratedTestReportingClient["finishBuild"]>>;
  }

  /**
   * Links a test run to the BrowserStack session it ran in, so TRA can show its session, logs and video (what
   * WebdriverIO sends as a CBTSessionCreated event). Takes the uuid `startTestRun` returned.
   */
  async linkTestRunSession(buildHashedId: string, testRunUuid: string, session: RunSession): Promise<void> {
    await this.sendEvents(buildHashedId, [{ event_type: "CBTSessionCreated", test_run: { uuid: testRunUuid, integrations: sessionIntegrations(session) } }]);
  }

  /** Attaches screenshots to test runs: `kind` `TEST_SCREENSHOT` logs whose `message` is the base64 image. */
  async addTestScreenshots(buildHashedId: string, screenshots: Array<{ testRunUuid: string; base64: string; timestamp?: string }>): Promise<void> {
    const logs = screenshots.map((s) => logFields({ kind: "TEST_SCREENSHOT", testRunUuid: s.testRunUuid, message: s.base64, timestamp: s.timestamp ?? new Date().toISOString() }));
    await this.sendEvents(buildHashedId, [{ event_type: "LogCreated", logs }], "/api/v1/screenshots");
  }

  private async lookupSession(sessionId: string, hint?: SessionHint): Promise<LinkedSession | undefined> {
    const web = async (): Promise<LinkedSession | undefined> => {
      try {
        return { product: "automate", session: await this.automate.getSession(sessionId) };
      } catch (e) {
        if (isNotFound(e)) return undefined;
        throw e;
      }
    };
    const mobile = async (): Promise<LinkedSession | undefined> => {
      try {
        return { product: "app-automate", session: await this.appAutomate.getSession(sessionId) };
      } catch (e) {
        if (isNotFound(e)) return undefined;
        throw e;
      }
    };
    for (const lookup of hint?.device ? [mobile, web] : [web, mobile]) {
      const found = await lookup();
      if (found) return found;
    }
    return undefined;
  }
}
