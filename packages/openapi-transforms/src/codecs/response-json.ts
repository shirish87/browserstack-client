import type { ResponseCodec } from "../registry.js";
import { CodecError } from "../codec-error.js";

const emptySchema = {
  "~standard": {
    version: 1 as const,
    vendor: "openapi-transforms",
    validate: (value: unknown) => ({ value: value as {} }),
  },
};

export const jsonResponseCodec: ResponseCodec<{}, unknown> = {
  name: "json",
  contentTypes: ["application/json"],
  configSchema: emptySchema as any,
  async decode(response) {
    const text = await response.text();
    try { return text.length ? JSON.parse(text) : undefined; }
    catch (cause) {
      throw new CodecError("json", "decode", `JSON parse failed: ${(cause as Error).message}`, cause as Error);
    }
  },
};
