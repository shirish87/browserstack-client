/* AUTO-GENERATED — do not edit */
import type { operations } from "./local-testing";
import { APIClient, type ExecuteOptions } from "@browserstack-client/core";
import { HttpError, toCamelCase, toSnakeCase } from "@browserstack-client/openapi-transforms";

export type GetLocalBinaryInstancesError = HttpError<
  | (operations["getLocalBinaryInstances"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getLocalBinaryInstances"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getLocalBinaryInstances"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getLocalBinaryInstances"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getLocalBinaryInstances"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetLocalBinaryInstanceError = HttpError<
  | (operations["getLocalBinaryInstance"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getLocalBinaryInstance"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getLocalBinaryInstance"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getLocalBinaryInstance"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["getLocalBinaryInstance"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type DisconnectLocalBinaryInstanceError = HttpError<
  | (operations["disconnectLocalBinaryInstance"]["responses"][400] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["disconnectLocalBinaryInstance"]["responses"][401] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["disconnectLocalBinaryInstance"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["disconnectLocalBinaryInstance"]["responses"][422] extends { content: { "application/json": infer E } } ? E : unknown)
  | (operations["disconnectLocalBinaryInstance"]["responses"][500] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export abstract class GeneratedLocalTestingClient extends APIClient {
getLocalBinaryInstances(options?: ExecuteOptions): Promise<operations["getLocalBinaryInstances"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/local/v1/list",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getLocalBinaryInstances",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getLocalBinaryInstances"]["responses"][200]["content"]["application/json"]>;
  }

getLocalBinaryInstance(localInstanceId: string, options?: ExecuteOptions): Promise<operations["getLocalBinaryInstance"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/local/v1/{localInstanceId}",
      params: { path: { localInstanceId: localInstanceId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getLocalBinaryInstance",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getLocalBinaryInstance"]["responses"][200]["content"]["application/json"]>;
  }

disconnectLocalBinaryInstance(localInstanceId: string, options?: ExecuteOptions): Promise<operations["disconnectLocalBinaryInstance"]["responses"][200]["content"]["application/json"]> {
    return (this.execute({
      path: "/local/v1/{localInstanceId}",
      params: { path: { localInstanceId: localInstanceId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "disconnectLocalBinaryInstance",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["disconnectLocalBinaryInstance"]["responses"][200]["content"]["application/json"]>;
  }
}
