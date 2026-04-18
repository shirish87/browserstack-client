import type { ResponseCodec } from "../registry.js";
import { CodecError } from "../codec-error.js";

export interface BinaryConfig { as?: "arraybuffer" | "blob" }

const schema = {
  "~standard": {
    version: 1 as const,
    vendor: "ot",
    validate: (v: unknown) => {
      if (v && typeof v === "object" && "as" in v && !["arraybuffer", "blob"].includes((v as any).as)) {
        return { issues: [{ message: "config.as must be 'arraybuffer' or 'blob'" }] };
      }
      return { value: (v ?? {}) as BinaryConfig };
    },
  },
};

export const binaryResponseCodec: ResponseCodec<BinaryConfig, ArrayBuffer | Blob> = {
  name: "binary",
  contentTypes: ["application/octet-stream", "*/*"],
  configSchema: schema as any,
  async decode(response, config) {
    try { return (config.as === "blob") ? await response.blob() : await response.arrayBuffer(); }
    catch (cause) { throw new CodecError("binary", "decode", (cause as Error).message, cause as Error); }
  },
};
