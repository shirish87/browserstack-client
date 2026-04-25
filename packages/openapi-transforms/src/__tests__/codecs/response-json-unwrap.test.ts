import { describe, expect, it } from "vitest";
import { jsonUnwrapCodec } from "../../codecs/response-json-unwrap";
import { CodecError } from "../../codec-error";

const ctx = { operationId: "op", method: "GET", url: "http://x" };

describe("jsonUnwrapCodec", () => {
  it("unwraps single path", async () => {
    const r = new Response('{"project":{"id":1}}');
    await expect(jsonUnwrapCodec.decode(r, { path: "$.project" }, ctx)).resolves.toEqual({ id: 1 });
  });
  it("unwraps array path", async () => {
    const r = new Response('[{"build":{"id":1}},{"build":{"id":2}}]');
    await expect(jsonUnwrapCodec.decode(r, { path: "$[*].build" }, ctx)).resolves.toEqual([{id:1},{id:2}]);
  });
  it("throws CodecError(transform) when path missing", async () => {
    const r = new Response('{"other":1}');
    await expect(jsonUnwrapCodec.decode(r, { path: "$.project" }, ctx)).rejects.toBeInstanceOf(CodecError);
  });
});
