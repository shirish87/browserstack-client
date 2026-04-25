import { describe, expect, it } from "vitest";
import { parsePath } from "../../path/parser";

describe("parsePath", () => {
  it("parses root", () => {
    expect(parsePath("$")).toEqual([{ kind: "root" }]);
  });
  it("parses .foo", () => {
    expect(parsePath("$.foo")).toEqual([
      { kind: "root" }, { kind: "field", name: "foo" },
    ]);
  });
  it("parses nested fields", () => {
    expect(parsePath("$.foo.bar")).toEqual([
      { kind: "root" }, { kind: "field", name: "foo" }, { kind: "field", name: "bar" },
    ]);
  });
  it("parses [*]", () => {
    expect(parsePath("$[*]")).toEqual([{ kind: "root" }, { kind: "wildcard" }]);
  });
  it("parses [N]", () => {
    expect(parsePath("$[3]")).toEqual([{ kind: "root" }, { kind: "index", index: 3 }]);
  });
  it("parses mixed", () => {
    expect(parsePath("$.items[*].id")).toEqual([
      { kind: "root" }, { kind: "field", name: "items" }, { kind: "wildcard" }, { kind: "field", name: "id" },
    ]);
  });
  it("rejects empty path", () => {
    expect(() => parsePath("")).toThrow(/must start with \$/);
  });
  it("rejects filter/recursive/slice", () => {
    expect(() => parsePath("$..foo")).toThrow(/unsupported/i);
    expect(() => parsePath("$[?(@.x)]")).toThrow(/unsupported/i);
    expect(() => parsePath("$[0:2]")).toThrow(/unsupported/i);
  });
});
