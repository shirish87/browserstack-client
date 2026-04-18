// @ts-nocheck
import { env } from "./env.js";
import { BrowserStackError } from "./error.js";
import { buildBasicAuthHeader } from "./auth.js";
import { makePkgInfo } from "./pkginfo.js";

import {
  CodecRegistry,
  executeOperation,
  registerAllBuiltins,
  type ResponseCodec,
  type RequestCodec,
} from "@browserstack-client/openapi-transforms";

function nonEmpty(value: string | undefined): string | undefined {
  return value?.trim?.()?.length ? value.trim() : undefined;
}

/**
 * Resolves the BrowserStack access key from options or environment variables.
 * Checks the provided value, BROWSERSTACK_ACCESS_KEY, and BROWSERSTACK_KEY in order.
 * @returns The resolved access key, or undefined if not found.
 */
export function resolveAccessKey(optionsAccessKey?: string): string | undefined {
  return nonEmpty(optionsAccessKey) ?? nonEmpty(env.BROWSERSTACK_ACCESS_KEY) ?? nonEmpty(env.BROWSERSTACK_KEY);
}

/**
 * Resolves the BrowserStack username from options or environment variables.
 * @returns The resolved username, or undefined if not found.
 */
export function resolveUsername(optionsUsername?: string): string | undefined {
  return nonEmpty(optionsUsername) ?? nonEmpty(env.BROWSERSTACK_USERNAME);
}
import type {
  ClientOptions,
  FetchOptions,
  FetchResponse,
  MaybeOptionalInit,
} from "openapi-fetch";
import createClient from "openapi-fetch";
import type { PathsWithMethod } from "openapi-typescript-helpers";

export interface BrowserStackOptions extends Partial<ClientOptions> {
  username?: string;
  accessKey?: string;
  /**
   * Custom HTTP fetch function. Can be a proxy-wrapping fetch, an Axios adapter, Got adapter, etc.
   * Defaults to the global fetch.
   */
  fetchFn?: typeof fetch;
  /**
   * @internal
   */
  usernameOptional?: boolean;
  codecs?: Array<ResponseCodec<any, any> | RequestCodec<any, any>>;
  errorMessageExtractor?: (body: unknown, ctx: { operationId: string; method: string; url: string }) => string | undefined;
  maxErrorBodySize?: number;
}

export type APIFetchOptions<T> = Omit<FetchOptions<T>, "body">;

/**
 * @internal
 */
export class APIClient<Paths extends {}> {
  protected readonly sdk: ReturnType<typeof createClient<Paths>>;
  protected readonly sdkCloud: ReturnType<typeof createClient<Paths>>;
  protected readonly baseUrls: { sdk: string; sdkCloud: string };
  protected readonly authHeader?: string;
  protected readonly userAgent: string;
  protected readonly fetchFn: typeof fetch;
  protected readonly registry: CodecRegistry;
  private readonly executeOptions: { maxErrorBodySize?: number; errorMessageExtractor?: any };

  constructor(
    options: BrowserStackOptions,
    baseUrl: string,
    cloudBaseUrl: string,
    pkgName: string,
    pkgVersion: string
  ) {
    const username = resolveUsername(options.username);
    if (
      options.usernameOptional !== true &&
      (typeof username !== "string" || !username.trim().length)
    ) {
      throw new BrowserStackError("Missing options.username");
    }

    const accessKey = resolveAccessKey(options.accessKey);
    if (typeof accessKey !== "string" || !accessKey.trim().length) {
      throw new BrowserStackError("Missing options.accessKey");
    }

    const pkginfo = makePkgInfo(pkgName, pkgVersion);

    const clientOptions: ClientOptions = {
      ...options,
      baseUrl: options.baseUrl ?? baseUrl,
      headers: {
        ...options.headers,
        Authorization: username
          ? buildBasicAuthHeader(username, accessKey)
          : undefined,
        "User-Agent": pkginfo.userAgent,
      },
      fetch: options.fetchFn,
    };

    this.sdk = createClient<Paths>(clientOptions);

    this.sdkCloud = createClient<Paths>({
      ...clientOptions,
      baseUrl: cloudBaseUrl,
    });

    this.baseUrls = {
      sdk: options.baseUrl ?? baseUrl,
      sdkCloud: cloudBaseUrl,
    };
    this.authHeader = username ? buildBasicAuthHeader(username, accessKey) : undefined;
    this.userAgent = pkginfo.userAgent;
    this.fetchFn = options.fetchFn ?? fetch;
    this.registry = new CodecRegistry();
    registerAllBuiltins(this.registry);
    for (const c of options.codecs ?? []) {
      if ("contentTypes" in c) this.registry.registerResponse(c);
      else this.registry.registerRequest(c);
    }
    this.executeOptions = {
      maxErrorBodySize: options.maxErrorBodySize,
      errorMessageExtractor: options.errorMessageExtractor,
    };
  }

