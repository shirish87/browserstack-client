import { BrowserStackOptions } from "@dot-slash/browserstack-core";
import { AppAutomateClient } from "@dot-slash/browserstack-app-automate";
import { AutomateClient } from "@dot-slash/browserstack-automate";
import { GeneratedTestReportingClient } from "@dot-slash/browserstack-openapi/test-reporting/client";
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

export interface TestReportingClientOptions extends BrowserStackOptions {
  uploadBaseUrl?: string;
  /** Base URL of the ingestion (collector) API: start/finish build, test and hook runs, build logs. */
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
  private readonly sessionCache = new Map<string, Promise<LinkedSession | undefined>>();

  constructor(options?: TestReportingClientOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api-automation.browserstack.com/ext/v1",
      options?.uploadBaseUrl ?? "https://upload-automation.browserstack.com",
      "@dot-slash/browserstack-test-reporting",
      __PKG_VERSION__,
      options?.ingestBaseUrl ?? "https://collector-observability.browserstack.com/ext/v1"
    );
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
