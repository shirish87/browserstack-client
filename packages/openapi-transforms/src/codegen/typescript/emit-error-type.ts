export function emitErrorAlias(operationId: string, errorStatuses: number[]): string {
  const alias = operationId.charAt(0).toUpperCase() + operationId.slice(1) + "Error";
  if (!errorStatuses.length) return `export type ${alias} = HttpError<unknown>;`;
  const lines = errorStatuses.map((s) =>
    `  | (operations["${operationId}"]["responses"][${s}] extends { content: { "application/json": infer E } } ? E : unknown)`
  );
  return `export type ${alias} = HttpError<\n${lines.join("\n")}\n>;`;
}
