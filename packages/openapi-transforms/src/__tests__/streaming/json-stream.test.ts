import { describe, expect, it } from "vitest";
import { parsePath } from "../../path/parser.js";
import { streamExtract } from "../../streaming/json-stream.js";

function bodyStream(s: string): ReadableStream<Uint8Array> {
  const bytes = new TextEncoder().encode(s);
  return new ReadableStream({ start(c) { c.enqueue(bytes); c.close(); } });
}

describe("streamExtract", () => {
  it("extracts $.foo as single value", async () => {
    const r = await streamExtract(bodyStream('{"foo":{"a":1}}'), parsePath("$.foo"));
    expect(r).toEqual({ a: 1 });
  });
  it("extracts $[*].x as array", async () => {
    const r = await streamExtract(bodyStream('[{"x":1},{"x":2}]'), parsePath("$[*].x"));
    expect(r).toEqual([1, 2]);
  });
  it("extracts $.items[*] as array", async () => {
    const r = await streamExtract(bodyStream('{"items":[10,20,30]}'), parsePath("$.items[*]"));
    expect(r).toEqual([10, 20, 30]);
  });
  it("returns $ as whole doc", async () => {
    const r = await streamExtract(bodyStream('{"k":"v"}'), parsePath("$"));
    expect(r).toEqual({ k: "v" });
  });
  it("throws if field missing", async () => {
    await expect(streamExtract(bodyStream('{"other":1}'), parsePath("$.foo"))).rejects.toThrow();
  });
  it("survives chunked input", async () => {
    const bytes1 = new TextEncoder().encode('{"items":[{"x":');
    const bytes2 = new TextEncoder().encode('1},{"x":2}]}');
    const stream = new ReadableStream<Uint8Array>({
      start(c) { c.enqueue(bytes1); c.enqueue(bytes2); c.close(); },
    });
    expect(await streamExtract(stream, parsePath("$.items[*].x"))).toEqual([1, 2]);
  });
});
