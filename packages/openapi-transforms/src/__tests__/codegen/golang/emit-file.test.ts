import { describe, expect, it } from "vitest";
import { emitGoFile } from "../../../codegen/golang/emit-file";

describe("emitGoFile", () => {
  it("emits package declaration with correct package name", () => {
    const result = emitGoFile("automate", "AutomateClient", "github.com/browserstack/browserstack-client");
    expect(result.trimStart()).toMatch(/^package automate/);
  });

  it("emits import block with context and internal http", () => {
    const result = emitGoFile("automate", "AutomateClient", "github.com/browserstack/browserstack-client");
    expect(result).toContain(`"context"`);
    expect(result).toContain(`github.com/browserstack/browserstack-client/internal/http`);
  });

  it("emits client struct and New constructor", () => {
    const result = emitGoFile("automate", "AutomateClient", "github.com/browserstack/browserstack-client");
    expect(result).toContain("type AutomateClient struct {");
    expect(result).toContain("http *browserstackhttp.Client");
    expect(result).toContain("func New(c *browserstackhttp.Client) *AutomateClient {");
    expect(result).toContain("return &AutomateClient{http: c}");
  });

  it("uses correct package name for app-automate", () => {
    const result = emitGoFile("app-automate", "AppAutomateClient", "github.com/browserstack/browserstack-client");
    expect(result.trimStart()).toMatch(/^package appautomate/);
  });
});
