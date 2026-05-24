import { resolveAccessKey, resolveUsername } from "@dot-slash/browserstack-core";
import { BrowserStackError } from "@dot-slash/browserstack-core";
import { isHttpError } from "@dot-slash/browserstack-openapi-transforms";

/**
 * Ensures that an access key exists and returns it.
 * If the access key is undefined, it falls back to BROWSERSTACK_ACCESS_KEY or BROWSERSTACK_KEY env vars.
 * Throws a BrowserStackError if the access key is missing or empty.
 * @param accessKey - The access key to ensure.
 * @returns The ensured access key.
 * @throws {BrowserStackError} If the access key is missing or empty.
 *
 * @internal
 */
export function ensureAccessKeyExists(accessKey?: string): string {
  const resolved = resolveAccessKey(accessKey);
  if (typeof resolved !== "string" || !resolved.trim().length) {
    throw new BrowserStackError("Missing accessKey");
  }

  return resolved.trim();
}

/**
 * Ensures that a username exists and returns it.
 * If the username is undefined, it falls back to BROWSERSTACK_USERNAME env var.
 * Throws a BrowserStackError if the username is missing or empty.
 * @param username - The username to ensure.
 * @returns The ensured username.
 * @throws {BrowserStackError} If the username is missing or empty.
 *
 * @internal
 */
export function ensureUsernameExists(data?: string): string {
  const username = resolveUsername(data);
  if (typeof username !== "string" || !username.trim().length) {
    throw new BrowserStackError("Missing username");
  }

  return username.trim();
}

/**
 * Formats an error into a human-readable string.
 * @param err - The error to format.
 * @returns The formatted error message.
 *
 * @internal
 */
export function formatError(err: unknown): string {
  if (isHttpError(err)) {
    const statusText = err.statusText || "";
    const msg = err.message && err.message !== `HTTP ${err.status} ${statusText}`.trim() ? `: ${err.message}` : "";
    return `Error: ${err.status} ${statusText}${msg}`;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return String(err);
}
