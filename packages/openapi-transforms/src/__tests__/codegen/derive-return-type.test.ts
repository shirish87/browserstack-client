import { describe, expect, it } from "vitest";
import { deriveReturnType } from "../../codegen/derive-return-type.js";

describe("deriveReturnType", () => {
  it("applies $.foo against a { foo: T } shape", () => {
    expect(deriveReturnType(
      `operations["getX"]["responses"][200]["content"]["application/json"]`,
      { responseCodec: "json-unwrap", responseCodecConfig: { path: "$.foo" } } as any,
    )).toBe(`operations["getX"]["responses"][200]["content"]["application/json"]["foo"]`);
  });
  it("applies $[*].bar against T[] shape as array of bar", () => {
    expect(deriveReturnType(
      `operations["getX"]["responses"][200]["content"]["application/json"]`,
      { responseCodec: "json-unwrap", responseCodecConfig: { path: "$[*].bar" } } as any,
    )).toBe(`Array<operations["getX"]["responses"][200]["content"]["application/json"][number]["bar"]>`);
  });
  it("returns base type for json codec", () => {
    expect(deriveReturnType(
      `operations["getX"]["responses"][200]["content"]["application/json"]`,
      { responseCodec: "json", responseCodecConfig: {} } as any,
    )).toBe(`operations["getX"]["responses"][200]["content"]["application/json"]`);
  });
  it("uses `string` for text, `ArrayBuffer` for binary default", () => {
    expect(deriveReturnType("X", { responseCodec: "text", responseCodecConfig: {} } as any)).toBe("string");
    expect(deriveReturnType("X", { responseCodec: "binary", responseCodecConfig: {} } as any)).toBe("ArrayBuffer");
    expect(deriveReturnType("X", { responseCodec: "binary", responseCodecConfig: { as: "blob" } } as any)).toBe("Blob");
  });
});
