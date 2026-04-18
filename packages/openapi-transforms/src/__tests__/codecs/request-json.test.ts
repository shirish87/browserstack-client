import { describe, expect, it } from "vitest";
import { jsonRequestCodec } from "../../codecs/request-json.js";

describe("jsonRequestCodec", () => {
  it("stringifies input with JSON content-type", () => {
    const r = jsonRequestCodec.encode({ a: 1 }, {});
    expect(r.body).toBe('{"a":1}');
    expect(r.headers!["content-type"]).toBe("application/json");
  });
});
