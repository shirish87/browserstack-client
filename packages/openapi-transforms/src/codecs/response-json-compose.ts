import type { ResponseCodec } from "../registry.js";
import { parsePath } from "../path/parser.js";
import { extract } from "../path/matcher.js";
import { CodecError } from "../codec-error.js";

export interface JsonComposeConfig {
  base: string;
  merge?: Record<string, string>;
}

const configSchema = {
  "~standard": {
    version: 1 as const,
    vendor: "openapi-transforms",
    validate: (v: unknown) => {
      if (!v || typeof v !== "object") return { issues: [{ message: "config must be an object" }] };
      const o = v as any;
      if (typeof o.base !== "string") return { issues: [{ message: "config.base must be a string" }] };
      if (o.merge != null && (typeof o.merge !== "object" || Array.isArray(o.merge))) {
        return { issues: [{ message: "config.merge must be an object" }] };
      }
      return { value: v as JsonComposeConfig };
    },
  },
};

export const jsonComposeCodec: ResponseCodec<JsonComposeConfig, unknown> = {
  name: "json-compose",
  contentTypes: ["application/json"],
  configSchema: configSchema as any,
  async decode(response, config) {
    let doc: unknown;
    try { doc = await response.json(); }
    catch (cause) { throw new CodecError("json-compose", "decode", (cause as Error).message, cause as Error); }
    try {
      const base = extract(parsePath(config.base), doc);
      if (!base || typeof base !== "object") {
        throw new CodecError("json-compose", "transform", `base path did not yield object: ${config.base}`);
      }
      const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
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
