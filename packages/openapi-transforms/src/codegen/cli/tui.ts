import { CLIMetadata, CLIActionMetadata, PickerConfig } from "./index";

const SECRET_FIELD_NAMES = new Set(["auth_token", "password", "authData.password"]);

function isSecretField(name: string): boolean {
  return SECRET_FIELD_NAMES.has(name);
}

export interface SpecInfoMap {
  [product: string]: { title: string; description: string; category?: string };
}

/** Parsed OpenAPI documents keyed by product, used to resolve $ref inside body schemas. */
export interface SpecDocMap {
  [product: string]: Record<string, unknown>;
}

function resolveRef(doc: Record<string, unknown> | undefined, ref: string): Record<string, unknown> | undefined {
  if (!doc || !ref.startsWith("#/")) return undefined;
  const parts = ref.slice(2).split("/");
  let cur: unknown = doc;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return (cur && typeof cur === "object") ? (cur as Record<string, unknown>) : undefined;
}

function resolveSchema(
  schema: Record<string, unknown> | undefined,
  doc: Record<string, unknown> | undefined,
  seen: Set<string> = new Set(),
): Record<string, unknown> | undefined {
  if (!schema) return undefined;
  if (typeof schema["$ref"] === "string") {
    const ref = schema["$ref"] as string;
    if (seen.has(ref)) return {};
    seen.add(ref);
    const resolved = resolveRef(doc, ref);
    return resolved ? resolveSchema(resolved, doc, seen) : {};
  }
  return schema;
}

const LABEL_ACRONYMS = new Set(["ci", "id", "url", "uuid", "api", "sdk", "xml", "json", "html", "css"]);

function toLabel(name: string): string {
  return name
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\./g, " › ")
    .replace(/\b\w+/g, w => LABEL_ACRONYMS.has(w.toLowerCase()) ? w.toUpperCase() : w.replace(/^\w/, c => c.toUpperCase()));
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
  picker?: PickerConfig;
  secret?: boolean;
}

interface TUIActionData {
  id: string;
  summary: string;
  description: string;
  section?: string;
  fields: TUIFieldData[];
}

interface TUIResourceData {
  id: string;
  label: string;
  actions: TUIActionData[];
  sectionOrder?: string[];
}

interface TUIProductData {
  id: string;
  title: string;
  description: string;
  category?: string;
  resources: TUIResourceData[];
}

function buildFields(actionMeta: CLIActionMetadata, doc: Record<string, unknown> | undefined): TUIFieldData[] {
  const fields: TUIFieldData[] = [];

  for (const p of actionMeta.parameters) {
    const schema = p.schema as Record<string, unknown> | undefined;
    const enumValues = Array.isArray(schema?.enum)
      ? (schema!.enum as unknown[]).map(String)
      : undefined;
    const desc = p.description || (schema?.description as string) || "";
    const picker = p.picker
      || ((schema && typeof schema["x-cli-picker"] === "object") ? schema["x-cli-picker"] as PickerConfig : undefined);
    fields.push({
      name: p.name,
      label: toLabel(p.name),
      description: desc,
      type: deriveFieldType(schema),
      required: p.required,
      location: p.in === "path" ? "path" : "query",
      enum: enumValues,
      picker,
      ...(isSecretField(p.name) ? { secret: true } : {}),
    });
  }

  const bodyContent = actionMeta.requestBody?.content;
  const rawBodySchema = (bodyContent?.["application/json"]?.schema
    ?? bodyContent?.["multipart/form-data"]?.schema
    ?? bodyContent?.["application/octet-stream"]?.schema) as
    | Record<string, unknown>
    | undefined;
  const bodySchema = resolveSchema(rawBodySchema, doc);
  if (bodySchema) {
    // Collect property schemas from the root, plus any oneOf/anyOf/allOf branches.
    // For oneOf/anyOf, fields are inherently optional (user fills one variant);
    // for allOf, the union of required fields applies.
    type PropEntry = { name: string; schema: Record<string, unknown>; required: boolean };
    const seen = new Map<string, PropEntry>();

    function ingest(schema: Record<string, unknown>, prefix: string, requiredCascade: boolean, depth: number) {
      if (depth > 8) return;
      const resolved = resolveSchema(schema, doc);
      if (!resolved) return;
      const properties = (resolved.properties || {}) as Record<string, Record<string, unknown>>;
      const required = (Array.isArray(resolved.required) ? resolved.required : []) as string[];
      for (const [propName, rawPropSchema] of Object.entries(properties)) {
        const propSchema = resolveSchema(rawPropSchema, doc) || rawPropSchema;
        const isReq = requiredCascade && required.includes(propName);
        const dotted = prefix ? `${prefix}.${propName}` : propName;

        // If the property is an object with its own properties, recurse and don't emit it as a leaf.
        // For arrays-of-objects, we keep them as scalar (user inputs JSON).
        const isObject = propSchema.type === "object" && propSchema.properties && Object.keys(propSchema.properties as object).length > 0;
        const hasAllOfObject = Array.isArray(propSchema.allOf) && (propSchema.allOf as Record<string, unknown>[]).some(s => {
          const r = resolveSchema(s, doc);
          return r && r.type === "object" && r.properties;
        });
        if (isObject || hasAllOfObject) {
          ingest(propSchema, dotted, isReq, depth + 1);
          continue;
        }

        const existing = seen.get(dotted);
        if (existing) {
          existing.required = existing.required || isReq;
        } else {
          seen.set(dotted, { name: dotted, schema: propSchema, required: isReq });
        }
      }
      // Recurse into allOf (required cascades through).
      if (Array.isArray(resolved.allOf)) {
        for (const sub of resolved.allOf as Record<string, unknown>[]) {
          ingest(sub, prefix, requiredCascade, depth + 1);
        }
      }
      // For oneOf / anyOf, fields are conditional — never required.
      if (Array.isArray(resolved.oneOf)) {
        for (const sub of resolved.oneOf as Record<string, unknown>[]) {
          ingest(sub, prefix, false, depth + 1);
        }
      }
      if (Array.isArray(resolved.anyOf)) {
        for (const sub of resolved.anyOf as Record<string, unknown>[]) {
          ingest(sub, prefix, false, depth + 1);
        }
      }
    }
    ingest(bodySchema, "", true, 0);

    for (const entry of seen.values()) {
      const enumValues = Array.isArray(entry.schema.enum)
        ? (entry.schema.enum as unknown[]).map(String)
        : undefined;
      const picker = (typeof entry.schema["x-cli-picker"] === "object")
        ? entry.schema["x-cli-picker"] as PickerConfig
        : undefined;
      fields.push({
        name: entry.name,
        label: toLabel(entry.name),
        description: (entry.schema.description as string) || "",
        type: deriveFieldType(entry.schema),
        required: entry.required,
        location: "body",
        enum: enumValues,
        picker,
        ...(isSecretField(entry.name) ? { secret: true } : {}),
      });
    }
  }

  return fields;
}

