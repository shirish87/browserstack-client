import { describe, expect, it } from "vitest";
import { emitGoMethod, type GoMethodInput } from "../../../codegen/golang/emit-method";

describe("emitGoMethod", () => {
  it("emits a GET with no params", () => {
    const input: GoMethodInput = {
      operationId: "getAutomateBuilds",
      methodName: "getAutomateBuilds",
      method: "GET",
      path: "/automate/builds.json",
      pathParams: [],
      queryParams: [],
      hasRequestBody: false,
      requestCodec: "json",
      responseType: "GetAutomateBuildsResponse",
      className: "AutomateClient",
    };
    const result = emitGoMethod(input);
    expect(result).toContain("func (c *AutomateClient) GetAutomateBuilds(ctx context.Context) (*GetAutomateBuildsResponse, error)");
    expect(result).toContain(`c.http.Get(ctx, "/automate/builds.json", nil, &out)`);
  });

  it("emits a GET with path param", () => {
    const input: GoMethodInput = {
      operationId: "getAutomateBuild",
      methodName: "getAutomateBuild",
      method: "GET",
      path: "/automate/builds/{buildId}.json",
      pathParams: [{ name: "buildId", goType: "string" }],
      queryParams: [],
      hasRequestBody: false,
      requestCodec: "json",
      responseType: "Build",
      className: "AutomateClient",
    };
    const result = emitGoMethod(input);
    expect(result).toContain("func (c *AutomateClient) GetAutomateBuild(ctx context.Context, buildId string) (*Build, error)");
    expect(result).toContain(`"/automate/builds/" + buildId + ".json"`);
  });

  it("emits a GET with query params", () => {
    const input: GoMethodInput = {
      operationId: "getAutomateBuilds",
      methodName: "getAutomateBuilds",
      method: "GET",
      path: "/automate/builds.json",
      pathParams: [],
      queryParams: [{ name: "limit", goType: "string" }],
      hasRequestBody: false,
      requestCodec: "json",
      responseType: "GetAutomateBuildsResponse",
      className: "AutomateClient",
    };
    const result = emitGoMethod(input);
    expect(result).toContain("limit string");
    expect(result).toContain(`map[string]string{"limit": limit}`);
  });

  it("emits a POST with JSON body", () => {
    const input: GoMethodInput = {
      operationId: "updateAutomateBuild",
      methodName: "updateAutomateBuild",
      method: "PATCH",
      path: "/automate/builds/{buildId}.json",
      pathParams: [{ name: "buildId", goType: "string" }],
      queryParams: [],
      hasRequestBody: true,
      requestCodec: "json",
      responseType: "Build",
      className: "AutomateClient",
      requestBodyType: "UpdateAutomateBuildRequest",
    };
    const result = emitGoMethod(input);
    expect(result).toContain("body *UpdateAutomateBuildRequest");
    expect(result).toContain("c.http.Patch(ctx,");
    expect(result).toContain("body, &out");
  });

  it("emits a multipart upload", () => {
    const input: GoMethodInput = {
      operationId: "uploadAutomateMediaFile",
      methodName: "uploadAutomateMediaFile",
      method: "POST",
      path: "/automate/upload",
      pathParams: [],
      queryParams: [],
      hasRequestBody: true,
      requestCodec: "multipart",
      responseType: "UploadAutomateMediaFileResponse",
      className: "AutomateClient",
    };
    const result = emitGoMethod(input);
    expect(result).toContain("file []byte, fileName string, fields map[string]string");
    expect(result).toContain("c.http.PostMultipart(ctx,");
  });

  it("emits a text response as string return", () => {
    const input: GoMethodInput = {
      operationId: "getAutomateSessionLogs",
      methodName: "getAutomateSessionLogs",
      method: "GET",
      path: "/automate/sessions/{sessionId}/logs",
      pathParams: [{ name: "sessionId", goType: "string" }],
      queryParams: [],
      hasRequestBody: false,
      requestCodec: "json",
      responseType: "string",
      className: "AutomateClient",
    };
    const result = emitGoMethod(input);
    expect(result).toContain("(string, error)");
    expect(result).toContain("c.http.GetText(ctx,");
  });
});
