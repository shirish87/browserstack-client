/**
 * Shared core utilities for BrowserStack client packages
 * @internal
 */
export { APIClient, resolveAccessKey, resolveUsername } from "./api-client.js";
export type {
  BrowserStackOptions,
  APIFetchOptions,
} from "./api-client.js";
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
} from "./error.js";
export type {
  ErrorContext,
  CodecContext,
  ErrorKind,
  ErrorBody,
} from "./error.js";
export { buildBasicAuthHeader } from "./auth.js";
export { env, versions, currentPlatform, currentArch } from "./env.js";
export { makePkgInfo } from "./pkginfo.js";
