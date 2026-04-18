import type { ResponseCodec } from "../registry.js";
import { parsePath } from "../path/parser.js";
import { streamExtract } from "../streaming/json-stream.js";
import { CodecError } from "../codec-error.js";

export interface JsonUnwrapConfig { path: string }

const configSchema = {
  "~standard": {
    version: 1 as const,
    vendor: "openapi-transforms",
    validate: (value: unknown) => {
      if (!value || typeof value !== "object" || typeof (value as any).path !== "string") {
        return { issues: [{ message: "config.path must be a string" }] };
      }
      return { value: value as JsonUnwrapConfig };
    },
  },
};

export const jsonUnwrapCodec: ResponseCodec<JsonUnwrapConfig, unknown> = {
  name: "json-unwrap",
  contentTypes: ["application/json"],
  configSchema: configSchema as any,
  async decode(response, config) {
    const ast = parsePath(config.path);
    if (!response.body) {
      throw new CodecError("json-unwrap", "decode", "response has no body");
    }
    try {
      return await streamExtract(response.body, ast);
    } catch (cause) {
      const err = cause as Error;
      const stage: "decode" | "transform" =
        /^path did not match/.test(err.message) || /expected (object|array)/.test(err.message)
          ? "transform" : "decode";
      throw new CodecError("json-unwrap", stage, err.message, err);
    }
  },
};
