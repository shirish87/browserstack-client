/* AUTO-GENERATED — do not edit */
import type { operations } from "./test-reporting";
import { APIClient, type ExecuteOptions } from "@dot-slash/browserstack-core";
import { HttpError, toCamelCase, toSnakeCase } from "@dot-slash/browserstack-openapi-transforms";
import type { DeepCamelCase } from "@dot-slash/browserstack-openapi-transforms";

export type GetTestReportingProjectsError = HttpError<unknown>;

export type GetTestReportingProjectBuildsError = HttpError<unknown>;

export type StartTestReportingBuildError = HttpError<unknown>;

export type GetTestReportingLatestBuildError = HttpError<unknown>;

export type GetTestReportingBuildError = HttpError<unknown>;

export type UpdateTestReportingBuildError = HttpError<unknown>;

export type FinishTestReportingBuildError = HttpError<unknown>;

export type StartTestReportingTestRunError = HttpError<unknown>;

export type FinishTestReportingTestRunError = HttpError<unknown>;

export type StartTestReportingHookRunError = HttpError<unknown>;

export type FinishTestReportingHookRunError = HttpError<unknown>;

export type AddTestReportingBuildLogsError = HttpError<unknown>;

export type GetTestReportingTestRunsError = HttpError<unknown>;

export type GetTestReportingSelfHealingReportError = HttpError<unknown>;

export type GetTestReportingQualityGateStatusError = HttpError<unknown>;

export type GetTestReportingQualityGateSettingsError = HttpError<unknown>;

export type UpdateTestReportingQualityGateSettingsError = HttpError<unknown>;

export type CreateTestReportingQualityGateProfileError = HttpError<unknown>;

export type GetTestReportingQualityGateProfileError = HttpError<unknown>;

export type UpdateTestReportingQualityGateProfileError = HttpError<unknown>;

export type DeleteTestReportingQualityGateProfileError = HttpError<unknown>;

export type ToggleTestReportingQualityGateProfileError = HttpError<unknown>;

export type UploadTestReportingReportError = HttpError<unknown>;

