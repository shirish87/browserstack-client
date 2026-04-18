/* AUTO-GENERATED — do not edit */
import type { operations, components } from "./tiny-types";
import type { APIFetchOptions } from "@browserstack-client/core";
import { HttpError } from "@browserstack-client/openapi-transforms";

export type GetProjectError = HttpError<
  | operations["getProject"]["responses"][404]["content"]["application/json"]
>;

export type GetLogsError = HttpError<unknown>;

export abstract class TinyClient {
  protected abstract execute(spec: any): Promise<unknown>;
getProject(projectId: number, options?: APIFetchOptions<operations["getProject"]>): Promise<operations["getProject"]["responses"][200]["content"]["application/json"]["project"]> {
    return this.execute({
      operationId: "getProject",
      method: "GET",
      path: "/projects/{projectId}",
      params: { path: { projectId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json-unwrap",
      responseCodecConfig: {"path":"$.project"},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getProject"]["responses"][200]["content"]["application/json"]["project"]>;
  }

getLogs(options?: APIFetchOptions<operations["getLogs"]>): Promise<string> {
    return this.execute({
      operationId: "getLogs",
      method: "GET",
      path: "/logs",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "text",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<string>;
  }
}
