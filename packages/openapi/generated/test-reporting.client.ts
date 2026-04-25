/* AUTO-GENERATED — do not edit */
import type { operations } from "./test-reporting";
import { APIClient, type ExecuteOptions } from "@browserstack-client/core";
import { HttpError, toCamelCase, toSnakeCase } from "@browserstack-client/openapi-transforms";
import type { DeepCamelCase } from "@browserstack-client/openapi-transforms";

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
getTestReportingProjects(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingProjects"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/projects",
      params: undefined,

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

getTestReportingProjectBuilds(projectId: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingProjectBuilds"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/projects/{projectId}/builds",
      params: { path: { projectId: projectId } },

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

startTestReportingBuild(body: DeepCamelCase<operations["startTestReportingBuild"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["startTestReportingBuild"]["responses"][200]["content"]["application/json"]>> {
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

getTestReportingLatestBuild(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingLatestBuild"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/latest",
      params: undefined,

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

getTestReportingBuild(buildId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingBuild"]["responses"][200]["content"]["application/json"]>> {
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

updateTestReportingBuild(buildId: string, body: DeepCamelCase<operations["updateTestReportingBuild"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["updateTestReportingBuild"]["responses"][200]["content"]["application/json"]>> {
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

finishTestReportingBuild(buildHashedId: string, body: DeepCamelCase<operations["finishTestReportingBuild"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["finishTestReportingBuild"]["responses"][200]["content"]["application/json"]>> {
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

startTestReportingTestRun(buildHashedId: string, body: DeepCamelCase<operations["startTestReportingTestRun"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["startTestReportingTestRun"]["responses"][200]["content"]["application/json"]>> {
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

finishTestReportingTestRun(buildHashedId: string, testRunUuid: string, body: DeepCamelCase<operations["finishTestReportingTestRun"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["finishTestReportingTestRun"]["responses"][200]["content"]["application/json"]>> {
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

startTestReportingHookRun(buildHashedId: string, body: DeepCamelCase<operations["startTestReportingHookRun"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["startTestReportingHookRun"]["responses"][200]["content"]["application/json"]>> {
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

finishTestReportingHookRun(buildHashedId: string, hookRunUuid: string, body: DeepCamelCase<operations["finishTestReportingHookRun"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["finishTestReportingHookRun"]["responses"][200]["content"]["application/json"]>> {
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

addTestReportingBuildLogs(buildHashedId: string, body: DeepCamelCase<operations["addTestReportingBuildLogs"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["addTestReportingBuildLogs"]["responses"][200]["content"]["application/json"]>> {
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

getTestReportingTestRuns(buildId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingTestRuns"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/{buildId}/testRuns",
      params: { path: { buildId: buildId } },

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

getTestReportingSelfHealingReport(buildUuid: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingSelfHealingReport"]["responses"][200]["content"]["application/json"]>> {
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

getTestReportingQualityGateStatus(buildUuid: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingQualityGateStatus"]["responses"][200]["content"]["application/json"]>> {
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

getTestReportingQualityGateSettings(projectName: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingQualityGateSettings"]["responses"][200]["content"]["application/json"]>> {
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

updateTestReportingQualityGateSettings(projectName: string, body: DeepCamelCase<operations["updateTestReportingQualityGateSettings"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["updateTestReportingQualityGateSettings"]["responses"][200]["content"]["application/json"]>> {
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

createTestReportingQualityGateProfile(projectName: string, body: DeepCamelCase<operations["createTestReportingQualityGateProfile"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["createTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>> {
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

getTestReportingQualityGateProfile(projectName: string, profileUuid: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>> {
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

updateTestReportingQualityGateProfile(projectName: string, profileUuid: string, body: DeepCamelCase<operations["updateTestReportingQualityGateProfile"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["updateTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>> {
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

deleteTestReportingQualityGateProfile(projectName: string, profileUuid: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>> {
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

toggleTestReportingQualityGateProfile(projectName: string, profileUuid: string, body: DeepCamelCase<operations["toggleTestReportingQualityGateProfile"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["toggleTestReportingQualityGateProfile"]["responses"][200]["content"]["application/json"]>> {
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

uploadTestReportingReport(body: ({ file: Blob } | { url: string }) & { fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["uploadTestReportingReport"]["responses"][200]["content"]["application/json"]>> {
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
