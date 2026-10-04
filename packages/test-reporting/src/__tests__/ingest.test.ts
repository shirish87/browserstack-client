import { describe, expect, it } from "vitest";
import { TestReportingIngestClient } from "../ingest.ts";

function setup(responses: Array<{ status?: number; body?: unknown }>) {
  const calls: Array<{ url: string; method: string; headers: Record<string, string>; body: unknown }> = [];
  const queue = [...responses];
  const fetchFn = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({
      url: url.toString(),
      method: init?.method ?? "GET",
      headers: Object.fromEntries(new Headers(init?.headers).entries()),
      body: init?.body ? JSON.parse(init.body as string) : undefined,
    });
    const r = queue.shift() ?? { body: {} };
    return new Response(JSON.stringify(r.body ?? {}), { status: r.status ?? 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  return { calls, client: new TestReportingIngestClient({ username: "u", accessKey: "k", fetchFn }) };
}

const build = { projectName: "proj", name: "build", startedAt: "2026-01-01T00:00:00Z", framework: { name: "vitest", version: "4" } };

describe("TestReportingIngestClient", () => {
  it("starts a build on the collector with basic auth and keeps the returned id and JWT", async () => {
    const { client, calls } = setup([{ body: { build_hashed_id: "bld", jwt: "tok" } }]);
    const res = await client.startBuild({ ...build, tags: ["ci"], ciInfo: { name: "GitHub Actions", buildUrl: "https://ci/1" }, versionControl: { sha: "abc", commitMessage: "m" } });
    expect(res).toEqual({ buildHashedId: "bld", jwt: "tok" });
    expect(calls[0].url).toBe("https://collector-observability.browserstack.com/api/v2/builds");
    expect(calls[0].method).toBe("POST");
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

  it("fails when the build start returns no JWT", async () => {
    const { client } = setup([{ body: { build_hashed_id: "bld" } }]);
    await expect(client.startBuild(build)).rejects.toThrow(/jwt/i);
  });

  it("sends events in one batch with the bearer JWT", async () => {
    const { client, calls } = setup([{ body: { build_hashed_id: "bld", jwt: "tok" } }, { body: { success: true } }]);
    await client.startBuild(build);
    await client.sendEvents([{ event_type: "TestRunStarted", test_run: { uuid: "1" } }]);
    expect(calls[1].url).toBe("https://collector-observability.browserstack.com/api/v1/batch");
    expect(calls[1].headers.authorization).toBe("Bearer tok");
    expect(calls[1].body).toEqual([{ event_type: "TestRunStarted", test_run: { uuid: "1" } }]);
  });

  it("stops the build", async () => {
    const { client, calls } = setup([{ body: { build_hashed_id: "bld", jwt: "tok" } }, { body: {} }]);
    await client.startBuild(build);
    await client.stopBuild("2026-01-01T00:01:00Z");
    expect(calls[1].url).toBe("https://collector-observability.browserstack.com/api/v1/builds/bld/stop");
    expect(calls[1].method).toBe("PUT");
    expect(calls[1].body).toEqual({ stop_time: "2026-01-01T00:01:00Z" });
  });

  it("throws before a build is started and on HTTP errors", async () => {
    const a = setup([]);
    await expect(a.client.sendEvents([])).rejects.toThrow(/startBuild/);
    const b = setup([{ status: 403, body: { message: "no" } }]);
    await expect(b.client.startBuild(build)).rejects.toThrow(/403/);
  });
});
