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
  const header = `/* AUTO-GENERATED — do not edit */
import type { operations } from "${input.typesImportPath}";
import { APIClient, type ExecuteOptions } from "@browserstack-client/core";
import { HttpError, toCamelCase, toSnakeCase } from "@browserstack-client/openapi-transforms";
`;
  const methods = input.methods.map((m) => ({
    ...m,
    overrides: input.fieldOverrides[m.operationId],
  }));
  const aliases = input.errorAliases.map((a) => emitErrorAlias(a.operationId, a.errorStatuses)).join("\n\n");
  const body = `export abstract class ${input.className} extends APIClient {
${methods.map(emitMethod).join("\n\n")}
}`;
  return `${header}\n${aliases}\n\n${body}\n`;
}
