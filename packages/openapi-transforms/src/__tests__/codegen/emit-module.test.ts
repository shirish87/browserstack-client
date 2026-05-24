import { describe, expect, it } from "vitest";
import { emitModule, type EmitModuleInput } from "../../codegen/typescript/emit-module";
import type { EmitMethodInput } from "../../codegen/typescript/emit-method";

const baseAnnotations = {
  responseCodec: "json" as const,
  responseCodecConfig: {},
  requestCodec: "json" as const,
  requestCodecConfig: {},
  custom: { response: false, request: false },
};

function makeMethod(overrides: Partial<EmitMethodInput> = {}): EmitMethodInput {
  return {
    operationId: "getX",
    methodName: "getX",
    method: "GET",
    path: "/x",
    pathParams: [],
    queryParams: [],
    hasRequestBody: false,
    operationsKey: "getX",
    returnType: "unknown",
    annotations: baseAnnotations,
    baseUrl: "sdk",
    ...overrides,
  };
}

function makeInput(overrides: Partial<EmitModuleInput> = {}): EmitModuleInput {
  return {
    className: "MyClient",
    typesImportPath: "./my-types",
    methods: [makeMethod()],
    errorAliases: [],
    fieldOverrides: {},
    ...overrides,
  };
}

describe("emitModule", () => {
  it("emits the auto-generated header comment", () => {
    const src = emitModule(makeInput());
    expect(src).toContain("/* AUTO-GENERATED — do not edit */");
  });

  it("imports from the provided typesImportPath", () => {
    const src = emitModule(makeInput({ typesImportPath: "./some/other-types" }));
    expect(src).toContain('import type { operations } from "./some/other-types"');
  });

  it("emits only toCamelCase import when no methods have request bodies", () => {
    const src = emitModule(makeInput({ methods: [makeMethod({ hasRequestBody: false })] }));
    expect(src).toContain("toCamelCase");
    expect(src).not.toContain("toSnakeCase");
  });

  it("emits toSnakeCase import when any method has a request body", () => {
    const src = emitModule(makeInput({ methods: [makeMethod({ hasRequestBody: true })] }));
    expect(src).toContain("toCamelCase, toSnakeCase");
  });

  it("emits the class declaration with the provided className", () => {
    const src = emitModule(makeInput({ className: "AutomateClient" }));
    expect(src).toContain("export class AutomateClient extends APIClient");
  });

  it("emits error type aliases", () => {
    const src = emitModule(makeInput({
      errorAliases: [{ operationId: "getX", errorStatuses: [404, 500] }],
    }));
    expect(src).toContain("export type GetXError = HttpError<");
    expect(src).toContain("[404]");
    expect(src).toContain("[500]");
  });

  it("emits return type aliases before the class body", () => {
    const src = emitModule(makeInput({
      methods: [makeMethod({
        returnType: "GetXResult",
        returnTypeAliases: [`/** @interface */\nexport type GetXResult = DeepCamelCase<unknown>;`],
      })],
    }));
    const aliasIdx = src.indexOf("export type GetXResult");
    const classIdx = src.indexOf("export class");
    expect(aliasIdx).toBeGreaterThan(-1);
    expect(aliasIdx).toBeLessThan(classIdx);
  });

  it("deduplicates return type aliases across methods", () => {
    const alias = `/** @interface */\nexport type SharedResult = DeepCamelCase<unknown>;`;
    const src = emitModule(makeInput({
      methods: [
        makeMethod({ operationId: "getX", returnTypeAliases: [alias] }),
        makeMethod({ operationId: "getY", methodName: "getY", returnTypeAliases: [alias] }),
      ],
    }));
    const count = (src.match(/export type SharedResult/g) ?? []).length;
    expect(count).toBe(1);
  });

  it("applies field overrides by operationId", () => {
    const src = emitModule(makeInput({
      methods: [makeMethod({ operationId: "updateX", methodName: "updateX", hasRequestBody: true })],
      fieldOverrides: { updateX: { request: { custom_id: "appId" } } },
    }));
    expect(src).toContain('"appId":"custom_id"');
  });

  it("trims trailing whitespace from every line", () => {
    const src = emitModule(makeInput());
    const lines = src.split("\n");
    const trailingWs = lines.filter((l) => l !== l.trimEnd());
    expect(trailingWs).toEqual([]);
  });

  it("emits multiple methods in the class body", () => {
    const src = emitModule(makeInput({
      methods: [
        makeMethod({ operationId: "getA", methodName: "getA" }),
        makeMethod({ operationId: "getB", methodName: "getB" }),
      ],
    }));
    expect(src).toContain("getA(");
    expect(src).toContain("getB(");
  });
});
