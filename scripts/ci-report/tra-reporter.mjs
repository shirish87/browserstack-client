// Vitest reporter that streams this repo's CI test results to BrowserStack Test Reporting & Analytics, live,
// through our own TestReportingClient (dogfooding): the build starts with the run, each test is started when it
// is ready and finished when it has a result, and the build is finished at the end.
// Best-effort: every API error is logged and swallowed, so an unreachable BrowserStack never fails CI.
import { relative } from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";
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
    this.started = false;
    this.chain = Promise.resolve();
    this.uuids = new Map(); // vitest test id -> run uuid
    this.startedAt = new Map();
  }

  static async fromEnv(env = process.env) {
    const username = env.BROWSERSTACK_USERNAME;
    const accessKey = env.BROWSERSTACK_ACCESS_KEY || env.BROWSERSTACK_KEY;
    if (!username || !accessKey) return new TraReporter({ env });
    const { TestReportingIngestClient } = await import("../../packages/test-reporting/dist/index.js");
    return new TraReporter({ client: new TestReportingIngestClient({ username, accessKey }), env });
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

  // Events are sent one at a time, in order, and never throw.
  enqueue(what, fn) {
    this.chain = this.chain.then(async () => {
      if (!this.started) return;
      try {
        await fn();
      } catch (e) {
        warn(what, e);
      }
    });
    return this.chain;
  }

  async onTestRunStart() {
    if (!this.enabled) return;
    try {
      await this.client.startBuild(this.buildRequest());
      this.started = true;
    } catch (e) {
      warn("startBuild", e);
    }
  }

  runData(testCase, extra) {
    const parts = testCase.fullName.split(" > ");
    const file = relative(this.cwd, testCase.module.moduleId).replaceAll("\\", "/");
    return {
      uuid: this.uuids.get(testCase.id),
      type: "test",
      name: testCase.name,
      scope: testCase.fullName,
      scopes: [testCase.project.name, ...parts.slice(0, -1)].slice(0, 20),
      identifier: `${file} > ${testCase.fullName}`,
      file_name: file,
      location: file,
      framework: "vitest",
      ...extra,
    };
  }

  onTestCaseReady(testCase) {
    if (!this.enabled) return;
    this.uuids.set(testCase.id, randomUUID());
    const started = iso();
    this.startedAt.set(testCase.id, Date.now());
    return this.enqueue("TestRunStarted", () =>
      this.client.sendEvents([{ event_type: "TestRunStarted", test_run: this.runData(testCase, { started_at: started, result: "pending" }) }])
    );
  }

  onUserConsoleLog(log) {
    if (!this.enabled) return;
    const uuid = this.uuids.get(log.taskId);
    if (!uuid) return;
    return this.enqueue("LogCreated", () =>
      this.client.sendEvents([
        {
          event_type: "LogCreated",
          logs: [
            {
              kind: "TEST_LOG",
              test_run_uuid: uuid,
              level: log.type === "stderr" ? "ERROR" : "INFO",
              message: String(log.content).replace(/\n$/, "").slice(0, 10000),
              timestamp: new Date(log.time ?? Date.now()).toISOString(),
              http_response: {},
            },
          ],
        },
      ])
    );
  }

  onTestCaseResult(testCase) {
    if (!this.enabled || !this.uuids.has(testCase.id)) return;
    const result = testCase.result();
    const state = result.state === "pending" ? "skipped" : result.state;
    const errors = (result.errors ?? []).slice(0, 100);
    const extra = {
      finished_at: iso(),
      result: state,
      duration_in_ms: Math.round(testCase.diagnostic()?.duration ?? Date.now() - this.startedAt.get(testCase.id)),
    };
    if (state === "failed" && errors.length) {
      extra.failure = errors.map((x) => ({ backtrace: [x.message, x.stack ?? ""] }));
      extra.failure_reason = errors[0].message;
      extra.failure_type = /AssertionError/.test(errors[0].name ?? errors[0].message ?? "") ? "AssertionError" : "UnhandledError";
    }
    return this.enqueue("TestRunFinished", async () => {
      const uuid = this.uuids.get(testCase.id);
      const events = [];
      if (state === "failed") {
        for (const x of errors) {
          events.push({
            event_type: "LogCreated",
            logs: [{ kind: "TEST_LOG", test_run_uuid: uuid, level: "ERROR", message: String(x.stack ?? x.message).slice(0, 10000), timestamp: iso(), http_response: {}, failure: true }],
          });
        }
      }
      events.push({ event_type: "TestRunFinished", test_run: this.runData(testCase, extra) });
      await this.client.sendEvents(events);
    });
  }

  async onTestRunEnd(_modules, errors = []) {
    if (!this.enabled) return;
    // Unhandled errors happen outside any test: report each as a failed run so they show up in the build.
    for (const x of errors) {
      const uuid = randomUUID();
      const now = iso();
      const run = {
        uuid, type: "test", name: `Unhandled ${x.name ?? "error"}`, scope: "unhandled errors", scopes: ["unhandled errors"],
        identifier: `unhandled > ${x.message}`, file_name: "unhandled", framework: "vitest", started_at: now, finished_at: now,
        result: "failed", duration_in_ms: 0, failure: [{ backtrace: [x.message, x.stack ?? ""] }], failure_reason: x.message, failure_type: "UnhandledError",
      };
      this.enqueue("unhandled error", () => this.client.sendEvents([{ event_type: "TestRunStarted", test_run: { ...run, finished_at: undefined, result: "pending" } }, { event_type: "TestRunFinished", test_run: run }]));
    }
    await this.chain;
    if (!this.started) return;
    try {
      await this.client.stopBuild(iso());
    } catch (e) {
      warn("stopBuild", e);
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
