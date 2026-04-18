import { describe, expect, it } from "vitest";
import { jsonResponseCodec } from "../../codecs/response-json.js";
import { CodecError } from "../../codec-error.js";

const ctx = { operationId: "op", method: "GET", url: "http://x" };

describe("jsonResponseCodec", () => {
  it("parses JSON body", async () => {
    const r = new Response('{"a":1}', { headers: { "content-type": "application/json" } });
    await expect(jsonResponseCodec.decode(r, {}, ctx)).resolves.toEqual({ a: 1 });
  });
  it("throws CodecError(decode) on malformed JSON", async () => {
    const r = new Response("not{json");
    await expect(jsonResponseCodec.decode(r, {}, ctx)).rejects.toBeInstanceOf(CodecError);
  });
});
