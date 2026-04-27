import { env } from "./env";
import { BrowserStackError } from "./error";
import { buildBasicAuthHeader } from "./auth";
import { makePkgInfo } from "./pkginfo";

import {
  CodecRegistry,
  executeOperation,
  registerAllBuiltins,
  type ResponseCodec,
  type RequestCodec,
} from "@dot-slash/browserstack-openapi-transforms";

function nonEmpty(value: string | undefined): string | undefined {
  return value?.trim?.()?.length ? value.trim() : undefined;
}

export function resolveAccessKey(optionsAccessKey?: string): string | undefined {
  return nonEmpty(optionsAccessKey) ?? nonEmpty(env.BROWSERSTACK_ACCESS_KEY) ?? nonEmpty(env.BROWSERSTACK_KEY);
}

export function resolveUsername(optionsUsername?: string): string | undefined {
  return nonEmpty(optionsUsername) ?? nonEmpty(env.BROWSERSTACK_USERNAME);
}

export interface BrowserStackOptions {
  username?: string;
  accessKey?: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  fetchFn?: typeof fetch;
  /** @internal */
  usernameOptional?: boolean;
  codecs?: Array<ResponseCodec<unknown, unknown> | RequestCodec<unknown, unknown>>;
  errorMessageExtractor?: (body: unknown, ctx: { operationId: string; method: string; url: string }) => string | undefined;
  maxErrorBodySize?: number;
}

export interface ExecuteOptions {
  signal?: AbortSignal;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * @internal
 */
export class APIClient {
  protected readonly baseUrls: { sdk: string; sdkCloud: string };
  protected readonly authHeader?: string;
  protected readonly userAgent: string;
  protected readonly fetchFn: typeof fetch;
  protected readonly registry: CodecRegistry;
  private readonly executeOptions: {
    maxErrorBodySize?: number;
    errorMessageExtractor?: BrowserStackOptions["errorMessageExtractor"];
  };

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
  protected async execute<T = unknown>(spec: {
    operationId: string;
    method: HttpMethod;
    path: string;
    params?: { path?: Record<string, unknown>; query?: Record<string, unknown> };
    requestCodec?: string;
    requestCodecConfig?: unknown;
    requestInput?: unknown;
    responseCodec: string;
    responseCodecConfig: unknown;
    baseUrl?: "sdk" | "sdkCloud";
    signal?: AbortSignal;
    [key: string]: unknown;
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
    const result = await executeOperation(
      {
        operationId: spec.operationId,
        method: spec.method,
        url,
        headers,
        registry: this.registry,
        requestCodec: spec.requestCodec,
        requestCodecConfig: spec.requestCodecConfig,
        requestInput: spec.requestInput,
        responseCodec: spec.responseCodec,
        responseCodecConfig: spec.responseCodecConfig,
        signal: spec.signal,
      },
      this.fetchFn,
      this.executeOptions,
    );
    return result as T;
  }
}
