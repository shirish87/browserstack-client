import type { ResponseCodec } from "../registry.js";
import { CodecError } from "../codec-error.js";

const schema = { "~standard": { version: 1 as const, vendor: "ot", validate: (v: unknown) => ({ value: v as {} }) } };

export const textResponseCodec: ResponseCodec<{}, string> = {
  name: "text",
  contentTypes: ["text/plain", "text/*"],
  configSchema: schema as any,
  async decode(response) {
    try { return await response.text(); }
    catch (cause) { throw new CodecError("text", "decode", (cause as Error).message, cause as Error); }
  },
};
