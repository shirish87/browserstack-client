import { describe, it, expect } from "vitest";
import { toCamelCase, toSnakeCase } from "../../transforms/case";

describe("toSnakeCase", () => {
  it("converts camelCase keys to snake_case", () => {
    expect(toSnakeCase({ fileName: "foo.txt", customId: "abc" }))
      .toEqual({ file_name: "foo.txt", custom_id: "abc" });
  });

  it("recurses into nested objects", () => {
    expect(toSnakeCase({ buildInfo: { buildName: "my build" } }))
      .toEqual({ build_info: { build_name: "my build" } });
  });

  it("recurses into arrays", () => {
    expect(toSnakeCase([{ buildName: "a" }, { buildName: "b" }]))
      .toEqual([{ build_name: "a" }, { build_name: "b" }]);
  });

  it("leaves non-object values untouched", () => {
    expect(toSnakeCase("hello")).toBe("hello");
    expect(toSnakeCase(42)).toBe(42);
    expect(toSnakeCase(null)).toBe(null);
  });

  it("leaves already-snake_case keys unchanged", () => {
    expect(toSnakeCase({ file_name: "foo" })).toEqual({ file_name: "foo" });
  });
});

describe("toCamelCase", () => {
  it("converts snake_case keys to camelCase", () => {
    expect(toCamelCase({ file_name: "foo.txt", custom_id: "abc" }))
      .toEqual({ fileName: "foo.txt", customId: "abc" });
  });

  it("recurses into nested objects", () => {
    expect(toCamelCase({ build_info: { build_name: "my build" } }))
      .toEqual({ buildInfo: { buildName: "my build" } });
  });

  it("recurses into arrays", () => {
    expect(toCamelCase([{ build_name: "a" }, { build_name: "b" }]))
      .toEqual([{ buildName: "a" }, { buildName: "b" }]);
  });

  it("leaves non-object values untouched", () => {
    expect(toCamelCase("hello")).toBe("hello");
    expect(toCamelCase(42)).toBe(42);
    expect(toCamelCase(null)).toBe(null);
  });
});

describe("toSnakeCase with overrides", () => {
  it("uses override map instead of default conversion", () => {
    expect(toSnakeCase({ appId: "abc" }, { appId: "custom_id" }))
      .toEqual({ custom_id: "abc" });
  });
});

describe("toCamelCase with overrides", () => {
  it("uses override map for matching keys", () => {
    expect(toCamelCase({ automation_build: { id: "x" } }, { automation_build: "build" }))
      .toEqual({ build: { id: "x" } });
  });
});
