/* AUTO-GENERATED — do not edit */
import type { operations } from "./test-management";
import { APIClient, type ExecuteOptions } from "@browserstack-client/core";
import { HttpError, toCamelCase, toSnakeCase } from "@browserstack-client/openapi-transforms";
import type { DeepCamelCase } from "@browserstack-client/openapi-transforms";

export type GetTestManagementProjectsError = HttpError<
  | (operations["getTestManagementProjects"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type CreateTestManagementProjectError = HttpError<
  | (operations["createTestManagementProject"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementProjectError = HttpError<
  | (operations["getTestManagementProject"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getTestManagementProject"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UpdateTestManagementProjectError = HttpError<
  | (operations["updateTestManagementProject"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateTestManagementProject"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteTestManagementProjectError = HttpError<
  | (operations["deleteTestManagementProject"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteTestManagementProject"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementFoldersError = HttpError<
  | (operations["getTestManagementFolders"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type CreateTestManagementFolderError = HttpError<
  | (operations["createTestManagementFolder"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementFolderError = HttpError<
  | (operations["getTestManagementFolder"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getTestManagementFolder"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UpdateTestManagementFolderError = HttpError<
  | (operations["updateTestManagementFolder"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateTestManagementFolder"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteTestManagementFolderError = HttpError<
  | (operations["deleteTestManagementFolder"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteTestManagementFolder"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type MoveTestManagementFolderError = HttpError<
  | (operations["moveTestManagementFolder"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["moveTestManagementFolder"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementTestCasesError = HttpError<
  | (operations["getTestManagementTestCases"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type BulkEditTestManagementTestCasesError = HttpError<
  | (operations["bulkEditTestManagementTestCases"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type BulkDeleteTestManagementTestCasesError = HttpError<
  | (operations["bulkDeleteTestManagementTestCases"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type BulkArchiveTestManagementTestCasesError = HttpError<
  | (operations["bulkArchiveTestManagementTestCases"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type BulkUnarchiveTestManagementTestCasesError = HttpError<
  | (operations["bulkUnarchiveTestManagementTestCases"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type BulkEditTestManagementTestCasesWithOperationsError = HttpError<
  | (operations["bulkEditTestManagementTestCasesWithOperations"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type CreateTestManagementTestCaseError = HttpError<
  | (operations["createTestManagementTestCase"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UpdateTestManagementTestCaseError = HttpError<
  | (operations["updateTestManagementTestCase"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateTestManagementTestCase"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteTestManagementTestCaseError = HttpError<
  | (operations["deleteTestManagementTestCase"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteTestManagementTestCase"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type ArchiveTestManagementTestCaseError = HttpError<
  | (operations["archiveTestManagementTestCase"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["archiveTestManagementTestCase"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UnarchiveTestManagementTestCaseError = HttpError<
  | (operations["unarchiveTestManagementTestCase"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["unarchiveTestManagementTestCase"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type MoveTestManagementTestCaseError = HttpError<
  | (operations["moveTestManagementTestCase"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["moveTestManagementTestCase"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementTestCaseAttachmentsError = HttpError<
  | (operations["getTestManagementTestCaseAttachments"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type AddTestManagementTestCaseAttachmentError = HttpError<
  | (operations["addTestManagementTestCaseAttachment"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteTestManagementTestCaseAttachmentError = HttpError<
  | (operations["deleteTestManagementTestCaseAttachment"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteTestManagementTestCaseAttachment"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementTestCaseResultsError = HttpError<
  | (operations["getTestManagementTestCaseResults"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementTestRunsError = HttpError<
  | (operations["getTestManagementTestRuns"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type CreateTestManagementTestRunError = HttpError<
  | (operations["createTestManagementTestRun"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementTestRunError = HttpError<
  | (operations["getTestManagementTestRun"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getTestManagementTestRun"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementTestRunTestCasesError = HttpError<
  | (operations["getTestManagementTestRunTestCases"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getTestManagementTestRunTestCases"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UpdateTestManagementTestRunError = HttpError<
  | (operations["updateTestManagementTestRun"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateTestManagementTestRun"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type PatchTestManagementTestRunError = HttpError<
  | (operations["patchTestManagementTestRun"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["patchTestManagementTestRun"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type AssignTestManagementTestRunTestCasesError = HttpError<
  | (operations["assignTestManagementTestRunTestCases"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["assignTestManagementTestRunTestCases"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type CloseTestManagementTestRunError = HttpError<
  | (operations["closeTestManagementTestRun"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["closeTestManagementTestRun"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteTestManagementTestRunError = HttpError<
  | (operations["deleteTestManagementTestRun"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteTestManagementTestRun"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementTestRunResultsError = HttpError<
  | (operations["getTestManagementTestRunResults"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type AddTestManagementTestRunResultsError = HttpError<
  | (operations["addTestManagementTestRunResults"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementTestRunTestCaseResultsError = HttpError<
  | (operations["getTestManagementTestRunTestCaseResults"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementTestResultAttachmentsError = HttpError<
  | (operations["getTestManagementTestResultAttachments"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type AddTestManagementTestResultAttachmentError = HttpError<
  | (operations["addTestManagementTestResultAttachment"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteTestManagementTestResultAttachmentError = HttpError<
  | (operations["deleteTestManagementTestResultAttachment"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteTestManagementTestResultAttachment"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementTestPlansError = HttpError<
  | (operations["getTestManagementTestPlans"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type CreateTestManagementTestPlanError = HttpError<
  | (operations["createTestManagementTestPlan"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementTestPlanError = HttpError<
  | (operations["getTestManagementTestPlan"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getTestManagementTestPlan"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UpdateTestManagementTestPlanError = HttpError<
  | (operations["updateTestManagementTestPlan"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateTestManagementTestPlan"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementTestPlanTestRunsError = HttpError<
  | (operations["getTestManagementTestPlanTestRuns"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getTestManagementTestPlanTestRuns"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementConfigurationsError = HttpError<
  | (operations["getTestManagementConfigurations"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type CreateTestManagementConfigurationError = HttpError<
  | (operations["createTestManagementConfiguration"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementConfigurationError = HttpError<
  | (operations["getTestManagementConfiguration"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getTestManagementConfiguration"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetTestManagementCustomFieldsError = HttpError<
  | (operations["getTestManagementCustomFields"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type CreateTestManagementCustomFieldError = HttpError<
  | (operations["createTestManagementCustomField"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UpdateTestManagementCustomFieldError = HttpError<
  | (operations["updateTestManagementCustomField"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateTestManagementCustomField"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteTestManagementCustomFieldError = HttpError<
  | (operations["deleteTestManagementCustomField"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteTestManagementCustomField"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export class GeneratedTestManagementClient extends APIClient {
getTestManagementProjects(options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementProjects"]["responses"][200]["content"]["application/json"] & Record<"projects", unknown>)["projects"]>> {
    return (this.execute({
      path: "/api/v2/projects",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.projects"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementProjects",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementProjects"]["responses"][200]["content"]["application/json"] & Record<"projects", unknown>)["projects"]>>;
  }

createTestManagementProject(body: DeepCamelCase<operations["createTestManagementProject"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["createTestManagementProject"]["responses"][200]["content"]["application/json"] & Record<"project", unknown>)["project"]>> {
    return (this.execute({
      path: "/api/v2/projects",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.project"},
      baseUrl: "sdk" as const,
      operationId: "createTestManagementProject",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["createTestManagementProject"]["responses"][200]["content"]["application/json"] & Record<"project", unknown>)["project"]>>;
  }

getTestManagementProject(projectId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementProject"]["responses"][200]["content"]["application/json"] & Record<"project", unknown>)["project"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}",
      params: { path: { projectId: projectId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.project"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementProject",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementProject"]["responses"][200]["content"]["application/json"] & Record<"project", unknown>)["project"]>>;
  }

updateTestManagementProject(projectId: string, body: DeepCamelCase<operations["updateTestManagementProject"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["updateTestManagementProject"]["responses"][200]["content"]["application/json"] & Record<"project", unknown>)["project"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}",
      params: { path: { projectId: projectId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.project"},
      baseUrl: "sdk" as const,
      operationId: "updateTestManagementProject",
      method: "PATCH" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["updateTestManagementProject"]["responses"][200]["content"]["application/json"] & Record<"project", unknown>)["project"]>>;
  }

deleteTestManagementProject(projectId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteTestManagementProject"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}",
      params: { path: { projectId: projectId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteTestManagementProject",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteTestManagementProject"]["responses"][200]["content"]["application/json"]>>;
  }

getTestManagementFolders(projectId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementFolders"]["responses"][200]["content"]["application/json"] & Record<"folders", unknown>)["folders"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/folders",
      params: { path: { projectId: projectId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.folders"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementFolders",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementFolders"]["responses"][200]["content"]["application/json"] & Record<"folders", unknown>)["folders"]>>;
  }

createTestManagementFolder(projectId: string, body: DeepCamelCase<operations["createTestManagementFolder"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["createTestManagementFolder"]["responses"][200]["content"]["application/json"] & Record<"folder", unknown>)["folder"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/folders",
      params: { path: { projectId: projectId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.folder"},
      baseUrl: "sdk" as const,
      operationId: "createTestManagementFolder",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["createTestManagementFolder"]["responses"][200]["content"]["application/json"] & Record<"folder", unknown>)["folder"]>>;
  }

getTestManagementFolder(projectId: string, folderId: number, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementFolder"]["responses"][200]["content"]["application/json"] & Record<"folder", unknown>)["folder"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/folders/{folderId}",
      params: { path: { projectId: projectId, folderId: folderId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.folder"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementFolder",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementFolder"]["responses"][200]["content"]["application/json"] & Record<"folder", unknown>)["folder"]>>;
  }

updateTestManagementFolder(projectId: string, folderId: number, body: DeepCamelCase<operations["updateTestManagementFolder"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["updateTestManagementFolder"]["responses"][200]["content"]["application/json"] & Record<"folder", unknown>)["folder"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/folders/{folderId}",
      params: { path: { projectId: projectId, folderId: folderId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.folder"},
      baseUrl: "sdk" as const,
      operationId: "updateTestManagementFolder",
      method: "PATCH" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["updateTestManagementFolder"]["responses"][200]["content"]["application/json"] & Record<"folder", unknown>)["folder"]>>;
  }

deleteTestManagementFolder(projectId: string, folderId: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteTestManagementFolder"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/folders/{folderId}",
      params: { path: { projectId: projectId, folderId: folderId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteTestManagementFolder",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteTestManagementFolder"]["responses"][200]["content"]["application/json"]>>;
  }

moveTestManagementFolder(projectId: string, folderId: number, body: DeepCamelCase<operations["moveTestManagementFolder"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["moveTestManagementFolder"]["responses"][200]["content"]["application/json"] & Record<"folder", unknown>)["folder"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/folders/{folderId}/move",
      params: { path: { projectId: projectId, folderId: folderId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.folder"},
      baseUrl: "sdk" as const,
      operationId: "moveTestManagementFolder",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["moveTestManagementFolder"]["responses"][200]["content"]["application/json"] & Record<"folder", unknown>)["folder"]>>;
  }

getTestManagementTestCases(projectId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementTestCases"]["responses"][200]["content"]["application/json"] & Record<"test_cases", unknown>)["test_cases"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases",
      params: { path: { projectId: projectId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_cases"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementTestCases",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementTestCases"]["responses"][200]["content"]["application/json"] & Record<"test_cases", unknown>)["test_cases"]>>;
  }

bulkEditTestManagementTestCases(projectId: string, body: DeepCamelCase<operations["bulkEditTestManagementTestCases"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["bulkEditTestManagementTestCases"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases",
      params: { path: { projectId: projectId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "bulkEditTestManagementTestCases",
      method: "PATCH" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["bulkEditTestManagementTestCases"]["responses"][200]["content"]["application/json"]>>;
  }

bulkDeleteTestManagementTestCases(projectId: string, body: DeepCamelCase<operations["bulkDeleteTestManagementTestCases"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["bulkDeleteTestManagementTestCases"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases",
      params: { path: { projectId: projectId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "bulkDeleteTestManagementTestCases",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["bulkDeleteTestManagementTestCases"]["responses"][200]["content"]["application/json"]>>;
  }

bulkArchiveTestManagementTestCases(projectId: string, body: DeepCamelCase<operations["bulkArchiveTestManagementTestCases"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["bulkArchiveTestManagementTestCases"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/archive",
      params: { path: { projectId: projectId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "bulkArchiveTestManagementTestCases",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["bulkArchiveTestManagementTestCases"]["responses"][200]["content"]["application/json"]>>;
  }

bulkUnarchiveTestManagementTestCases(projectId: string, body: DeepCamelCase<operations["bulkUnarchiveTestManagementTestCases"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["bulkUnarchiveTestManagementTestCases"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/unarchive",
      params: { path: { projectId: projectId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "bulkUnarchiveTestManagementTestCases",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["bulkUnarchiveTestManagementTestCases"]["responses"][200]["content"]["application/json"]>>;
  }

bulkEditTestManagementTestCasesWithOperations(projectId: string, body: DeepCamelCase<operations["bulkEditTestManagementTestCasesWithOperations"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["bulkEditTestManagementTestCasesWithOperations"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/with-operations",
      params: { path: { projectId: projectId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "bulkEditTestManagementTestCasesWithOperations",
      method: "PATCH" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["bulkEditTestManagementTestCasesWithOperations"]["responses"][200]["content"]["application/json"]>>;
  }

createTestManagementTestCase(projectId: string, folderId: number, body: DeepCamelCase<operations["createTestManagementTestCase"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["createTestManagementTestCase"]["responses"][200]["content"]["application/json"] & Record<"test_case", unknown>)["test_case"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/folders/{folderId}/test-cases",
      params: { path: { projectId: projectId, folderId: folderId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_case"},
      baseUrl: "sdk" as const,
      operationId: "createTestManagementTestCase",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["createTestManagementTestCase"]["responses"][200]["content"]["application/json"] & Record<"test_case", unknown>)["test_case"]>>;
  }

updateTestManagementTestCase(projectId: string, testCaseId: string, body: DeepCamelCase<operations["updateTestManagementTestCase"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["updateTestManagementTestCase"]["responses"][200]["content"]["application/json"] & Record<"test_case", unknown>)["test_case"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}",
      params: { path: { projectId: projectId, testCaseId: testCaseId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_case"},
      baseUrl: "sdk" as const,
      operationId: "updateTestManagementTestCase",
      method: "PATCH" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["updateTestManagementTestCase"]["responses"][200]["content"]["application/json"] & Record<"test_case", unknown>)["test_case"]>>;
  }

deleteTestManagementTestCase(projectId: string, testCaseId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteTestManagementTestCase"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}",
      params: { path: { projectId: projectId, testCaseId: testCaseId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteTestManagementTestCase",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteTestManagementTestCase"]["responses"][200]["content"]["application/json"]>>;
  }

archiveTestManagementTestCase(projectId: string, testCaseId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["archiveTestManagementTestCase"]["responses"][200]["content"]["application/json"] & Record<"test_case", unknown>)["test_case"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/archive",
      params: { path: { projectId: projectId, testCaseId: testCaseId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_case"},
      baseUrl: "sdk" as const,
      operationId: "archiveTestManagementTestCase",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["archiveTestManagementTestCase"]["responses"][200]["content"]["application/json"] & Record<"test_case", unknown>)["test_case"]>>;
  }

unarchiveTestManagementTestCase(projectId: string, testCaseId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["unarchiveTestManagementTestCase"]["responses"][200]["content"]["application/json"] & Record<"test_case", unknown>)["test_case"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/unarchive",
      params: { path: { projectId: projectId, testCaseId: testCaseId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_case"},
      baseUrl: "sdk" as const,
      operationId: "unarchiveTestManagementTestCase",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["unarchiveTestManagementTestCase"]["responses"][200]["content"]["application/json"] & Record<"test_case", unknown>)["test_case"]>>;
  }

moveTestManagementTestCase(projectId: string, testCaseId: string, body: DeepCamelCase<operations["moveTestManagementTestCase"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["moveTestManagementTestCase"]["responses"][200]["content"]["application/json"] & Record<"test_case", unknown>)["test_case"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/move",
      params: { path: { projectId: projectId, testCaseId: testCaseId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_case"},
      baseUrl: "sdk" as const,
      operationId: "moveTestManagementTestCase",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["moveTestManagementTestCase"]["responses"][200]["content"]["application/json"] & Record<"test_case", unknown>)["test_case"]>>;
  }

getTestManagementTestCaseAttachments(projectId: string, testCaseId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementTestCaseAttachments"]["responses"][200]["content"]["application/json"] & Record<"attachments", unknown>)["attachments"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/attachments",
      params: { path: { projectId: projectId, testCaseId: testCaseId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.attachments"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementTestCaseAttachments",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementTestCaseAttachments"]["responses"][200]["content"]["application/json"] & Record<"attachments", unknown>)["attachments"]>>;
  }

addTestManagementTestCaseAttachment(projectId: string, testCaseId: string, body: ({ file: Blob } | { url: string }) & { fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["addTestManagementTestCaseAttachment"]["responses"][200]["content"]["application/json"] & Record<"attachment", unknown>)["attachment"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/attachments",
      params: { path: { projectId: projectId, testCaseId: testCaseId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.attachment"},
      baseUrl: "sdk" as const,
      operationId: "addTestManagementTestCaseAttachment",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["addTestManagementTestCaseAttachment"]["responses"][200]["content"]["application/json"] & Record<"attachment", unknown>)["attachment"]>>;
  }

deleteTestManagementTestCaseAttachment(projectId: string, testCaseId: string, attachmentId: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteTestManagementTestCaseAttachment"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/attachments/{attachmentId}",
      params: { path: { projectId: projectId, testCaseId: testCaseId, attachmentId: attachmentId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteTestManagementTestCaseAttachment",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteTestManagementTestCaseAttachment"]["responses"][200]["content"]["application/json"]>>;
  }

getTestManagementTestCaseResults(projectId: string, testCaseId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementTestCaseResults"]["responses"][200]["content"]["application/json"] & Record<"test_results", unknown>)["test_results"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-cases/{testCaseId}/results",
      params: { path: { projectId: projectId, testCaseId: testCaseId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_results"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementTestCaseResults",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementTestCaseResults"]["responses"][200]["content"]["application/json"] & Record<"test_results", unknown>)["test_results"]>>;
  }

getTestManagementTestRuns(projectId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementTestRuns"]["responses"][200]["content"]["application/json"] & Record<"test_runs", unknown>)["test_runs"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-runs",
      params: { path: { projectId: projectId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_runs"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementTestRuns",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementTestRuns"]["responses"][200]["content"]["application/json"] & Record<"test_runs", unknown>)["test_runs"]>>;
  }

createTestManagementTestRun(projectId: string, body: DeepCamelCase<operations["createTestManagementTestRun"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["createTestManagementTestRun"]["responses"][200]["content"]["application/json"] & Record<"testrun", unknown>)["testrun"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-runs",
      params: { path: { projectId: projectId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.testrun"},
      baseUrl: "sdk" as const,
      operationId: "createTestManagementTestRun",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["createTestManagementTestRun"]["responses"][200]["content"]["application/json"] & Record<"testrun", unknown>)["testrun"]>>;
  }

getTestManagementTestRun(projectId: string, testRunId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementTestRun"]["responses"][200]["content"]["application/json"] & Record<"test_run", unknown>)["test_run"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}",
      params: { path: { projectId: projectId, testRunId: testRunId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_run"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementTestRun",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementTestRun"]["responses"][200]["content"]["application/json"] & Record<"test_run", unknown>)["test_run"]>>;
  }

getTestManagementTestRunTestCases(projectId: string, testRunId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementTestRunTestCases"]["responses"][200]["content"]["application/json"] & Record<"test_cases", unknown>)["test_cases"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/test-cases",
      params: { path: { projectId: projectId, testRunId: testRunId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_cases"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementTestRunTestCases",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementTestRunTestCases"]["responses"][200]["content"]["application/json"] & Record<"test_cases", unknown>)["test_cases"]>>;
  }

updateTestManagementTestRun(projectId: string, testRunId: string, body: DeepCamelCase<operations["updateTestManagementTestRun"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["updateTestManagementTestRun"]["responses"][200]["content"]["application/json"] & Record<"testrun", unknown>)["testrun"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/update",
      params: { path: { projectId: projectId, testRunId: testRunId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.testrun"},
      baseUrl: "sdk" as const,
      operationId: "updateTestManagementTestRun",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["updateTestManagementTestRun"]["responses"][200]["content"]["application/json"] & Record<"testrun", unknown>)["testrun"]>>;
  }

patchTestManagementTestRun(projectId: string, testRunId: string, body: DeepCamelCase<operations["patchTestManagementTestRun"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["patchTestManagementTestRun"]["responses"][200]["content"]["application/json"] & Record<"testrun", unknown>)["testrun"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/update",
      params: { path: { projectId: projectId, testRunId: testRunId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.testrun"},
      baseUrl: "sdk" as const,
      operationId: "patchTestManagementTestRun",
      method: "PATCH" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["patchTestManagementTestRun"]["responses"][200]["content"]["application/json"] & Record<"testrun", unknown>)["testrun"]>>;
  }

assignTestManagementTestRunTestCases(projectId: string, testRunId: string, body: DeepCamelCase<operations["assignTestManagementTestRunTestCases"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["assignTestManagementTestRunTestCases"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/assign",
      params: { path: { projectId: projectId, testRunId: testRunId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "assignTestManagementTestRunTestCases",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["assignTestManagementTestRunTestCases"]["responses"][200]["content"]["application/json"]>>;
  }

closeTestManagementTestRun(projectId: string, testRunId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["closeTestManagementTestRun"]["responses"][200]["content"]["application/json"] & Record<"testrun", unknown>)["testrun"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/close",
      params: { path: { projectId: projectId, testRunId: testRunId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.testrun"},
      baseUrl: "sdk" as const,
      operationId: "closeTestManagementTestRun",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["closeTestManagementTestRun"]["responses"][200]["content"]["application/json"] & Record<"testrun", unknown>)["testrun"]>>;
  }

deleteTestManagementTestRun(projectId: string, testRunId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteTestManagementTestRun"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/delete",
      params: { path: { projectId: projectId, testRunId: testRunId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteTestManagementTestRun",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteTestManagementTestRun"]["responses"][200]["content"]["application/json"]>>;
  }

getTestManagementTestRunResults(projectId: string, testRunId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementTestRunResults"]["responses"][200]["content"]["application/json"] & Record<"test_results", unknown>)["test_results"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/results",
      params: { path: { projectId: projectId, testRunId: testRunId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_results"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementTestRunResults",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementTestRunResults"]["responses"][200]["content"]["application/json"] & Record<"test_results", unknown>)["test_results"]>>;
  }

addTestManagementTestRunResults(projectId: string, testRunId: string, body: DeepCamelCase<operations["addTestManagementTestRunResults"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["addTestManagementTestRunResults"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/results",
      params: { path: { projectId: projectId, testRunId: testRunId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "addTestManagementTestRunResults",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["addTestManagementTestRunResults"]["responses"][200]["content"]["application/json"]>>;
  }

getTestManagementTestRunTestCaseResults(projectId: string, testRunId: string, testCaseId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementTestRunTestCaseResults"]["responses"][200]["content"]["application/json"] & Record<"test_results", unknown>)["test_results"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-runs/{testRunId}/test-cases/{testCaseId}/results",
      params: { path: { projectId: projectId, testRunId: testRunId, testCaseId: testCaseId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_results"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementTestRunTestCaseResults",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementTestRunTestCaseResults"]["responses"][200]["content"]["application/json"] & Record<"test_results", unknown>)["test_results"]>>;
  }

getTestManagementTestResultAttachments(projectId: string, testResultId: number, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementTestResultAttachments"]["responses"][200]["content"]["application/json"] & Record<"attachments", unknown>)["attachments"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-results/{testResultId}/attachments",
      params: { path: { projectId: projectId, testResultId: testResultId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.attachments"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementTestResultAttachments",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementTestResultAttachments"]["responses"][200]["content"]["application/json"] & Record<"attachments", unknown>)["attachments"]>>;
  }

addTestManagementTestResultAttachment(projectId: string, testResultId: number, body: ({ file: Blob } | { url: string }) & { fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["addTestManagementTestResultAttachment"]["responses"][200]["content"]["application/json"] & Record<"attachment", unknown>)["attachment"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-results/{testResultId}/attachments",
      params: { path: { projectId: projectId, testResultId: testResultId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.attachment"},
      baseUrl: "sdk" as const,
      operationId: "addTestManagementTestResultAttachment",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["addTestManagementTestResultAttachment"]["responses"][200]["content"]["application/json"] & Record<"attachment", unknown>)["attachment"]>>;
  }

deleteTestManagementTestResultAttachment(projectId: string, testResultId: number, attachmentId: number, options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteTestManagementTestResultAttachment"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-results/{testResultId}/attachments/{attachmentId}",
      params: { path: { projectId: projectId, testResultId: testResultId, attachmentId: attachmentId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteTestManagementTestResultAttachment",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteTestManagementTestResultAttachment"]["responses"][200]["content"]["application/json"]>>;
  }

getTestManagementTestPlans(projectId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementTestPlans"]["responses"][200]["content"]["application/json"] & Record<"test_plans", unknown>)["test_plans"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-plans",
      params: { path: { projectId: projectId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_plans"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementTestPlans",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementTestPlans"]["responses"][200]["content"]["application/json"] & Record<"test_plans", unknown>)["test_plans"]>>;
  }

createTestManagementTestPlan(projectId: string, body: DeepCamelCase<operations["createTestManagementTestPlan"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["createTestManagementTestPlan"]["responses"][200]["content"]["application/json"] & Record<"test_plan", unknown>)["test_plan"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-plans",
      params: { path: { projectId: projectId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_plan"},
      baseUrl: "sdk" as const,
      operationId: "createTestManagementTestPlan",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["createTestManagementTestPlan"]["responses"][200]["content"]["application/json"] & Record<"test_plan", unknown>)["test_plan"]>>;
  }

getTestManagementTestPlan(projectId: string, testPlanId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementTestPlan"]["responses"][200]["content"]["application/json"] & Record<"test_plan", unknown>)["test_plan"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-plans/{testPlanId}",
      params: { path: { projectId: projectId, testPlanId: testPlanId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_plan"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementTestPlan",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementTestPlan"]["responses"][200]["content"]["application/json"] & Record<"test_plan", unknown>)["test_plan"]>>;
  }

updateTestManagementTestPlan(projectId: string, testPlanId: string, body: DeepCamelCase<operations["updateTestManagementTestPlan"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["updateTestManagementTestPlan"]["responses"][200]["content"]["application/json"] & Record<"test_plan", unknown>)["test_plan"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-plans/{testPlanId}/update",
      params: { path: { projectId: projectId, testPlanId: testPlanId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_plan"},
      baseUrl: "sdk" as const,
      operationId: "updateTestManagementTestPlan",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["updateTestManagementTestPlan"]["responses"][200]["content"]["application/json"] & Record<"test_plan", unknown>)["test_plan"]>>;
  }

getTestManagementTestPlanTestRuns(projectId: string, testPlanId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementTestPlanTestRuns"]["responses"][200]["content"]["application/json"] & Record<"test_runs", unknown>)["test_runs"]>> {
    return (this.execute({
      path: "/api/v2/projects/{projectId}/test-plans/{testPlanId}/test-runs",
      params: { path: { projectId: projectId, testPlanId: testPlanId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.test_runs"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementTestPlanTestRuns",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementTestPlanTestRuns"]["responses"][200]["content"]["application/json"] & Record<"test_runs", unknown>)["test_runs"]>>;
  }

getTestManagementConfigurations(options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementConfigurations"]["responses"][200]["content"]["application/json"] & Record<"configurations", unknown>)["configurations"]>> {
    return (this.execute({
      path: "/api/v2/configurations",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.configurations"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementConfigurations",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementConfigurations"]["responses"][200]["content"]["application/json"] & Record<"configurations", unknown>)["configurations"]>>;
  }

createTestManagementConfiguration(body: DeepCamelCase<operations["createTestManagementConfiguration"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["createTestManagementConfiguration"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/configurations",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "createTestManagementConfiguration",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["createTestManagementConfiguration"]["responses"][200]["content"]["application/json"]>>;
  }

getTestManagementConfiguration(configurationId: string, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementConfiguration"]["responses"][200]["content"]["application/json"] & Record<"configuration", unknown>)["configuration"]>> {
    return (this.execute({
      path: "/api/v2/configurations/{configurationId}",
      params: { path: { configurationId: configurationId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.configuration"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementConfiguration",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementConfiguration"]["responses"][200]["content"]["application/json"] & Record<"configuration", unknown>)["configuration"]>>;
  }

getTestManagementCustomFields(options?: ExecuteOptions): Promise<DeepCamelCase<(operations["getTestManagementCustomFields"]["responses"][200]["content"]["application/json"] & Record<"custom_fields", unknown>)["custom_fields"]>> {
    return (this.execute({
      path: "/api/v2/custom-fields",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.custom_fields"},
      baseUrl: "sdk" as const,
      operationId: "getTestManagementCustomFields",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["getTestManagementCustomFields"]["responses"][200]["content"]["application/json"] & Record<"custom_fields", unknown>)["custom_fields"]>>;
  }

createTestManagementCustomField(body: DeepCamelCase<operations["createTestManagementCustomField"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<(operations["createTestManagementCustomField"]["responses"][200]["content"]["application/json"] & Record<"custom_field", unknown>)["custom_field"]>> {
    return (this.execute({
      path: "/api/v2/custom-fields",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.custom_field"},
      baseUrl: "sdk" as const,
      operationId: "createTestManagementCustomField",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<(operations["createTestManagementCustomField"]["responses"][200]["content"]["application/json"] & Record<"custom_field", unknown>)["custom_field"]>>;
  }

updateTestManagementCustomField(customFieldId: string, body: DeepCamelCase<operations["updateTestManagementCustomField"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<((operations["updateTestManagementCustomField"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"] & Record<"custom_field", unknown>)["custom_field"]>> {
    return (this.execute({
      path: "/api/v2/custom-fields/{customFieldId}",
      params: { path: { customFieldId: customFieldId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.data.custom_field"},
      baseUrl: "sdk" as const,
      operationId: "updateTestManagementCustomField",
      method: "PATCH" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<((operations["updateTestManagementCustomField"]["responses"][200]["content"]["application/json"] & Record<"data", unknown>)["data"] & Record<"custom_field", unknown>)["custom_field"]>>;
  }

deleteTestManagementCustomField(customFieldId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["deleteTestManagementCustomField"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/api/v2/custom-fields/{customFieldId}",
      params: { path: { customFieldId: customFieldId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteTestManagementCustomField",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["deleteTestManagementCustomField"]["responses"][200]["content"]["application/json"]>>;
  }
}
