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
    startBuild: vi.fn(async () => ({ buildHashedId: "bld1", jwt: "tok" })),
    sendEvents: vi.fn(async () => undefined),
    stopBuild: vi.fn(async () => undefined),
  };
}

const tc = (over: Record<string, unknown> = {}) => ({
  id: "t1",
  name: "does a thing",
  fullName: "suite > does a thing",
  module: { moduleId: "/repo/packages/core/src/a.test.ts" },
  project: { name: "core" },
  result: () => ({ state: "passed", errors: [] }),
  diagnostic: () => ({ duration: 12.4 }),
  ...over,
});

const make = (client = fakeClient(), extra: Record<string, unknown> = {}) => new TraReporter({ client, env, cwd: "/repo", event: {}, ...extra });
const events = (client: ReturnType<typeof fakeClient>) => client.sendEvents.mock.calls.flatMap((c) => c[0] as Array<Record<string, any>>);

describe("TraReporter", () => {
  it("starts the build when the run starts, with CI metadata", async () => {
    const client = fakeClient();
    const r = make(client);
    await r.onTestRunStart();
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
    expect(client.stopBuild).toHaveBeenCalledWith(expect.any(String));
  });

  it("captures PR context: head commit and branch, PR number/title, actor, event and run/job URLs", async () => {
    const client = fakeClient();
    const event = {
      pull_request: { number: 34, title: "ci: report to TRA", html_url: "https://github.com/shirish87/browserstack-client/pull/34", head: { ref: "feature/x", sha: "headsha1234567" } },
    };
    const prEnv = { ...env, GITHUB_EVENT_NAME: "pull_request", GITHUB_HEAD_REF: "feature/x", GITHUB_ACTOR: "shirish87", GITHUB_JOB: "test-sdk", GITHUB_REF_NAME: "34/merge", RUNNER_OS: "Linux" };
    const r = new TraReporter({ client, env: prEnv, cwd: "/repo", event });
    await r.onTestRunStart();
    expect(client.startBuild).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "CI #45 (feature/x) [linux]",
        tags: expect.arrayContaining(["ci", "linux", "feature/x", "pull_request"]),
        versionControl: expect.objectContaining({ sha: "headsha1234567", branch: "feature/x", commitMessage: "ci: report to TRA" }),
        ciInfo: expect.objectContaining({ name: "GitHub Actions", url: "https://github.com/shirish87/browserstack-client/pull/34", buildNumber: "45", jobName: "test-sdk" }),
      })
    );
  });

  it("captures push context: head commit message and author from the event", async () => {
    const client = fakeClient();
    const event = { head_commit: { message: "fix: a thing\n\nbody", committer: { name: "Bob", email: "bob@x.io" } } };
    const r = new TraReporter({ client, env: { ...env, GITHUB_EVENT_NAME: "push" }, cwd: "/repo", event });
    await r.onTestRunStart();
    expect(client.startBuild).toHaveBeenCalledWith(
      expect.objectContaining({ versionControl: expect.objectContaining({ commitMessage: "fix: a thing", committerName: "Bob", committerEmail: "bob@x.io" }) })
    );
  });

  it("reports each test live: TestRunStarted when ready, TestRunFinished when it has a result", async () => {
    const client = fakeClient();
    const r = make(client);
    await r.onTestRunStart();
    await r.onTestCaseReady(tc());
    const [started] = events(client);
    expect(started).toMatchObject({
      event_type: "TestRunStarted",
      test_run: { type: "test", name: "does a thing", scopes: ["core", "suite"], file_name: "packages/core/src/a.test.ts", framework: "vitest", result: "pending", uuid: expect.any(String) },
    });
    await r.onTestCaseResult(tc());
    const finished = events(client).find((e) => e.event_type === "TestRunFinished")!;
    expect(finished.test_run).toMatchObject({ uuid: started.test_run.uuid, result: "passed", duration_in_ms: 12 });
  });

  it("reports failures with message, stack trace and an ERROR log", async () => {
    const client = fakeClient();
    const r = make(client);
    await r.onTestRunStart();
    await r.onTestCaseReady(tc());
    await r.onTestCaseResult(tc({ result: () => ({ state: "failed", errors: [{ name: "AssertionError", message: "boom", stack: "Error: boom\n  at x" }] }) }));
    const ev = events(client);
    const finished = ev.find((e) => e.event_type === "TestRunFinished")!;
    expect(finished.test_run).toMatchObject({ result: "failed", failure: [{ backtrace: ["boom", "Error: boom\n  at x"] }], failure_reason: "boom", failure_type: "AssertionError" });
    const log = ev.find((e) => e.event_type === "LogCreated")!;
    expect(log.logs[0]).toMatchObject({ kind: "TEST_LOG", level: "ERROR", message: "Error: boom\n  at x", test_run_uuid: finished.test_run.uuid, failure: true });
  });

  it("sends test console output as TEST_LOG entries linked to the run", async () => {
    const client = fakeClient();
    const r = make(client);
    await r.onTestRunStart();
    await r.onTestCaseReady(tc());
    await r.onUserConsoleLog({ content: "hello\n", type: "stderr", taskId: "t1", time: 1759600000000 });
    const log = events(client).find((e) => e.event_type === "LogCreated")!;
    expect(log.logs[0]).toMatchObject({ kind: "TEST_LOG", level: "ERROR", message: "hello", timestamp: new Date(1759600000000).toISOString() });
  });

  it("reports unhandled errors as a failed run", async () => {
    const client = fakeClient();
    const r = make(client);
    await r.onTestRunStart();
    await r.onTestRunEnd([], [{ name: "Error", message: "unhandled", stack: "Error: unhandled\n  at y" }]);
    const finished = events(client).find((e) => e.event_type === "TestRunFinished")!;
    expect(finished.test_run).toMatchObject({ result: "failed", failure: [{ backtrace: ["unhandled", "Error: unhandled\n  at y"] }] });
  });

  it("never throws and sends nothing when the build cannot be started", async () => {
    const client = fakeClient();
    client.startBuild.mockRejectedValue(new Error("unreachable"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const r = make(client);
    await r.onTestRunStart();
    await r.onTestCaseReady(tc());
    await r.onTestCaseResult(tc());
    await r.onTestRunEnd([], []);
    expect(client.sendEvents).not.toHaveBeenCalled();
    expect(client.stopBuild).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("swallows per-event API errors and keeps going", async () => {
    const client = fakeClient();
    client.sendEvents.mockRejectedValueOnce(new Error("500"));
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const r = make(client);
    await r.onTestRunStart();
    await r.onTestCaseReady(tc());
    await r.onTestCaseResult(tc());
    await r.onTestRunEnd([], []);
    expect(client.sendEvents).toHaveBeenCalledTimes(2);
    expect(client.stopBuild).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("is disabled without credentials", async () => {
    const r = await TraReporter.fromEnv({ GITHUB_RUN_ID: "1" });
    expect(r.enabled).toBe(false);
  });
});
