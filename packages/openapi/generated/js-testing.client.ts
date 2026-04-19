/* AUTO-GENERATED — do not edit */
import type { operations } from "./js-testing";
import { APIClient, type ExecuteOptions } from "@browserstack-client/core";
import { HttpError, toCamelCase, toSnakeCase } from "@browserstack-client/openapi-transforms";

export type GetStatusError = HttpError<
  | (operations["getStatus"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getStatus"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getStatus"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getStatus"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getStatus"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetWorkerScreenshotError = HttpError<
  | (operations["getWorkerScreenshot"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorkerScreenshot"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorkerScreenshot"]["responses"][403] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorkerScreenshot"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorkerScreenshot"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorkerScreenshot"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type UpdateWorkerURLError = HttpError<
  | (operations["updateWorkerURL"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateWorkerURL"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateWorkerURL"]["responses"][403] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateWorkerURL"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateWorkerURL"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["updateWorkerURL"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetBrowsersError = HttpError<
  | (operations["getBrowsers"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getBrowsers"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getBrowsers"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getBrowsers"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getBrowsers"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetWorkersError = HttpError<
  | (operations["getWorkers"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorkers"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorkers"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorkers"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorkers"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type CreateWorkerError = HttpError<
  | (operations["createWorker"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createWorker"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createWorker"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createWorker"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["createWorker"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetWorkerError = HttpError<
  | (operations["getWorker"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorker"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorker"]["responses"][403] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorker"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorker"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getWorker"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DeleteWorkerError = HttpError<
  | (operations["deleteWorker"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteWorker"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteWorker"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteWorker"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["deleteWorker"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export abstract class GeneratedJsTestingClient extends APIClient {
getStatus(options?: ExecuteOptions): Promise<operations["getStatus"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/status",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getStatus",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getStatus"]["responses"][200]["content"]["application/json"]>;
  }

getWorkerScreenshot(workerId: string, format: string, options?: ExecuteOptions): Promise<operations["getWorkerScreenshot"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/worker/{workerId}/screenshot.{format}",
      params: { path: { workerId: workerId, format: format } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getWorkerScreenshot",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getWorkerScreenshot"]["responses"][200]["content"]["application/json"]>;
  }

updateWorkerURL(workerId: string, body: operations["updateWorkerURL"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: ExecuteOptions): Promise<operations["updateWorkerURL"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/worker/{workerId}/url.json",
      params: { path: { workerId: workerId } },
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "updateWorkerURL",
      method: "PUT" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["updateWorkerURL"]["responses"][200]["content"]["application/json"]>;
  }

getBrowsers(options?: ExecuteOptions): Promise<operations["getBrowsers"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/browsers",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getBrowsers",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getBrowsers"]["responses"][200]["content"]["application/json"]>;
  }

getWorkers(options?: ExecuteOptions): Promise<operations["getWorkers"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/workers",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getWorkers",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getWorkers"]["responses"][200]["content"]["application/json"]>;
  }

createWorker(body: operations["createWorker"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown, options?: ExecuteOptions): Promise<operations["createWorker"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/worker",
      params: undefined,
      requestInput: toSnakeCase(body, undefined),
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "createWorker",
      method: "POST" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["createWorker"]["responses"][200]["content"]["application/json"]>;
  }

getWorker(workerId: string, options?: ExecuteOptions): Promise<operations["getWorker"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/worker/{workerId}",
      params: { path: { workerId: workerId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getWorker",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getWorker"]["responses"][200]["content"]["application/json"]>;
  }

deleteWorker(workerId: string, options?: ExecuteOptions): Promise<operations["deleteWorker"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/worker/{workerId}",
      params: { path: { workerId: workerId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "deleteWorker",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["deleteWorker"]["responses"][200]["content"]["application/json"]>;
  }
}
