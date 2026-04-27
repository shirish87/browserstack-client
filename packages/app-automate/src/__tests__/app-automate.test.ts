import { components } from "@dot-slash/browserstack-openapi";
import type { DeepCamelCase } from "@dot-slash/browserstack-openapi-transforms";
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
      const data = await client.getDevices();
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
      const data = await client.getPlan();
      expect(data).toBeDefined();
      expect(data.automatePlan).toBeDefined();
      expect(data.automatePlan.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<DeepCamelCase<components["schemas"]["AutomatePlan"]>>();
    });
  });

  describe("Projects", () => {
    test("getAppAutomateProjects", async () => {
      const { client } = appAutomateContext;
      const data = await client.getProjects();
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
      const data = await client.getProject(String(projectId));
      expect(data).toBeDefined();
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AutomateProject"]>
      >();
    });

    test("updateAppAutomateProject", async () => {
      const { client, randomProjectId } = appAutomateContext;
      const projectId = await randomProjectId();
      const newName = `project-${Math.random().toString(36).substring(7)}`;
      const data = await client.updateProject(String(projectId), {
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
      const data = await client.getProjectBadgeKey(String(projectId));
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toBeString();
    });
  });

  describe("Builds", () => {
    test("getAppAutomateBuilds", async () => {
      const { client } = appAutomateContext;
      const data = await client.getBuilds();
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
      const data = await client.getBuild(buildId);
      expect(data).toBeDefined();
      expect(data.automationBuild).toBeDefined();
    });

    test("updateAppAutomateBuild", async () => {
      const { client, randomBuildId } = appAutomateContext;
      const buildId = await randomBuildId();
      const data = await client.updateBuild(buildId, {
        buildTag: "pricing-build",
      });

      if ("automationBuild" in data) {
        expect(data.automationBuild.buildTag).toBeDefined();
      }
    });

    test("uploadAppAutomateBuildTerminalLogs", async () => {
      const { client, randomBuildId } = appAutomateContext;
      const buildId = await randomBuildId();
      const data = await client.uploadBuildTerminalLogs(buildId, {
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
      const data = await client.getSession(sessionId);
      expect(data).toBeDefined();
      expect(data).haveOwnProperty("status");
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AppAutomateSession"]>
      >();
    });

    test("updateAppAutomateSession", async () => {
      const { client, randomSessionId } = appAutomateContext;
      const sessionId = await randomSessionId();
      const data = await client.updateSession(sessionId, {
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
      const data = await client.uploadSessionTerminalLogs(sessionId, {
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
        const build = await client.getBuild(buildId);
        const sessions = build.sessions ?? [];
        const sessionId = sessions[0]?.automationSession?.hashedId;
        const data = await client.getSessionLogs(buildId, sessionId!);
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<string>();
      });

      test("getAppAutomateDeviceLogs", async () => {
        const { client, randomBuildId } = appAutomateContext;
        const buildId = await randomBuildId();
        const build = await client.getBuild(buildId);
        const sessions = build.sessions ?? [];
        const sessionId = sessions[0]?.automationSession?.hashedId;
        const data = await client.getDeviceLogs(buildId, sessionId!);
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<string>();
      });

      test("getAppAutomateAppiumLogs", async () => {
        const { client, randomBuildId } = appAutomateContext;
        const buildId = await randomBuildId();
        const build = await client.getBuild(buildId);
        const sessions = build.sessions ?? [];

        let data: string | undefined;
        for (const session of sessions) {
          const sId = session.automationSession?.hashedId;
          try {
            data = await client.getAppiumLogs(buildId, sId!);
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
        const build = await client.getBuild(buildId);
        const sessions = build.sessions ?? [];

        let data: DeepCamelCase<components["schemas"]["AppAutomateAppProfilingV1"]>[] | undefined;
        for (const session of sessions) {
          const sId = session.automationSession?.hashedId;
          try {
            data = await client.getAppProfilingDataV1(buildId, sId!);
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
        const build = await client.getBuild(buildId);
        const sessions = build.sessions ?? [];
        const sessionId = sessions[0]?.automationSession?.hashedId;
        const data = await client.getAppProfilingDataV2(buildId, sessionId!);
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
      const data = await client.uploadMediaFile({
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
      const data = await client.getMediaFiles();
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("getAppAutomateMediaFilesByCustomId", async () => {
      const { client } = appAutomateContext;
      const data = await client.getMediaFilesByCustomId("terminal-logs");
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("getAppAutomateGroupMediaFiles", async () => {
      const { client } = appAutomateContext;
      const data = await client.getGroupMediaFiles();
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("deleteAppAutomateMediaFile", async () => {
      const { client } = appAutomateContext;
      const uploaded = await client.uploadMediaFile({
        file: new Blob(["delete-me"], { type: "text/plain" }),
        fileName: "delete-me.txt",
      });
      if (!("mediaId" in uploaded)) return;
      const data = await client.deleteMediaFile(uploaded.mediaId!);
      expect(data).toBeDefined();
      if ("success" in data) {
        expect(data.success).toBe(true);
      }
    }, EXTENDED_TIMEOUT);
  });

  describe("Appium Apps", () => {
    test("uploadAppAutomateApp", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadApp({
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
      const data = await client.getApps();
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("getAppAutomateAppsByCustomId", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppsByCustomId("example-app");
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("getAppAutomateGroupApps", async () => {
      const { client } = appAutomateContext;
      const data = await client.getGroupApps();
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("deleteAppAutomateApp", async () => {
      const { client } = appAutomateContext;
      const uploaded = await client.uploadApp({
        url: "https://github.com/markushi/android-ui/raw/a589fad7b74ace063c2b0e90741d43225b200a18/example.apk",
        fileName: "example.apk",
      });
      if (!("appId" in uploaded)) return;
      const data = await client.deleteApp(uploaded.appId!);
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
        const data = await client.uploadFlutterAndroidApp({
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
        const data = await client.getFlutterAndroidApps();
        expect(data).toBeDefined();
        if (Array.isArray(data)) {
          expect(data.length).toBeGreaterThan(0);
        }
      });

      test("getAppAutomateFlutterAndroidApp", async () => {
        const { client, randomFlutterAndroidAppId } = appAutomateContext;
        const appId = await randomFlutterAndroidAppId();
        const data = await client.getFlutterAndroidApp(appId);
        expect(data).toBeDefined();
        if ("appUrl" in data) {
          expect(data.appUrl).toBeDefined();
        }
      });

      test("deleteAppAutomateFlutterAndroidApp", async () => {
        const { client } = appAutomateContext;
        const uploaded = await client.uploadFlutterAndroidApp({
          url: "https://github.com/TheAlphamerc/flutter_ecommerce_app/releases/download/v1.0.0/app-release.apk",
          fileName: "example.apk",
        });
        if (!("appId" in uploaded)) return;
        const data = await client.deleteFlutterAndroidApp(uploaded.appId!);
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

        const data = await client.uploadFlutteriOSApp({
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
        const data = await client.getFlutteriOSApps();
        expect(data).toBeDefined();
        if (Array.isArray(data)) {
          expect(data.length).toBeGreaterThan(0);
        }
      });

      test("getAppAutomateFlutteriOSApp", async () => {
        const { client, randomFlutteriOSTestPackageId } = appAutomateContext;
        const appId = await randomFlutteriOSTestPackageId();
        const data = await client.getFlutteriOSApp(appId);
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
      const data = await client.uploadEspressoApp({
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
      const data = await client.getEspressoApps();
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("getAppAutomateEspressoApp", async () => {
      const { client, randomEspressoAppId } = appAutomateContext;
      const appId = await randomEspressoAppId();
      const data = await client.getEspressoApp(appId);
      expect(data).toBeDefined();
      if ("appUrl" in data) {
        expect(data.appUrl).toBeDefined();
      }
    });
  });

  describe("XCUITest Apps", () => {
    test("uploadAppAutomateXCUITestApp", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadXCUITestApp({
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
      const data = await client.getXCUITestApps();
      expect(data).toBeDefined();
      if (Array.isArray(data)) {
        expect(data.length).toBeGreaterThan(0);
      }
    });

    test("getAppAutomateXCUITestApp", async () => {
      const { client, randomXCUITestAppId } = appAutomateContext;
      const appId = await randomXCUITestAppId();
      const data = await client.getXCUITestApp(appId);
      expect(data).toBeDefined();
      if ("appUrl" in data) {
        expect(data.appUrl).toBeDefined();
      }
    });

    test("deleteAppAutomateXCUITestApp", async () => {
      const { client } = appAutomateContext;
      const uploaded = await client.uploadXCUITestApp({
        url: "https://github.com/aws-samples/aws-device-farm-sample-app-for-ios/raw/58e48234db510bd4fbf643643e8808c5d6a13845/prebuilt/prebuiltXCUITests.ipa",
        fileName: "prebuiltXCUITests.ipa",
      });
      if (!("appId" in uploaded)) return;
      const data = await client.deleteXCUITestApp(uploaded.appId!);
      expect(data).toBeDefined();
      if ("success" in data) {
        expect(data.success).toBeDefined();
      }
    }, LONG_TIMEOUT);
  }, EXTENDED_TIMEOUT);

  describe("Detox Android Apps", () => {
    test("uploadAppAutomateDetoxAndroidApp", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadDetoxAndroidApp({
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
      const data = await client.uploadDetoxAndroidAppClient({
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
