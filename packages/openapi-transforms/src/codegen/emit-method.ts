import type { OperationAnnotations } from "./annotations";
import type { OperationOverrides } from "./field-overrides";

export interface EmitMethodInput {
  operationId: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  pathParams: Array<{ name: string; tsType: string }>;
  queryParams: Array<{ name: string; tsType: string; required: boolean }>;
  hasRequestBody: boolean;
  operationsKey: string;
  returnType: string;
  annotations: OperationAnnotations;
  baseUrl: "sdk" | "sdkCloud";
  overrides?: OperationOverrides;
}

export function emitMethod(input: EmitMethodInput): string {
  const camelParams = input.pathParams.map((p) => ({
    ...p,
    camelName: camelize(p.name),
  }));

  const params = [
    ...camelParams.map((p) => `${p.camelName}: ${p.tsType}`),
    ...(input.hasRequestBody
      ? [
          input.annotations.requestCodec === "multipart"
            ? `body: { file: Blob; fileName: string } & Record<string, unknown>`
            : `body: operations["${input.operationsKey}"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown`,
        ]
      : []),
    `options?: ExecuteOptions`,
  ].join(", ");

  const pathArg =
    input.pathParams.length
      ? `{ path: { ${input.pathParams.map((p, i) => `${p.name}: ${camelParams[i].camelName}`).join(", ")} } }`
      : "undefined";

  const configLit = JSON.stringify(input.annotations.responseCodecConfig);
  const reqConfigLit = JSON.stringify(input.annotations.requestCodecConfig);

  const reqOverrides = input.overrides?.request ?? {};
  const reqOverrideLit = Object.keys(reqOverrides).length
    ? JSON.stringify(Object.fromEntries(Object.entries(reqOverrides).map(([snake, camel]) => [camel, snake])))
    : "undefined";

  const respOverrides = input.overrides?.response ?? {};
  const respOverrideLit = Object.keys(respOverrides).length
    ? JSON.stringify(respOverrides)
    : "undefined";

  const requestInput = input.hasRequestBody
    ? `toSnakeCase(body, ${reqOverrideLit})`
    : "undefined";

  return `
  ${input.operationId}(${params}): Promise<${input.returnType}> {
    return (this.execute({
      path: "${input.path}",
      params: ${pathArg},
      ${input.hasRequestBody ? `requestInput: ${requestInput},` : ""}
      requestCodec: "${input.annotations.requestCodec}",
      requestCodecConfig: ${reqConfigLit},
      responseCodec: "${input.annotations.responseCodec}",
      responseCodecConfig: ${configLit},
      baseUrl: "${input.baseUrl}" as const,
      operationId: "${input.operationId}",
      method: "${input.method}" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, ${respOverrideLit})) as Promise<${input.returnType}>;
  }`.trim();
}

function camelize(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
