import type { ResponseCodec } from "../registry";
import { CodecError } from "../codec-error";
import { defineSchema, isRecord } from "./schema";

export interface BinaryConfig { as?: "arraybuffer" | "blob" }

const schema = defineSchema<BinaryConfig>("openapi-transforms", (v) => {
  if (v == null) return { value: {} };
  if (!isRecord(v)) return { issues: [{ message: "config must be an object" }] };
  const as = v.as;
  if (as === undefined) return { value: {} };
  if (as === "arraybuffer" || as === "blob") return { value: { as } };
  return { issues: [{ message: "config.as must be 'arraybuffer' or 'blob'" }] };
});

export const binaryResponseCodec: ResponseCodec<BinaryConfig, ArrayBuffer | Blob> = {
  name: "binary",
  contentTypes: ["application/octet-stream", "*/*"],
  configSchema: schema,
  async decode(response, config) {
    try { return (config.as === "blob") ? await response.blob() : await response.arrayBuffer(); }
    catch (cause) { throw new CodecError("binary", "decode", (cause as Error).message, cause as Error); }
  },
};
