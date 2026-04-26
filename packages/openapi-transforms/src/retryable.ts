import type { ErrorKind } from "./errors";

export function isRetryable(kind: ErrorKind, status?: number): boolean {
  if (kind === "network") return true;
  if (kind !== "http") return false;
  if (status === 408 || status === 429) return true;
  if (status && status >= 500 && status < 600) return status !== 501 && status !== 505;
  return false;
}
