import { describe, expect, it } from "vitest";
import { TestReportingClient } from "../index.ts";

const username = process.env.BROWSERSTACK_USERNAME;
const accessKey = process.env.BROWSERSTACK_ACCESS_KEY ?? process.env.BROWSERSTACK_KEY;

// End to end against the real Test Reporting & Analytics ingestion API: report a run, then read it back.
describe.skipIf(!username || !accessKey)("TestReportingClient live ingestion", () => {
  it("reports a build with a passed and a failed test and reads them back", async () => {
    const client = new TestReportingClient({ username, accessKey });
    const now = () => new Date().toISOString();
    const { buildHashedId } = await client.startBuild({
      projectName: "sdk-integration-tests",
      name: `ingestion-live ${now()}`,
      startedAt: now(),
      framework: { name: "vitest", version: "4" },
      tags: ["sdk-test"],
    });
    expect(buildHashedId).toMatch(/^[a-z0-9]{40}$/);

    const ok = await client.startTestRun(buildHashedId!, { name: "passes", fileName: "ingestion.live.test.ts", scopes: ["live"], startedAt: now() });
    const bad = await client.startTestRun(buildHashedId!, { name: "fails", fileName: "ingestion.live.test.ts", scopes: ["live"], startedAt: now() });
    await client.addBuildLogs(buildHashedId!, { logs: [{ kind: "TEST_LOG", testRunUuid: bad.uuid, level: "ERROR", message: "boom", timestamp: now() }] });
    await client.finishTestRun(buildHashedId!, ok.uuid!, { result: "passed", finishedAt: now(), fileName: "ingestion.live.test.ts", scopes: ["live"], durationInMs: 5 });
    await client.finishTestRun(buildHashedId!, bad.uuid!, {
      result: "failed",
      finishedAt: now(),
      fileName: "ingestion.live.test.ts",
      scopes: ["live"],
      durationInMs: 5,
      failure: [{ error: "AssertionError: boom", backtrace: "at x" }],
    });
    await client.finishBuild(buildHashedId!, { finishedAt: now() });

    const reader = client;
    let summary: { passed?: number; failed?: number } | undefined;
    for (let i = 0; i < 20; i++) {
      try {
        summary = (await reader.getTestRuns(buildHashedId!)).testSummary; // the build can take a moment to become readable
      } catch {
        summary = undefined;
      }
      if ((summary?.passed ?? 0) + (summary?.failed ?? 0) >= 2) break;
      await new Promise((r) => setTimeout(r, 3000));
    }
    expect(summary).toMatchObject({ passed: 1, failed: 1 });
  }, 90_000);
});
