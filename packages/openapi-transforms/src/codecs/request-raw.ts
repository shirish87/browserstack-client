import type { RequestCodec } from "../registry";
import { defineSchema } from "./schema";

type EmptyConfig = Record<string, never>;

const schema = defineSchema<EmptyConfig>("openapi-transforms", () => ({ value: {} as EmptyConfig }));

export const rawRequestCodec: RequestCodec<BodyInit, EmptyConfig> = {
  name: "raw",
  contentType: undefined,
  configSchema: schema,
  encode(input) {
    return { body: input };
  },
};
