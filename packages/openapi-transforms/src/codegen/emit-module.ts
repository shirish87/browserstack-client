import { emitMethod, type EmitMethodInput } from "./emit-method.js";
import { emitErrorAlias } from "./emit-error-type.js";

export interface EmitModuleInput {
  className: string;          // e.g. "GeneratedAutomateClient"
  typesImportPath: string;    // e.g. "../../openapi/generated/automate"
  methods: EmitMethodInput[];
  errorAliases: Array<{ operationId: string; errorStatuses: number[] }>;
}

export function emitModule(input: EmitModuleInput): string {
  const header = `/* AUTO-GENERATED — do not edit */
import type { operations, paths } from "${input.typesImportPath}";
import { APIClient, type APIFetchOptions } from "@browserstack-client/core";
import { HttpError } from "@browserstack-client/openapi-transforms";
`;
  const aliases = input.errorAliases.map((a) => emitErrorAlias(a.operationId, a.errorStatuses)).join("\n\n");
  const body = `export abstract class ${input.className} extends APIClient<paths> {
${input.methods.map(emitMethod).join("\n\n")}
}`;
  return `${header}\n${aliases}\n\n${body}\n`;
}
