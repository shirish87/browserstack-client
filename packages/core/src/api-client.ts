import { env } from "./env";
import { BrowserStackError } from "./error";
import { buildBasicAuthHeader } from "./auth";
import { makePkgInfo } from "./pkginfo";
import { composeMiddleware, type MiddlewareFunction } from "./middleware";

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
  middleware?: MiddlewareFunction[];
  timeout?: number;
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
  /** Base URLs used for API requests. */
  protected readonly baseUrls: { sdk: string; sdkCloud: string };
  /** HTTP Basic Auth header derived from username and access key. */
  protected readonly authHeader?: string;
  /** User-Agent string sent with every request. */
  protected readonly userAgent: string;
  /** Fetch implementation used to make HTTP requests. */
  protected readonly fetchFn: typeof fetch;
  /** Registry of request and response codecs. */
  protected readonly registry: CodecRegistry;
  private readonly executeOptions: {
    maxErrorBodySize?: number;
    errorMessageExtractor?: BrowserStackOptions["errorMessageExtractor"];
  };
  protected readonly clientTimeout?: number;

  constructor(
    options: BrowserStackOptions,
    baseUrl: string,
    cloudBaseUrl: string,
    pkgName: string,
    pkgVersion: string
  ) {
    const hasMiddleware = !!(options.middleware && options.middleware.length > 0);
    const usernameOptional = options.usernameOptional === true || hasMiddleware;

    const username = resolveUsername(options.username);
    if (
      usernameOptional !== true &&
      (typeof username !== "string" || !username.trim().length)
    ) {
      throw new BrowserStackError("Missing options.username");
    }

    const accessKey = resolveAccessKey(options.accessKey);
    if (usernameOptional !== true && (typeof accessKey !== "string" || !accessKey.trim().length)) {
      throw new BrowserStackError("Missing options.accessKey");
    }

    const pkginfo = makePkgInfo(pkgName, pkgVersion);

    this.baseUrls = {
      sdk: options.baseUrl ?? baseUrl,
      sdkCloud: cloudBaseUrl,
    };
    this.authHeader = (username && accessKey) ? buildBasicAuthHeader(username, accessKey) : undefined;
    this.userAgent = pkginfo.userAgent;
    this.clientTimeout = options.timeout;

    let baseFetch = options.fetchFn ?? fetch;
    if (options.middleware && options.middleware.length > 0) {
      const MAX_MIDDLEWARE_CAP = 10;
      if (options.middleware.length > MAX_MIDDLEWARE_CAP) {
        throw new BrowserStackError(`Too many middlewares registered. Maximum allowed is ${MAX_MIDDLEWARE_CAP}.`);
      }
      baseFetch = composeMiddleware(options.middleware, baseFetch);
    }
    this.fetchFn = baseFetch;

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
    const limit = (Error as typeof Error & { stackTraceLimit?: number }).stackTraceLimit;
    (Error as typeof Error & { stackTraceLimit?: number }).stackTraceLimit = 100;
    const stack = new Error().stack || "";
    (Error as typeof Error & { stackTraceLimit?: number }).stackTraceLimit = limit;
    const recursionDepth = (stack.match(/APIClient\.execute/g) || []).length || (stack.match(/\w+\.execute/g) || []).length;
    if (recursionDepth > 10) {
      throw new BrowserStackError(
        `Circular middleware execution or excessive recursion detected (depth > 10).`
      );
    }

    let timeoutId: any = undefined;
    let timeoutSignal: AbortSignal | undefined = undefined;
    let signal = spec.signal;

    if (this.clientTimeout) {
      const controller = new AbortController();
      timeoutId = setTimeout(() => {
        controller.abort(new DOMException("The operation was aborted due to timeout.", "TimeoutError"));
      }, this.clientTimeout);
      timeoutSignal = controller.signal;

      if (spec.signal) {
        if (typeof AbortSignal.any === "function") {
          signal = AbortSignal.any([spec.signal, timeoutSignal]);
        } else {
          if (spec.signal.aborted) {
            controller.abort(spec.signal.reason);
          } else {
            spec.signal.addEventListener("abort", () => {
              controller.abort(spec.signal?.reason);
            });
          }
          signal = controller.signal;
        }
      } else {
        signal = timeoutSignal;
      }
    }

    try {
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
      if (this.clientTimeout) {
        headers["X-BrowserStack-Timeout"] = String(this.clientTimeout);
      }

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
          signal,
          baseUrl: spec.baseUrl,
        },
        this.fetchFn,
        this.executeOptions,
      );
      return result as T;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }
}
