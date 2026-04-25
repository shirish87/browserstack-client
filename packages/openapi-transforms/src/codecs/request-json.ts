import type { RequestCodec } from "../registry";
import { defineSchema } from "./schema";

type EmptyConfig = Record<string, never>;

const schema = defineSchema<EmptyConfig>("openapi-transforms", () => ({ value: {} as EmptyConfig }));

export const jsonRequestCodec: RequestCodec<unknown, EmptyConfig> = {
  name: "json",
  contentType: "application/json",
  configSchema: schema,
  encode(input) {
    return { body: JSON.stringify(input), headers: { "content-type": "application/json" } };
  },
};
