/* AUTO-GENERATED — do not edit */
import type { operations, components, paths } from "./screenshots";
import { APIClient, type APIFetchOptions } from "@browserstack-client/core";
import { HttpError } from "@browserstack-client/openapi-transforms";

export type GetScreenshotsJobError = HttpError<
  | operations["getScreenshotsJob"]["responses"][400]["content"]["application/json"]
  | operations["getScreenshotsJob"]["responses"][401]["content"]["application/json"]
  | operations["getScreenshotsJob"]["responses"][404]["content"]["application/json"]
  | operations["getScreenshotsJob"]["responses"][422]["content"]["application/json"]
  | operations["getScreenshotsJob"]["responses"][500]["content"]["application/json"]
>;

export type CreateScreenshotsJobError = HttpError<
  | operations["createScreenshotsJob"]["responses"][400]["content"]["application/json"]
  | operations["createScreenshotsJob"]["responses"][401]["content"]["application/json"]
  | operations["createScreenshotsJob"]["responses"][404]["content"]["application/json"]
  | operations["createScreenshotsJob"]["responses"][422]["content"]["application/json"]
  | operations["createScreenshotsJob"]["responses"][500]["content"]["application/json"]
>;

export type GetScreenshotsBrowsersError = HttpError<
  | operations["getScreenshotsBrowsers"]["responses"][400]["content"]["application/json"]
  | operations["getScreenshotsBrowsers"]["responses"][401]["content"]["application/json"]
  | operations["getScreenshotsBrowsers"]["responses"][404]["content"]["application/json"]
  | operations["getScreenshotsBrowsers"]["responses"][422]["content"]["application/json"]
  | operations["getScreenshotsBrowsers"]["responses"][500]["content"]["application/json"]
>;

export abstract class GeneratedScreenshotsClient extends APIClient<paths> {
getScreenshotsJob(jobId: string, options?: APIFetchOptions<operations["getScreenshotsJob"]>): Promise<operations["getScreenshotsJob"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getScreenshotsJob",
      method: "GET",
      path: "/screenshots/{jobId}.json",
      params: { path: { jobId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getScreenshotsJob"]["responses"][200]["content"]["application/json"]>;
  }

createScreenshotsJob(body: operations["createScreenshotsJob"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["createScreenshotsJob"]>): Promise<operations["createScreenshotsJob"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "createScreenshotsJob",
      method: "POST",
      path: "/screenshots",
      params: undefined,
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["createScreenshotsJob"]["responses"][200]["content"]["application/json"]>;
  }

getScreenshotsBrowsers(options?: APIFetchOptions<operations["getScreenshotsBrowsers"]>): Promise<operations["getScreenshotsBrowsers"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getScreenshotsBrowsers",
      method: "GET",
      path: "/screenshots/browsers.json",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getScreenshotsBrowsers"]["responses"][200]["content"]["application/json"]>;
  }
}
