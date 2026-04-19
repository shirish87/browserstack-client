import { describe, it, expect } from "vitest";
import { loadFieldOverrides } from "../../codegen/field-overrides";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("loadFieldOverrides", () => {
  it("returns empty overrides when file does not exist", async () => {
    const result = await loadFieldOverrides("/nonexistent/path.yaml");
    expect(result).toEqual({});
  });

  it("parses overrides from YAML file", async () => {
    const dir = await mkdtemp(join(tmpdir(), "overrides-"));
    const file = join(dir, "overrides.yaml");
    await writeFile(file, `overrides:\n  getBuilds:\n    response:\n      automation_build: build\n`);
    const result = await loadFieldOverrides(file);
    expect(result).toEqual({ getBuilds: { response: { automation_build: "build" } } });
    await rm(dir, { recursive: true });
  });

  it("returns empty overrides when overrides key is empty", async () => {
    const dir = await mkdtemp(join(tmpdir(), "overrides-"));
    const file = join(dir, "overrides.yaml");
    await writeFile(file, `overrides: {}\n`);
    const result = await loadFieldOverrides(file);
    expect(result).toEqual({});
    await rm(dir, { recursive: true });
  });
});
