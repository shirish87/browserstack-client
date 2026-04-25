import { components } from "@browserstack-client/openapi";
import type { DeepCamelCase } from "@browserstack-client/openapi-transforms";
import { zipSync } from "fflate";
import { describe, expect, expectTypeOf, test } from "vitest";
import { appAutomateContext } from "./setup.ts";

const TIMEOUT = 10_000;
const EXTENDED_TIMEOUT = 15_000;
const LONG_TIMEOUT = 30_000;

describe("AppAutomateClient", () => {
  describe("Devices", () => {
    test("getAppAutomateDevices", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppAutomateDevices();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AppAutomateDevice"]>[]
      >();
    });
  });

  describe("Plan", () => {
    test("getAppAutomatePlan", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppAutomatePlan();
      expect(data).toBeDefined();
      expect(data.automatePlan).toBeDefined();
      expect(data.automatePlan.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<DeepCamelCase<components["schemas"]["AutomatePlan"]>>();
    });
  });

  describe("Projects", () => {
    test("getAppAutomateProjects", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppAutomateProjects();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AutomateProject"]>[]
      >();
    });

    test("getAppAutomateProject", async () => {
      const { client, randomProjectId } = appAutomateContext;
      const projectId = await randomProjectId();
      const data = await client.getAppAutomateProject(String(projectId));
      expect(data).toBeDefined();
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AutomateProject"]>
      >();
    });

    test("updateAppAutomateProject", async () => {
      const { client, randomProjectId } = appAutomateContext;
      const projectId = await randomProjectId();
      const newName = `project-${Math.random().toString(36).substring(7)}`;
      const data = await client.updateAppAutomateProject(String(projectId), {
        name: newName,
      });

      expect(data).toBeDefined();
      expect(data.name).toBeDefined();
      expect(data.name).toEqual(newName);
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AutomateProject"]>
      >();
    });

    test("getAppAutomateProjectBadgeKey", async () => {
      const { client, randomProjectId } = appAutomateContext;
      const projectId = await randomProjectId();
      const data = await client.getAppAutomateProjectBadgeKey(String(projectId));
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toBeString();
    });
  });

  describe("Builds", () => {
    test("getAppAutomateBuilds", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppAutomateBuilds();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AutomateBuild"]>[]
      >();
    });

    test("getAppAutomateBuild", async () => {
      const { client, randomBuildId } = appAutomateContext;
      const buildId = await randomBuildId();
      const data = await client.getAppAutomateBuild(buildId);
      expect(data).toBeDefined();
      expect(data.automationBuild).toBeDefined();
    });

    test("updateAppAutomateBuild", async () => {
      const { client, randomBuildId } = appAutomateContext;
      const buildId = await randomBuildId();
      const data = await client.updateAppAutomateBuild(buildId, {
        buildTag: "pricing-build",
      });

      if ("automationBuild" in data) {
        expect(data.automationBuild.buildTag).toBeDefined();
      }
    });

    test("uploadAppAutomateBuildTerminalLogs", async () => {
      const { client, randomBuildId } = appAutomateContext;
      const buildId = await randomBuildId();
      const data = await client.uploadAppAutomateBuildTerminalLogs(buildId, {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        fileName: "terminal.txt",
      });

      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<string>();
    }, TIMEOUT);
  });

  describe("Sessions", () => {
    test("getAppAutomateSession", async () => {
      const { client, randomSessionId } = appAutomateContext;
      const sessionId = await randomSessionId();
      const data = await client.getAppAutomateSession(sessionId);
      expect(data).toBeDefined();
      expect(data).haveOwnProperty("status");
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AppAutomateSession"]>
      >();
    });

    test("updateAppAutomateSession", async () => {
      const { client, randomSessionId } = appAutomateContext;
      const sessionId = await randomSessionId();
      const data = await client.updateAppAutomateSession(sessionId, {
        status: "passed",
        reason: "pricing-error",
      });

      expect(data).toBeDefined();
      expect(data).haveOwnProperty("status");
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AppAutomateSession"]>
      >();
    });

    test("uploadAppAutomateSessionTerminalLogs", async () => {
      const { client, randomSessionId } = appAutomateContext;
      const sessionId = await randomSessionId();
      const data = await client.uploadAppAutomateSessionTerminalLogs(sessionId, {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        fileName: "terminal.txt",
      });

      expect(data).toBeDefined();
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<string>();
    }, TIMEOUT);

    describe("Logs", () => {
      test("getAppAutomateSessionLogs", async () => {
        const { client, randomBuildId } = appAutomateContext;
        const buildId = await randomBuildId();
        const build = await client.getAppAutomateBuild(buildId);
        const sessions = build.sessions ?? [];
        const sessionId = sessions[0]?.automationSession?.hashedId;
        const data = await client.getAppAutomateSessionLogs(buildId, sessionId!);
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<string>();
      });

      test("getAppAutomateDeviceLogs", async () => {
        const { client, randomBuildId } = appAutomateContext;
        const buildId = await randomBuildId();
        const build = await client.getAppAutomateBuild(buildId);
        const sessions = build.sessions ?? [];
        const sessionId = sessions[0]?.automationSession?.hashedId;
        const data = await client.getAppAutomateDeviceLogs(buildId, sessionId!);
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<string>();
      });

      test("getAppAutomateAppiumLogs", async () => {
        const { client, randomBuildId } = appAutomateContext;
        const buildId = await randomBuildId();
        const build = await client.getAppAutomateBuild(buildId);
        const sessions = build.sessions ?? [];

        let data: string | undefined;
        for (const session of sessions) {
          const sId = session.automationSession?.hashedId;
          try {
            data = await client.getAppAutomateAppiumLogs(buildId, sId!);
            if (data) break;
          } catch {
            // logs may not exist for this session, try next
          }
        }

        expect(data).toBeDefined();
        expect(typeof data).toBe("string");
        if (data) {
          expect(data.length).toBeGreaterThan(0);
          expectTypeOf(data).toMatchTypeOf<string>();
        }
      });

      test("getAppAutomateAppProfilingDataV1", async () => {
        const { client, randomBuildId } = appAutomateContext;
        const buildId = await randomBuildId();
        const build = await client.getAppAutomateBuild(buildId);
        const sessions = build.sessions ?? [];

        let data: DeepCamelCase<components["schemas"]["AppAutomateAppProfilingV1"]>[] | undefined;
        for (const session of sessions) {
          const sId = session.automationSession?.hashedId;
          try {
            data = await client.getAppAutomateAppProfilingDataV1(buildId, sId!);
            if (data) break;
          } catch {
            // profiling may not be available for this session (e.g. iOS), try next
          }
        }

        expect(data).toBeDefined();
        expect(Array.isArray(data)).toBe(true);
        if (data) {
          expect(data.length).toBeGreaterThan(0);
          expectTypeOf(data).toMatchTypeOf<
            DeepCamelCase<components["schemas"]["AppAutomateAppProfilingV1"]>[]
          >();
        }
      });

      test("getAppAutomateAppProfilingDataV2", async () => {
        const { client, randomBuildId } = appAutomateContext;
        const buildId = await randomBuildId();
        const build = await client.getAppAutomateBuild(buildId);
        const sessions = build.sessions ?? [];
        const sessionId = sessions[0]?.automationSession?.hashedId;
        const data = await client.getAppAutomateAppProfilingDataV2(buildId, sessionId!);
        expect(data).toBeDefined();
        expect(data).toBeInstanceOf(Object);
        expect(data.metadata).toBeInstanceOf(Object);
        expect(data.data).toBeInstanceOf(Object);
        expectTypeOf(data).toMatchTypeOf<
          DeepCamelCase<components["schemas"]["AppAutomateAppProfilingV2"]>
        >();
      });
    }, EXTENDED_TIMEOUT);
  });

  describe("Media Files", () => {
    test("uploadAppAutomateMediaFile", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadAppAutomateMediaFile({
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        fileName: "terminal.txt",
      });

      expect(data).toBeDefined();
      if ("mediaUrl" in data) {
        expect(data.mediaUrl).toBeDefined();
        expectTypeOf(data.mediaUrl).toMatchTypeOf<string>();
      }
    });

    test("getAppAutomateMediaFiles", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppAutomateMediaFiles();
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("getAppAutomateMediaFilesByCustomId", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppAutomateMediaFilesByCustomId("terminal-logs");
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("getAppAutomateGroupMediaFiles", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppAutomateGroupMediaFiles();
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("deleteAppAutomateMediaFile", async () => {
      const { client } = appAutomateContext;
      const uploaded = await client.uploadAppAutomateMediaFile({
        file: new Blob(["delete-me"], { type: "text/plain" }),
        fileName: "delete-me.txt",
      });
      if (!("mediaId" in uploaded)) return;
      const data = await client.deleteAppAutomateMediaFile(uploaded.mediaId!);
      expect(data).toBeDefined();
      if ("success" in data) {
        expect(data.success).toBe(true);
      }
    }, EXTENDED_TIMEOUT);
  });

  describe("Appium Apps", () => {
    test("uploadAppAutomateApp", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadAppAutomateApp({
        url: "https://github.com/markushi/android-ui/raw/a589fad7b74ace063c2b0e90741d43225b200a18/example.apk",
        fileName: "example.apk",
      });

      expect(data).toBeDefined();
      if ("appUrl" in data) {
        expect(data.appUrl).toBeDefined();
        expectTypeOf(data.appUrl).toMatchTypeOf<string>();
      }
    });

    test("getAppAutomateApps", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppAutomateApps();
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("getAppAutomateAppsByCustomId", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppAutomateAppsByCustomId("example-app");
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("getAppAutomateGroupApps", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppAutomateGroupApps();
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("deleteAppAutomateApp", async () => {
      const { client } = appAutomateContext;
      const uploaded = await client.uploadAppAutomateApp({
        url: "https://github.com/markushi/android-ui/raw/a589fad7b74ace063c2b0e90741d43225b200a18/example.apk",
        fileName: "example.apk",
      });
      if (!("appId" in uploaded)) return;
      const data = await client.deleteAppAutomateApp(uploaded.appId!);
      expect(data).toBeDefined();
      if ("success" in data) {
        expect(data.success).toBe(true);
      }
    }, LONG_TIMEOUT);
  });

  describe("Flutter Apps", () => {
    describe("Flutter Android Apps", () => {
      test("uploadAppAutomateFlutterAndroidApp", async () => {
        const { client } = appAutomateContext;
        const data = await client.uploadAppAutomateFlutterAndroidApp({
          url: "https://github.com/TheAlphamerc/flutter_ecommerce_app/releases/download/v1.0.0/app-release.apk",
          fileName: "example.apk",
        });

        expect(data).toBeDefined();
        if ("appUrl" in data) {
          expect(data.appUrl).toBeDefined();
          expectTypeOf(data.appUrl).toMatchTypeOf<string>();
        }
      });

      test("getAppAutomateFlutterAndroidApps", async () => {
        const { client } = appAutomateContext;
        const data = await client.getAppAutomateFlutterAndroidApps();
        expect(data).toBeDefined();
        if (Array.isArray(data)) {
          expect(data.length).toBeGreaterThan(0);
        }
      });

      test("getAppAutomateFlutterAndroidApp", async () => {
        const { client, randomFlutterAndroidAppId } = appAutomateContext;
        const appId = await randomFlutterAndroidAppId();
        const data = await client.getAppAutomateFlutterAndroidApp(appId);
        expect(data).toBeDefined();
        if ("appUrl" in data) {
          expect(data.appUrl).toBeDefined();
        }
      });

      test("deleteAppAutomateFlutterAndroidApp", async () => {
        const { client } = appAutomateContext;
        const uploaded = await client.uploadAppAutomateFlutterAndroidApp({
          url: "https://github.com/TheAlphamerc/flutter_ecommerce_app/releases/download/v1.0.0/app-release.apk",
          fileName: "example.apk",
        });
        if (!("appId" in uploaded)) return;
        const data = await client.deleteAppAutomateFlutterAndroidApp(uploaded.appId!);
        expect(data).toBeDefined();
        if ("success" in data) {
          expect(data.success).toBeDefined();
        }
      }, LONG_TIMEOUT);
    });

    describe("Flutter iOS Apps", () => {
      test("uploadAppAutomateFlutteriOSApp", async () => {
        const { client } = appAutomateContext;
        const zipped = zipSync({
          "example.app": new Uint8Array([1, 2, 3, 4, 5]),
        });

        const data = await client.uploadAppAutomateFlutteriOSApp({
          file: new Blob([zipped.buffer as ArrayBuffer], { type: "application/zip" }),
          fileName: "example.zip",
        });

        expect(data).toBeDefined();
        if ("testPackageUrl" in data) {
          expect(data.testPackageUrl).toBeDefined();
          expectTypeOf(data.testPackageUrl).toMatchTypeOf<string>();
        }
      });

      test("getAppAutomateFlutteriOSApps", async () => {
        const { client } = appAutomateContext;
        const data = await client.getAppAutomateFlutteriOSApps();
        expect(data).toBeDefined();
        if (Array.isArray(data)) {
          expect(data.length).toBeGreaterThan(0);
        }
      });

      test("getAppAutomateFlutteriOSApp", async () => {
        const { client, randomFlutteriOSTestPackageId } = appAutomateContext;
        const appId = await randomFlutteriOSTestPackageId();
        const data = await client.getAppAutomateFlutteriOSApp(appId);
        expect(data).toBeDefined();
        if ("testPackageUrl" in data) {
          expect(data.testPackageUrl).toBeDefined();
        }
      });
    });
  });

  describe("Espresso Apps", () => {
    test("uploadAppAutomateEspressoApp", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadAppAutomateEspressoApp({
        url: "https://github.com/aws-samples/aws-device-farm-sample-app-for-android/raw/master/prebuilt/app-debug.apk",
        fileName: "app-debug.apk",
      });

      expect(data).toBeDefined();
      if ("appUrl" in data) {
        expect(data.appUrl).toBeDefined();
        expectTypeOf(data.appUrl).toMatchTypeOf<string>();
      }
    }, EXTENDED_TIMEOUT);

    test("getAppAutomateEspressoApps", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppAutomateEspressoApps();
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("getAppAutomateEspressoApp", async () => {
      const { client, randomEspressoAppId } = appAutomateContext;
      const appId = await randomEspressoAppId();
      const data = await client.getAppAutomateEspressoApp(appId);
      expect(data).toBeDefined();
      if ("appUrl" in data) {
        expect(data.appUrl).toBeDefined();
      }
    });
  });

  describe("XCUITest Apps", () => {
    test("uploadAppAutomateXCUITestApp", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadAppAutomateXCUITestApp({
        url: "https://github.com/aws-samples/aws-device-farm-sample-app-for-ios/raw/58e48234db510bd4fbf643643e8808c5d6a13845/prebuilt/prebuiltXCUITests.ipa",
        fileName: "prebuiltXCUITests.ipa",
      });

      expect(data).toBeDefined();
      if ("appUrl" in data) {
        expect(data.appUrl).toBeDefined();
        expectTypeOf(data.appUrl).toMatchTypeOf<string>();
      }
    });

    test("getAppAutomateXCUITestApps", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppAutomateXCUITestApps();
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("getAppAutomateXCUITestApp", async () => {
      const { client, randomXCUITestAppId } = appAutomateContext;
      const appId = await randomXCUITestAppId();
      const data = await client.getAppAutomateXCUITestApp(appId);
      expect(data).toBeDefined();
      if ("appUrl" in data) {
        expect(data.appUrl).toBeDefined();
      }
    });

    test("deleteAppAutomateXCUITestApp", async () => {
      const { client } = appAutomateContext;
      const uploaded = await client.uploadAppAutomateXCUITestApp({
        url: "https://github.com/aws-samples/aws-device-farm-sample-app-for-ios/raw/58e48234db510bd4fbf643643e8808c5d6a13845/prebuilt/prebuiltXCUITests.ipa",
        fileName: "prebuiltXCUITests.ipa",
      });
      if (!("appId" in uploaded)) return;
      const data = await client.deleteAppAutomateXCUITestApp(uploaded.appId!);
      expect(data).toBeDefined();
      if ("success" in data) {
        expect(data.success).toBeDefined();
      }
    }, LONG_TIMEOUT);
  }, EXTENDED_TIMEOUT);

  describe("Detox Android Apps", () => {
    test("uploadAppAutomateDetoxAndroidApp", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadAppAutomateDetoxAndroidApp({
        url: "https://github.com/aws-samples/aws-device-farm-sample-app-for-android/raw/f3025888cec435e547e85abc965e040f5da85910/prebuilt/app-debug.apk",
        fileName: "example.apk",
      });

      expect(data).toBeDefined();
      if ("appUrl" in data) {
        expect(data.appUrl).toBeDefined();
        expectTypeOf(data.appUrl).toMatchTypeOf<string>();
      }
    });

    test("uploadAppAutomateDetoxAndroidAppClient", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadAppAutomateDetoxAndroidAppClient({
        url: "https://github.com/aws-samples/aws-device-farm-sample-app-for-android/raw/f3025888cec435e547e85abc965e040f5da85910/prebuilt/app-debug.apk",
        fileName: "example.apk",
      });

      expect(data).toBeDefined();
      if ("appUrl" in data) {
        expect(data.appUrl).toBeDefined();
        expectTypeOf(data.appUrl).toMatchTypeOf<string>();
      }
    });
  });
});
