import type { RequestCodec } from "../registry.js";
const schema = { "~standard": { version: 1 as const, vendor: "ot", validate: (v: unknown) => ({ value: (v ?? {}) as {} }) } };
export const jsonRequestCodec: RequestCodec<unknown, {}> = {
  name: "json",
  contentType: "application/json",
  configSchema: schema as any,
  encode(input) {
    return { body: JSON.stringify(input), headers: { "content-type": "application/json" } };
  },
};
