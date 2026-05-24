/* AUTO-GENERATED — do not edit */
import type { operations } from "./screenshots";
import { APIClient, type ExecuteOptions } from "@dot-slash/browserstack-core";
import { HttpError, toCamelCase, toSnakeCase } from "@dot-slash/browserstack-openapi-transforms";
import type { DeepCamelCase } from "@dot-slash/browserstack-openapi-transforms";

export type GetScreenshotsJobError = HttpError<
  | (operations["getScreenshotsJob"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getScreenshotsJob"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getScreenshotsJob"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getScreenshotsJob"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getScreenshotsJob"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type CreateScreenshotsJobError = HttpError<
  | (operations["createScreenshotsJob"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createScreenshotsJob"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createScreenshotsJob"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createScreenshotsJob"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createScreenshotsJob"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetScreenshotsBrowsersError = HttpError<
  | (operations["getScreenshotsBrowsers"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getScreenshotsBrowsers"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getScreenshotsBrowsers"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getScreenshotsBrowsers"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getScreenshotsBrowsers"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export class GeneratedScreenshotsClient extends APIClient {
/**
 * Fetches a screenshot job
 *
 * @param jobId - ID of your screenshot job
 * @param options - Optional abort signal and other request options
 */
  getJob(jobId: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getScreenshotsJob"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/screenshots/{jobId}.json",
      params: { path: { jobId: jobId } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getScreenshotsJob",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getScreenshotsJob"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Take a screenshot of a website on a particular browser
 *
 * @param options - Optional abort signal and other request options
 */
  createJob(body: DeepCamelCase<operations["createScreenshotsJob"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>, options?: ExecuteOptions): Promise<DeepCamelCase<operations["createScreenshotsJob"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/screenshots",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "createScreenshotsJob",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["createScreenshotsJob"]["responses"][200]["content"]["application/json"]>>;
  }

/**
 * Fetches list of browsers supported by Screenshots API
 *
 * @param options - Optional abort signal and other request options
 */
  getBrowsers(options?: ExecuteOptions): Promise<DeepCamelCase<operations["getScreenshotsBrowsers"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/screenshots/browsers.json",
      params: undefined,

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getScreenshotsBrowsers",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getScreenshotsBrowsers"]["responses"][200]["content"]["application/json"]>>;
  }
}
