import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { streamExtract } from "../../streaming/json-stream.js";
import { parsePath } from "../../path/parser.js";
import { extract } from "../../path/matcher.js";

const jsonValueArb: fc.Arbitrary<unknown> = fc.oneof(
  fc.integer(),
  fc.string({ maxLength: 10 }),
  fc.boolean(),
  fc.constant(null),
);

describe("streaming vs JSON.parse oracle", () => {
  it("$.foo[*] matches reference extraction", async () => {
    await fc.assert(fc.asyncProperty(
      fc.record({ foo: fc.array(jsonValueArb, { maxLength: 10 }) }),
      async (obj) => {
        const body = JSON.stringify(obj);
        const stream = new ReadableStream<Uint8Array>({
          start(c) { c.enqueue(new TextEncoder().encode(body)); c.close(); },
        });
        const ast = parsePath("$.foo[*]");
        const streamed = await streamExtract(stream, ast);
        const oracle = extract(ast, obj);
        expect(streamed).toEqual(oracle);
      },
    ), { numRuns: 100 });
  });
});
