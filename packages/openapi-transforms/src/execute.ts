import type { CodecRegistry } from "./registry";
import type { CodecContext } from "./errors";
import {
  HttpError, NetworkError, DecodeError, TransformError, ClientError, OpenAPIError,
} from "./errors";
import { CodecError } from "./codec-error";
import { captureErrorBody } from "./body-capture";
import { defaultErrorMessage } from "./error-message";
import { isRetryable } from "./retryable";

export interface ExecuteOptions {
  maxErrorBodySize?: number;
  errorMessageExtractor?: (body: unknown, ctx: CodecContext) => string | undefined;
}

export interface ExecuteSpec {
  operationId: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  registry: CodecRegistry;
  requestCodec?: string;
  requestCodecConfig?: unknown;
  requestInput?: unknown;
  responseCodec: string;
  responseCodecConfig: unknown;
  signal?: AbortSignal;
}

export async function executeOperation(
  spec: ExecuteSpec,
  fetchFn: typeof fetch = fetch,
  options: ExecuteOptions = {},
): Promise<unknown> {
  const ctx: CodecContext = { operationId: spec.operationId, method: spec.method, url: spec.url };
  const maxErrorBodySize = options.maxErrorBodySize ?? 64 * 1024;
  const extractor = options.errorMessageExtractor ?? defaultErrorMessage;

  let body: BodyInit | undefined;
  let headers: Record<string, string> = { ...(spec.headers ?? {}) };

  if (spec.requestCodec) {
    try {
      const codec = spec.registry.resolveRequest(spec.requestCodec);
      const enc = codec.encode(spec.requestInput, spec.requestCodecConfig);
      body = enc.body;
      headers = { ...headers, ...(enc.headers ?? {}) };
    } catch (cause) {
      throw new ClientError(`request encode failed: ${(cause as Error).message}`, ctx, cause as Error);
    }
  }

  let response: Response;
  try {
    response = await fetchFn(spec.url, { method: spec.method, headers, body, signal: spec.signal });
  } catch (cause) {
    throw new NetworkError((cause as Error).message || "network error", ctx, cause as Error);
  }

  if (!response.ok) {
    const captured = await captureErrorBody(response.clone(), maxErrorBodySize);
    const message = extractor(captured.parsed ?? captured.text, ctx) ?? `HTTP ${response.status} ${response.statusText}`;
    throw new HttpError(message, ctx, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      requestId: response.headers.get("x-request-id") ?? undefined,
      body: captured,
      retryable: isRetryable("http", response.status),
    });
  }

  const codec = spec.registry.resolveResponse(spec.responseCodec);
  try {
    return await codec.decode(response, spec.responseCodecConfig, ctx);
  } catch (cause) {
    if (cause instanceof CodecError) {
      const base = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        codecName: cause.codecName,
        cause: cause.cause ?? cause,
      };
      if (cause.stage === "decode") {
        throw new DecodeError(cause.message, ctx, base);
      }
      throw new TransformError(cause.message, ctx, { ...base });
    }
    throw new OpenAPIError("decode", (cause as Error).message, ctx, cause as Error);
  }
}
