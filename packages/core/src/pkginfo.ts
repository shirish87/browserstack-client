import { versions } from "./env.ts";

/**
 * Create package info for User-Agent header
 * @internal
 */
export function makePkgInfo(name: string, version: string) {
  const libVersion = [name, version].filter(Boolean).join("/");
  const envVersion = ["node", versions.node].filter(Boolean).join("/");
  const userAgent = [libVersion, envVersion].filter(Boolean).join(" ");

  return {
    name,
    version,
    userAgent,
  };
}
