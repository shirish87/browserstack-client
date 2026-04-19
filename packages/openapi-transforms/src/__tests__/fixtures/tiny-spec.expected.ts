/* AUTO-GENERATED — do not edit */
import type { operations } from "./tiny-types";
import { APIClient, type ExecuteOptions } from "@browserstack-client/core";
import { HttpError, toCamelCase, toSnakeCase } from "@browserstack-client/openapi-transforms";

export type GetProjectError = HttpError<
  | (operations["getProject"]["responses"][404] extends { content: { "application/json": infer E } } ? E : unknown)
>;

export type GetLogsError = HttpError<unknown>;

export abstract class TinyClient extends APIClient {
getProject(projectId: number, options?: ExecuteOptions): Promise<operations["getProject"]["responses"][200]["content"]["application/json"]["project"]> {
    return (this.execute({
      path: "/projects/{projectId}",
      params: { path: { projectId: projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.project"},
      baseUrl: "sdk" as const,
      operationId: "getProject",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<operations["getProject"]["responses"][200]["content"]["application/json"]["project"]>;
  }

getLogs(options?: ExecuteOptions): Promise<string> {
    return (this.execute({
      path: "/logs",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getLogs",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<string>;
  }
}
