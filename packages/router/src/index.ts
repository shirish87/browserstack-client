import { buildBasicAuthHeader } from "@dot-slash/browserstack-core";
import type { IncomingMessage, ServerResponse } from "node:http";
import { Readable } from "node:stream";

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

    let signal: AbortSignal;
    if (request.signal) {
      // @ts-ignore
      signal = AbortSignal.any ? AbortSignal.any([request.signal, timeoutController.signal]) : timeoutController.signal;
    } else {
      signal = timeoutController.signal;
    }

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
      const protocol = (req.socket as any).encrypted ? "https" : "http";
      const host = req.headers.host ?? "localhost";
      const fullUrl = new URL(req.url ?? "/", `${protocol}://${host}`).toString();

      const body = req.method !== "GET" && req.method !== "HEAD"
        ? Readable.toWeb(req) as ReadableStream
        : undefined;

      const webRequest = new Request(fullUrl, {
        method: req.method,
        headers: req.headers as Record<string, string>,
        body,
        // @ts-ignore
        duplex: "half",
      });

      const webResponse = await webRouter(webRequest);

      res.statusCode = webResponse.status;
      res.statusMessage = webResponse.statusText;
      webResponse.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      if (webResponse.body) {
        const reader = webResponse.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
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
