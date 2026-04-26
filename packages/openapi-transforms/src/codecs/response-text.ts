import type { ResponseCodec } from "../registry";
import { CodecError } from "../codec-error";
import { defineSchema } from "./schema";

type EmptyConfig = Record<string, never>;

const schema = defineSchema<EmptyConfig>("openapi-transforms", () => ({ value: {} as EmptyConfig }));

export const textResponseCodec: ResponseCodec<EmptyConfig, string> = {
  name: "text",
  contentTypes: ["text/plain", "text/*"],
  configSchema: schema,
  async decode(response) {
    try { return await response.text(); }
    catch (cause) { throw new CodecError("text", "decode", (cause as Error).message, cause as Error); }
  },
};
