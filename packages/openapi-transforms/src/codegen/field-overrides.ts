import yaml from "yaml";
import fs from "node:fs/promises";

export interface OperationOverrides {
  request?: Record<string, string>;  // snake_case_wire → camelCasePublic
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
  } catch {
    return {};
  }
  const doc = yaml.parse(raw) as SidecarDoc;
  return doc?.overrides ?? {};
}
