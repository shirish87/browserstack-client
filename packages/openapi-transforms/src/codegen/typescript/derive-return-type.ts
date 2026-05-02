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

function deriveJsonCompose(
  baseType: string,
  ann: OperationAnnotations,
  operationId: string
): DerivedReturnType {
  const base = configAs(ann.responseCodecConfig, "base");
  const merge = configAs(ann.responseCodecConfig, "merge");
  if (typeof base !== "string") return { type: "unknown", aliases: [] };
  const baseResult = applyPath(baseType, base, operationId, "Base");
  const aliases = [...baseResult.aliases];
  let composedType = `DeepCamelCase<${baseResult.type}>`;
  if (merge !== null && typeof merge === "object") {
    for (const [field, path] of Object.entries(merge as Record<string, unknown>)) {
      if (typeof path === "string") {
        const arrayResult = applyPath(baseType, path, operationId, toPascalCase(field));
        aliases.push(...arrayResult.aliases);
        composedType = `${composedType} & { ${field}: ${arrayResult.type} }`;
      }
    }
  }
  const aliasName = `${toPascalCase(operationId)}Result`;
  aliases.push(`/** @interface */\nexport type ${aliasName} = ${composedType};`);
  return { type: aliasName, aliases };
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
    case "json-compose":
      return deriveJsonCompose(baseType, ann, operationId);
    default:
      return { type: "unknown", aliases: [] };
  }
}

function namedAlias(inner: DerivedReturnType, operationId: string, suffix: string): DerivedReturnType {
  if (/^[A-Za-z][A-Za-z0-9]*$/.test(inner.type)) return inner;
  const aliases = [...inner.aliases];
  if (/^Array<[A-Za-z][A-Za-z0-9]*>$/.test(inner.type)) {
    const listAliasName = `${toPascalCase(operationId)}${suffix}`;
    if (!aliases.some((a) => a.includes(`type ${listAliasName} `))) {
      aliases.push(`export type ${listAliasName} = ${inner.type};`);
    }
    return { type: listAliasName, aliases };
  }
  const aliasName = `${toPascalCase(operationId)}${suffix}`;
  if (!aliases.some((a) => a.includes(`type ${aliasName} `))) {
    aliases.push(`/** @interface */\nexport type ${aliasName} = DeepCamelCase<${inner.type}>;`);
  }
  return { type: aliasName, aliases };
}

function applyFieldNode(
  acc: string,
  nodeName: string,
  isArray: boolean,
  operationId: string,
  suffix: string,
  aliases: string[]
): { acc: string; isArray: boolean } {
  if (isArray) {
    const elemExpr = `(${acc}[number] & Record<"${nodeName}", unknown>)["${nodeName}"]`;
    const elemAliasName = `${toPascalCase(operationId)}${suffix}Item`;
    if (!aliases.some((a) => a.includes(`type ${elemAliasName} `))) {
      aliases.push(`/** @interface */\nexport type ${elemAliasName} = DeepCamelCase<${elemExpr}>;`);
    }
    return { acc: `Array<${elemAliasName}>`, isArray: false };
  }
  return { acc: `(${acc} & Record<"${nodeName}", unknown>)["${nodeName}"]`, isArray: false };
}

function applyPath(base: string, path: string, operationId: string, suffix: string): DerivedReturnType {
  const ast = parsePath(path);
  let acc = base;
  let isArray = false;
  const aliases: string[] = [];
  for (const node of ast.slice(1)) {
    if (node.kind === "field") {
      ({ acc, isArray } = applyFieldNode(acc, node.name, isArray, operationId, suffix, aliases));
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