  /**
   * @internal
   */
  protected async makeGetRequest<
    Path extends PathsWithMethod<Paths, "get">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "get">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { get: infer M } ? M : never>["data"]
    >
  > {
    const response = await this.sdk.GET(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }

  /**
   * @internal
   */
  protected async makePostRequest<
    Path extends PathsWithMethod<Paths, "post">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "post">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { post: infer M } ? M : never>["data"]
    >
  > {
    const response = await this.sdk.POST(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }

  /**
   * @internal
   */
  protected async makeCloudGetRequest<
    Path extends PathsWithMethod<Paths, "get">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "get">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { get: infer M } ? M : never>["data"]
    >
  > {
    const response = await this.sdkCloud.GET(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }

  /**
   * @internal
   */
  protected async makeCloudPostRequest<
    Path extends PathsWithMethod<Paths, "post">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "post">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { post: infer M } ? M : never>["data"]
    >
  > {
    const response = await this.sdkCloud.POST(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }

  /**
   * @internal
   */
  protected async makePutRequest<
    Path extends PathsWithMethod<Paths, "put">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "put">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { put: infer M } ? M : never>["data"]
    >
  > {
    const response = await this.sdk.PUT(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }

  /**
   * @internal
   */
  protected async makePatchRequest<
    Path extends PathsWithMethod<Paths, "patch">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "patch">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { patch: infer M } ? M : never>["data"]
    >
  > {
    const response = await this.sdk.PATCH(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }

  /**
   * @internal
   */
  protected async execute<T = unknown>(spec: {
    operationId: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    params?: { path?: Record<string, unknown>; query?: Record<string, unknown> };
    requestCodec?: string;
    requestCodecConfig?: unknown;
    requestInput?: unknown;
    responseCodec: string;
    responseCodecConfig: unknown;
    baseUrl?: "sdk" | "sdkCloud";
  }): Promise<T> {
    const base = this.baseUrls[spec.baseUrl ?? "sdk"];
    let interpolated = spec.path;
    for (const [k, v] of Object.entries(spec.params?.path ?? {})) {
      interpolated = interpolated.replace(`{${k}}`, encodeURIComponent(String(v)));
    }
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(spec.params?.query ?? {})) {
      if (v == null) continue;
      if (Array.isArray(v)) for (const item of v) qs.append(k, String(item));
      else qs.append(k, String(v));
    }
    const query = qs.toString();
    const url = `${base}${interpolated}${query ? "?" + query : ""}`;
    const headers: Record<string, string> = { "User-Agent": this.userAgent };
    if (this.authHeader) headers["Authorization"] = this.authHeader;
    return executeOperation(
      {
        operationId: spec.operationId, method: spec.method, url,
        headers, registry: this.registry,
        requestCodec: spec.requestCodec, requestCodecConfig: spec.requestCodecConfig, requestInput: spec.requestInput,
        responseCodec: spec.responseCodec, responseCodecConfig: spec.responseCodecConfig,
      },
      this.fetchFn,
      this.executeOptions,
    ) as Promise<T>;
  }

  /**
   * @internal
   */
  protected async makeDeleteRequest<
    Path extends PathsWithMethod<Paths, "delete">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "delete">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { delete: infer M } ? M : never, unknown>["data"]
    >
  > {
    const response = await this.sdk.DELETE(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }
}
