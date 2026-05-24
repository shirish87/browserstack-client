import { describe, expect, it } from "vitest";
import { generateTUIManifestTS, generateTUIManifestGo, type SpecInfoMap } from "../../codegen/cli/tui";
import { CLIMetadata } from "../../codegen/cli";

describe("TUI Manifest Codegen", () => {
  it("marks auth_token fields as secret in TS manifest", () => {
    const metadata: CLIMetadata[] = [{
      product: "local-testing",
      resources: {
        default: {
          actions: {
            "list-instances": {
              operationId: "list-instances",
              methodName: "listInstances",
              path: "/instances",
              method: "GET",
              summary: "List instances",
              description: "",
              parameters: [{
                name: "auth_token",
                in: "query",
                required: true,
                schema: { type: "string", description: "Your BrowserStack access token" },
              }],
            },
          },
        },
      },
    }];
    const specInfoMap: SpecInfoMap = { "local-testing": { title: "Local Testing", description: "" } };
    const output = generateTUIManifestTS(metadata, specInfoMap);
    
    // Extract the JSON part from the TS output
    const jsonMatch = output.match(/export const TUI_MANIFEST: TUIProduct\[\] = (\[[\s\S]*\]);/);
    expect(jsonMatch).not.toBeNull();
    const parsed = JSON.parse(jsonMatch![1]);
    
    const field = parsed[0].resources[0].actions[0].fields[0];
    expect(field.name).toBe("auth_token");
    expect(field.secret).toBe(true);
  });

  it("marks auth_token fields as secret in Go manifest", () => {
    const metadata: CLIMetadata[] = [{
      product: "local-testing",
      resources: {
        default: {
          actions: {
            "list-instances": {
              operationId: "list-instances",
              methodName: "listInstances",
              path: "/instances",
              method: "GET",
              summary: "List instances",
              description: "",
              parameters: [{
                name: "auth_token",
                in: "query",
                required: true,
                schema: { type: "string", description: "Your BrowserStack access token" },
              }],
            },
          },
        },
      },
    }];
    const specInfoMap: SpecInfoMap = { "local-testing": { title: "Local Testing", description: "" } };
    const output = generateTUIManifestGo(metadata, specInfoMap);
    expect(output).toContain("Secret:      true,");
  });

  it("does not mark non-credential fields as secret", () => {
    const metadata: CLIMetadata[] = [{
      product: "automate",
      resources: {
        default: {
          actions: {
            "list-sessions": {
              operationId: "list-sessions",
              methodName: "listSessions",
              path: "/sessions",
              method: "GET",
              summary: "List sessions",
              description: "",
              parameters: [{
                name: "buildId",
                in: "path",
                required: true,
                schema: { type: "string" },
              }],
            },
          },
        },
      },
    }];
    const specInfoMap: SpecInfoMap = { automate: { title: "Automate", description: "" } };
    const output = generateTUIManifestTS(metadata, specInfoMap);
    
    const jsonMatch = output.match(/export const TUI_MANIFEST: TUIProduct\[\] = (\[[\s\S]*\]);/);
    const parsed = JSON.parse(jsonMatch![1]);
    
    const field = parsed[0].resources[0].actions[0].fields[0];
    expect(field.name).toBe("buildId");
    expect(field.secret).toBeFalsy();
  });
});
