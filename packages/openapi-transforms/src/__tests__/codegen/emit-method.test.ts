import { describe, expect, it } from "vitest";
import { emitMethod } from "../../codegen/emit-method.js";

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
});
