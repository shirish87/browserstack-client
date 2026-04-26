import type { OperationAnnotations } from "./annotations";
import { parsePath } from "../../path/parser";
import { toPascalCase } from "../shared/operation";

function configAs(cfg: unknown, key: string): unknown {
  if (cfg !== null && typeof cfg === "object" && key in cfg) {
    return (cfg as Record<string, unknown>)[key];
  }
  return undefined;
}

export interface DerivedReturnType {
  type: string;
  aliases: string[];
}

export function deriveReturnType(baseType: string, ann: OperationAnnotations, operationId: string): DerivedReturnType {
  switch (ann.responseCodec) {
    case "json": return { type: baseType, aliases: [] };
    case "text": return { type: "string", aliases: [] };
    case "binary": {
      const as = configAs(ann.responseCodecConfig, "as");
      return { type: as === "blob" ? "Blob" : "ArrayBuffer", aliases: [] };
    }
    case "json-unwrap": {
      const path = configAs(ann.responseCodecConfig, "path");
      if (typeof path !== "string") throw new Error("json-unwrap config.path missing or not a string");
      const inner = applyPath(baseType, path, operationId, "Result");
      return namedAlias(inner, operationId, "Result");
    }
    case "json-compose": {
      const base = configAs(ann.responseCodecConfig, "base");
      const merge = configAs(ann.responseCodecConfig, "merge");
      if (typeof base !== "string") return { type: "unknown", aliases: [] };
      const baseResult = applyPath(baseType, base, operationId, "Base");
      const aliases = [...baseResult.aliases];
      // Apply DeepCamelCase only to the base (scalar) part.
      // Merge fields are already named aliases that are themselves DeepCamelCase — don't double-wrap.
      let composedType = `DeepCamelCase<${baseResult.type}>`;
      if (merge !== null && typeof merge === "object") {
        for (const [field, path] of Object.entries(merge as Record<string, unknown>)) {
          if (typeof path === "string") {
            const arrayResult = applyPath(baseType, path, operationId, toPascalCase(field));
            aliases.push(...arrayResult.aliases);
            // arrayResult.type is Array<NamedAlias> — reference directly without DeepCamelCase
            composedType = `${composedType} & { ${field}: ${arrayResult.type} }`;
          }
        }
      }
      // Wrap the entire compose result in a named alias.
      // @interface tells TypeDoc to treat this as an interface (shows named type, not inlined object).
      const aliasName = `${toPascalCase(operationId)}Result`;
      aliases.push(`/** @interface */\nexport type ${aliasName} = ${composedType};`);
      return { type: aliasName, aliases };
    }
    default:
      return { type: "unknown", aliases: [] };
  }
}

function namedAlias(inner: DerivedReturnType, operationId: string, suffix: string): DerivedReturnType {
  // If inner.type is already a plain alias name (no angle brackets / operators), return as-is
  if (/^[A-Za-z][A-Za-z0-9]*$/.test(inner.type)) return inner;
  const aliases = [...inner.aliases];
  // Array<ElemAlias> — wrap in a list alias so @preventInline works on the whole array type too
  if (/^Array<[A-Za-z][A-Za-z0-9]*>$/.test(inner.type)) {
    const listAliasName = `${toPascalCase(operationId)}${suffix}`;
    if (!aliases.some((a) => a.includes(`type ${listAliasName} `))) {
      aliases.push(`export type ${listAliasName} = ${inner.type};`);
    }
    return { type: listAliasName, aliases };
  }
  const aliasName = `${toPascalCase(operationId)}${suffix}`;
  if (!aliases.some((a) => a.includes(`type ${aliasName} `))) {
    // @interface tells TypeDoc to treat this alias as an interface — shows as a named
    // type in method signatures rather than being inlined as an anonymous object.
    aliases.push(`/** @interface */\nexport type ${aliasName} = DeepCamelCase<${inner.type}>;`);
  }
  return { type: aliasName, aliases };
}

function applyPath(base: string, path: string, operationId: string, suffix: string): DerivedReturnType {
  const ast = parsePath(path);
  let acc = base;
  let isArray = false;
  const aliases: string[] = [];
  for (const node of ast.slice(1)) {
    if (node.kind === "field") {
      if (isArray) {
        // Element aliases always use "Item" to avoid clashing with the outer "Result"/"List" alias
        const elemExpr = `(${acc}[number] & Record<"${node.name}", unknown>)["${node.name}"]`;
        const elemAliasName = `${toPascalCase(operationId)}${suffix}Item`;
        if (!aliases.some((a) => a.includes(`type ${elemAliasName} `))) {
          aliases.push(`/** @interface */\nexport type ${elemAliasName} = DeepCamelCase<${elemExpr}>;`);
        }
        acc = `Array<${elemAliasName}>`;
        isArray = false;
      } else {
        acc = `(${acc} & Record<"${node.name}", unknown>)["${node.name}"]`;
      }
    } else if (node.kind === "wildcard") {
      isArray = true;
    } else if (node.kind === "index") {
      acc = `${acc}[number]`;
    }
  }
  if (isArray && !acc.startsWith("Array<")) {
    const elemExpr = `${acc}[number]`;
    const elemAliasName = `${toPascalCase(operationId)}${suffix}Item`;
    if (!aliases.some((a) => a.includes(`type ${elemAliasName} `))) {
      aliases.push(`/** @interface */\nexport type ${elemAliasName} = DeepCamelCase<${elemExpr}>;`);
    }
    acc = `Array<${elemAliasName}>`;
  }
  return { type: acc, aliases };
}
