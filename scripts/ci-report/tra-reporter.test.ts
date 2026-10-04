import { describe, expect, it, vi } from "vitest";
import { TraReporter } from "./tra-reporter.mjs";

const env = {
  GITHUB_REPOSITORY: "shirish87/browserstack-client",
  GITHUB_RUN_ID: "123",
  GITHUB_RUN_NUMBER: "45",
  GITHUB_RUN_ATTEMPT: "1",
  GITHUB_REF_NAME: "main",
  GITHUB_SHA: "abcdef1234567890",
  GITHUB_WORKFLOW: "CI",
  TRA_LABEL: "linux",
};

function fakeClient() {
  return {
    startBuild: vi.fn(async () => ({ success: true, buildHashedId: "bld1" })),
    startTestRun: vi.fn(async () => ({ success: true, uuid: "run1" })),
    finishTestRun: vi.fn(async () => ({ success: true })),
    finishBuild: vi.fn(async () => ({ success: true })),
    addBuildLogs: vi.fn(async () => ({ success: true })),
  };
}

const tc = (over: Record<string, unknown> = {}) => ({
  id: "t1",
  name: "does a thing",
  fullName: "suite > does a thing",
  module: { moduleId: "/repo/packages/core/src/a.test.ts" },
  project: { name: "core" },
  location: { line: 3, column: 1 },
  result: () => ({ state: "passed", errors: [] }),
  diagnostic: () => ({ duration: 12.4 }),
  ...over,
});

