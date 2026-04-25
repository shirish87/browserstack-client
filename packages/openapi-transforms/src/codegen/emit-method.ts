import type { OperationAnnotations } from "./annotations";
import type { OperationOverrides } from "./field-overrides";
import { camelize } from "../transforms/case";

export interface EmitMethodInput {
  operationId: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  pathParams: Array<{ name: string; tsType: string }>;
  queryParams: Array<{ name: string; baseName?: string; tsType: string; required: boolean }>;
  hasRequestBody: boolean;
  operationsKey: string;
  returnType: string;
  annotations: OperationAnnotations;
  baseUrl: "sdk" | "sdkCloud";
  overrides?: OperationOverrides;
}

export function emitMethod(input: EmitMethodInput): string {
  const camelPathParams = input.pathParams.map((p) => ({
    ...p,
    camelName: camelize(p.name),
  }));
  const camelQueryParams = input.queryParams.map((p) => ({
    ...p,
    camelName: camelize(p.baseName ?? p.name),
  }));

  const params = [
    ...camelPathParams.map((p) => `${p.camelName}: ${p.tsType}`),
    ...(input.hasRequestBody
      ? [
          input.annotations.requestCodec === "multipart"
            ? `body: ({ file: Blob } | { url: string }) & { fileName: string } & Record<string, unknown>`
            : `body: DeepCamelCase<operations["${input.operationsKey}"]["requestBody"] extends { content: { "application/json": infer B } } ? B : never>`,
        ]
      : []),
    ...camelQueryParams.map((p) => `${p.camelName}?: ${p.tsType}`),
    `options?: ExecuteOptions`,
  ].join(", ");

  const hasPath = input.pathParams.length > 0;
  const hasQuery = camelQueryParams.length > 0;

  let paramsArg: string;
  if (hasPath && hasQuery) {
    const pathPart = input.pathParams.map((p, i) => `${p.name}: ${camelPathParams[i].camelName}`).join(", ");
    const queryPart = camelQueryParams.map((p) => `"${p.name}": ${p.camelName}`).join(", ");
    paramsArg = `{ path: { ${pathPart} }, query: { ${queryPart} } }`;
  } else if (hasPath) {
    paramsArg = `{ path: { ${input.pathParams.map((p, i) => `${p.name}: ${camelPathParams[i].camelName}`).join(", ")} } }`;
  } else if (hasQuery) {
    paramsArg = `{ query: { ${camelQueryParams.map((p) => `"${p.name}": ${p.camelName}`).join(", ")} } }`;
  } else {
    paramsArg = "undefined";
  }

  const configLit = JSON.stringify(input.annotations.responseCodecConfig);
  const reqConfigLit = JSON.stringify(input.annotations.requestCodecConfig);

  // Sidecar stores snake→camel; toSnakeCase expects camel→snake, so invert here
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
  ${input.operationId}(${params}): Promise<DeepCamelCase<${input.returnType}>> {
    return (this.execute({
      path: "${input.path}",
      params: ${paramsArg},
      ${input.hasRequestBody ? `requestInput: ${requestInput},` : ""}
      requestCodec: "${input.annotations.requestCodec}",
      requestCodecConfig: ${reqConfigLit},
      responseCodec: "${input.annotations.responseCodec}",
      responseCodecConfig: ${configLit},
      baseUrl: "${input.baseUrl}" as const,
      operationId: "${input.operationId}",
      method: "${input.method}" as const,
      signal: options?.signal,
    }) as Promise<unknown>).then((r) => toCamelCase(r, ${respOverrideLit})) as Promise<DeepCamelCase<${input.returnType}>>;
  }`.trim();
}
