import type { ResponseCodec } from "../registry";
import { CodecError } from "../codec-error";
import { defineSchema } from "./schema";

type EmptyConfig = Record<string, never>;

const emptySchema = defineSchema<EmptyConfig>("openapi-transforms", () => ({ value: {} as EmptyConfig }));

export const jsonResponseCodec: ResponseCodec<EmptyConfig, unknown> = {
  name: "json",
  contentTypes: ["application/json"],
  configSchema: emptySchema,
  async decode(response) {
    const text = await response.text();
    try { return text.length ? JSON.parse(text) : undefined; }
    catch (cause) {
      throw new CodecError("json", "decode", `JSON parse failed: ${(cause as Error).message}`, cause as Error);
    }
  },
};
