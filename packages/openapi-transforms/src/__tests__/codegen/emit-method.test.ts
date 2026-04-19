import { describe, expect, it } from "vitest";
import { emitMethod } from "../../codegen/emit-method";

describe("emitMethod", () => {
  it("emits a GET method with path params and json-unwrap codec", () => {
    const src = emitMethod({
      operationId: "getAutomateProject",
      method: "GET",
      path: "/automate/projects/{projectId}.json",
      pathParams: [{ name: "projectId", tsType: "number" }],
      queryParams: [],
      hasRequestBody: false,
      operationsKey: "getAutomateProject",
      returnType: 'components["schemas"]["AutomateProject"]',
      annotations: {
        responseCodec: "json-unwrap", responseCodecConfig: { path: "$.project" },
        requestCodec: "json", requestCodecConfig: {},
        custom: { response: false, request: false },
      },
      baseUrl: "sdk",
    });
    expect(src).toContain("getAutomateProject(projectId: number");
    expect(src).toContain("operationId: \"getAutomateProject\"");
    expect(src).toContain("method: \"GET\"");
    expect(src).toContain("path: \"/automate/projects/{projectId}.json\"");
    expect(src).toContain("responseCodec: \"json-unwrap\"");
    expect(src).toContain("responseCodecConfig: {\"path\":\"$.project\"}");
    expect(src).toContain("Promise<components[\"schemas\"][\"AutomateProject\"]>");
  });

  it("camelizes snake_case path params in signature", () => {
    const src = emitMethod({
      operationId: "getAutomateSession",
      method: "GET",
      path: "/automate/sessions/{session_id}",
      pathParams: [{ name: "session_id", tsType: "string" }],
      queryParams: [],
      hasRequestBody: false,
      operationsKey: "getAutomateSession",
      returnType: "unknown",
      annotations: { responseCodec: "json", responseCodecConfig: {}, requestCodec: "json", requestCodecConfig: {}, custom: { response: false, request: false } },
      baseUrl: "sdk",
    });
    expect(src).toContain("sessionId: string");
    expect(src).not.toContain("session_id: string");
  });

  it("wraps requestInput with toSnakeCase when hasRequestBody is true", () => {
    const src = emitMethod({
      operationId: "updateBuild",
      method: "PUT",
      path: "/automate/builds/{build_id}",
      pathParams: [{ name: "build_id", tsType: "string" }],
      queryParams: [],
      hasRequestBody: true,
      operationsKey: "updateBuild",
      returnType: "unknown",
      annotations: { responseCodec: "json", responseCodecConfig: {}, requestCodec: "json", requestCodecConfig: {}, custom: { response: false, request: false } },
      baseUrl: "sdk",
    });
    expect(src).toContain("toSnakeCase(body, undefined)");
  });

  it("wraps response with toCamelCase", () => {
    const src = emitMethod({
      operationId: "getAutomatePlan",
      method: "GET",
      path: "/automate/plan.json",
      pathParams: [],
      queryParams: [],
      hasRequestBody: false,
      operationsKey: "getAutomatePlan",
      returnType: "unknown",
      annotations: { responseCodec: "json", responseCodecConfig: {}, requestCodec: "json", requestCodecConfig: {}, custom: { response: false, request: false } },
      baseUrl: "sdk",
    });
    expect(src).toContain("toCamelCase(r, undefined)");
  });

  it("inverts request overrides for toSnakeCase", () => {
    const src = emitMethod({
      operationId: "uploadApp",
      method: "POST",
      path: "/app-automate/upload",
      pathParams: [],
      queryParams: [],
      hasRequestBody: true,
      operationsKey: "uploadApp",
      returnType: "unknown",
      annotations: { responseCodec: "json", responseCodecConfig: {}, requestCodec: "json", requestCodecConfig: {}, custom: { response: false, request: false } },
      baseUrl: "sdk",
      overrides: { request: { custom_id: "appId" } },
    });
    // sidecar: custom_id → appId (snake→camel); inverted for toSnakeCase: appId → custom_id
    expect(src).toContain('"appId":"custom_id"');
  });
});
