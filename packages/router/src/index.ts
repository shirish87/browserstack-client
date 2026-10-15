import { buildBasicAuthHeader } from "@dot-slash/browserstack-core";

export { createOtelGateway, createOtelIngest } from "./otel/ingest.ts";
export { DEFAULT_OTEL_TIMEOUTS, EXIT_FAILURE, EXIT_OK, EXIT_TIMEOUT } from "./otel/types.ts";
export type {
  OtelGateway,
  OtelIngest,
  OtelIngestOptions,
} from "./otel/ingest.ts";
export type { TraceSnapshot, TraIngestClient } from "./otel/types.ts";
import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "node:http";
import type { Socket } from "node:net";
import { Readable } from "node:stream";

function isEncrypted(socket: Socket): boolean {
  return "encrypted" in socket && socket.encrypted === true;
}

function headersOf(headers: IncomingHttpHeaders): Headers {
  const out = new Headers();
  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === "string") out.set(key, value);
    else if (Array.isArray(value)) {
      for (const item of value) out.append(key, item);
    }
  }
  return out;
}

function requestInit(method: string | undefined, headers: Headers, body: BodyInit | undefined): RequestInit {
  const init: RequestInit & { duplex?: "half" } = { method, headers, body };
  if (body !== undefined) init.duplex = "half";
  return init;
}

function bodyOf(req: IncomingMessage): BodyInit | undefined {
  if (req.method === "GET" || req.method === "HEAD") return undefined;
  const reader = Readable.toWeb(req).getReader();
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const next = await reader.read();
      if (next.done) {
        controller.close();
        return;
      }
      if (next.value instanceof Uint8Array) controller.enqueue(next.value);
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}

export interface RouterOptions {
  /** Secure BrowserStack Username */
  username: string;
  /** Secure BrowserStack Access Key */
  accessKey: string;
  /** Server-owned upstream host allowlist. */
  allowedHosts: string[];
  /** Custom fetch implementation (optional, defaults to global fetch) */
  fetchFn?: typeof fetch;
  /** Default request timeout in milliseconds (defaults to 30000 ms) */
  defaultTimeout?: number;
  /** Maximum request timeout in milliseconds allowed (defaults to 60000 ms) to prevent DoS */
  maxTimeout?: number;
}

function isAllowedHost(url: URL, allowedHosts: string[]): boolean {
  return allowedHosts.includes(url.hostname);
}

export function createWebRouter(options: RouterOptions) {
  if (options.allowedHosts.length === 0) {
    throw new Error("allowedHosts must include at least one host");
  }
  const fetchFn = options.fetchFn ?? fetch;
  const authHeader = buildBasicAuthHeader(options.username, options.accessKey);
  const defaultTimeout = options.defaultTimeout ?? 30000;
  const maxTimeout = options.maxTimeout ?? 60000;

  return async function handleRequest(request: Request): Promise<Response> {
    const requestUrl = new URL(request.url);
    const targetUrlString = requestUrl.searchParams.get("url");

    if (!targetUrlString) {
      return new Response("Missing 'url' query parameter", { status: 400 });
    }

    let targetUrl: URL;
    try {
      targetUrl = new URL(targetUrlString);
    } catch {
      return new Response("Invalid 'url' query parameter", { status: 400 });
    }

    if (targetUrl.protocol !== "https:") {
      return new Response("Forbidden target protocol", { status: 403 });
    }

    if (!isAllowedHost(targetUrl, options.allowedHosts)) {
      return new Response("Forbidden target host", { status: 403 });
    }

    let timeout = defaultTimeout;
    const clientTimeoutHeader = request.headers.get("x-browserstack-timeout");
    if (clientTimeoutHeader) {
      const parsed = parseInt(clientTimeoutHeader, 10);
      if (!isNaN(parsed) && parsed > 0) {
        timeout = Math.min(parsed, maxTimeout);
      }
    }

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("x-browserstack-timeout");
    headers.set("Authorization", authHeader);

    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => {
      timeoutController.abort(new Error("Request Timeout"));
    }, timeout);

    const signal = request.signal
      ? AbortSignal.any([request.signal, timeoutController.signal])
      : timeoutController.signal;

    try {
      const response = await fetchFn(targetUrl.toString(), {
        method: request.method,
        headers,
        body: request.method !== "GET" && request.method !== "HEAD" ? await request.blob() : undefined,
        signal,
      });

      const responseHeaders = new Headers(response.headers);
      responseHeaders.delete("content-encoding");
      responseHeaders.delete("content-length");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      if ((err as Error).name === "AbortError" || (err as Error).message === "Request Timeout") {
        return new Response("Gateway Timeout", { status: 504 });
      }
      return new Response(`Bad Gateway: ${(err as Error).message}`, {
        status: 502,
        headers: { "Content-Type": "text/plain" },
      });
    } finally {
      clearTimeout(timeoutId);
    }
  };
}

export function createGateway(options: RouterOptions) {
  const webRouter = createWebRouter(options);

  return async function nodeMiddleware(
    req: IncomingMessage,
    res: ServerResponse,
    next?: (err?: unknown) => void
  ) {
    try {
      const protocol = isEncrypted(req.socket) ? "https" : "http";
      const host = req.headers.host ?? "localhost";
      const fullUrl = new URL(req.url ?? "/", `${protocol}://${host}`).toString();

      const webRequest = new Request(fullUrl, requestInit(req.method, headersOf(req.headers), bodyOf(req)));

      const webResponse = await webRouter(webRequest);

      res.statusCode = webResponse.status;
      res.statusMessage = webResponse.statusText;
      webResponse.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      if (webResponse.body) {
        const reader = webResponse.body.getReader();
        const maxChunks = 1_000_000;
        let chunks = 0;
        while (chunks < maxChunks) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) res.write(value);
          chunks += 1;
        }
        if (chunks >= maxChunks) {
          const extra = await reader.read();
          if (!extra.done) {
            await reader.cancel();
            throw new Error("Upstream response exceeded the chunk limit");
          }
        }
      }
      res.end();
    } catch (err) {
      if (next) {
        next(err);
      } else {
        res.statusCode = 500;
        res.end("Internal Gateway Error");
      }
    }
  };
}
