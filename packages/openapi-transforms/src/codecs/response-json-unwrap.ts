import type { ResponseCodec } from "../registry";
import { parsePath } from "../path/parser";
import { streamExtract } from "../streaming/json-stream";
import { CodecError } from "../codec-error";
import { defineSchema, isRecord } from "./schema";

export interface JsonUnwrapConfig { path: string }

const configSchema = defineSchema<JsonUnwrapConfig>("openapi-transforms", (value) => {
  if (!isRecord(value) || typeof value.path !== "string") {
    return { issues: [{ message: "config.path must be a string" }] };
  }
  return { value: { path: value.path } };
});

export const jsonUnwrapCodec: ResponseCodec<JsonUnwrapConfig, unknown> = {
  name: "json-unwrap",
  contentTypes: ["application/json"],
  configSchema,
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
