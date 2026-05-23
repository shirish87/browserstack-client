import { CLIMetadata, CLIActionMetadata } from "./index";

export interface SpecInfoMap {
  [product: string]: { title: string; description: string };
}

function toLabel(name: string): string {
  return name.replace(/-/g, " ").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function deriveFieldType(schema: Record<string, unknown> | undefined): string {
  if (!schema) return "string";
  if (schema.format === "binary") return "file";
  if (schema.type === "boolean") return "boolean";
  if (schema.type === "integer" || schema.type === "number") return "number";
  return "string";
}

interface TUIFieldData {
  name: string;
  label: string;
  description: string;
  type: string;
  required: boolean;
  location: string;
  enum?: string[];
}

interface TUIActionData {
  id: string;
  summary: string;
  description: string;
  fields: TUIFieldData[];
}

interface TUIResourceData {
  id: string;
  label: string;
  actions: TUIActionData[];
}

interface TUIProductData {
  id: string;
  title: string;
  description: string;
  resources: TUIResourceData[];
}

function buildFields(actionMeta: CLIActionMetadata): TUIFieldData[] {
  const fields: TUIFieldData[] = [];

  for (const p of actionMeta.parameters) {
    const schema = p.schema as Record<string, unknown> | undefined;
    const enumValues = Array.isArray(schema?.enum)
      ? (schema!.enum as unknown[]).map(String)
      : undefined;
    fields.push({
      name: p.name,
      label: toLabel(p.name),
      description: (schema?.description as string) || "",
      type: deriveFieldType(schema),
      required: p.required,
      location: p.in === "path" ? "path" : "query",
      enum: enumValues,
    });
  }

  const bodySchema = actionMeta.requestBody?.content?.["application/json"]?.schema as
    | Record<string, unknown>
    | undefined;
  if (bodySchema) {
    const properties = (bodySchema.properties || {}) as Record<string, Record<string, unknown>>;
    const requiredFields = (Array.isArray(bodySchema.required) ? bodySchema.required : []) as string[];
    for (const [propName, propSchema] of Object.entries(properties)) {
      const enumValues = Array.isArray(propSchema.enum)
        ? (propSchema.enum as unknown[]).map(String)
        : undefined;
      fields.push({
        name: propName,
        label: toLabel(propName),
        description: (propSchema.description as string) || "",
        type: deriveFieldType(propSchema),
        required: requiredFields.includes(propName),
        location: "body",
        enum: enumValues,
      });
    }
  }

  return fields;
}

function buildManifest(metadata: CLIMetadata[], specInfoMap: SpecInfoMap): TUIProductData[] {
  return metadata.map(m => {
    const info = specInfoMap[m.product] || { title: m.product, description: "" };
    const resources: TUIResourceData[] = Object.entries(m.resources).map(([resId, resMeta]) => {
      const actions: TUIActionData[] = Object.entries(resMeta.actions).map(([actionId, actionMeta]) => ({
        id: actionId,
        summary: actionMeta.summary || actionId,
        description: actionMeta.description || "",
        fields: buildFields(actionMeta),
      }));
      return {
        id: resId,
        label: resId === "default" ? info.title : toLabel(resId),
        actions,
      };
    });
    return {
      id: m.product,
      title: info.title,
      description: info.description,
      resources,
    };
  });
}

function jsonStr(s: string): string {
  return JSON.stringify(s);
}

export function generateTUIManifestTS(metadata: CLIMetadata[], specInfoMap: SpecInfoMap): string {
  const products = buildManifest(metadata, specInfoMap);
  let out = "/**\n * Generated TUI manifest. Do not modify.\n */\n\n";
  out += `import type { TUIProduct } from "./tui-types.js";\n\n`;
  out += `export const TUI_MANIFEST: TUIProduct[] = ${JSON.stringify(products, null, 2)};\n`;
  return out;
}

function goStringSlice(arr: string[]): string {
  if (arr.length === 0) return "nil";
  return `[]string{${arr.map(s => jsonStr(s)).join(", ")}}`;
}

function goField(f: TUIFieldData, indent: string): string {
  const lines = [
    `${indent}{`,
    `${indent}\tName:        ${jsonStr(f.name)},`,
    `${indent}\tLabel:       ${jsonStr(f.label)},`,
    `${indent}\tDescription: ${jsonStr(f.description)},`,
    `${indent}\tType:        "${f.type}",`,
    `${indent}\tRequired:    ${f.required},`,
    `${indent}\tLocation:    "${f.location}",`,
    `${indent}\tEnum:        ${goStringSlice(f.enum ?? [])},`,
    `${indent}}`,
  ];
  return lines.join("\n");
}

function goAction(a: TUIActionData, indent: string): string {
  const fieldsStr = a.fields.length === 0
    ? "nil"
    : `[]Field{\n${a.fields.map(f => goField(f, indent + "\t\t")).join(",\n")},\n${indent}\t}`;
  return [
    `${indent}{`,
    `${indent}\tID:          ${jsonStr(a.id)},`,
    `${indent}\tSummary:     ${jsonStr(a.summary)},`,
    `${indent}\tDescription: ${jsonStr(a.description)},`,
    `${indent}\tFields:      ${fieldsStr},`,
    `${indent}}`,
  ].join("\n");
}

function goResource(r: TUIResourceData, indent: string): string {
  const actionsStr = r.actions.length === 0
    ? "nil"
    : `[]Action{\n${r.actions.map(a => goAction(a, indent + "\t\t")).join(",\n")},\n${indent}\t}`;
  return [
    `${indent}{`,
    `${indent}\tID:      ${jsonStr(r.id)},`,
    `${indent}\tLabel:   ${jsonStr(r.label)},`,
    `${indent}\tActions: ${actionsStr},`,
    `${indent}}`,
  ].join("\n");
}

export function generateTUIManifestGo(metadata: CLIMetadata[], specInfoMap: SpecInfoMap): string {
  const products = buildManifest(metadata, specInfoMap);
  let out = "// Code generated by build.mjs. Do not edit.\n\n";
  out += "package tui\n\n";
  out += "// Manifest is the full product → resource → action → fields tree.\n";
  out += "var Manifest = []Product{\n";
  for (const p of products) {
    const resourcesStr = p.resources.length === 0
      ? "nil"
      : `[]Resource{\n${p.resources.map(r => goResource(r, "\t\t")).join(",\n")},\n\t}`;
    out += `\t{\n`;
    out += `\t\tID:          ${jsonStr(p.id)},\n`;
    out += `\t\tTitle:       ${jsonStr(p.title)},\n`;
    out += `\t\tDescription: ${jsonStr(p.description)},\n`;
    out += `\t\tResources:   ${resourcesStr},\n`;
    out += `\t},\n`;
  }
  out += "}\n";
  return out;
}