describe("TraReporter", () => {
  it("starts the build when the run starts, with CI metadata", async () => {
    const client = fakeClient();
    const r = new TraReporter({ client, env, cwd: "/repo" });
    await r.onTestRunStart([]);
    await r.onTestRunEnd([], []);
    expect(client.startBuild).toHaveBeenCalledWith(
      expect.objectContaining({
        projectName: "shirish87/browserstack-client",
        name: "CI #45 (main) [linux]",
        buildRunIdentifier: "123-1-linux",
        framework: expect.objectContaining({ name: "vitest" }),
        ciInfo: expect.objectContaining({ buildUrl: "https://github.com/shirish87/browserstack-client/actions/runs/123" }),
        versionControl: expect.objectContaining({ sha: "abcdef1234567890", branch: "main" }),
      })
    );
  });

  it("captures PR context: head commit and branch, PR number/title, actor, event and run/job URLs", async () => {
    const client = fakeClient();
    const event = {
      pull_request: {
        number: 34,
        title: "ci: report to TRA",
        html_url: "https://github.com/shirish87/browserstack-client/pull/34",
        head: { ref: "feature/x", sha: "headsha1234567" },
      },
    };
    const prEnv = { ...env, GITHUB_EVENT_NAME: "pull_request", GITHUB_HEAD_REF: "feature/x", GITHUB_ACTOR: "shirish87", GITHUB_JOB: "test-sdk", GITHUB_REF_NAME: "34/merge", GITHUB_SERVER_URL: "https://github.com", RUNNER_OS: "Linux" };
    const r = new TraReporter({ client, env: prEnv, cwd: "/repo", event });
    await r.onTestRunStart();
    expect(client.startBuild).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "CI #45 (feature/x) [linux]",
        tags: expect.arrayContaining(["ci", "linux", "feature/x", "pull_request"]),
        versionControl: expect.objectContaining({ sha: "headsha1234567", branch: "feature/x", commitMessage: "ci: report to TRA" }),
        ciInfo: expect.objectContaining({
          name: "GitHub Actions",
          buildUrl: "https://github.com/shirish87/browserstack-client/actions/runs/123",
          url: "https://github.com/shirish87/browserstack-client/pull/34",
          buildNumber: "45",
          jobName: "test-sdk",
        }),
      })
    );
  });

  it("captures push context: head commit message and author from the event", async () => {
    const client = fakeClient();
    const event = { head_commit: { message: "fix: a thing\n\nbody", author: { name: "Ann", email: "ann@x.io" }, committer: { name: "Bob", email: "bob@x.io" } } };
    const r = new TraReporter({ client, env: { ...env, GITHUB_EVENT_NAME: "push" }, cwd: "/repo", event });
    await r.onTestRunStart();
    expect(client.startBuild).toHaveBeenCalledWith(
      expect.objectContaining({
        versionControl: expect.objectContaining({ sha: "abcdef1234567890", branch: "main", commitMessage: "fix: a thing", committerName: "Bob", committerEmail: "bob@x.io" }),
      })
    );
  });

  it("reports each test live: start when it is ready, finish when it has a result", async () => {
    const client = fakeClient();
    const r = new TraReporter({ client, env, cwd: "/repo" });
    await r.onTestRunStart([]);
    await r.onTestCaseReady(tc());
    expect(client.startTestRun).toHaveBeenCalledWith("bld1", expect.objectContaining({ name: "does a thing", scopes: ["core", "suite"], fileName: "packages/core/src/a.test.ts" }));
    expect(client.finishTestRun).not.toHaveBeenCalled();
    await r.onTestCaseResult(tc());
    expect(client.finishTestRun).toHaveBeenCalledWith("bld1", "run1", expect.objectContaining({ result: "passed", durationInMs: 12 }));
    await r.onTestRunEnd([], []);
    expect(client.finishBuild).toHaveBeenCalledWith("bld1", expect.objectContaining({ finishedAt: expect.any(String) }));
  });

  it("maps failures with error and backtrace", async () => {
    const client = fakeClient();
    const r = new TraReporter({ client, env, cwd: "/repo" });
    await r.onTestRunStart([]);
    await r.onTestCaseReady(tc());
    await r.onTestCaseResult(tc({ result: () => ({ state: "failed", errors: [{ message: "boom", stack: "at x" }] }) }));
    expect(client.finishTestRun).toHaveBeenCalledWith("bld1", "run1", expect.objectContaining({ result: "failed", failure: [{ error: "boom", backtrace: "at x" }] }));
  });

  it("sends test console output as TEST_LOG entries linked to the test run", async () => {
    const client = fakeClient();
    const r = new TraReporter({ client, env, cwd: "/repo" });
    await r.onTestRunStart();
    await r.onTestCaseReady(tc());
    await r.onUserConsoleLog({ content: "hello\n", type: "stderr", taskId: "t1", time: 1759600000000 });
    await r.onTestRunEnd([], []);
    expect(client.addBuildLogs).toHaveBeenCalledWith("bld1", {
      logs: [expect.objectContaining({ kind: "TEST_LOG", testRunUuid: "run1", level: "ERROR", message: "hello", timestamp: new Date(1759600000000).toISOString() })],
    });
  });

  it("sends failure messages and unhandled errors as ERROR logs with stack traces", async () => {
    const client = fakeClient();
    const r = new TraReporter({ client, env, cwd: "/repo" });
    await r.onTestRunStart();
    await r.onTestCaseReady(tc());
    await r.onTestCaseResult(tc({ result: () => ({ state: "failed", errors: [{ message: "boom", stack: "Error: boom\n  at x" }] }) }));
    await r.onTestRunEnd([], [{ name: "Error", message: "unhandled", stack: "Error: unhandled\n  at y" }]);
    const logs = client.addBuildLogs.mock.calls.flatMap((c) => (c[1] as { logs: unknown[] }).logs);
    expect(logs).toContainEqual(expect.objectContaining({ kind: "TEST_LOG", testRunUuid: "run1", level: "ERROR", message: "Error: boom\n  at x", failure: true }));
    expect(logs).toContainEqual(expect.objectContaining({ kind: "TEST_LOG", level: "ERROR", message: "Error: unhandled\n  at y", failure: true }));
  });

  it("never throws and stops calling once the build cannot be started", async () => {
    const client = fakeClient();
    client.startBuild.mockRejectedValue(new Error("unreachable"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const r = new TraReporter({ client, env, cwd: "/repo" });
    await expect(r.onTestRunStart([])).resolves.toBeUndefined();
    await expect(r.onTestCaseReady(tc())).resolves.toBeUndefined();
    await expect(r.onTestCaseResult(tc())).resolves.toBeUndefined();
    await expect(r.onTestRunEnd([], [])).resolves.toBeUndefined();
    expect(client.startTestRun).not.toHaveBeenCalled();
    expect(client.finishBuild).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("swallows per-test API errors", async () => {
    const client = fakeClient();
    client.startTestRun.mockRejectedValue(new Error("500"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const r = new TraReporter({ client, env, cwd: "/repo" });
    await r.onTestRunStart([]);
    await r.onTestCaseReady(tc());
    await expect(r.onTestCaseResult(tc())).resolves.toBeUndefined();
    expect(client.finishTestRun).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("is disabled without credentials", async () => {
    const r = await TraReporter.fromEnv({ GITHUB_RUN_ID: "1" });
    expect(r.enabled).toBe(false);
  });
});