export class GeneratedTestReportingClient extends APIClient {
/** Get Project List */
  getProjects(nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingProjects"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/projects",
      params: { query: { "next_page": nextPage } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getTestReportingProjects",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getTestReportingProjects"]["responses"][200]["content"]["application/json"]>>;
  }

/** Get Build List for Project */
  getProjectBuilds(projectId: number, uniqueBuildNames?: string, buildTags?: string, buildStatus?: string, users?: string, frameworks?: string, isArchived?: string, dateRange?: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingProjectBuilds"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/projects/{projectId}/builds",
      params: { path: { projectId: projectId }, query: { "unique_build_names": uniqueBuildNames, "build_tags": buildTags, "build_status": buildStatus, "users": users, "frameworks": frameworks, "is_archived": isArchived, "date_range": dateRange, "next_page": nextPage } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getTestReportingProjectBuilds",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getTestReportingProjectBuilds"]["responses"][200]["content"]["application/json"]>>;
  }

/** Start Build (ingestion) */
  startBuild(body: DeepCamelCase<operations["startTestReportingBuild"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["startTestReportingBuild"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/start",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "startTestReportingBuild",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["startTestReportingBuild"]["responses"][200]["content"]["application/json"]>>;
  }

/** Get Latest Build */
  getLatestBuild(projectName?: string, buildName?: string, userName?: string, buildTags?: string, framework?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingLatestBuild"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/latest",
      params: { query: { "project_name": projectName, "build_name": buildName, "user_name": userName, "build_tags": buildTags, "framework": framework } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getTestReportingLatestBuild",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getTestReportingLatestBuild"]["responses"][200]["content"]["application/json"]>>;
  }

/** Get Build Details */
  getBuild(buildId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingBuild"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/{buildId}",
      params: { path: { buildId: buildId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getTestReportingBuild",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getTestReportingBuild"]["responses"][200]["content"]["application/json"]>>;
  }

/** Update Build Metadata */
  updateBuild(buildId: string, body: DeepCamelCase<operations["updateTestReportingBuild"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["updateTestReportingBuild"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/{buildId}",
      params: { path: { buildId: buildId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "updateTestReportingBuild",
      method: "PATCH" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["updateTestReportingBuild"]["responses"][200]["content"]["application/json"]>>;
  }

/** Finish Build (ingestion) */
  finishBuild(buildHashedId: string, body: DeepCamelCase<operations["finishTestReportingBuild"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["finishTestReportingBuild"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/{buildHashedId}/finish",
      params: { path: { buildHashedId: buildHashedId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "finishTestReportingBuild",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["finishTestReportingBuild"]["responses"][200]["content"]["application/json"]>>;
  }

/** Start Test Run (ingestion) */
  startTestRun(buildHashedId: string, body: DeepCamelCase<operations["startTestReportingTestRun"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["startTestReportingTestRun"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/{buildHashedId}/tests/start",
      params: { path: { buildHashedId: buildHashedId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "startTestReportingTestRun",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["startTestReportingTestRun"]["responses"][200]["content"]["application/json"]>>;
  }

/** Finish Test Run (ingestion) */
  finishTestRun(buildHashedId: string, testRunUuid: string, body: DeepCamelCase<operations["finishTestReportingTestRun"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["finishTestReportingTestRun"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/{buildHashedId}/tests/{testRunUuid}/finish",
      params: { path: { buildHashedId: buildHashedId, testRunUuid: testRunUuid } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "finishTestReportingTestRun",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["finishTestReportingTestRun"]["responses"][200]["content"]["application/json"]>>;
  }

/** Start Hook Run (ingestion) */
  startHookRun(buildHashedId: string, body: DeepCamelCase<operations["startTestReportingHookRun"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["startTestReportingHookRun"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/{buildHashedId}/hooks/start",
      params: { path: { buildHashedId: buildHashedId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "startTestReportingHookRun",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["startTestReportingHookRun"]["responses"][200]["content"]["application/json"]>>;
  }

/** Finish Hook Run (ingestion) */
  finishHookRun(buildHashedId: string, hookRunUuid: string, body: DeepCamelCase<operations["finishTestReportingHookRun"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["finishTestReportingHookRun"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/{buildHashedId}/hooks/{hookRunUuid}/finish",
      params: { path: { buildHashedId: buildHashedId, hookRunUuid: hookRunUuid } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "finishTestReportingHookRun",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["finishTestReportingHookRun"]["responses"][200]["content"]["application/json"]>>;
  }

/** Add Build Logs (ingestion) */
  addBuildLogs(buildHashedId: string, body: DeepCamelCase<operations["addTestReportingBuildLogs"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["addTestReportingBuildLogs"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/{buildHashedId}/logs",
      params: { path: { buildHashedId: buildHashedId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "addTestReportingBuildLogs",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["addTestReportingBuildLogs"]["responses"][200]["content"]["application/json"]>>;
  }

/** Get Test List */
  getTestRuns(buildId: string, reRuns?: string, testStatuses?: string, isFlaky?: string, isNewFailure?: string, sort?: string, order?: string, nextPage?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingTestRuns"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/{buildId}/testRuns",
      params: { path: { buildId: buildId }, query: { "re_runs": reRuns, "test_statuses": testStatuses, "is_flaky": isFlaky, "is_new_failure": isNewFailure, "sort": sort, "order": order, "next_page": nextPage } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getTestReportingTestRuns",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getTestReportingTestRuns"]["responses"][200]["content"]["application/json"]>>;
  }

/** Get Self-Healing Report */
  getSelfHealingReport(buildUuid: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingSelfHealingReport"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/{buildUuid}/selfHealingReport",
      params: { path: { buildUuid: buildUuid } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getTestReportingSelfHealingReport",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getTestReportingSelfHealingReport"]["responses"][200]["content"]["application/json"]>>;
  }

/** Get Quality Gate Status */
  getQualityGateStatus(buildUuid: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingQualityGateStatus"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/quality-gates/{buildUuid}",
      params: { path: { buildUuid: buildUuid } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getTestReportingQualityGateStatus",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getTestReportingQualityGateStatus"]["responses"][200]["content"]["application/json"]>>;
  }

/** Get Quality Gate Settings */
  getQualityGateSettings(projectName: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingQualityGateSettings"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/quality-gates/{projectName}/settings",
      params: { path: { projectName: projectName } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getTestReportingQualityGateSettings",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getTestReportingQualityGateSettings"]["responses"][200]["content"]["application/json"]>>;
  }

/** Update Quality Gate Settings */
  updateQualityGateSettings(projectName: string, body: DeepCamelCase<operations["updateTestReportingQualityGateSettings"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["updateTestReportingQualityGateSettings"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/quality-gates/{projectName}/settings",
      params: { path: { projectName: projectName } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "updateTestReportingQualityGateSettings",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["updateTestReportingQualityGateSettings"]["responses"][200]["content"]["application/json"]>>;
  }

/** Create Quality Gate Profile */
  createQualityGateProfile(projectName: string, body: DeepCamelCase<operations["createTestReportingQualityGateProfile"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["createTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/quality-gates/{projectName}/profiles",
      params: { path: { projectName: projectName } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "createTestReportingQualityGateProfile",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["createTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>>;
  }

/** Get Quality Gate Profile */
  getQualityGateProfile(projectName: string, profileUuid: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/quality-gates/{projectName}/profiles/{profileUuid}",
      params: { path: { projectName: projectName, profileUuid: profileUuid } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getTestReportingQualityGateProfile",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>>;
  }

/** Update Quality Gate Profile */
  updateQualityGateProfile(projectName: string, profileUuid: string, body: DeepCamelCase<operations["updateTestReportingQualityGateProfile"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["updateTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/quality-gates/{projectName}/profiles/{profileUuid}",
      params: { path: { projectName: projectName, profileUuid: profileUuid } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "updateTestReportingQualityGateProfile",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["updateTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>>;
  }

/** Delete Quality Gate Profile */
  deleteQualityGateProfile(projectName: string, profileUuid: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/quality-gates/{projectName}/profiles/{profileUuid}",
      params: { path: { projectName: projectName, profileUuid: profileUuid } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteTestReportingQualityGateProfile",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>>;
  }

/** Toggle Quality Gate Profile */
  toggleQualityGateProfile(projectName: string, profileUuid: string, body: DeepCamelCase<operations["toggleTestReportingQualityGateProfile"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["toggleTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/quality-gates/{projectName}/profiles/{profileUuid}/toggle",
      params: { path: { projectName: projectName, profileUuid: profileUuid } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "toggleTestReportingQualityGateProfile",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["toggleTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>>;
  }

/** Upload Test Reports (JUnit or Allure) */
  uploadReport(body: ({ file: Blob } | { url: string }) & { fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["uploadTestReportingReport"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/upload",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "uploadTestReportingReport",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["uploadTestReportingReport"]["responses"][200]["content"]["application/json"]>>;
  }
}
