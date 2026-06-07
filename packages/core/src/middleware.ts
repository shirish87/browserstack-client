import type { HttpMethod } from "./api-client";

export interface MiddlewareContext {
  operationId: string;
  baseUrl?: "sdk" | "sdkCloud";
}

export interface MiddlewareRequest {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body?: BodyInit;
  signal?: AbortSignal;
  context: MiddlewareContext;
}

export type MiddlewareResponse = Response;

export type MiddlewareNext = (req: MiddlewareRequest) => Promise<MiddlewareResponse>;

export type MiddlewareFunction = (
  req: MiddlewareRequest,
  next: MiddlewareNext
) => Promise<MiddlewareResponse>;

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {};
  const record: Record<string, string> = {};

  if (Array.isArray(headers)) {
    for (const entry of headers) {
      if (Array.isArray(entry) && entry.length >= 2) {
        const [key, value] = entry;
        record[String(key).toLowerCase()] = String(value);
      }
    }
    return record;
  }

  if (typeof (headers as any).forEach === "function") {
    (headers as any).forEach((value: string, key: string) => {
      record[String(key).toLowerCase()] = String(value);
    });
    return record;
  }

  for (const [key, value] of Object.entries(headers)) {
    record[key.toLowerCase()] = String(value);
  }
  return record;
}

export function composeMiddleware(
  middleware: MiddlewareFunction[],
  fallbackFetch: typeof fetch
): typeof fetch {
  return async function (urlOrRequest: string | URL | Request, init?: RequestInit): Promise<Response> {
    let resolvedUrl = "";
    let resolvedMethod = "GET";
    let resolvedHeaders: Record<string, string> = {};
    let resolvedBody: any = undefined;
    let resolvedSignal: AbortSignal | undefined = undefined;
    let requestInitOptions: RequestInit = {};

    if (typeof urlOrRequest === "string") {
      resolvedUrl = urlOrRequest;
    } else if (urlOrRequest instanceof URL) {
      resolvedUrl = urlOrRequest.toString();
    } else if (typeof Request !== "undefined" && urlOrRequest instanceof Request) {
      resolvedUrl = urlOrRequest.url;
      resolvedMethod = urlOrRequest.method;
      resolvedHeaders = normalizeHeaders(urlOrRequest.headers);
      resolvedBody = urlOrRequest.body;
      resolvedSignal = urlOrRequest.signal;
      // Preserve standard request settings
      requestInitOptions = {
        mode: urlOrRequest.mode,
        credentials: urlOrRequest.credentials,
        cache: urlOrRequest.cache,
        redirect: urlOrRequest.redirect,
        referrer: urlOrRequest.referrer,
        referrerPolicy: urlOrRequest.referrerPolicy,
        integrity: urlOrRequest.integrity,
        keepalive: urlOrRequest.keepalive,
      };
    }

    const customInit = init as (RequestInit & { operationId?: string; baseUrl?: "sdk" | "sdkCloud" }) | undefined;
    const { operationId, baseUrl, ...rest } = customInit ?? {};

    if (customInit) {
      if (customInit.method) resolvedMethod = customInit.method;
      // Note: We merge headers here (rather than replacing them) to preserve critical headers
      // (like Authorization and User-Agent) injected by the BrowserStack APIClient.
      if (customInit.headers) resolvedHeaders = { ...resolvedHeaders, ...normalizeHeaders(customInit.headers) };
      if (customInit.body) resolvedBody = customInit.body;
      if (customInit.signal) resolvedSignal = customInit.signal;
    }

    const initialRequest: MiddlewareRequest = {
      url: resolvedUrl,
      method: resolvedMethod as any,
      headers: resolvedHeaders,
      body: resolvedBody ?? undefined,
      signal: resolvedSignal ?? undefined,
      context: {
        operationId: operationId ?? "unknown",
        baseUrl: baseUrl,
      },
    };

    let index = -1;
    async function dispatch(i: number, req: MiddlewareRequest): Promise<Response> {
      if (i <= index) {
        throw new Error("next() called multiple times in middleware pipeline");
      }
      index = i;
      const fn = middleware[i];
      if (!fn) {
        const fetchInit: RequestInit = {
          ...requestInitOptions,
          ...rest,
          method: req.method,
          headers: req.headers,
          body: req.body,
          signal: req.signal,
        };
        // Set duplex: "half" for streams (WHATWG ReadableStream or Node.js Readable stream)
        const isStream = req.body && (
          typeof (req.body as any).getReader === "function" ||
          typeof (req.body as any).pipe === "function"
        );
        if (isStream && !(fetchInit as any).duplex) {
          (fetchInit as any).duplex = "half";
        }
        return await fallbackFetch(req.url, fetchInit);
      }
      return await fn(req, (nextReq) => dispatch(i + 1, nextReq));
    }

    return await dispatch(0, initialRequest);
  };
}
