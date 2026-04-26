import { emitMethod, type EmitMethodInput } from "./emit-method";
import { emitErrorAlias } from "./emit-error-type";
import type { FieldOverrides } from "./field-overrides";

export interface EmitModuleInput {
  className: string;
  typesImportPath: string;
  methods: EmitMethodInput[];
  errorAliases: Array<{ operationId: string; errorStatuses: number[] }>;
  fieldOverrides: FieldOverrides;
}

export function emitModule(input: EmitModuleInput): string {
  const needsSnakeCase = input.methods.some((m) => m.hasRequestBody);
  const transformImports = needsSnakeCase
    ? "toCamelCase, toSnakeCase"
    : "toCamelCase";
  const header = `/* AUTO-GENERATED — do not edit */
import type { operations } from "${input.typesImportPath}";
import { APIClient, type ExecuteOptions } from "@browserstack-client/core";
import { HttpError, ${transformImports} } from "@browserstack-client/openapi-transforms";
import type { DeepCamelCase } from "@browserstack-client/openapi-transforms";
`;
  const methods = input.methods.map((m) => ({
    ...m,
    overrides: input.fieldOverrides[m.operationId],
  }));
  const errorAliases = input.errorAliases.map((a) => emitErrorAlias(a.operationId, a.errorStatuses)).join("\n\n");
  // Collect return type helper aliases, deduplicating across methods
  const seen = new Set<string>();
  const returnTypeAliases: string[] = [];
  for (const m of methods) {
    for (const alias of (m.returnTypeAliases ?? [])) {
      if (!seen.has(alias)) { seen.add(alias); returnTypeAliases.push(alias); }
    }
  }
  // Extract alias names for @preventInline so TypeDoc shows them as named types in signatures
  const aliasNames = returnTypeAliases
    .map((a) => {
      const m = a.match(/export type ([A-Za-z][A-Za-z0-9]*) =/);
      return m ? m[1] : null;
    })
    .filter((n): n is string => n !== null);
  const classJsDoc = "";
  const body = `${classJsDoc}export class ${input.className} extends APIClient {
${methods.map(emitMethod).join("\n\n")}
}`;
  const returnTypeSection = returnTypeAliases.length ? returnTypeAliases.join("\n") + "\n\n" : "";
  const out = `${header}\n${errorAliases}\n\n${returnTypeSection}${body}\n`;
  return out.split("\n").map((line) => line.trimEnd()).join("\n");
}
