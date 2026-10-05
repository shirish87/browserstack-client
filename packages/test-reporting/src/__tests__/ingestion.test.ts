import { describe, expect, it } from "vitest";
import { BrowserStackError } from "@dot-slash/browserstack-core";
import { HttpError } from "@dot-slash/browserstack-openapi-transforms";
import { TestReportingClient } from "../index.ts";

const COLLECTOR = "https://collector-observability.browserstack.com";

const firstEvent = (body: unknown): unknown => (Array.isArray(body) ? body[0] : undefined);

function setup(startBody: unknown = { build_hashed_id: "bld", jwt: "tok" }) {
  const calls: Array<{ url: string; method: string; headers: Record<string, string>; body: unknown }> = [];
  const queue: Array<{ status?: number; body: unknown }> = [{ body: startBody }];
  const fetchFn = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: url.toString(), method: init?.method ?? "GET", headers: Object.fromEntries(new Headers(init?.headers).entries()), body: init?.body ? JSON.parse(init.body as string) : undefined });
    const r = queue.shift() ?? { body: { success: true } };
    return new Response(JSON.stringify(r.body), { status: r.status ?? 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  const client = new TestReportingClient({ username: "u", accessKey: "k", fetchFn });
  return { client, calls, queue };
}

const build = { name: "build", projectName: "proj", startedAt: "2026-01-01T00:00:00Z", framework: { name: "vitest", version: "4" } };
const started = async (s = setup()) => ({ ...s, id: (await s.client.startBuild(build)).buildHashedId as string });

describe("live ingestion (TestReportingClient)", () => {
  it("startBuild posts to the collector with basic auth and returns the build id", async () => {
    const { client, calls } = setup();
    const res = await client.startBuild({ ...build, tags: ["ci"], ciInfo: { name: "GitHub Actions", buildUrl: "https://ci/1" }, versionControl: { sha: "abc", commitMessage: "m" } } as never);
    expect(res).toEqual({ success: true, buildHashedId: "bld" });
    expect(calls[0].url).toBe(`${COLLECTOR}/api/v2/builds`);
    expect(calls[0].headers.authorization).toBe(`Basic ${btoa("u:k")}`);
    expect(calls[0].body).toMatchObject({
      format: "json",
      project_name: "proj",
      name: "build",
      started_at: "2026-01-01T00:00:00Z",
      tags: ["ci"],
      ci_info: { name: "GitHub Actions", build_url: "https://ci/1" },
      version_control: { sha: "abc", commit_message: "m" },
      product_map: { observability: true },
      framework_details: { frameworkName: "vitest", frameworkVersion: "4", testFramework: { name: "vitest", version: "4" } },
    });
  });

  it("startBuild fails without a JWT", async () => {
    await expect(setup({ build_hashed_id: "bld" }).client.startBuild(build)).rejects.toThrow(/JWT/);
  });

  it("honours ingestBaseUrl", async () => {
    const urls: string[] = [];
    const fetchFn = (async (url: string | URL | Request) => (urls.push(url.toString()), new Response(JSON.stringify({ build_hashed_id: "b", jwt: "t" }), { status: 200 }))) as typeof fetch;
    await new TestReportingClient({ username: "u", accessKey: "k", fetchFn, ingestBaseUrl: "https://example.test/" }).startBuild(build);
    expect(urls[0]).toBe("https://example.test/api/v2/builds");
  });

  it("startTestRun sends TestRunStarted with the build JWT and returns the run uuid", async () => {
    const { client, calls, id } = await started();
    const res = await client.startTestRun(id, { name: "t", fileName: "a.test.ts", scopes: ["unit", "suite"], startedAt: "2026-01-01T00:00:01Z" });
    expect(res.uuid).toMatch(/^[0-9a-f-]{36}$/);
    expect(calls[1].url).toBe(`${COLLECTOR}/api/v1/batch`);
    expect(calls[1].headers.authorization).toBe("Bearer tok");
    expect(calls[1].body).toEqual([
      { event_type: "TestRunStarted", test_run: expect.objectContaining({ uuid: res.uuid, type: "test", name: "t", file_name: "a.test.ts", scopes: ["unit", "suite"], scope: "unit > suite", framework: "vitest", result: "pending", started_at: "2026-01-01T00:00:01Z" }) },
    ]);
  });

  it("finishTestRun sends TestRunFinished merged with the start data, including failure details", async () => {
    const { client, calls, id } = await started();
    const { uuid } = await client.startTestRun(id, { name: "t", fileName: "a.test.ts", scopes: ["unit"], startedAt: "2026-01-01T00:00:01Z" });
    await client.finishTestRun(id, uuid as string, {
      result: "failed",
      finishedAt: "2026-01-01T00:00:02Z",
      fileName: "a.test.ts",
      scopes: ["unit"],
      durationInMs: 1000,
      failure: [{ error: "AssertionError: boom", backtrace: "at x" }],
    });
    expect(firstEvent(calls[2].body)).toMatchObject({
      event_type: "TestRunFinished",
      test_run: { uuid, name: "t", started_at: "2026-01-01T00:00:01Z", finished_at: "2026-01-01T00:00:02Z", result: "failed", duration_in_ms: 1000, failure: [{ backtrace: ["AssertionError: boom", "at x"] }], failure_reason: "AssertionError: boom", failure_type: "AssertionError" },
    });
  });

  it("hook runs use HookRunStarted/HookRunFinished", async () => {
    const { client, calls, id } = await started();
    const { uuid } = await client.startHookRun(id, { hookType: "BEFORE_ALL", name: "setup", fileName: "a.test.ts", scopes: ["unit"], startedAt: "2026-01-01T00:00:01Z" });
    await client.finishHookRun(id, uuid as string, { hookType: "BEFORE_ALL", result: "passed", finishedAt: "2026-01-01T00:00:02Z", fileName: "a.test.ts", scopes: ["unit"] });
    expect(firstEvent(calls[1].body)).toMatchObject({ event_type: "HookRunStarted", hook_run: { uuid, type: "hook", hook_type: "BEFORE_ALL" } });
    expect(firstEvent(calls[2].body)).toMatchObject({ event_type: "HookRunFinished", hook_run: { uuid, result: "passed" } });
  });

  it("addBuildLogs sends a LogCreated event with snake_case fields", async () => {
    const { client, calls, id } = await started();
    await client.addBuildLogs(id, { logs: [{ kind: "TEST_LOG", testRunUuid: "u1", level: "ERROR", message: "boom", timestamp: "2026-01-01T00:00:01Z" }] });
    expect(calls[1].body).toEqual([
      { event_type: "LogCreated", logs: [expect.objectContaining({ kind: "TEST_LOG", test_run_uuid: "u1", level: "ERROR", message: "boom", timestamp: "2026-01-01T00:00:01Z", http_response: {} })] },
    ]);
  });

  it("finishBuild stops the build and forgets it", async () => {
    const { client, calls, id } = await started();
    await client.finishBuild(id, { finishedAt: "2026-01-01T00:01:00Z" });
    expect(calls[1].url).toBe(`${COLLECTOR}/api/v1/builds/bld/stop`);
    expect(calls[1].method).toBe("PUT");
    expect(calls[1].body).toEqual({ stop_time: "2026-01-01T00:01:00Z" });
    await expect(client.addBuildLogs(id, { logs: [] })).rejects.toThrow(BrowserStackError);
  });

  it("linkTestRunSession sends CBTSessionCreated with the session details", async () => {
    const { client, calls, id } = await started();
    await client.linkTestRunSession(id, "run1", { sessionId: "s1", browser: "chrome", browserVersion: "130", platform: "linux" });
    expect(calls[1].body).toEqual([
      { event_type: "CBTSessionCreated", test_run: { uuid: "run1", integrations: { browserstack: expect.objectContaining({ session_id: "s1", browser: "chrome", browser_version: "130", platform: "linux" }) } } },
    ]);
  });

  it("addTestScreenshots sends TEST_SCREENSHOT logs to the screenshots endpoint", async () => {
    const { client, calls, id } = await started();
    await client.addTestScreenshots(id, [{ testRunUuid: "run1", base64: "aGk=" }]);
    expect(calls[1].url).toBe(`${COLLECTOR}/api/v1/screenshots`);
    expect(firstEvent(calls[1].body)).toMatchObject({ event_type: "LogCreated", logs: [expect.objectContaining({ kind: "TEST_SCREENSHOT", test_run_uuid: "run1", message: "aGk=" })] });
  });

  it("rejects runs and logs for a build this client did not start", async () => {
    const { client } = setup();
    await expect(client.startTestRun("nope", { name: "t", fileName: "f", scopes: ["s"], startedAt: "2026-01-01T00:00:00Z" })).rejects.toThrow(/startBuild/);
  });

  it("surfaces HTTP errors with status and body", async () => {
    const { client, queue } = setup();
    queue[0] = { status: 403, body: { message: "no" } };
    await expect(client.startBuild(build)).rejects.toBeInstanceOf(HttpError);
  });
});
