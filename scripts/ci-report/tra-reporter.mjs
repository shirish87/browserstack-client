// Vitest reporter that streams this repo's CI test results to BrowserStack Test Reporting & Analytics, live,
// through our own TestReportingClient (dogfooding): the build starts with the run, each test is started when it
// is ready and finished when it has a result, and the build is finished at the end.
// Best-effort: every API error is logged and swallowed, so an unreachable BrowserStack never fails CI.
import { relative } from "node:path";
import os from "node:os";
import { readFileSync } from "node:fs";

const warn = (what, e) => console.warn(`[tra] ${what} failed (ignored): ${e instanceof Error ? e.message : e}`);
const iso = () => new Date().toISOString();

export class TraReporter {
  constructor({ client, env = process.env, cwd = process.cwd(), event } = {}) {
    this.client = client;
    this.env = env;
    this.cwd = cwd;
    // The GitHub Actions event payload (push / pull_request) has the commit and PR details env vars lack.
    this.event = event ?? (env.GITHUB_EVENT_PATH ? JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, "utf-8")) : {});
    this.enabled = Boolean(client);
    this.build = undefined; // Promise<string | undefined> (buildHashedId)
    this.tests = new Map(); // test id -> Promise<{ buildId, uuid } | undefined>
    this.logs = []; // pending build log entries, flushed at the end of the run
  }

  static async fromEnv(env = process.env) {
    const username = env.BROWSERSTACK_USERNAME;
    const accessKey = env.BROWSERSTACK_ACCESS_KEY || env.BROWSERSTACK_KEY;
    if (!username || !accessKey) return new TraReporter({ env });
    const { TestReportingClient } = await import("../../packages/test-reporting/dist/index.js");
    return new TraReporter({ client: new TestReportingClient({ username, accessKey }), env });
  }

  buildRequest() {
    const e = this.env;
    const ev = this.event;
    const pr = ev.pull_request;
    const commit = ev.head_commit;
    const repo = e.GITHUB_REPOSITORY;
    const runId = e.GITHUB_RUN_ID;
    const label = e.TRA_LABEL;
    // On pull_request runs GITHUB_SHA / GITHUB_REF_NAME describe the synthetic merge commit; report the PR head.
    const branch = pr?.head?.ref ?? e.GITHUB_HEAD_REF ?? e.GITHUB_REF_NAME;
    const sha = pr?.head?.sha ?? e.GITHUB_SHA;
    const server = e.GITHUB_SERVER_URL ?? "https://github.com";
    const req = {
      name: runId ? `${e.GITHUB_WORKFLOW ?? "CI"} #${e.GITHUB_RUN_NUMBER} (${branch})${label ? ` [${label}]` : ""}` : `local ${iso()}`,
      projectName: repo ?? "browserstack-client",
      startedAt: iso(),
      tags: [...new Set(["ci", label, branch, e.GITHUB_EVENT_NAME].filter(Boolean))],
      framework: { name: "vitest", version: this.vitestVersion ?? "unknown" },
      hostInfo: { hostname: os.hostname(), platform: os.platform(), arch: os.arch(), version: os.release(), type: e.RUNNER_OS },
    };
    if (runId) {
      req.buildRunIdentifier = [runId, e.GITHUB_RUN_ATTEMPT ?? "1", label].filter(Boolean).join("-");
      req.ciInfo = {
        name: "GitHub Actions",
        buildUrl: `${server}/${repo}/actions/runs/${runId}`,
        url: pr?.html_url ?? `${server}/${repo}/commit/${sha}`,
        buildNumber: e.GITHUB_RUN_NUMBER,
        jobName: e.GITHUB_JOB,
      };
    }
    if (sha) {
      req.versionControl = {
        name: "git",
        sha,
        branch,
        commitMessage: (pr?.title ?? commit?.message)?.split("\n")[0],
        committerName: commit?.committer?.name ?? e.GITHUB_ACTOR,
        committerEmail: commit?.committer?.email,
      };
    }
    return req;
  }

  async onTestRunStart() {
    if (!this.enabled) return;
    this.build = this.client
      .startBuild(this.buildRequest())
      .then((res) => res?.buildHashedId ?? res?.build_hashed_id)
      .catch((e) => (warn("startBuild", e), undefined));
    await this.build;
  }

  async onTestCaseReady(testCase) {
    if (!this.enabled) return;
    const started = (async () => {
      const buildId = await this.build;
      if (!buildId) return undefined;
      try {
        const parts = testCase.fullName.split(" > ");
        const res = await this.client.startTestRun(buildId, {
          name: testCase.name,
          fileName: relative(this.cwd, testCase.module.moduleId).replaceAll("\\", "/"),
          scopes: [testCase.project.name, ...parts.slice(0, -1)].slice(0, 20),
          startedAt: iso(),
          ...(testCase.location ? { location: `${testCase.location.line}:${testCase.location.column}` } : {}),
        });
        const uuid = res?.uuid ?? res?.testRunId;
        return uuid ? { buildId, uuid, startedAt: Date.now() } : undefined;
      } catch (e) {
        warn("startTestRun", e);
        return undefined;
      }
    })();
    this.tests.set(testCase.id, started);
    await started;
  }

  async onUserConsoleLog(log) {
    if (!this.enabled || !log.taskId) return;
    const run = await this.tests.get(log.taskId);
    if (!run) return;
    this.logs.push({
      kind: "TEST_LOG",
      testRunUuid: run.uuid,
      level: log.type === "stderr" ? "ERROR" : "INFO",
      message: String(log.content).replace(/\n$/, "").slice(0, 10000),
      timestamp: new Date(log.time ?? Date.now()).toISOString(),
    });
  }

  async onTestCaseResult(testCase) {
    if (!this.enabled) return;
    const run = await this.tests.get(testCase.id);
    if (!run) return;
    try {
      const result = testCase.result();
      const state = result.state === "pending" ? "skipped" : result.state;
      const parts = testCase.fullName.split(" > ");
      if (state === "failed") {
        for (const x of result.errors ?? []) {
          this.logs.push({ kind: "TEST_LOG", testRunUuid: run.uuid, level: "ERROR", message: String(x.stack ?? x.message).slice(0, 10000), timestamp: iso(), failure: true });
        }
      }
      await this.client.finishTestRun(run.buildId, run.uuid, {
        result: state,
        finishedAt: iso(),
        fileName: relative(this.cwd, testCase.module.moduleId).replaceAll("\\", "/"),
        scopes: [testCase.project.name, ...parts.slice(0, -1)].slice(0, 20),
        durationInMs: Math.round(testCase.diagnostic()?.duration ?? Date.now() - run.startedAt),
        ...(state === "failed" ? { failure: (result.errors ?? []).slice(0, 100).map((x) => ({ error: x.message, backtrace: x.stack })) } : {}),
      });
    } catch (e) {
      warn("finishTestRun", e);
    }
  }

  async onTestRunEnd(_modules, errors = []) {
    if (!this.enabled) return;
    await Promise.all(this.tests.values());
    const buildId = await this.build;
    if (!buildId) return;
    // Unhandled errors (outside any test) belong to the build itself.
    for (const x of errors) {
      this.logs.push({ kind: "TEST_LOG", level: "ERROR", message: String(x.stack ?? x.message).slice(0, 10000), timestamp: iso(), failure: true });
    }
    for (let i = 0; i < this.logs.length; i += 500) {
      try {
        await this.client.addBuildLogs(buildId, { logs: this.logs.slice(i, i + 500) });
      } catch (e) {
        warn("addBuildLogs", e);
      }
    }
    try {
      await this.client.finishBuild(buildId, { finishedAt: iso() });
    } catch (e) {
      warn("finishBuild", e);
    }
  }
}

// Vitest loads the default export as the reporter class; it needs the credentialed client up front.
export default class TraVitestReporter extends TraReporter {
  async onInit(vitest) {
    this.vitestVersion = vitest?.version;
    const r = await TraReporter.fromEnv(process.env);
    this.client = r.client;
    this.enabled = r.enabled;
    if (!this.enabled) console.log("[tra] BrowserStack credentials not available; live reporting disabled.");
  }
}
