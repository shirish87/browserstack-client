import yaml from "yaml";
import fs from "node:fs/promises";

export interface OperationOverrides {
  // Stored as snake_case_wire → camelCasePublic (matches YAML sidecar convention).
  // Inverted to camelCasePublic → snake_case_wire at emit time before passing to toSnakeCase.
  request?: Record<string, string>;
  // snake_case_wire → camelCasePublic (used as-is by toCamelCase)
  response?: Record<string, string>;
}

export type FieldOverrides = Record<string, OperationOverrides>;

interface SidecarDoc {
  overrides?: Record<string, OperationOverrides>;
}

export async function loadFieldOverrides(path: string): Promise<FieldOverrides> {
  let raw: string;
  try {
    raw = await fs.readFile(path, "utf8");
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw err;
  }
  const doc = yaml.parse(raw) as SidecarDoc;
  return doc?.overrides ?? {};
}
