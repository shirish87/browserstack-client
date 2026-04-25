import type { ResponseCodec } from "../registry";
import { parsePath } from "../path/parser";
import { extract } from "../path/matcher";
import { CodecError } from "../codec-error";
import { defineSchema, isRecord } from "./schema";

export interface JsonComposeConfig {
  base: string;
  merge?: Record<string, string>;
}

const configSchema = defineSchema<JsonComposeConfig>("openapi-transforms", (v) => {
  if (!isRecord(v)) return { issues: [{ message: "config must be an object" }] };
  if (typeof v.base !== "string") return { issues: [{ message: "config.base must be a string" }] };
  if (v.merge !== undefined && !isRecord(v.merge)) {
    return { issues: [{ message: "config.merge must be an object" }] };
  }
  const merge = v.merge as Record<string, string> | undefined;
  return { value: { base: v.base, merge } };
});

export const jsonComposeCodec: ResponseCodec<JsonComposeConfig, unknown> = {
  name: "json-compose",
  contentTypes: ["application/json"],
  configSchema,
  async decode(response, config) {
    let doc: unknown;
    try { doc = await response.json(); }
    catch (cause) { throw new CodecError("json-compose", "decode", (cause as Error).message, cause as Error); }
    try {
      const base = extract(parsePath(config.base), doc);
      if (!isRecord(base)) {
        throw new CodecError("json-compose", "transform", `base path did not yield object: ${config.base}`);
      }
      const out: Record<string, unknown> = { ...base };
      for (const [key, path] of Object.entries(config.merge ?? {})) {
        out[key] = extract(parsePath(path), doc);
      }
      return out;
    } catch (cause) {
      if (cause instanceof CodecError) throw cause;
      throw new CodecError("json-compose", "transform", (cause as Error).message, cause as Error);
    }
  },
};
