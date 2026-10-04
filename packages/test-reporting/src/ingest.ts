import { BrowserStackError, type BrowserStackOptions } from "@dot-slash/browserstack-core";

export interface IngestBuildRequest {
  projectName: string;
  name: string;
  startedAt: string;
  framework: { name: string; version: string };
  tags?: string[];
  buildRunIdentifier?: string;
  hostInfo?: { hostname?: string; platform?: string; type?: string; version?: string; arch?: string };
  ciInfo?: { name?: string; buildUrl?: string; url?: string; buildNumber?: string; jobName?: string };
  versionControl?: { name?: string; sha?: string; branch?: string; tag?: string; commitMessage?: string; committerName?: string; committerEmail?: string };
}

/** An event for `sendEvents`: TestRunStarted/TestRunFinished (`test_run`), HookRun* (`hook_run`) or LogCreated (`logs`). */
export interface IngestEvent {
  event_type: "TestRunStarted" | "TestRunFinished" | "HookRunStarted" | "HookRunFinished" | "LogCreated" | (string & {});
  [key: string]: unknown;
}

export interface TestReportingIngestOptions extends Pick<BrowserStackOptions, "username" | "accessKey" | "fetchFn"> {
  /** Defaults to the Test Reporting & Analytics collector. */
  baseUrl?: string;
}

/**
 * Live ingestion into Test Reporting & Analytics, the way the BrowserStack SDKs (e.g. WebdriverIO) report results: start a
 * build with basic auth (which returns a build id and a JWT), stream test, hook and log events with the JWT, then stop the build.
 */
export class TestReportingIngestClient {
  private readonly baseUrl: string;
  private readonly basicAuth: string;
  private readonly fetchFn: typeof fetch;
  private build: { buildHashedId: string; jwt: string } | undefined;

  constructor(options: TestReportingIngestOptions) {
    const username = options.username ?? process.env.BROWSERSTACK_USERNAME;
    const accessKey = options.accessKey ?? process.env.BROWSERSTACK_ACCESS_KEY ?? process.env.BROWSERSTACK_KEY;
    if (!username || !accessKey) throw new BrowserStackError("Missing username or accessKey");
    this.basicAuth = `Basic ${Buffer.from(`${username}:${accessKey}`).toString("base64")}`;
    this.baseUrl = (options.baseUrl ?? "https://collector-observability.browserstack.com").replace(/\/$/, "");
    this.fetchFn = options.fetchFn ?? fetch;
  }

  async startBuild(req: IngestBuildRequest): Promise<{ buildHashedId: string; jwt: string }> {
    const res = await this.request<{ build_hashed_id?: string; jwt?: string }>("POST", "/api/v2/builds", this.basicAuth, {
      format: "json",
      project_name: req.projectName,
      name: req.name,
      started_at: req.startedAt,
      tags: req.tags,
      build_run_identifier: req.buildRunIdentifier,
      host_info: req.hostInfo,
      ci_info: req.ciInfo && { name: req.ciInfo.name, build_url: req.ciInfo.buildUrl, url: req.ciInfo.url, build_number: req.ciInfo.buildNumber, job_name: req.ciInfo.jobName },
      version_control: req.versionControl && {
        name: req.versionControl.name,
        sha: req.versionControl.sha,
        branch: req.versionControl.branch,
        tag: req.versionControl.tag,
        commit_message: req.versionControl.commitMessage,
        committer_name: req.versionControl.committerName,
        committer_email: req.versionControl.committerEmail,
      },
      framework_details: {
        frameworkName: req.framework.name,
        frameworkVersion: req.framework.version,
        sdkVersion: req.framework.version,
        language: "ECMAScript",
        testFramework: { name: req.framework.name, version: req.framework.version },
      },
      product_map: { observability: true },
      config: {},
    });
    if (!res.build_hashed_id || !res.jwt) throw new BrowserStackError("Build start returned no build id or jwt (is Test Reporting enabled for this account?)");
    this.build = { buildHashedId: res.build_hashed_id, jwt: res.jwt };
    return this.build;
  }

  async sendEvents(events: IngestEvent[]): Promise<void> {
    await this.request("POST", "/api/v1/batch", this.bearer("sendEvents"), events);
  }

  async stopBuild(stopTime: string): Promise<void> {
    await this.request("PUT", `/api/v1/builds/${this.build?.buildHashedId}/stop`, this.bearer("stopBuild"), { stop_time: stopTime });
  }

  private bearer(method: string): string {
    if (!this.build) throw new BrowserStackError(`${method}() called before startBuild()`);
    return `Bearer ${this.build.jwt}`;
  }

  private async request<T>(method: string, path: string, authorization: string, body: unknown): Promise<T> {
    const res = await this.fetchFn(`${this.baseUrl}${path}`, {
      method,
      headers: { "content-type": "application/json", authorization },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    if (!res.ok) throw new BrowserStackError(`${method} ${path} failed: HTTP ${res.status}${text ? ` ${text.slice(0, 300)}` : ""}`);
    return (text ? JSON.parse(text) : {}) as T;
  }
}
