import { describe, expect, it } from "vitest";
import { emitGoTypes } from "../../../codegen/golang/emit-types";

describe("emitGoTypes", () => {
  it("emits a struct with all-optional fields", () => {
    const result = emitGoTypes("automate", {
      Build: {
        type: "object",
        properties: {
          name: { type: "string" },
          duration: { type: "integer" },
        },
      },
    });
    expect(result).toContain("type Build struct {");
    expect(result).toContain('Name *string `json:"name"`');
    expect(result).toContain('Duration *int `json:"duration"`');
  });

  it("emits non-pointer fields for required properties", () => {
    const result = emitGoTypes("automate", {
      Build: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          duration: { type: "integer" },
        },
      },
    });
    expect(result).toContain('Name string `json:"name"`');
    expect(result).toContain('Duration *int `json:"duration"`');
  });

  it("emits boolean fields as *bool", () => {
    const result = emitGoTypes("automate", {
      Session: {
        type: "object",
        properties: {
          is_running: { type: "boolean" },
        },
      },
    });
    expect(result).toContain('IsRunning *bool `json:"is_running"`');
  });

  it("emits array fields as slices", () => {
    const result = emitGoTypes("automate", {
      Project: {
        type: "object",
        properties: {
          tags: { type: "array", items: { type: "string" } },
        },
      },
    });
    expect(result).toContain('Tags []string `json:"tags"`');
  });

  it("emits nested object fields as map[string]any", () => {
    const result = emitGoTypes("automate", {
      Build: {
        type: "object",
        properties: {
          meta: { type: "object" },
        },
      },
    });
    expect(result).toContain('Meta map[string]any `json:"meta"`');
  });

  it("emits correct package declaration", () => {
    const result = emitGoTypes("test-management", {});
    expect(result.trimStart()).toMatch(/^package management/);
  });
});
