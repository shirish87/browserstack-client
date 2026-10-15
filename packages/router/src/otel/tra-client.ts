import { buildBasicAuthHeader } from "@dot-slash/browserstack-core";
import type { TraFailure, TraIngestClient, TraLog, TestResult } from "./types.ts";

export const DEFAULT_TRA_BASE_URL = "https://api-automation.browserstack.com/ext/v1";

function idFrom(body: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = body[key];
    if (typeof value === "string" && value.length > 0) return value;
  }
  return undefined;
}

export function createTraIngestClient(options: {
  username: string;
  accessKey: string;
  baseUrl?: string;
  fetchFn?: typeof fetch;
}): TraIngestClient {
  const fetchFn = options.fetchFn ?? fetch;
  const baseUrl = (options.baseUrl ?? DEFAULT_TRA_BASE_URL).replace(/\/$/, "");
  const authorization = buildBasicAuthHeader(options.username, options.accessKey);

  async function send(method: string, path: string, body?: unknown): Promise<Record<string, unknown>> {
    const response = await fetchFn(`${baseUrl}${path}`, {
      method,
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`TRA ${method} ${path} failed (${response.status}): ${text.slice(0, 500)}`);
    }
    if (!text) return {};
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, unknown>;
  }

  return {
    async startBuild(body) {
      const data = await send("POST", "/builds/start", {
        name: body.name,
        project_name: body.projectName,
        started_at: body.startedAt,
        framework: body.framework,
        tags: body.tags,
      });
      return { buildHashedId: idFrom(data, "build_hashed_id", "buildHashedId") };
    },

    async finishBuild(buildHashedId, body) {
      await send("PUT", `/builds/${encodeURIComponent(buildHashedId)}/finish`, {
        finished_at: body.finishedAt,
      });
    },

    async startTestRun(buildHashedId, body) {
      const data = await send("POST", `/builds/${encodeURIComponent(buildHashedId)}/tests/start`, {
        name: body.name,
        file_name: body.fileName,
        scopes: body.scopes,
        started_at: body.startedAt,
        tags: body.tags,
        location: body.location,
      });
      return { uuid: idFrom(data, "uuid", "test_run_id", "testRunId") };
    },

    async finishTestRun(buildHashedId, testRunUuid, body) {
      await send("PUT", `/builds/${encodeURIComponent(buildHashedId)}/tests/${encodeURIComponent(testRunUuid)}/finish`, finishBody(body));
    },

    async startHookRun(buildHashedId, body) {
      const data = await send("POST", `/builds/${encodeURIComponent(buildHashedId)}/hooks/start`, {
        hook_type: body.hookType,
        name: body.name,
        file_name: body.fileName,
        scopes: body.scopes,
        started_at: body.startedAt,
        test_run_id: body.testRunId,
        tags: body.tags,
        location: body.location,
      });
      return { uuid: idFrom(data, "uuid", "test_run_id", "testRunId") };
    },

    async finishHookRun(buildHashedId, hookRunUuid, body) {
      await send("PUT", `/builds/${encodeURIComponent(buildHashedId)}/hooks/${encodeURIComponent(hookRunUuid)}/finish`, {
        ...finishBody(body),
        hook_type: body.hookType,
      });
    },

    async addBuildLogs(buildHashedId, body) {
      await send("POST", `/builds/${encodeURIComponent(buildHashedId)}/logs`, {
        logs: body.logs.map(wireLog),
      });
    },
  };
}

function finishBody(body: {
  result: TestResult;
  finishedAt: string;
  fileName: string;
  scopes: string[];
  durationInMs?: number;
  failure?: TraFailure[];
}): Record<string, unknown> {
  return {
    result: body.result,
    finished_at: body.finishedAt,
    file_name: body.fileName,
    scopes: body.scopes,
    duration_in_ms: body.durationInMs,
    failure: body.failure,
  };
}

function wireLog(log: TraLog): Record<string, unknown> {
  return {
    kind: log.kind,
    test_run_uuid: log.testRunUuid,
    hook_run_uuid: log.hookRunUuid,
    timestamp: log.timestamp,
    level: log.level,
    message: log.message,
    duration: log.duration,
    failure: log.failure,
    file_name: log.fileName,
    file_size: log.fileSize,
  };
}