function buildManifest(metadata: CLIMetadata[], specInfoMap: SpecInfoMap, specDocMap: SpecDocMap = {}): TUIProductData[] {
  return metadata.map(m => {
    const info = specInfoMap[m.product] || { title: m.product, description: "" };
    const doc = specDocMap[m.product];
    const resources: TUIResourceData[] = Object.entries(m.resources).map(([resId, resMeta]) => {
      const actions: TUIActionData[] = Object.entries(resMeta.actions).map(([actionId, actionMeta]) => ({
        id: actionId,
        summary: actionMeta.summary || actionId,
        description: actionMeta.description || "",
        section: actionMeta.section,
        fields: buildFields(actionMeta, doc),
      }));
      return {
        id: resId,
        label: resId === "default" ? info.title : toLabel(resId),
        actions,
        sectionOrder: resMeta.sectionOrder,
      };
    });
    return {
      id: m.product,
      title: info.title,
      description: info.description,
      ...(info.category ? { category: info.category } : {}),
      resources,
    };
  });
}

function jsonStr(s: string): string {
  return JSON.stringify(s);
}

export function generateTUIManifestTS(metadata: CLIMetadata[], specInfoMap: SpecInfoMap, specDocMap: SpecDocMap = {}): string {
  const products = buildManifest(metadata, specInfoMap, specDocMap);
  let out = "/**\n * Generated TUI manifest. Do not modify.\n */\n\n";
  out += `import type { TUIProduct } from "./tui-types.js";\n\n`;
  out += `export const TUI_MANIFEST: TUIProduct[] = ${JSON.stringify(products, null, 2)};\n`;
  return out;
}

function goStringSlice(arr: string[]): string {
  if (arr.length === 0) return "nil";
  return `[]string{${arr.map(s => jsonStr(s)).join(", ")}}`;
}

function goPicker(p: PickerConfig | undefined, indent: string): string {
  if (!p) return "nil";
  const labelFields = p.labelFields ?? [];
  const filterBy = p.filterBy ?? [];
  return [
    `&PickerConfig{`,
    `${indent}\t\tSource:      ${jsonStr(p.source)},`,
    `${indent}\t\tValueField:  ${jsonStr(p.valueField)},`,
    `${indent}\t\tLabelFields: ${goStringSlice(labelFields)},`,
    `${indent}\t\tFilterBy:    ${goStringSlice(filterBy)},`,
    `${indent}\t}`,
  ].join("\n");
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
    `${indent}\tPicker:      ${goPicker(f.picker, indent)},`,
    `${indent}\tSecret:      ${f.secret ? "true" : "false"},`,
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
    `${indent}\tSection:     ${jsonStr(a.section ?? "")},`,
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
    `${indent}\tID:           ${jsonStr(r.id)},`,
    `${indent}\tLabel:        ${jsonStr(r.label)},`,
    `${indent}\tActions:      ${actionsStr},`,
    `${indent}\tSectionOrder: ${goStringSlice(r.sectionOrder ?? [])},`,
    `${indent}}`,
  ].join("\n");
}

export function generateTUIManifestGo(metadata: CLIMetadata[], specInfoMap: SpecInfoMap, specDocMap: SpecDocMap = {}): string {
  const products = buildManifest(metadata, specInfoMap, specDocMap);
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
    out += `\t\tCategory:    ${jsonStr(p.category ?? "")},\n`;
    out += `\t\tResources:   ${resourcesStr},\n`;
    out += `\t},\n`;
  }
  out += "}\n";
  return out;
}
