import { describe, expect, it } from "vitest";
import { parsePath } from "../../path/parser";
import { extract, isArrayPath } from "../../path/matcher";

describe("extract", () => {
  it("$ returns whole value", () => {
    expect(extract(parsePath("$"), { a: 1 })).toEqual({ a: 1 });
  });
  it("$.foo extracts field", () => {
    expect(extract(parsePath("$.foo"), { foo: 42 })).toBe(42);
  });
  it("$[*] maps array", () => {
    expect(extract(parsePath("$[*]"), [1, 2, 3])).toEqual([1, 2, 3]);
  });
  it("$[*].x maps over field", () => {
    expect(extract(parsePath("$[*].x"), [{ x: 1 }, { x: 2 }])).toEqual([1, 2]);
  });
  it("$.items[*].id on nested", () => {
    expect(extract(parsePath("$.items[*].id"), { items: [{ id: "a" }, { id: "b" }] })).toEqual(["a", "b"]);
  });
  it("[N] returns index", () => {
    expect(extract(parsePath("$[2]"), [10, 20, 30])).toBe(30);
  });
  it("throws when intermediate field missing", () => {
    expect(() => extract(parsePath("$.a.b"), { a: null })).toThrow();
  });
});

describe("isArrayPath", () => {
  it("true when wildcard present", () => {
    expect(isArrayPath(parsePath("$[*]"))).toBe(true);
    expect(isArrayPath(parsePath("$.a[*]"))).toBe(true);
  });
  it("false when only root/field/index", () => {
    expect(isArrayPath(parsePath("$.a.b"))).toBe(false);
    expect(isArrayPath(parsePath("$[0]"))).toBe(false);
  });
});
