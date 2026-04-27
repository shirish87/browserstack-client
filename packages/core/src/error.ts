export interface ErrorContext {
  path?: string;
  response?: unknown;
  [key: string]: unknown;
}

/**
 * BrowserStackError represents an error returned from a BrowserStack Client.
 * @internal
 */
export class BrowserStackError extends Error {
  readonly code?: string;
  readonly context?: ErrorContext | Error;

  constructor(message: string, context?: ErrorContext | Error) {
    super(message);
    this.name = "BrowserStackError";
    this.context = context;

    if (context instanceof Error) {
      this.name = context.name;
      this.stack = context.stack;

      if ("code" in context && typeof context.code === "string") {
        this.code = context.code;
      }
    }

    Object.setPrototypeOf(this, BrowserStackError.prototype);
  }
}

export {
  OpenAPIError,
  NetworkError,
  HttpError,
  DecodeError,
  TransformError,
  ClientError,
  isNetworkError,
  isHttpError,
  isDecodeError,
  isTransformError,
  isClientError,
} from "@dot-slash/browserstack-openapi-transforms";
export type {
  CodecContext,
  ErrorKind,
  ErrorBody,
} from "@dot-slash/browserstack-openapi-transforms";
