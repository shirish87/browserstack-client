import { describe, expect, it } from "vitest";
import { flatten } from "../pickers.ts";

describe("flatten", () => {
  it("returns flat array as-is", () => {
    const input = [{ id: 1, name: "A" }, { id: 2, name: "B" }];
    expect(flatten(input)).toEqual(input);
  });

  it("unwraps projects list wrapper", () => {
    const input = { projects: [{ id: 10 }, { id: 20 }] };
    expect(flatten(input)).toEqual([{ id: 10 }, { id: 20 }]);
  });

  it("unwraps builds list wrapper", () => {
    const input = { builds: [{ id: "abc" }, { id: "def" }] };
    expect(flatten(input)).toEqual([{ id: "abc" }, { id: "def" }]);
  });

  it("unwraps reports list wrapper", () => {
    const input = { reports: [{ id: 1 }, { id: 2 }, { id: 3 }] };
    expect(flatten(input)).toHaveLength(3);
  });

  it("unwraps scans list wrapper", () => {
    const input = { scans: [{ id: 5 }] };
    expect(flatten(input)).toEqual([{ id: 5 }]);
  });

  it("unwraps scan_runs list wrapper", () => {
    const input = { scan_runs: [{ id: 7 }, { id: 8 }] };
    expect(flatten(input)).toHaveLength(2);
  });

  it("unwraps testCases list wrapper", () => {
    const input = { testCases: [{ id: 100 }] };
    expect(flatten(input)).toEqual([{ id: 100 }]);
  });

  it("recurses into data object to find nested list wrapper", () => {
    // website-scanner: {data:{projects:[...]}}
    const input = { data: { projects: [{ id: 1 }, { id: 2 }] } };
    expect(flatten(input)).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("unwraps per-item automation_build envelope via itemPath", () => {
    const input = [
      { automation_build: { hashed_id: "abc", name: "Build 1" } },
      { automation_build: { hashed_id: "def", name: "Build 2" } },
    ];
    const result = flatten(input, "automation_build");
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ hashed_id: "abc", name: "Build 1" });
    expect(result[1]).toEqual({ hashed_id: "def", name: "Build 2" });
  });

  it("unwraps per-item automation_session envelope via itemPath", () => {
    const input = [
      { automation_session: { hashed_id: "s1", status: "done" } },
      { automation_session: { hashed_id: "s2", status: "running" } },
    ];
    const result = flatten(input, "automation_session");
    expect(result).toHaveLength(2);
    expect(result[0].hashed_id).toBe("s1");
  });

  it("does not unwrap per-item envelope when itemPath is empty", () => {
    const input = [{ automation_build: { hashed_id: "abc" } }];
    const result = flatten(input);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("automation_build");
  });

  it("returns single object as one-item array", () => {
    const input = { id: 42, name: "Thing" };
    expect(flatten(input)).toEqual([{ id: 42, name: "Thing" }]);
  });

  it("returns empty array for null/undefined", () => {
    expect(flatten(null)).toEqual([]);
    expect(flatten(undefined)).toEqual([]);
  });
});
