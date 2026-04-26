/**
 * Shared core utilities for BrowserStack client packages
 * @internal
 */
export { APIClient, resolveAccessKey, resolveUsername } from "./api-client.js";
export type {
  BrowserStackOptions,
  APIFetchOptions,
} from "./api-client.js";
export { BrowserStackError } from "./error.js";
export type { ErrorContext } from "./error.js";
export { buildBasicAuthHeader } from "./auth.js";
export { env, versions, currentPlatform, currentArch } from "./env.js";
export { makePkgInfo } from "./pkginfo.js";
