// Removes anything account-specific or secret from a captured API response so it can be committed
// as a fixture: presigned/URL tokens, user names (listed in SANITIZE_NAMES, comma-separated) and ids, build/session hashes and local file paths.
import { createHash } from "node:crypto";

const HASH = /\b[a-z0-9]{40}\b/g;

/** Deterministic, non-reversible stand-in so references between objects stay consistent. */
function fakeHash(original) {
  return createHash("sha1").update(`fixture:${original}`).digest("hex");
}

function localPath(p) {
  const path = p.replace(/^file:\/\//, "");
  const nm = path.lastIndexOf("/node_modules/");
  if (nm !== -1) return `/work${path.slice(nm)}`;
  return `/work/${path.split("/").slice(-2).join("/")}`;
}

/** Rules that need no id remapping: shared by captured JSON and plain-text logs. */
export function scrubSecrets(s) {
  return s
    // Public build links carry a token in the path that grants unauthenticated access to the build.
    .replace(/(\/public-build\/)[^\s"'?]+/g, "$1TOKEN")
    // Device serials identify a physical device in BrowserStack's cloud.
    .replace(/("?(?:appium:)?(?:udid|deviceUDID)"?\s*:\s*")[^"]+(")/gi, "$1UDID$2")
    .replace(/("deviceName"\s*:\s*")[A-Z0-9]{10,}(")/g, "$1UDID$2")
    // Android installs a random per-install directory name.
    .replace(/\/data\/app\/~~[^/\s]+\/([^/\s=]+)-[A-Za-z0-9_-]{20,}==/g, "/data/app/~~APP/$1-APP==");
}

function sanitizeString(s) {
  let out = scrubSecrets(s)
    // Strip query strings from URLs: they carry presigned S3 signatures and auth tokens.
    .replace(/(https?:\/\/[^\s"'?]+)\?[^\s"']*/g, "$1")
    // Local absolute paths (optionally file:// URLs) leak the machine layout.
    .replace(/(?:file:\/\/)?\/(?:tmp|home|Users|var)\/[^\s:"')]+/g, localPath)
    .replace(HASH, (h) => fakeHash(h));
  // Names of the people running a capture, from the environment so no real name is committed here.
  for (const name of (process.env.SANITIZE_NAMES ?? "").split(",").map((n) => n.trim()).filter(Boolean)) {
    out = out.replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "Test User");
  }
  return out;
}

const ID_KEYS = new Set(["user_id", "last_executed_by_id", "created_by", "group_id", "sub_group_id"]);

export function sanitize(value, key = "") {
  if (typeof value === "string") return sanitizeString(value);
  if (typeof value === "number" && ID_KEYS.has(key)) return 1;
  if (Array.isArray(value)) return value.map((v) => sanitize(v, key));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [sanitizeString(k), sanitize(v, k)]));
  }
  return value;
}
