/* AUTO-GENERATED — do not edit */
import type { operations } from "./observability";
import { APIClient, type ExecuteOptions } from "@browserstack-client/core";
import { HttpError, toCamelCase, toSnakeCase } from "@browserstack-client/openapi-transforms";
import type { DeepCamelCase } from "@browserstack-client/openapi-transforms";

export type GetObservabilityProjectsError = HttpError<unknown>;

export type GetObservabilityBuildsError = HttpError<unknown>;

export type GetObservabilityBuildError = HttpError<unknown>;

export type UpdateObservabilityBuildError = HttpError<unknown>;

export type GetObservabilityTestRunsError = HttpError<unknown>;

export type UploadObservabilityJUnitReportError = HttpError<unknown>;

export class GeneratedObservabilityClient extends APIClient {
getObservabilityProjects(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getObservabilityProjects"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/projects",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getObservabilityProjects",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getObservabilityProjects"]["responses"][200]["content"]["application/json"]>>;
  }

getObservabilityBuilds(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getObservabilityBuilds"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getObservabilityBuilds",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getObservabilityBuilds"]["responses"][200]["content"]["application/json"]>>;
  }

getObservabilityBuild(buildId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getObservabilityBuild"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/{buildId}",
      params: { path: { buildId: buildId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getObservabilityBuild",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getObservabilityBuild"]["responses"][200]["content"]["application/json"]>>;
  }

updateObservabilityBuild(buildId: string, body: DeepCamelCase<operations["updateObservabilityBuild"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<void> {
    return (this.execute({
      path: "/builds/{buildId}",
      params: { path: { buildId: buildId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "updateObservabilityBuild",
      method: "PATCH" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<void>;
  }

getObservabilityTestRuns(buildId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getObservabilityTestRuns"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/builds/{buildId}/testRuns",
      params: { path: { buildId: buildId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getObservabilityTestRuns",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getObservabilityTestRuns"]["responses"][200]["content"]["application/json"]>>;
  }

uploadObservabilityJUnitReport(body: ({ file: Blob } | { url: string }) & { fileName: string } & Record<string, unknown>, options?: ExecuteOptions): Promise<void> {
    return (this.execute({
      path: "/junit/upload",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "multipart",
      requestCodecConfig: {"fileField":"file","filenameFrom":"$.file_name"},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "uploadObservabilityJUnitReport",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<void>;
  }
}
