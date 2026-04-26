import { describe, it, expect } from "vitest";
import { streamExtract } from "../../streaming/json-stream";
import { parsePath } from "../../path/parser";

function itemStream(count: number): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  let i = 0;
  return new ReadableStream({
    pull(c) {
      if (i === 0) c.enqueue(enc.encode('{"items":['));
      if (i < count) {
        const comma = i > 0 ? "," : "";
        c.enqueue(enc.encode(`${comma}{"x":${i},"payload":"${"a".repeat(200)}"}`));
        i++;
      } else {
        c.enqueue(enc.encode("]}"));
        c.close();
      }
    },
  });
}

describe("streaming memory", () => {
  it("processes 50k items without retaining full parse tree", async () => {
    if (typeof global.gc !== "function") {
      console.warn("Skipping: run with --expose-gc");
      return;
    }
    global.gc!();
    const before = process.memoryUsage().heapUsed;
    const n = 50_000;
    const result = await streamExtract(itemStream(n), parsePath("$.items[*].x"));
    global.gc!();
    const after = process.memoryUsage().heapUsed;
    expect(Array.isArray(result) ? (result as unknown[]).length : 0).toBe(n);
    expect(after - before).toBeLessThan(15 * 1024 * 1024);
  }, 30_000);
});
