import { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import { buildDateRange, flattenTests, type FlatTest } from "./analytics";
import { normalizeHierarchy } from "./hierarchy";
import {
  BuildDetailsSchema,
  BuildListResponseSchema,
  hasBuildId,
  type IdentifiedBuild,
  ProjectListResponseSchema,
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
        opts.order,
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

  async selfHealingReport(client: TestReportingClient, buildUuid: string) {
    return SelfHealingReportSchema.parse(await client.getSelfHealingReport(buildUuid));
  },
};
