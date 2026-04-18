import type { OperationAnnotations } from "./annotations.js";

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
}

export function emitMethod(input: EmitMethodInput): string {
  const params = [
    ...input.pathParams.map((p) => `${p.name}: ${p.tsType}`),
    ...(input.hasRequestBody ? [`body: operations["${input.operationsKey}"]["requestBody"] extends { content: { "application/json": infer B } } ? B : unknown`] : []),
    `options?: APIFetchOptions<operations["${input.operationsKey}"]>`,
  ].join(", ");

  const pathArg = input.pathParams.length
    ? `{ path: { ${input.pathParams.map((p) => p.name).join(", ")} } }`
    : "undefined";

  const configLit = JSON.stringify(input.annotations.responseCodecConfig);

  return `
  ${input.operationId}(${params}): Promise<${input.returnType}> {
    return this.execute({
      path: "${input.path}",
      params: ${pathArg},
      ${input.hasRequestBody ? "requestInput: body," : ""}
      requestCodec: "${input.annotations.requestCodec}",
      requestCodecConfig: ${JSON.stringify(input.annotations.requestCodecConfig)},
      responseCodec: "${input.annotations.responseCodec}",
      responseCodecConfig: ${configLit},
      baseUrl: "${input.baseUrl}",
      ...options,
      operationId: "${input.operationId}",
      method: "${input.method}" as const,
    }) as Promise<${input.returnType}>;
  }`.trim();
}
