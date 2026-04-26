import { describe, expect, it } from "vitest";
import { deriveReturnType } from "../../codegen/typescript/derive-return-type";
import type { OperationAnnotations } from "../../codegen/typescript/annotations";

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
    const result = deriveReturnType(
      `operations["getX"]["responses"][200]["content"]["application/json"]`,
      ann("json-unwrap", { path: "$.foo" }),
      "getX",
    );
    expect(result.type).toBe(`(operations["getX"]["responses"][200]["content"]["application/json"] & Record<"foo", unknown>)["foo"]`);
    expect(result.aliases).toEqual([]);
  });
  it("applies $[*].bar against T[] shape as array of bar — emits named element+list aliases", () => {
    const result = deriveReturnType(
      `operations["getX"]["responses"][200]["content"]["application/json"]`,
      ann("json-unwrap", { path: "$[*].bar" }),
      "getX",
    );
    expect(result.type).toBe(`GetXResult`);
    // element alias + list alias
    expect(result.aliases.length).toBeGreaterThanOrEqual(2);
    expect(result.aliases.some((a) => a.includes("GetXResultItem"))).toBe(true);
    expect(result.aliases.some((a) => a.includes("GetXResult ="))).toBe(true);
  });
  it("returns base type for json codec", () => {
    const result = deriveReturnType(
      `operations["getX"]["responses"][200]["content"]["application/json"]`,
      ann("json"),
      "getX",
    );
    expect(result.type).toBe(`operations["getX"]["responses"][200]["content"]["application/json"]`);
    expect(result.aliases).toEqual([]);
  });
  it("uses `string` for text, `ArrayBuffer` for binary default", () => {
    expect(deriveReturnType("X", ann("text"), "getX").type).toBe("string");
    expect(deriveReturnType("X", ann("binary"), "getX").type).toBe("ArrayBuffer");
    expect(deriveReturnType("X", ann("binary", { as: "blob" }), "getX").type).toBe("Blob");
  });
});
