import { beforeAll, describe, expect, it } from "vitest";
import {
  BuildDetailsSchema,
  BuildListResponseSchema,
  ProjectListResponseSchema,
  TestRunsResponseSchema,
  type TestRunNode,
} from "@dot-slash/browserstack-test-reporting/models";
import { unmodelledKeys } from "../drift";
import { dedupePath, liveContext, unique, type LiveContext } from "./helpers";

/** Node types and statuses the spec documents. A new value is drift: update the spec and the UI. */
const KNOWN_NODE_TYPES = ["ROOT", "DESCRIBE", "TEST", "HOOK"];
const KNOWN_STATUSES = ["passed", "failed", "skipped", "pending", "unknown", "running", "timeout", "in progress"];

let ctx: LiveContext;
let projectId: number | undefined;
const buildIds: string[] = [];

beforeAll(async () => {
  ctx = liveContext();
  let next: string | undefined;
  for (let page = 0; page < 20 && projectId === undefined; page++) {
    const res = await ctx.testReporting.getProjects(next);
    projectId = res.projects?.find((p) => p.name === ctx.projectName)?.id;
    if (!res.pagination?.hasNext || !res.pagination.nextPage) break;
    next = res.pagination.nextPage;
  }
  if (projectId !== undefined) {
    const builds = await ctx.testReporting.getProjectBuilds(projectId);
    buildIds.push(...(builds.builds ?? []).slice(0, 6).map((b) => b.buildId ?? "").filter(Boolean));
  }
});

function collect(nodes: TestRunNode[], out: TestRunNode[] = []): TestRunNode[] {
  for (const n of nodes) {
    out.push(n);
    collect(n.children ?? [], out);
  }
  return out;
}

describe("TRA live contract", () => {
  it("project list matches the models", async () => {
    const data = await ctx.testReporting.getProjects();
    ProjectListResponseSchema.parse(data);
    expect(unmodelledKeys(ProjectListResponseSchema, data).map(dedupePath)).toEqual([]);
  });

  it("has a project with builds to check (run the generators first)", () => {
    expect(projectId, `no TRA project named "${ctx.projectName}"; run the generators in packages/contract-tests/generators`).toBeDefined();
    expect(buildIds.length).toBeGreaterThan(0);
  });

  it("build list and build details match the models", async () => {
    if (projectId === undefined) return;
    const list = await ctx.testReporting.getProjectBuilds(projectId);
    BuildListResponseSchema.parse(list);
    const drift = unmodelledKeys(BuildListResponseSchema, list).map(dedupePath);
    for (const id of buildIds) {
      const details = await ctx.testReporting.getBuild(id);
      BuildDetailsSchema.parse(details);
      drift.push(...unmodelledKeys(BuildDetailsSchema, details).map(dedupePath));
    }
    expect(unique(drift)).toEqual([]);
  });

  it("every page of every build's test tree matches the models, with only known node types and statuses", async () => {
    const drift: string[] = [];
    const types: string[] = [];
    const statuses: string[] = [];
    for (const id of buildIds) {
      let next: string | undefined;
      for (let page = 0; page < 20; page++) {
        const res = await ctx.testReporting.getTestRuns(id, undefined, undefined, undefined, undefined, undefined, undefined, next);
        TestRunsResponseSchema.parse(res);
        drift.push(...unmodelledKeys(TestRunsResponseSchema, res).map(dedupePath));
        for (const node of collect(res.hierarchy ?? [])) {
          types.push(node.type ?? "(none)");
          if (node.details?.status) statuses.push(node.details.status);
          for (const r of node.details?.retries ?? []) if (r.status) statuses.push(r.status);
        }
        if (!res.pagination?.hasNext || !res.pagination.nextPage) break;
        next = res.pagination.nextPage;
      }
    }
    expect(unique(drift)).toEqual([]);
    expect(unique(types).filter((t) => !KNOWN_NODE_TYPES.includes(t)), "unknown node types").toEqual([]);
    expect(unique(statuses).filter((s) => !KNOWN_STATUSES.includes(s.toLowerCase())), "unknown statuses").toEqual([]);
  });

  it("durations are milliseconds and every test names itself via displayName", async () => {
    const id = buildIds[0];
    if (!id) return;
    const res = await ctx.testReporting.getTestRuns(id);
    const tests = collect(res.hierarchy ?? []).filter((n) => n.type === "TEST");
    expect(tests.length).toBeGreaterThan(0);
    for (const t of tests) expect(t.displayName, "tests have no separate `name` field").toBeTruthy();
    const slowest = Math.max(...tests.map((t) => t.details?.duration ?? 0));
    expect(slowest).toBeGreaterThanOrEqual(100); // a real browser test takes more than 100 ms; seconds would be < 100
  });

  it("each getTestRuns filter is accepted by the API, and test_statuses really filters", async () => {
    const id = buildIds[0];
    if (!id) return;
    const t = ctx.testReporting;
    interface Filters {
      reRuns?: string; testStatuses?: string; isFlaky?: string; isNewFailure?: string; sort?: string; order?: string; nextPage?: string;
      ciBuildNumbers?: string; hostNames?: string; hasPerformanceAnomaly?: string; isAlwaysFailing?: string; isMuted?: string;
      failureCategories?: string; devices?: string; os?: string;
    }
    const q = (f: Filters) =>
      t.getTestRuns(id, f.reRuns, f.testStatuses, f.isFlaky, f.isNewFailure, f.sort, f.order, f.nextPage, f.ciBuildNumbers, f.hostNames, f.hasPerformanceAnomaly, f.isAlwaysFailing, f.isMuted, f.failureCategories, f.devices, f.os);

    const cases: Record<string, Filters> = {
      testStatuses: { testStatuses: "failed" },
      isFlaky: { isFlaky: "true" },
      isNewFailure: { isNewFailure: "true" },
      sortOrder: { sort: "DURATION", order: "Desc" },
      hasPerformanceAnomaly: { hasPerformanceAnomaly: "true" },
      isAlwaysFailing: { isAlwaysFailing: "true" },
      isMuted: { isMuted: "false" },
      failureCategories: { failureCategories: "Assertion Error" },
      os: { os: "Windows" },
      devices: { devices: "NA" },
      hostNames: { hostNames: "vm" },
      ciBuildNumbers: { ciBuildNumbers: "1" },
    };
    // Smart-tag filters are gated by plan: the API answers with an error naming plan restrictions.
    const SMART_TAG_FILTERS = ["isFlaky", "isNewFailure", "hasPerformanceAnomaly", "isAlwaysFailing"];
    const rejected: string[] = [];
    const planGated: string[] = [];
    for (const [name, filters] of Object.entries(cases)) {
      try {
        await q(filters);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        if (/plan restrictions/i.test(message)) planGated.push(name);
        else rejected.push(`${name}: ${message}`);
      }
    }
    expect(rejected, "filters the spec documents but the API rejects").toEqual([]);
    expect(planGated.filter((n) => !SMART_TAG_FILTERS.includes(n)), "only smart-tag filters should be plan-gated").toEqual([]);

    const failedOnly = await q({ testStatuses: "failed" });
    const statuses = collect(failedOnly.hierarchy ?? []).filter((n) => n.type === "TEST").map((n) => n.details?.status);
    expect(unique(statuses).filter((s) => s !== "failed")).toEqual([]);
  });
});
