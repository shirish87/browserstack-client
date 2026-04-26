export type ErrorKind =
  | "network"
  | "http"
  | "decode"
  | "transform"
  | "validation"
  | "client";

export interface CodecContext {
  readonly operationId: string;
  readonly method: string;
  readonly url: string;
}

export class OpenAPIError extends Error {
  readonly kind: ErrorKind;
  readonly operationId: string;
  readonly method: string;
  readonly url: string;
  readonly cause?: Error;

  constructor(kind: ErrorKind, message: string, ctx: CodecContext, cause?: Error) {
    super(message);
    this.name = "OpenAPIError";
    this.kind = kind;
    this.operationId = ctx.operationId;
    this.method = ctx.method;
    this.url = ctx.url;
    if (cause) this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends OpenAPIError {
  declare readonly kind: "network";
  declare readonly cause: Error;
  constructor(message: string, ctx: CodecContext, cause: Error) {
    super("network", message, ctx, cause);
    this.name = "NetworkError";
  }
}

export interface ErrorBody<T = unknown> {
  contentType?: string;
  text?: string;
  parsed?: T;
  truncated?: boolean;
}

export interface HttpErrorFields<TBody> {
  status: number;
  statusText: string;
  headers: Headers;
  requestId?: string;
  body: ErrorBody<TBody>;
  retryable: boolean;
}

export class HttpError<TBody = unknown> extends OpenAPIError {
  declare readonly kind: "http";
  readonly status: number;
  readonly statusText: string;
  readonly headers: Headers;
  readonly requestId?: string;
  readonly body: ErrorBody<TBody>;
  readonly retryable: boolean;

  constructor(message: string, ctx: CodecContext, fields: HttpErrorFields<TBody>) {
    super("http", message, ctx);
    this.name = "HttpError";
    this.status = fields.status;
    this.statusText = fields.statusText;
    this.headers = fields.headers;
    if (fields.requestId !== undefined) this.requestId = fields.requestId;
    this.body = fields.body;
    this.retryable = fields.retryable;
  }
}

export interface DecodeErrorFields {
  status: number;
  statusText: string;
  headers: Headers;
  codecName: string;
  cause: Error;
}

export class DecodeError extends OpenAPIError {
  declare readonly kind: "decode";
  declare readonly cause: Error;
  readonly status: number;
  readonly statusText: string;
  readonly headers: Headers;
  readonly codecName: string;
  constructor(message: string, ctx: CodecContext, fields: DecodeErrorFields) {
    super("decode", message, ctx, fields.cause);
    this.name = "DecodeError";
    this.status = fields.status;
    this.statusText = fields.statusText;
    this.headers = fields.headers;
    this.codecName = fields.codecName;
  }
}

export interface TransformErrorFields {
  status: number;
  statusText: string;
  codecName: string;
  path?: string;
  cause: Error;
}

export class TransformError extends OpenAPIError {
  declare readonly kind: "transform";
  declare readonly cause: Error;
  readonly status: number;
  readonly statusText: string;
  readonly codecName: string;
  readonly path?: string;
  constructor(message: string, ctx: CodecContext, fields: TransformErrorFields) {
    super("transform", message, ctx, fields.cause);
    this.name = "TransformError";
    this.status = fields.status;
    this.statusText = fields.statusText;
    this.codecName = fields.codecName;
    if (fields.path !== undefined) this.path = fields.path;
  }
}

export class ClientError extends OpenAPIError {
  declare readonly kind: "client";
  constructor(message: string, ctx: CodecContext, cause?: Error) {
    super("client", message, ctx, cause);
    this.name = "ClientError";
  }
}

export const isNetworkError = (e: unknown): e is NetworkError => e instanceof NetworkError;
export const isHttpError = <T = unknown>(e: unknown): e is HttpError<T> => e instanceof HttpError;
export const isDecodeError = (e: unknown): e is DecodeError => e instanceof DecodeError;
export const isTransformError = (e: unknown): e is TransformError => e instanceof TransformError;
export const isClientError = (e: unknown): e is ClientError => e instanceof ClientError;
