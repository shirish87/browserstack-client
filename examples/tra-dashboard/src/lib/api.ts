import { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import {
  BuildDetailsSchema,
  BuildsResponseSchema,
  ProjectsResponseSchema,
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
    return ProjectsResponseSchema.parse(await client.getProjects(nextPage));
  },

  async builds(client: TestReportingClient, projectId: number, opts: { status?: string; nextPage?: string } = {}) {
    return BuildsResponseSchema.parse(
      await client.getProjectBuilds(projectId, undefined, undefined, opts.status, undefined, undefined, undefined, undefined, opts.nextPage),
    );
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
