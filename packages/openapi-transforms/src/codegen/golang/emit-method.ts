import { toPascalCase } from "./case";

export interface GoMethodInput {
  operationId: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  pathParams: Array<{ name: string; goType: string }>;
  queryParams: Array<{ name: string; goType: string }>;
  hasRequestBody: boolean;
  requestCodec: string;
  responseType: string;
  className: string;
  requestBodyType?: string;
}

function toStringExpr(name: string, goType: string): string {
  return goType === "int" ? `strconv.Itoa(${name})` : name;
}

function buildUrlExpr(path: string, pathParams: Array<{ name: string; goType: string }>): string {
  if (!pathParams.length) return `"${path}"`;
  const paramMap = Object.fromEntries(pathParams.map((p) => [p.name, p.goType]));
  const parts = path.split(/(\{[^}]+\})/);
  return parts
    .filter((part) => part.length > 0)
    .map((part) => {
      const match = part.match(/^\{([^}]+)\}$/);
      if (match) {
        const name = match[1];
        const goType = paramMap[name] ?? "string";
        return toStringExpr(name, goType);
      }
      return `"${part}"`;
    })
    .join(" + ");
}

function buildQueryExpr(queryParams: Array<{ name: string; goType: string }>): string {
  if (!queryParams.length) return "nil";
  const entries = queryParams.map((p) => `"${p.name}": ${toStringExpr(p.name, p.goType)}`).join(", ");
  return `map[string]string{${entries}}`;
}

export function emitGoMethod(input: GoMethodInput): string {
  const fnName = toPascalCase(input.operationId);
  const isTextResponse = input.responseType === "string";
  const isMultipart = input.requestCodec === "multipart";
  const urlExpr = buildUrlExpr(input.path, input.pathParams);
  const queryExpr = buildQueryExpr(input.queryParams);

  const paramsList = [
    "ctx context.Context",
    ...input.pathParams.map((p) => `${p.name} ${p.goType}`),
    ...input.queryParams.map((p) => `${p.name} ${p.goType}`),
    ...(isMultipart ? ["file []byte", "fileName string", "fields map[string]string"] : []),
    ...(input.hasRequestBody && !isMultipart && input.requestBodyType
      ? [`body *${input.requestBodyType}`]
      : []),
  ].join(", ");

  const httpMethod = input.method.charAt(0).toUpperCase() + input.method.slice(1).toLowerCase();

  if (isTextResponse) {
    return `func (c *${input.className}) ${fnName}(${paramsList}) (string, error) {
\treturn c.http.GetText(ctx, ${urlExpr}, ${queryExpr})
}`;
  }

  if (isMultipart) {
    return `func (c *${input.className}) ${fnName}(${paramsList}) (*${input.responseType}, error) {
\tvar out ${input.responseType}
\tif err := c.http.PostMultipart(ctx, ${urlExpr}, file, fileName, fields, &out); err != nil {
\t\treturn nil, err
\t}
\treturn &out, nil
}`;
  }

  const needsBody = input.hasRequestBody;
  const methodArgs =
    input.method === "GET" || input.method === "DELETE"
      ? `${urlExpr}, ${queryExpr}, &out`
      : needsBody
        ? `${urlExpr}, body, &out`
        : `${urlExpr}, nil, &out`;

  return `func (c *${input.className}) ${fnName}(${paramsList}) (*${input.responseType}, error) {
\tvar out ${input.responseType}
\tif err := c.http.${httpMethod}(ctx, ${methodArgs}); err != nil {
\t\treturn nil, err
\t}
\treturn &out, nil
}`;
}
