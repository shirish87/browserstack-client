import { toPascalCase, toGoPackageName } from "./case";

interface SchemaProperty {
  type?: string;
  title?: string;
  items?: { type?: string; $ref?: string };
  $ref?: string;
  additionalProperties?: { type?: string; $ref?: string; items?: { type?: string; $ref?: string } } | boolean;
}

interface SchemaObject {
  type?: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  allOf?: Array<{ $ref?: string; type?: string; properties?: Record<string, SchemaProperty>; required?: string[] }>;
  items?: { type?: string; $ref?: string; title?: string; properties?: Record<string, SchemaProperty> };
  _baseEmbed?: string;
}

type Schemas = Record<string, SchemaObject>;

function primitiveGoType(type: string | undefined, ptr: string): string | undefined {
  switch (type) {
    case "string":  return `${ptr}string`;
    case "integer": return `${ptr}int`;
    case "number":  return `${ptr}float64`;
    case "boolean": return `${ptr}bool`;
    default:        return undefined;
  }
}

function arrayItemGoType(
  items: SchemaProperty["items"],
  knownTypes: Set<string>,
  schemaName: string,
  fieldName: string
): string {
  if (items?.$ref) {
    const name = toPascalCase(items.$ref.replace(/^.*\//, ""));
    if (!knownTypes.has(name)) throw new Error(`[go-codegen] Schema "${schemaName}" field "${fieldName}": array items $ref "${items.$ref}" not found in known schemas.`);
    return name;
  }
  return primitiveGoType(items?.type, "") ?? "any";
}

function additionalPropsGoType(
  addlProps: NonNullable<SchemaProperty["additionalProperties"]>,
  knownTypes: Set<string>,
  schemaName: string,
  fieldName: string
): string {
  if (addlProps === true || (typeof addlProps === "object" && Object.keys(addlProps).length === 0)) {
    return "json.RawMessage";
  }
  if (typeof addlProps !== "object") return "any";

  let valType = "any";
  if (addlProps.$ref) {
    const name = toPascalCase(addlProps.$ref.replace(/^.*\//, ""));
    if (!knownTypes.has(name)) throw new Error(`[go-codegen] Schema "${schemaName}" field "${fieldName}": additionalProperties $ref "${addlProps.$ref}" not found in known schemas.`);
    valType = name;
  } else if (addlProps.type === "array" && addlProps.items) {
    if (addlProps.items.$ref) {
      const name = toPascalCase(addlProps.items.$ref.replace(/^.*\//, ""));
      if (!knownTypes.has(name)) throw new Error(`[go-codegen] Schema "${schemaName}" field "${fieldName}": additionalProperties items $ref "${addlProps.items.$ref}" not found in known schemas.`);
      valType = `[]${name}`;
    } else {
      valType = primitiveGoType(addlProps.items.type, "[]") ?? "[]any";
    }
  } else {
    valType = primitiveGoType(addlProps.type, "") ?? "any";
  }
  return `map[string]${valType}`;
}

function goType(prop: SchemaProperty, required: boolean, knownTypes: Set<string>, schemaName: string, fieldName: string): string {
  const ptr = required ? "" : "*";
  if (prop.$ref) {
    const name = toPascalCase(prop.$ref.replace(/^.*\//, ""));
    if (knownTypes.has(name)) {
      return `${ptr}${name}`;
    }
    throw new Error(`[go-codegen] Schema "${schemaName}" field "${fieldName}": $ref "${prop.$ref}" not found in known schemas. Define the schema or move it to shared.yml.`);
  }
  const prim = primitiveGoType(prop.type, ptr);
  if (prim !== undefined) return prim;
  switch (prop.type) {
    case "array": {
      const goItem = arrayItemGoType(prop.items, knownTypes, schemaName, fieldName);
      return `[]${goItem}`;
    }
    case "object": {
      if (prop.title) {
        const name = toPascalCase(prop.title);
        if (knownTypes.has(name)) return `${ptr}${name}`;
      }
      const addlProps = prop.additionalProperties;
      if (addlProps !== undefined) {
        return additionalPropsGoType(addlProps, knownTypes, schemaName, fieldName);
      }
      throw new Error(`[go-codegen] Schema "${schemaName}" field "${fieldName}": inline type:object has no named $ref and no additionalProperties. Extract it to a named schema.`);
    }
    default:
      throw new Error(`[go-codegen] Schema "${schemaName}" field "${fieldName}": unresolvable type "${prop.type ?? "unknown"}".`);
  }
}

function mergeAllOf(schema: SchemaObject, schemas?: Schemas): SchemaObject {
  if (!schema.allOf) return schema;
  const merged: SchemaObject = { type: "object", properties: {}, required: [] };
  for (const part of schema.allOf) {
    // Resolve $ref parts so their fields are flattened in.
    const resolved = (part.$ref && schemas)
      ? schemas[part.$ref.replace(/^.*\//, "")] ?? part
      : part;
    if (resolved.properties) {
      Object.assign(merged.properties!, resolved.properties);
    }
    if (resolved.required) {
      merged.required!.push(...resolved.required);
    }
  }
  if (schema.properties) Object.assign(merged.properties!, schema.properties);
  if (schema.required) merged.required!.push(...schema.required);
  return merged;
}

function emitStruct(name: string, rawSchema: SchemaObject, knownTypes: Set<string>, schemas?: Schemas): string {
  const schema = mergeAllOf(rawSchema, schemas);
  const required = new Set(schema.required ?? []);
  const fields: string[] = [];
  if (rawSchema._baseEmbed) {
    fields.push(`\t${rawSchema._baseEmbed}`);
  }
  for (const [fieldName, prop] of Object.entries(schema.properties ?? {})) {
    const goName = toPascalCase(fieldName).replace(/[^a-zA-Z0-9_]/g, "");
    const isRequired = required.has(fieldName);
    const typ = goType(prop, isRequired, knownTypes, name, fieldName);
    fields.push(`\t${goName} ${typ} \`json:"${fieldName}"\``);
  }
  return `type ${toPascalCase(name)} struct {\n${fields.join("\n")}\n}`;
}

function primitiveElemType(type: string | undefined): string {
  return primitiveGoType(type, "") ?? "any";
}

function emitArrayAlias(name: string, schema: SchemaObject, knownTypes: Set<string>): string {
  const itemSchema = schema.items;
  let elemType = "any";
  if (itemSchema?.$ref) {
    const refName = toPascalCase(itemSchema.$ref.replace(/^.*\//, ""));
    if (!knownTypes.has(refName)) throw new Error(`[go-codegen] Array schema "${name}": items $ref "${itemSchema.$ref}" not found in known schemas.`);
    elemType = refName;
  } else if (itemSchema?.type === "object" || itemSchema?.properties) {
    throw new Error(`[go-codegen] Array schema "${name}": items is inline type:object without a named $ref. Extract it to a named schema.`);
  } else {
    elemType = primitiveElemType(itemSchema?.type);
  }
  return `type ${toPascalCase(name)} []${elemType}`;
}

export function emitGoTypes(product: string, schemas: Schemas): string {
  const pkg = toGoPackageName(product);
  const seenDecls = new Set<string>();
  const knownTypes = new Set(Object.keys(schemas).map(toPascalCase));

  const decls = Object.entries(schemas)
    .filter(([, s]) => s.type === "object" || s.properties !== undefined || s.allOf !== undefined || s.type === "array")
    .map(([name, schema]) => {
      const goName = toPascalCase(name);
      if (seenDecls.has(goName)) {
        return "";
      }
      seenDecls.add(goName);
      if (schema.type === "array") return emitArrayAlias(name, schema, knownTypes);
      return emitStruct(name, schema, knownTypes, schemas);
    })
    .filter(decl => decl !== "")
    .join("\n\n");

  const needsJsonImport = decls.includes("json.RawMessage");
  const imports = needsJsonImport ? `import "encoding/json"\n\n` : "";
  return `package ${pkg}\n\n${imports}${decls}\n`;
}
