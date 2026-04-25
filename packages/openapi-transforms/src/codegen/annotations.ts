import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { CodecRegistry } from "../registry";

export interface OperationAnnotations {
  responseCodec: string;
  responseCodecConfig: unknown;
  requestCodec: string;
  requestCodecConfig: unknown;
  custom: { response: boolean; request: boolean };
}

type TransformAnnotation = { codec: string; config?: unknown };
type Op = Record<string, unknown> & {
  "x-response-transform"?: TransformAnnotation | string;
  "x-request-transform"?: TransformAnnotation | string;
  "x-response-custom"?: boolean;
  "x-request-custom"?: boolean;
};

function normalizeTransform(ann: TransformAnnotation | string | undefined): TransformAnnotation | undefined {
  if (!ann) return undefined;
  if (typeof ann === "object") return ann;
  // Shorthand: "json-unwrap $.foo" or "text"
  const spaceIdx = ann.indexOf(" ");
  if (spaceIdx === -1) return { codec: ann };
  const codec = ann.slice(0, spaceIdx);
  const arg = ann.slice(spaceIdx + 1).trim();
  // Only json-unwrap takes a path argument
  return { codec, config: { path: arg } };
}

function validateConfig(schema: StandardSchemaV1<unknown, unknown>, value: unknown, where: string): unknown {
  const res = schema["~standard"].validate(value ?? {});
  if (res instanceof Promise) {
    throw new Error(`${where}: async validators are not supported at codegen time`);
  }
  if ("issues" in res && res.issues) {
    const msg = res.issues.map((i) => i.message).join("; ");
    throw new Error(`${where}: ${msg}`);
  }
  return (res as { value: unknown }).value;
}

export function readAnnotations(op: Op, registry: CodecRegistry, operationId: string): OperationAnnotations {
  const custom = { response: Boolean(op["x-response-custom"]), request: Boolean(op["x-request-custom"]) };

  const respAnn = normalizeTransform(op["x-response-transform"]);
  const respName = respAnn?.codec ?? "json";
  let respCodec;
  try { respCodec = registry.resolveResponse(respName); }
  catch { throw new Error(`${operationId}: unknown response codec '${respName}'`); }
  const respConfig = validateConfig(respCodec.configSchema, respAnn?.config, `${operationId}.x-response-transform.config`);

  const reqAnn = normalizeTransform(op["x-request-transform"]);
  const reqName = reqAnn?.codec ?? "json";
  let reqCodec;
  try { reqCodec = registry.resolveRequest(reqName); }
  catch { throw new Error(`${operationId}: unknown request codec '${reqName}'`); }
  const reqConfig = validateConfig(reqCodec.configSchema, reqAnn?.config, `${operationId}.x-request-transform.config`);

  return { responseCodec: respName, responseCodecConfig: respConfig, requestCodec: reqName, requestCodecConfig: reqConfig, custom };
}
