/**
 * Shared core utilities for BrowserStack client packages
 * @internal
 */
export { APIClient, resolveAccessKey, resolveUsername } from "./api-client";
export type {
  BrowserStackOptions,
  ExecuteOptions,
  HttpMethod,
} from "./api-client";
export {
  BrowserStackError,
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
} from "./error";
export type {
  ErrorContext,
  CodecContext,
  ErrorKind,
  ErrorBody,
} from "./error";
export { buildBasicAuthHeader } from "./auth";
export { env, versions, currentPlatform, currentArch } from "./env";
export { makePkgInfo } from "./pkginfo";
