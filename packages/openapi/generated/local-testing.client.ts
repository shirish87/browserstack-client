/* AUTO-GENERATED — do not edit */
import type { operations, components, paths } from "./local-testing";
import { APIClient, type APIFetchOptions } from "@browserstack-client/core";
import { HttpError } from "@browserstack-client/openapi-transforms";

export type GetLocalBinaryInstancesError = HttpError<
  | operations["getLocalBinaryInstances"]["responses"][400]["content"]["application/json"]
  | operations["getLocalBinaryInstances"]["responses"][401]["content"]["application/json"]
  | operations["getLocalBinaryInstances"]["responses"][404]["content"]["application/json"]
  | operations["getLocalBinaryInstances"]["responses"][422]["content"]["application/json"]
  | operations["getLocalBinaryInstances"]["responses"][500]["content"]["application/json"]
>;

export type GetLocalBinaryInstanceError = HttpError<
  | operations["getLocalBinaryInstance"]["responses"][400]["content"]["application/json"]
  | operations["getLocalBinaryInstance"]["responses"][401]["content"]["application/json"]
  | operations["getLocalBinaryInstance"]["responses"][404]["content"]["application/json"]
  | operations["getLocalBinaryInstance"]["responses"][422]["content"]["application/json"]
  | operations["getLocalBinaryInstance"]["responses"][500]["content"]["application/json"]
>;

export type DisconnectLocalBinaryInstanceError = HttpError<
  | operations["disconnectLocalBinaryInstance"]["responses"][400]["content"]["application/json"]
  | operations["disconnectLocalBinaryInstance"]["responses"][401]["content"]["application/json"]
  | operations["disconnectLocalBinaryInstance"]["responses"][404]["content"]["application/json"]
  | operations["disconnectLocalBinaryInstance"]["responses"][422]["content"]["application/json"]
  | operations["disconnectLocalBinaryInstance"]["responses"][500]["content"]["application/json"]
>;

export abstract class GeneratedLocalTestingClient extends APIClient<paths> {
getLocalBinaryInstances(options?: APIFetchOptions<operations["getLocalBinaryInstances"]>): Promise<operations["getLocalBinaryInstances"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getLocalBinaryInstances",
      method: "GET",
      path: "/local/v1/list",
      params: undefined,
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getLocalBinaryInstances"]["responses"][200]["content"]["application/json"]>;
  }

getLocalBinaryInstance(localInstanceId: string, options?: APIFetchOptions<operations["getLocalBinaryInstance"]>): Promise<operations["getLocalBinaryInstance"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "getLocalBinaryInstance",
      method: "GET",
      path: "/local/v1/{localInstanceId}",
      params: { path: { localInstanceId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["getLocalBinaryInstance"]["responses"][200]["content"]["application/json"]>;
  }

disconnectLocalBinaryInstance(localInstanceId: string, options?: APIFetchOptions<operations["disconnectLocalBinaryInstance"]>): Promise<operations["disconnectLocalBinaryInstance"]["responses"][200]["content"]["application/json"]> {
    return this.execute({
      operationId: "disconnectLocalBinaryInstance",
      method: "DELETE",
      path: "/local/v1/{localInstanceId}",
      params: { path: { localInstanceId } },
      
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk",
      ...options,
    }) as Promise<operations["disconnectLocalBinaryInstance"]["responses"][200]["content"]["application/json"]>;
  }
}
