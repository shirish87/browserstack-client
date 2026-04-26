import { describe, expect, test } from "vitest";
import { accessibilityContext } from "./setup.ts";

const TIMEOUT = 30_000;

async function executeTest(callApi: () => Promise<unknown>, validate: (response: unknown) => void) {
  try {
    const response = await callApi();
    validate(response);
  } catch (err) {
    if (
      err !== null &&
      typeof err === "object" &&
      "status" in err &&
      err.status === 401 &&
      "message" in err &&
      typeof err.message === "string" &&
      err.message.includes("External APIs")
    ) {
      console.warn("Skipping test assertion due to lack of API access: ", err.message);
      expect(true).toBe(true); // pass
    } else {
      throw err;
    }
  }
}

describe("AccessibilityClient", () => {
  describe("Workflow Analyzer", () => {
    test("getAccessibilityWorkflowAnalyzerReports", async () => {
      const { client } = accessibilityContext;
      await executeTest(() => client.getWorkflowAnalyzerReports(), (response) => {
        expect(response).toBeDefined();
        expect(Array.isArray(response)).toBe(true);
      });
    }, TIMEOUT);
  });

  describe("Assisted Tests", () => {
    test("getAccessibilityAssistedTestReports", async () => {
      const { client } = accessibilityContext;
      await executeTest(() => client.getAssistedTestReports(), (response) => {
        expect(response).toBeDefined();
        expect(Array.isArray(response)).toBe(true);
      });
    }, TIMEOUT);
  });

  describe("Website Scanner", () => {
    test("getAccessibilityWebsiteScannerAuthConfigs", async () => {
      const { client } = accessibilityContext;
      await executeTest(() => client.getWebsiteScannerAuthConfigs(), (configs) => {
        expect(configs).toBeDefined();
        expect(Array.isArray(configs)).toBe(true);
      });
    }, TIMEOUT);

    test("createAccessibilityWebsiteScannerAuthConfig", async () => {
      const { client } = accessibilityContext;
      await executeTest(() => client.createWebsiteScannerAuthConfig({
        name: `test-auth-${Date.now()}`,
        type: "basic",
        authData: {
          url: "https://example.com/login",
          username: "testuser",
          password: "password123",
          usernameSelector: "#user",
          passwordSelector: "#pass",
          submitSelector: "#submit"
        },
      }), (config) => {
        expect(config).toBeDefined();
        expect(config !== null && typeof config === "object" && "id" in config).toBe(true);
      });
    }, TIMEOUT);

    test("getAccessibilityWebsiteScannerScans", async () => {
      const { client } = accessibilityContext;
      await executeTest(() => client.getWebsiteScannerScans(), (scans) => {
        expect(scans).toBeDefined();
        expect(Array.isArray(scans)).toBe(true);
      });
    }, TIMEOUT);

    test("createAccessibilityWebsiteScannerScan", async () => {
      const { client } = accessibilityContext;
      await executeTest(() => client.createWebsiteScannerScan({
        scanUrl: "https://example.com",
      }), (scan) => {
        expect(scan).toBeDefined();
        expect(scan !== null && typeof scan === "object" && "id" in scan).toBe(true);
      });
    }, TIMEOUT);
  });

  describe("Automated Tests", () => {
    test("getAccessibilityAutomatedTestProjects", async () => {
      const { client } = accessibilityContext;
      await executeTest(() => client.getAutomatedTestProjects(), (projects) => {
        expect(projects).toBeDefined();
        expect(Array.isArray(projects)).toBe(true);
      });
    }, TIMEOUT);

    test("getAccessibilityAutomatedTestBuilds", async () => {
      const { client } = accessibilityContext;
      await executeTest(() => client.getAutomatedTestBuilds(), (builds) => {
        expect(builds).toBeDefined();
        expect(Array.isArray(builds)).toBe(true);
      });
    }, TIMEOUT);
  });
});
