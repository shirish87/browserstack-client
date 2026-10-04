import type { z } from "zod";
import { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import { TestManagementClient } from "@dot-slash/browserstack-test-management";
import { TmCasesSchema, TmProjectsSchema, TmRunsSchema } from "./tm";
import { buildDateRange, flattenTests, type FlatTest } from "./analytics";
import { normalizeHierarchy } from "./hierarchy";
import { PlanSchema, ProfilingSamplesSchema, ProfilingV2Schema } from "./extras";
import {
  BuildDetailsSchema,
  BuildListResponseSchema,
  hasBuildId,
  type IdentifiedBuild,
  ProjectListResponseSchema,
  QualityGateProfileSchema,
  QualityGateSettingsSchema,
  QualityGateStatusSchema,
  SelfHealingReportSchema,
  TestRunsResponseSchema,
} from "./schemas";

/**
 * The browser never talks to browserstack.com directly: every SDK request is rewritten to
 * `/gateway?url=…` on this origin. The server attaches the signed-in user's credentials
 * (held in a server-side session behind an HttpOnly cookie), so none exist in the browser.
 */
export function createTraClient(): TestReportingClient {
  return new TestReportingClient({
    middleware: [(req, next) => next({ ...req, url: `/gateway?url=${encodeURIComponent(req.url)}` })],
  });
}

/** Same gateway rewrite as the TRA client; Test Management is a separate host behind the same session. */
export function createTmClient(): TestManagementClient {
  return new TestManagementClient({
    middleware: [(req, next) => next({ ...req, url: `/gateway?url=${encodeURIComponent(req.url)}` })],
  });
}

/** A GET through the same gateway for endpoints the SDK doesn't wrap; the body is validated like every other response. */
export async function gatewayJson<S extends z.ZodType>(url: string, schema: S): Promise<z.infer<S>> {
  const res = await fetch(`/gateway?url=${encodeURIComponent(url)}`, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
  return schema.parse(await res.json());
}

const API = "https://api.browserstack.com";
export const extrasApi = {
  profiling: (buildId: string, sessionId: string) => gatewayJson(`${API}/app-automate/builds/${buildId}/sessions/${sessionId}/appprofiling`, ProfilingSamplesSchema),
  profilingV2: (buildId: string, sessionId: string) => gatewayJson(`${API}/app-automate/builds/${buildId}/sessions/${sessionId}/appprofiling/v2`, ProfilingV2Schema),
  plan: (product: "automate" | "app-automate") => gatewayJson(`${API}/${product}/plan.json`, PlanSchema),
};

/** Test Management responses, validated at the boundary like TRA's. */
export const tmApi = {
  /** The TM project that shares a TRA project's name (TM identifies projects like `PR-137`), if there is one. */
  async projectIdFor(client: TestManagementClient, name: string): Promise<string | undefined> {
    const projects = TmProjectsSchema.parse(await client.getProjects());
    return projects.find((p) => p.name === name)?.identifier;
  },
  /** Up to `max` cases, paged. */
  async cases(client: TestManagementClient, projectId: string, max = 300) {
    const out: ReturnType<typeof TmCasesSchema.parse> = [];
    for (let page = 1; page <= 10 && out.length < max; page++) {
      const batch = TmCasesSchema.parse(await client.getTestCases(projectId, page));
      out.push(...batch);
      if (batch.length === 0) break;
    }
    return out.slice(0, max);
  },
  async runs(client: TestManagementClient, projectId: string) {
    return TmRunsSchema.parse(await client.getTestRuns(projectId));
  },
};

/** Every response is validated at the boundary: the rest of the app only sees parsed types. */
export const traApi = {
  async projects(client: TestReportingClient, nextPage?: string) {
    return ProjectListResponseSchema.parse(await client.getProjects(nextPage));
  },

  async builds(
    client: TestReportingClient,
    projectId: number,
    opts: { status?: string; users?: string; days?: number; nextPage?: string } = {},
  ) {
    return BuildListResponseSchema.parse(
      await client.getProjectBuilds(
        projectId,
        undefined,
        undefined,
        opts.status,
        opts.users,
        undefined,
        undefined,
        opts.days ? buildDateRange(opts.days) : undefined,
        opts.nextPage,
      ),
    );
  },

  /** Pages through builds in a time window (newest first), up to `max`, for trend analytics. */
  async buildsWindow(client: TestReportingClient, projectId: number, opts: { days: number; status?: string; max?: number }): Promise<IdentifiedBuild[]> {
    const max = opts.max ?? 120;
    const out: IdentifiedBuild[] = [];
    let next: string | undefined;
    for (let page = 0; page < 10 && out.length < max; page++) {
      const res = await traApi.builds(client, projectId, { days: opts.days, ...(opts.status ? { status: opts.status } : {}), ...(next ? { nextPage: next } : {}) });
      out.push(...(res.builds ?? []).filter(hasBuildId));
      if (!res.pagination?.hasNext || !res.pagination.nextPage) break;
      next = res.pagination.nextPage;
    }
    return out.slice(0, max);
  },

  /** Every test of a build as flat rows, following pagination (capped). */
  async allTests(client: TestReportingClient, buildId: string): Promise<FlatTest[]> {
    const out: FlatTest[] = [];
    let next: string | undefined;
    for (let page = 0; page < 8; page++) {
      const res = await traApi.testRuns(client, buildId, next ? { nextPage: next } : {});
      out.push(...flattenTests(normalizeHierarchy(res.hierarchy ?? [])));
      if (!res.pagination?.hasNext || !res.pagination.nextPage) break;
      next = res.pagination.nextPage;
    }
    return out;
  },

  async build(client: TestReportingClient, buildId: string) {
    return BuildDetailsSchema.parse(await client.getBuild(buildId));
  },

  async testRuns(
    client: TestReportingClient,
    buildId: string,
    opts: { statuses?: string; flaky?: boolean; newFailure?: boolean; sort?: string; order?: string; nextPage?: string } = {},
  ) {
    return TestRunsResponseSchema.parse(
      await client.getTestRuns(
        buildId,
        undefined,
        opts.statuses,
        opts.flaky ? "true" : undefined,
        opts.newFailure ? "true" : undefined,
        opts.sort,
        // TRA answers 500 to `sort` without `order`.
        opts.sort ? (opts.order ?? "Asc") : opts.order,
        opts.nextPage,
      ),
    );
  },

  async qualityGateStatus(client: TestReportingClient, buildUuid: string) {
    return QualityGateStatusSchema.parse(await client.getQualityGateStatus(buildUuid));
  },

  async qualityGateSettings(client: TestReportingClient, projectName: string) {
    return QualityGateSettingsSchema.parse(await client.getQualityGateSettings(projectName));
  },

  async qualityGateProfile(client: TestReportingClient, projectName: string, profileId: string) {
    return QualityGateProfileSchema.parse(await client.getQualityGateProfile(projectName, profileId));
  },

  async selfHealingReport(client: TestReportingClient, buildUuid: string) {
    return SelfHealingReportSchema.parse(await client.getSelfHealingReport(buildUuid));
  },
};
