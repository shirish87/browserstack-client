import { env } from "@/env";
import { BrowserStackError } from "@/error";

/**
 * Ensures that a key exists and returns it.
 * If the key is undefined, it falls back to the value of env.BROWSERSTACK_KEY.
 * Throws a BrowserStackError if the key is missing or empty.
 * @param key - The key to ensure.
 * @returns The ensured key.
 * @throws {BrowserStackError} If the key is missing or empty.
 *
 * @internal
 */
export function ensureKeyExists(key: string | undefined): string {
  const accessToken = key ?? env.BROWSERSTACK_KEY;
  if (typeof accessToken !== "string" || !accessToken.trim().length) {
    throw new BrowserStackError("Missing key");
  }

  return accessToken.trim();
}

/**
 * Ensures that a username exists and returns it.
 * If the key is undefined, it falls back to the value of env.BROWSERSTACK_USERNAME.
 * Throws a BrowserStackError if the key is missing or empty.
 * @param key - The key to ensure.
 * @returns The ensured key.
 * @throws {BrowserStackError} If the key is missing or empty.
 *
 * @internal
 */
export function ensureUsernameExists(key: string | undefined): string {
  const username = key ?? env.BROWSERSTACK_USERNAME;
  if (typeof username !== "string" || !username.trim().length) {
    throw new BrowserStackError("Missing key");
  }

  return username.trim();
}
