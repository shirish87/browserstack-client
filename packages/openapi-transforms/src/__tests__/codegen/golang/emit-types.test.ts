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

  it("throws on nested inline type:object fields", () => {
    expect(() =>
      emitGoTypes("automate", {
        Build: {
          type: "object",
          properties: {
            meta: { type: "object" },
          },
        },
      })
    ).toThrow('[go-codegen] Schema "Build" field "meta": inline type:object');
  });

  it("emits map[string]T for type:object with additionalProperties", () => {
    const result = emitGoTypes("automate", {
      Build: {
        type: "object",
        properties: {
          meta: { type: "object", additionalProperties: { type: "string" } },
        },
      },
    });
    expect(result).toContain('Meta map[string]string `json:"meta"`');
  });

  it("emits correct package declaration", () => {
    const result = emitGoTypes("test-management", {});
    expect(result.trimStart()).toMatch(/^package testmanagement/);
  });

  it("flattens allOf $ref into struct fields", () => {
    const result = emitGoTypes("automate", {
      Browser: {
        type: "object",
        required: ["browser", "browser_version"],
        properties: {
          browser: { type: "string" },
          browser_version: { type: "string" },
        },
      },
      BrowserPlatform: {
        allOf: [
          { $ref: "#/components/schemas/Browser" },
          {
            type: "object",
            required: ["os", "os_version"],
            properties: {
              os: { type: "string" },
              os_version: { type: "string" },
              device: { type: "string" },
            },
          },
        ],
      },
    });
    expect(result).toContain('Browser string `json:"browser"`');
    expect(result).toContain('BrowserVersion string `json:"browser_version"`');
    expect(result).toContain('Os string `json:"os"`');
    expect(result).toContain('Device *string `json:"device"`');
  });
});
