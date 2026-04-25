import { describe, expect, it } from "vitest";
import { binaryResponseCodec } from "../../codecs/response-binary";

const ctx = { operationId: "op", method: "GET", url: "http://x" };

describe("binaryResponseCodec", () => {
  it("returns ArrayBuffer by default", async () => {
    const r = new Response(new Uint8Array([1, 2, 3]));
    const out = await binaryResponseCodec.decode(r, {}, ctx);
    expect(out).toBeInstanceOf(ArrayBuffer);
    expect(new Uint8Array(out as ArrayBuffer)).toEqual(new Uint8Array([1,2,3]));
  });
  it("returns Blob when configured", async () => {
    const r = new Response(new Uint8Array([1,2,3]));
    const out = await binaryResponseCodec.decode(r, { as: "blob" }, ctx);
    expect(out).toBeInstanceOf(Blob);
  });
});
