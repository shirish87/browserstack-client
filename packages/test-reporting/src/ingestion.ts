// Live ingestion into Test Reporting & Analytics. This is the protocol the BrowserStack SDKs (e.g. WebdriverIO) use:
// a build is started with basic auth (which returns a build id and a JWT), test/hook/log events are streamed to the
// batch endpoint with that JWT, and the build is stopped at the end. The mapping from the camelCase request bodies of
// `TestReportingClient` to those wire events lives here.

const snake = (k: string) => k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const snakeKeys = (o: Record<string, unknown> | undefined) => o && Object.fromEntries(Object.entries(o).map(([k, v]) => [snake(k), v]));

export interface FrameworkInfo {
  name: string;
  version: string;
}

export function buildStartBody(body: {
  name: string;
  projectName: string;
  startedAt: string;
  framework?: FrameworkInfo;
  tags?: string[];
  buildRunIdentifier?: string;
  hostInfo?: Record<string, unknown>;
  ciInfo?: Record<string, unknown>;
  versionControl?: Record<string, unknown>;
}) {
  const f = body.framework;
  return {
    format: "json",
    project_name: body.projectName,
    name: body.name,
    started_at: body.startedAt,
    tags: body.tags,
    build_run_identifier: body.buildRunIdentifier,
    host_info: snakeKeys(body.hostInfo),
    ci_info: snakeKeys(body.ciInfo),
    version_control: snakeKeys(body.versionControl),
    framework_details: f && {
      frameworkName: f.name,
      frameworkVersion: f.version,
      sdkVersion: f.version,
      language: "ECMAScript",
      testFramework: { name: f.name, version: f.version },
    },
    product_map: { observability: true },
    config: {},
  };
}

export interface RunStart {
  type: "test" | "hook";
  uuid: string;
  name: string;
  fileName: string;
  scopes: string[];
  startedAt: string;
  tags?: string[];
  location?: string;
  hookType?: string;
  framework?: string;
}

/** Run fields that stay the same between a run's start and finish event. */
export function runFields(r: RunStart, extra: Record<string, unknown> = {}) {
  return {
    uuid: r.uuid,
    type: r.type,
    name: r.name,
    scope: r.scopes.join(" > "),
    scopes: r.scopes,
    identifier: `${r.fileName} > ${r.scopes.join(" > ")} > ${r.name}`,
    file_name: r.fileName,
    location: r.location ?? r.fileName,
    tags: r.tags,
    framework: r.framework,
    hook_type: r.hookType,
    started_at: r.startedAt,
    ...extra,
  };
}

export function failureFields(failure: Array<{ error?: string; backtrace?: string }> | undefined) {
  if (!failure?.length) return {};
  const first = failure[0].error ?? "";
  return {
    failure: failure.map((x) => ({ backtrace: [x.error ?? "", x.backtrace ?? ""] })),
    failure_reason: first,
    failure_type: /AssertionError/.test(first) ? "AssertionError" : "UnhandledError",
  };
}

export interface LogEntry {
  kind: string;
  testRunUuid?: string;
  hookRunUuid?: string;
  timestamp?: string;
  level?: string;
  message?: string;
  duration?: number;
  failure?: boolean;
  fileName?: string;
  fileSize?: number;
  attachmentType?: string;
  httpResponse?: Record<string, unknown>;
}

export const logFields = (l: LogEntry) => ({
  kind: l.kind,
  test_run_uuid: l.testRunUuid,
  hook_run_uuid: l.hookRunUuid,
  timestamp: l.timestamp,
  level: l.level,
  message: l.message,
  duration: l.duration,
  failure: l.failure,
  file_name: l.fileName,
  file_size: l.fileSize,
  attachment_type: l.attachmentType,
  http_response: l.httpResponse ?? {},
});

/** Session/cloud details of a test run, as BrowserStack's CBTSessionCreated event carries them. */
export interface RunSession {
  /** Cloud provider key, e.g. `browserstack`. */
  provider?: string;
  sessionId: string;
  browser?: string;
  browserVersion?: string;
  platform?: string;
  platformVersion?: string;
  device?: string;
  capabilities?: Record<string, unknown>;
}

export const sessionIntegrations = (s: RunSession) => ({
  [s.provider ?? "browserstack"]: {
    capabilities: s.capabilities,
    session_id: s.sessionId,
    browser: s.browser,
    browser_version: s.browserVersion,
    platform: s.platform,
    platform_version: s.platformVersion,
    device: s.device,
  },
});
