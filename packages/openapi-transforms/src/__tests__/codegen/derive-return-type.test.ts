import { describe, expect, it } from "vitest";
import { deriveReturnType } from "../../codegen/derive-return-type";
import type { OperationAnnotations } from "../../codegen/annotations";

function ann(responseCodec: string, responseCodecConfig: unknown = {}): OperationAnnotations {
  return {
    responseCodec,
    responseCodecConfig,
    requestCodec: "json",
    requestCodecConfig: {},
    custom: { response: false, request: false },
  };
}

describe("deriveReturnType", () => {
  it("applies $.foo against a { foo: T } shape", () => {
    expect(deriveReturnType(
      `operations["getX"]["responses"][200]["content"]["application/json"]`,
      ann("json-unwrap", { path: "$.foo" }),
    )).toBe(`(operations["getX"]["responses"][200]["content"]["application/json"] & Record<"foo", unknown>)["foo"]`);
  });
  it("applies $[*].bar against T[] shape as array of bar", () => {
    expect(deriveReturnType(
      `operations["getX"]["responses"][200]["content"]["application/json"]`,
      ann("json-unwrap", { path: "$[*].bar" }),
    )).toBe(`Array<(operations["getX"]["responses"][200]["content"]["application/json"][number] & Record<"bar", unknown>)["bar"]>`);
  });
  it("returns base type for json codec", () => {
    expect(deriveReturnType(
      `operations["getX"]["responses"][200]["content"]["application/json"]`,
      ann("json"),
    )).toBe(`operations["getX"]["responses"][200]["content"]["application/json"]`);
  });
  it("uses `string` for text, `ArrayBuffer` for binary default", () => {
    expect(deriveReturnType("X", ann("text"))).toBe("string");
    expect(deriveReturnType("X", ann("binary"))).toBe("ArrayBuffer");
    expect(deriveReturnType("X", ann("binary", { as: "blob" }))).toBe("Blob");
  });
});
