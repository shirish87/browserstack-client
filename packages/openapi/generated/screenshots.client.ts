/* AUTO-GENERATED — do not edit */
import type { operations, paths } from "./screenshots";
import { APIClient, type APIFetchOptions } from "@browserstack-client/core";
import { HttpError } from "@browserstack-client/openapi-transforms";

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

export abstract class GeneratedScreenshotsClient extends APIClient<paths> {
getScreenshotsJob(jobId: string, options?: APIFetchOptions<operations["getScreenshotsJob"]>): Promise<operations["getScreenshotsJob"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/screenshots/{jobId}.json",
      params: { path: { jobId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "getScreenshotsJob",
      method: "GET" as const,
    }) as Promise<operations["getScreenshotsJob"]["responses"][200]["content"]["application/json"]>;
  }

createScreenshotsJob(body: operations["createScreenshotsJob"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["createScreenshotsJob"]>): Promise<operations["createScreenshotsJob"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/screenshots",
      params: undefined,
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "createScreenshotsJob",
      method: "POST" as const,
    }) as Promise<operations["createScreenshotsJob"]["responses"][200]["content"]["application/json"]>;
  }

getScreenshotsBrowsers(options?: APIFetchOptions<operations["getScreenshotsBrowsers"]>): Promise<operations["getScreenshotsBrowsers"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      path: "/screenshots/browsers.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
      operationId: "getScreenshotsBrowsers",
      method: "GET" as const,
    }) as Promise<operations["getScreenshotsBrowsers"]["responses"][200]["content"]["application/json"]>;
  }
}
