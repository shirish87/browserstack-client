/** A start/finish pair the router keeps aligned with Test Reporting & Analytics. */
export type PairKind = "build" | "test" | "hook" | "step";

export type TestResult = "passed" | "failed" | "skipped" | "timeout";

export const EXIT_OK = 0;
export const EXIT_FAILURE = 1;
export const EXIT_TIMEOUT = 124;

export interface PairCounts {
  started: number;
  finished: number;
}

export interface TraceError {
  code: string;
  message: string;
  spanId?: string;
  exitCode: number;
}

export interface TraceSnapshot {
  traceId: string;
  buildHashedId: string | null;
  /** Null while the build is open and nothing has failed or timed out. */
  exitCode: number | null;
  closed: boolean;
  /** True when every accepted start has exactly one finish and nothing is still open. */
  balanced: boolean;
  open: Record<PairKind, number>;
  pairs: Record<PairKind, PairCounts>;
  errors: TraceError[];
}

export interface TraLog {
  kind: "TEST_LOG" | "HTTP" | "TEST_SCREENSHOT" | "HOOK_LOG" | "TEST_STEP" | "TEST_ATTACHMENT";
  testRunUuid?: string;
  hookRunUuid?: string;
  timestamp: string;
  level?: "DEBUG" | "INFO" | "WARN" | "ERROR";
  message?: string;
  duration?: number;
  failure?: boolean;
  fileName?: string;
  fileSize?: number;
}

export interface TraFailure {
  error?: string;
  backtrace?: string;
}

/**
 * CamelCase view of the TRA ingestion calls the router balances.
 * The default client sends snake_case on the wire.
 */
export interface TraIngestClient {
  startBuild(body: {
    name: string;
    projectName: string;
    startedAt: string;
    framework: { name: string; version: string };
    tags?: string[];
  }): Promise<{ buildHashedId?: string }>;

  finishBuild(buildHashedId: string, body: { finishedAt: string }): Promise<unknown>;

  startTestRun(buildHashedId: string, body: {
    name: string;
    fileName: string;
    scopes: string[];
    startedAt: string;
    tags?: string[];
    location?: string;
  }): Promise<{ uuid?: string; testRunId?: string }>;

  finishTestRun(buildHashedId: string, testRunUuid: string, body: {
    result: TestResult;
    finishedAt: string;
    fileName: string;
    scopes: string[];
    durationInMs?: number;
    failure?: TraFailure[];
  }): Promise<unknown>;

  startHookRun(buildHashedId: string, body: {
    hookType: string;
    name: string;
    fileName: string;
    scopes: string[];
    startedAt: string;
    testRunId?: string;
    tags?: string[];
    location?: string;
  }): Promise<{ uuid?: string; testRunId?: string }>;

  finishHookRun(buildHashedId: string, hookRunUuid: string, body: {
    hookType: string;
    result: TestResult;
    finishedAt: string;
    fileName: string;
    scopes: string[];
    durationInMs?: number;
    failure?: TraFailure[];
  }): Promise<unknown>;

  addBuildLogs(buildHashedId: string, body: { logs: TraLog[] }): Promise<unknown>;
}

export interface OtelTimeouts {
  hookTimeoutMs: number;
  testTimeoutMs: number;
  stepTimeoutMs: number;
  buildTimeoutMs: number;
  buildIdleTimeoutMs: number;
  sweepIntervalMs: number;
  maxBodyBytes: number;
  maxFinishAttempts: number;
}

export const DEFAULT_OTEL_TIMEOUTS: OtelTimeouts = {
  hookTimeoutMs: 120_000,
  testTimeoutMs: 600_000,
  stepTimeoutMs: 120_000,
  buildTimeoutMs: 3_600_000,
  buildIdleTimeoutMs: 3_600_000,
  sweepIntervalMs: 5_000,
  maxBodyBytes: 1_048_576,
  maxFinishAttempts: 8,
};
