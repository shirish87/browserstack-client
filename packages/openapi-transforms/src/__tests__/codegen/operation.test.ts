import { describe, expect, it } from "vitest";
import {
  toPascalCase,
  stripOperationPrefix,
  toActionSlug,
  toCLIAction,
  isArrayList,
  OPERATION_ID_PREFIX,
} from "../../codegen/shared/operation";

describe("toPascalCase", () => {
  it("converts hyphen-separated words", () => {
    expect(toPascalCase("app-automate")).toBe("AppAutomate");
  });
  it("converts underscore-separated words", () => {
    expect(toPascalCase("test_management")).toBe("TestManagement");
  });
  it("converts dot-separated words", () => {
    expect(toPascalCase("test.reporting")).toBe("TestReporting");
  });
  it("handles a single word", () => {
    expect(toPascalCase("automate")).toBe("Automate");
  });
  it("handles already-PascalCase input", () => {
    expect(toPascalCase("AutomateClient")).toBe("AutomateClient");
  });
  it("collapses multiple separators", () => {
    expect(toPascalCase("a--b")).toBe("AB");
  });
});

describe("stripOperationPrefix", () => {
  it("strips the product prefix from an operationId", () => {
    expect(stripOperationPrefix("getAutomateBrowsers", "automate")).toBe("getBrowsers");
  });
  it("strips multi-word product prefix", () => {
    expect(stripOperationPrefix("bulkDeleteTestManagementTestCases", "test-management")).toBe("bulkDeleteTestCases");
  });
  it("returns operationId unchanged for unknown product", () => {
    expect(stripOperationPrefix("getX", "unknown-product")).toBe("getX");
  });
  it("returns operationId unchanged when prefix not found in id", () => {
    expect(stripOperationPrefix("getBuilds", "automate")).toBe("getBuilds");
  });
  it("does not strip when rest part is empty", () => {
    expect(stripOperationPrefix("Automate", "automate")).toBe("Automate");
  });
  it("covers all known products in OPERATION_ID_PREFIX", () => {
    expect(Object.keys(OPERATION_ID_PREFIX).length).toBeGreaterThan(0);
    for (const [product, prefix] of Object.entries(OPERATION_ID_PREFIX)) {
      const operationId = `get${prefix}Thing`;
      const result = stripOperationPrefix(operationId, product);
      expect(result).toBe("getThing");
    }
  });
});

describe("toActionSlug", () => {
  it("converts camelCase method name to kebab-case slug", () => {
    expect(toActionSlug("getBrowsers")).toBe("get-browsers");
  });
  it("handles consecutive uppercase (acronyms)", () => {
    expect(toActionSlug("getSessionAppiumLogs")).toBe("get-session-appium-logs");
  });
  it("lowercases the whole result", () => {
    expect(toActionSlug("ListBuilds")).toBe("list-builds");
  });
});

describe("toCLIAction", () => {
  it("maps get-*s to list-*", () => {
    expect(toCLIAction("getBuilds")).toBe("list-builds");
  });
  it("maps get-* returning an array to list-*", () => {
    expect(toCLIAction("getSession", { type: "array" })).toBe("list-session");
  });
  it("keeps non-get verbs unchanged", () => {
    expect(toCLIAction("deleteBuild")).toBe("delete-build");
    expect(toCLIAction("updateSession")).toBe("update-session");
  });
  it("keeps singular get-* that returns non-array", () => {
    expect(toCLIAction("getBuild")).toBe("get-build");
  });
});

describe("isArrayList", () => {
  it("returns true for type:array schema", () => {
    expect(isArrayList({ type: "array" })).toBe(true);
  });
  it("returns false for type:object schema", () => {
    expect(isArrayList({ type: "object" })).toBe(false);
  });
  it("returns false for non-object", () => {
    expect(isArrayList(null)).toBe(false);
    expect(isArrayList("string")).toBe(false);
    expect(isArrayList(undefined)).toBe(false);
  });
  it("returns true for oneOf containing an array type", () => {
    expect(isArrayList({ oneOf: [{ type: "object" }, { type: "array" }] })).toBe(true);
  });
  it("returns true for anyOf containing an array type", () => {
    expect(isArrayList({ anyOf: [{ type: "array" }] })).toBe(true);
  });
  it("returns false for oneOf with no array types", () => {
    expect(isArrayList({ oneOf: [{ type: "object" }, { type: "string" }] })).toBe(false);
  });
});
