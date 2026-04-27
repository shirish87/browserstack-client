/* AUTO-GENERATED — do not edit */
import type { operations } from "./local-testing";
import { APIClient, type ExecuteOptions } from "@dot-slash/browserstack-core";
import { HttpError, toCamelCase } from "@dot-slash/browserstack-openapi-transforms";
import type { DeepCamelCase } from "@dot-slash/browserstack-openapi-transforms";

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

export class GeneratedLocalTestingClient extends APIClient {
/** Fetches list of recent binary instances for local testing. Note that the binary should have been started with the --enable-logging-for-api parameter. */
  getInstances(authToken?: string, last?: string, state?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getLocalBinaryInstances"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/local/v1/list",
      params: { query: { "auth_token": authToken, "last": last, "state": state } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getLocalBinaryInstances",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getLocalBinaryInstances"]["responses"][200]["content"]["application/json"]>>;
  }

/** Fetches details of a Local binary instance used for local testing. Note that the binary should have been started with the --enable-logging-for-api parameter. */
  getInstance(localInstanceId: string, authToken?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["getLocalBinaryInstance"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/local/v1/{localInstanceId}",
      params: { path: { localInstanceId: localInstanceId }, query: { "auth_token": authToken } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "getLocalBinaryInstance",
      method: "GET" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["getLocalBinaryInstance"]["responses"][200]["content"]["application/json"]>>;
  }

/** Disconnect a Local binary instance */
  disconnectInstance(localInstanceId: string, authToken?: string, options?: ExecuteOptions): Promise<DeepCamelCase<operations["disconnectLocalBinaryInstance"]["responses"][200]["content"]["application/json"]>> {
    return (this.execute({
      path: "/local/v1/{localInstanceId}",
      params: { path: { localInstanceId: localInstanceId }, query: { "auth_token": authToken } },

      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      operationId: "disconnectLocalBinaryInstance",
      method: "DELETE" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, undefined)) as Promise<DeepCamelCase<operations["disconnectLocalBinaryInstance"]["responses"][200]["content"]["application/json"]>>;
  }
}
