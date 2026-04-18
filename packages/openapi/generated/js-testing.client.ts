/* AUTO-GENERATED — do not edit */
import type { operations, components, paths } from "./js-testing";
import { APIClient, type APIFetchOptions } from "@browserstack-client/core";
import { HttpError } from "@browserstack-client/openapi-transforms";

export type GetStatusError = HttpError<
  | operations["getStatus"]["responses"][400]["content"]["application/json"]
  | operations["getStatus"]["responses"][401]["content"]["application/json"]
  | operations["getStatus"]["responses"][404]["content"]["application/json"]
  | operations["getStatus"]["responses"][422]["content"]["application/json"]
  | operations["getStatus"]["responses"][500]["content"]["application/json"]
>;

export type GetWorkerScreenshotError = HttpError<
  | operations["getWorkerScreenshot"]["responses"][400]["content"]["application/json"]
  | operations["getWorkerScreenshot"]["responses"][401]["content"]["application/json"]
  | operations["getWorkerScreenshot"]["responses"][403]["content"]["application/json"]
  | operations["getWorkerScreenshot"]["responses"][404]["content"]["application/json"]
  | operations["getWorkerScreenshot"]["responses"][422]["content"]["application/json"]
  | operations["getWorkerScreenshot"]["responses"][500]["content"]["application/json"]
>;

export type UpdateWorkerURLError = HttpError<
  | operations["updateWorkerURL"]["responses"][400]["content"]["application/json"]
  | operations["updateWorkerURL"]["responses"][401]["content"]["application/json"]
  | operations["updateWorkerURL"]["responses"][403]["content"]["application/json"]
  | operations["updateWorkerURL"]["responses"][404]["content"]["application/json"]
  | operations["updateWorkerURL"]["responses"][422]["content"]["application/json"]
  | operations["updateWorkerURL"]["responses"][500]["content"]["application/json"]
>;

export type GetBrowsersError = HttpError<
  | operations["getBrowsers"]["responses"][400]["content"]["application/json"]
  | operations["getBrowsers"]["responses"][401]["content"]["application/json"]
  | operations["getBrowsers"]["responses"][404]["content"]["application/json"]
  | operations["getBrowsers"]["responses"][422]["content"]["application/json"]
  | operations["getBrowsers"]["responses"][500]["content"]["application/json"]
>;

export type GetWorkersError = HttpError<
  | operations["getWorkers"]["responses"][400]["content"]["application/json"]
  | operations["getWorkers"]["responses"][401]["content"]["application/json"]
  | operations["getWorkers"]["responses"][404]["content"]["application/json"]
  | operations["getWorkers"]["responses"][422]["content"]["application/json"]
  | operations["getWorkers"]["responses"][500]["content"]["application/json"]
>;

export type CreateWorkerError = HttpError<
  | operations["createWorker"]["responses"][400]["content"]["application/json"]
  | operations["createWorker"]["responses"][401]["content"]["application/json"]
  | operations["createWorker"]["responses"][404]["content"]["application/json"]
  | operations["createWorker"]["responses"][422]["content"]["application/json"]
  | operations["createWorker"]["responses"][500]["content"]["application/json"]
>;

export type GetWorkerError = HttpError<
  | operations["getWorker"]["responses"][400]["content"]["application/json"]
  | operations["getWorker"]["responses"][401]["content"]["application/json"]
  | operations["getWorker"]["responses"][403]["content"]["application/json"]
  | operations["getWorker"]["responses"][404]["content"]["application/json"]
  | operations["getWorker"]["responses"][422]["content"]["application/json"]
  | operations["getWorker"]["responses"][500]["content"]["application/json"]
>;

export type DeleteWorkerError = HttpError<
  | operations["deleteWorker"]["responses"][400]["content"]["application/json"]
  | operations["deleteWorker"]["responses"][401]["content"]["application/json"]
  | operations["deleteWorker"]["responses"][404]["content"]["application/json"]
  | operations["deleteWorker"]["responses"][422]["content"]["application/json"]
  | operations["deleteWorker"]["responses"][500]["content"]["application/json"]
>;

export abstract class GeneratedJsTestingClient extends APIClient<paths> {
getStatus(options?: APIFetchOptions<operations["getStatus"]>): Promise<operations["getStatus"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getStatus",
      method: "GET",
      path: "/status",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getStatus"]["responses"][200]["content"]["application/json"]>;
  }

getWorkerScreenshot(workerId: string, format: string, options?: APIFetchOptions<operations["getWorkerScreenshot"]>): Promise<operations["getWorkerScreenshot"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getWorkerScreenshot",
      method: "GET",
      path: "/worker/{workerId}/screenshot.{format}",
      params: { path: { workerId, format } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getWorkerScreenshot"]["responses"][200]["content"]["application/json"]>;
  }

updateWorkerURL(workerId: string, body: operations["updateWorkerURL"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["updateWorkerURL"]>): Promise<operations["updateWorkerURL"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "updateWorkerURL",
      method: "PUT",
      path: "/worker/{workerId}/url.json",
      params: { path: { workerId } },
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["updateWorkerURL"]["responses"][200]["content"]["application/json"]>;
  }

getBrowsers(options?: APIFetchOptions<operations["getBrowsers"]>): Promise<operations["getBrowsers"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getBrowsers",
      method: "GET",
      path: "/browsers",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getBrowsers"]["responses"][200]["content"]["application/json"]>;
  }

getWorkers(options?: APIFetchOptions<operations["getWorkers"]>): Promise<operations["getWorkers"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getWorkers",
      method: "GET",
      path: "/workers",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getWorkers"]["responses"][200]["content"]["application/json"]>;
  }

createWorker(body: operations["createWorker"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: APIFetchOptions<operations["createWorker"]>): Promise<operations["createWorker"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "createWorker",
      method: "POST",
      path: "/worker",
      params: undefined,
      requestInput: body,
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["createWorker"]["responses"][200]["content"]["application/json"]>;
  }

getWorker(workerId: string, options?: APIFetchOptions<operations["getWorker"]>): Promise<operations["getWorker"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getWorker",
      method: "GET",
      path: "/worker/{workerId}",
      params: { path: { workerId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getWorker"]["responses"][200]["content"]["application/json"]>;
  }

deleteWorker(workerId: string, options?: APIFetchOptions<operations["deleteWorker"]>): Promise<operations["deleteWorker"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "deleteWorker",
      method: "DELETE",
      path: "/worker/{workerId}",
      params: { path: { workerId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["deleteWorker"]["responses"][200]["content"]["application/json"]>;
  }
}
