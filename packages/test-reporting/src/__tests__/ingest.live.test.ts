import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { TestReportingClient } from "../index.ts";
import { TestReportingIngestClient } from "../ingest.ts";

const username = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY ?? process.env.BROWSERSTACK_KEY;

// End to end against the real Test Reporting & Analytics ingestion API: report a run, then read it back.
describe.skipIf(!username || !accessKey)("TestReportingIngestClient (live)", () => {
  it("reports a build with a passed and a failed test and reads them back", async () => {
    const ingest = new TestReportingIngestClient({ username, accessKey });
    const now = () => new Date().toISOString();
    const { buildHashedId } = await ingest.startBuild({
      projectName: "sdk-integration-tests",
      name: `ingest-live ${now()}`,
      startedAt: now(),
      framework: { name: "vitest", version: "4" },
      tags: ["sdk-test"],
    });
    expect(buildHashedId).toMatch(/^[a-z0-9]{40}$/);

    const run = (name: string) => ({ uuid: randomUUID(), type: "test", name, scope: `live > ${name}`, scopes: ["live"], file_name: "ingest.live.test.ts", framework: "vitest" });
    const ok = run("passes");
    const bad = run("fails");
    await ingest.sendEvents([
      { event_type: "TestRunStarted", test_run: { ...ok, started_at: now(), result: "pending" } },
      { event_type: "TestRunStarted", test_run: { ...bad, started_at: now(), result: "pending" } },
    ]);
    await ingest.sendEvents([
      { event_type: "LogCreated", logs: [{ kind: "TEST_LOG", test_run_uuid: bad.uuid, level: "ERROR", message: "boom", timestamp: now(), http_response: {} }] },
      { event_type: "TestRunFinished", test_run: { ...ok, finished_at: now(), result: "passed", duration_in_ms: 5 } },
      {
        event_type: "TestRunFinished",
        test_run: { ...bad, finished_at: now(), result: "failed", duration_in_ms: 5, failure: [{ backtrace: ["boom", "at x"] }], failure_reason: "boom", failure_type: "AssertionError" },
      },
    ]);
    await ingest.stopBuild(now());

    const reader = new TestReportingClient({ username, accessKey });
    let summary: { passed?: number; failed?: number } | undefined;
    for (let i = 0; i < 20; i++) {
      summary = (await reader.getTestRuns(buildHashedId)).testSummary;
      if ((summary?.passed ?? 0) + (summary?.failed ?? 0) >= 2) break;
      await new Promise((r) => setTimeout(r, 3000));
    }
    expect(summary).toMatchObject({ passed: 1, failed: 1 });
  }, 90_000);
});
