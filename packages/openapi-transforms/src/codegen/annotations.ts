import type { CodecRegistry } from "../registry.js";

export interface OperationAnnotations {
  responseCodec: string;
  responseCodecConfig: unknown;
  requestCodec: string;
  requestCodecConfig: unknown;
  custom: { response: boolean; request: boolean };
}

type Op = Record<string, unknown> & {
  "x-response-transform"?: { codec: string; config?: unknown };
  "x-request-transform"?: { codec: string; config?: unknown };
  "x-response-custom"?: boolean;
  "x-request-custom"?: boolean;
};

function validateConfig(schema: any, value: unknown, where: string): unknown {
  const res = schema["~standard"].validate(value ?? {});
  if ("issues" in res) {
    const msg = res.issues.map((i: any) => i.message).join("; ");
    throw new Error(`${where}: ${msg}`);
  }
  return res.value;
}

export function readAnnotations(op: Op, registry: CodecRegistry, operationId: string): OperationAnnotations {
  const custom = { response: Boolean(op["x-response-custom"]), request: Boolean(op["x-request-custom"]) };

  const respAnn = op["x-response-transform"];
  const respName = respAnn?.codec ?? "json";
  let respCodec;
  try { respCodec = registry.resolveResponse(respName); }
  catch { throw new Error(`${operationId}: unknown response codec '${respName}'`); }
  const respConfig = validateConfig(respCodec.configSchema, respAnn?.config, `${operationId}.x-response-transform.config`);

  const reqAnn = op["x-request-transform"];
  const reqName = reqAnn?.codec ?? "json";
  let reqCodec;
  try { reqCodec = registry.resolveRequest(reqName); }
  catch { throw new Error(`${operationId}: unknown request codec '${reqName}'`); }
  const reqConfig = validateConfig(reqCodec.configSchema, reqAnn?.config, `${operationId}.x-request-transform.config`);

  return { responseCodec: respName, responseCodecConfig: respConfig, requestCodec: reqName, requestCodecConfig: reqConfig, custom };
}
