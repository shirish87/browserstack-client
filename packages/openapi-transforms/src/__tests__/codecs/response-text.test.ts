import { describe, expect, it } from "vitest";
import { textResponseCodec } from "../../codecs/response-text.js";

const ctx = { operationId: "op", method: "GET", url: "http://x" };

describe("textResponseCodec", () => {
  it("returns body text", async () => {
    const r = new Response("hello");
    await expect(textResponseCodec.decode(r, {}, ctx)).resolves.toBe("hello");
  });
});
