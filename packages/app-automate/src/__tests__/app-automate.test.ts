import { FlutterPlatform } from "@browserstack-client/app-automate";
import { components } from "@browserstack-client/openapi";
import { zipSync } from "fflate";
import { describe, expect, expectTypeOf, test } from "vitest";
import type { BrowserStackTestContext } from "./setup.ts";
import { appAutomateContext } from "./setup.ts";

describe("AppAutomateClient", () => {
  describe("Devices", () => {
    test("getDevices", async () => {
      const { client } = appAutomateContext;
      const data = await client.getDevices();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateDevice"][]
      >();
    });
  });

  describe("Plan", () => {
    test("getPlan", async () => {
      const { client } = appAutomateContext;
      const data = await client.getPlan();
      expect(data).toBeDefined();
      expect(data.automate_plan).toBeDefined();
      expect(data.automate_plan.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomatePlan"]>();
    });
  });

  describe("Projects", () => {
    test("getProjects", async () => {
      const { client } = appAutomateContext;
      const data = await client.getProjects();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateProject"][]
      >();
    });

    test("getProject", async () => {
      const { client, randomProjectId} = appAutomateContext;
      const projectId = await randomProjectId();
      const data = await client.getProject(projectId);
      expect(data).toBeDefined();
      expect(data.builds).toBeInstanceOf(Array);
      expect(data.builds.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateProject"]
      >();
    });

    test("updateProject", async () => {
      const { client, randomProjectId} = appAutomateContext;
      const projectId = await randomProjectId();
      const newName = `project-${Math.random().toString(36).substring(7)}`;
      const data = await client.updateProject(projectId, {
        name: newName,
      });

      expect(data).toBeDefined();
      expect(data.name).toBeDefined();
      expect(data.name).toEqual(newName);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateProject"]
      >();
    });

    test("getBadgeKey", async () => {
      const { client, randomProjectId} = appAutomateContext;
      const projectId = await randomProjectId();
      const data = await client.getBadgeKey(projectId);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toBeString();
    });

    test.skip("deleteProject", async () => {
      const { client, randomProjectId} = appAutomateContext;
      const projectId = await randomProjectId();
      const data = await client.deleteProject(projectId);
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Object);
      expect(data).haveOwnProperty("status");
      expect(data.status).toEqual("ok");
      expect(data).haveOwnProperty("message");
    });
  });

  describe("Builds", () => {
    test("getBuilds", async () => {
      const { client } = appAutomateContext;
      const data = await client.getBuilds();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateBuild"][]
      >();
    });

    test("getBuild", async () => {
      const { client, randomBuildId} = appAutomateContext;
      const buildId = await randomBuildId();
      const data = await client.getBuild(buildId);
      expect(data).toBeDefined();
      expect(data.sessions).toBeInstanceOf(Array);
      expect(data.sessions.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateBuild"]
      >();
    });

    test("updateBuild", async () => {
      const { client, randomBuildId} = appAutomateContext;
      const buildId = await randomBuildId();
      const data = await client.updateBuild(buildId, {
        build_tag: "pricing-build",
      });

      expect(data.build_tag).toBeDefined();
      expect(data.build_tag).toEqual("pricing-build");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateBuild"]
      >();
    });

    test("uploadBuildTerminalLogs", async () => {
      const { client, randomBuildId} = appAutomateContext;
      const buildId = await randomBuildId();
      const data = await client.uploadBuildTerminalLogs(buildId, {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        filename: "terminal.txt",
      });

      expect(data).toBeDefined();
      expect(data.message).toBeDefined();
      expect(data.message.length).toBeGreaterThan(0);
      expectTypeOf(data.message).toMatchTypeOf<string>();
    }, 10_000);

    test.skip("deleteBuild", async () => {
      const { client, randomBuildId} = appAutomateContext;
      const buildId = await randomBuildId();
      const data = await client.deleteBuild(buildId);
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Object);
      expect(data).haveOwnProperty("status");
      expect(data.status).toEqual("ok");
      expect(data).haveOwnProperty("message");
    });
  });

  describe("Sessions", () => {
    test("getSession", async () => {
      const { client, randomSessionId} = appAutomateContext;
      const sessionId = await randomSessionId();
      const data = await client.getSession(sessionId);
      expect(data).toBeDefined();
      expect(data).haveOwnProperty("status");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateSession"]
      >();
    });

    test("updateSessionStatus", async () => {
      const { client, randomSessionId} = appAutomateContext;
      const sessionId = await randomSessionId();
      const data = await client.updateSessionStatus(sessionId, {
        status: "passed",
        reason: "pricing-error",
      });

      expect(data).toBeDefined();
      expect(data.status).toBeDefined();
      expect(data.status).toEqual("passed");
      expect(data.reason).toBeDefined();
      expect(data.reason).toEqual("pricing-error");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateSession"]
      >();
    });

    test("uploadSessionTerminalLogs", async () => {
      const { client, randomSessionId} = appAutomateContext;
      const sessionId = await randomSessionId();
      const data = await client.uploadSessionTerminalLogs(sessionId, {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        filename: "terminal.txt",
      });

      expect(data).toBeDefined();
      expect(data.message).toBeDefined();
      expect(data.message.length).toBeGreaterThan(0);
      expectTypeOf(data.message).toMatchTypeOf<string>();
    }, 10_000);

    describe("Logs", () => {
      test("getSessionLogs", async () => {
      const { client, randomBuildId} = appAutomateContext;
        const buildId = await randomBuildId();
        const { sessions } = await client.getBuild(buildId);
        const data = await client.getSessionLogs(
          buildId,
          sessions[0].hashed_id
        );
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<string>();
      });

      test("getSessionDeviceLogs", async () => {
      const { client, randomBuildId} = appAutomateContext;
        const buildId = await randomBuildId();
        const { sessions } = await client.getBuild(buildId);
        const data = await client.getSessionDeviceLogs(
          buildId,
          sessions[0].hashed_id
        );
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<string>();
      });

      test("getSessionAppiumLogs", async () => {
      const { client, randomBuildId} = appAutomateContext;
        const buildId = await randomBuildId();
        const { sessions } = await client.getBuild(buildId);

        // Try each session until we find one that has appium logs available
        // (older sessions may have had their logs purged from storage).
        let data: string | undefined;
        for (const session of sessions) {
          try {
            data = await client.getSessionAppiumLogs(buildId, session.hashed_id);
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

      test.skip("getSessionNetworkLogs", async () => {
      const { client, randomBuildId} = appAutomateContext;
        const buildId = await randomBuildId();
        const { sessions } = await client.getBuild(buildId);
        const data = await client.getSessionNetworkLogs(
          buildId,
          sessions[0].hashed_id
        );
        expect(data).toBeDefined();
        expect(data).toBeInstanceOf(Object);
        expect(data.logs).toBeDefined();
        expect(data.logs).toBeInstanceOf(Object);
      });

      test("getSessionAppProfilingDataV1", async () => {
      const { client, randomBuildId} = appAutomateContext;
        const buildId = await randomBuildId();
        const { sessions } = await client.getBuild(buildId);

        // App profiling is only available for Android sessions.
        // Try each session until we find one that supports it.
        let data: components["schemas"]["AppAutomateAppProfilingV1"][] | undefined;
        for (const session of sessions) {
          try {
            data = await client.getSessionAppProfilingDataV1(buildId, session.hashed_id);
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
            components["schemas"]["AppAutomateAppProfilingV1"][]
          >();
        }
      });

      test("getSessionAppProfilingDataV2", async () => {
      const { client, randomBuildId} = appAutomateContext;
        const buildId = await randomBuildId();
        const { sessions } = await client.getBuild(buildId);
        const data = await client.getSessionAppProfilingDataV2(
          buildId,
          sessions[0].hashed_id
        );
        expect(data).toBeDefined();
        expect(data).toBeInstanceOf(Object);
        expect(data.metadata).toBeInstanceOf(Object);
        expect(data.data).toBeInstanceOf(Object);
        expectTypeOf(data).toMatchTypeOf<
          components["schemas"]["AppAutomateAppProfilingV2"]
        >();
      });

      test.skip("deleteSession", async () => {
      const { client, randomSessionId} = appAutomateContext;
        const sessionId = await randomSessionId();
        const data = await client.deleteSession(sessionId);
        expect(data).toBeDefined();
        expect(data).toBeInstanceOf(Object);
        expect(data).haveOwnProperty("status");
        expect(data.status).toEqual("ok");
        expect(data).haveOwnProperty("message");
      });
    }, 15_000);
  });

  describe("Media Files", () => {
    test("uploadMediaFile", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadMediaFile({
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        filename: "terminal.txt",
        custom_id: "terminal-logs",
      });

      expect(data).toBeDefined();
      expect(data.media_url).toBeDefined();
      expectTypeOf(data.media_url).toMatchTypeOf<string>();
    });

    test("getMediaFiles", async () => {
      const { client } = appAutomateContext;
      const data = await client.getMediaFiles();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateMediaFile"][]
      >();
    });

    test("getMediaFilesByCustomId", async () => {
      const { client } = appAutomateContext;
      const data = await client.getMediaFilesByCustomId("terminal-logs");
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].custom_id).toEqual("terminal-logs");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateMediaFile"][]
      >();
    });

    test("getGroupMediaFiles", async () => {
      const { client } = appAutomateContext;
      const data = await client.getGroupMediaFiles();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateMediaFile"][]
      >();
    });

    test.skip("deleteMediaFile", async () => {
      const { client, randomMediaId} = appAutomateContext;
      const mediaId = await randomMediaId();
      const data = await client.deleteMediaFile(mediaId);
      expect(data).toBeDefined();
      expect(data.success).toBeDefined();
      expect(data.success).toBe(true);
      expectTypeOf(data.success).toMatchTypeOf<boolean>();
    });
  });

  describe("Appium Apps", () => {
    test("uploadApp", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadAppiumApp({
        url: "https://github.com/markushi/android-ui/raw/a589fad7b74ace063c2b0e90741d43225b200a18/example.apk",
        filename: "example.apk",
        custom_id: "example-app",
      });

      expect(data).toBeDefined();
      expect(data.app_url).toBeDefined();
      expectTypeOf(data.app_url).toMatchTypeOf<string>();
    });

    test("getApps", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppiumApps();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"][]
      >();
    });

    test("getAppsByCustomId", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppiumAppsByCustomId("example-app");
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].custom_id).toEqual("example-app");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"][]
      >();
    });

    test("getGroupApps", async () => {
      const { client } = appAutomateContext;
      const data = await client.getAppiumGroupApps();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"][]
      >();
    });

    test.skip("deleteApp", async () => {
      const { client, randomAppiumAppId: randomAppId} = appAutomateContext;
      const appId = await randomAppId();
      const data = await client.deleteAppiumApp(appId);
      expect(data).toBeDefined();
      expect(data.success).toBeDefined();
      expect(data.success).toBe(true);
      expectTypeOf(data.success).toMatchTypeOf<boolean>();
    });
  });

  describe("Flutter Apps", () => {
    describe<BrowserStackTestContext>("Flutter Android Apps", (test) => {
      const platform = FlutterPlatform.android;

      test("uploadFlutterApp", async () => {
      const { client } = appAutomateContext;
        const data = await client.uploadFlutterApp(platform, {
          url: "https://github.com/TheAlphamerc/flutter_ecommerce_app/releases/download/v1.0.0/app-release.apk",
          filename: "example.apk",
          custom_id: "example-app",
        });

        expect(data).toBeDefined();
        expect(data.app_url).toBeDefined();
        expectTypeOf(data.app_url).toMatchTypeOf<string>();
      });

      test("getFlutterApps", async () => {
      const { client } = appAutomateContext;
        const data = await client.getFlutterApps(platform);
        expect(data).toBeDefined();
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<
          components["schemas"]["AppAutomateApp"][]
        >();
      });

      test("getAppById", async () => {
      const { client, randomFlutterAndroidAppId} = appAutomateContext;
        const appId = await randomFlutterAndroidAppId();
        const data = await client.getFlutterApp(platform, appId);
        expect(data).toBeDefined();
        expect(data.custom_id).toEqual("example-app");
        expectTypeOf(data).toMatchTypeOf<
          components["schemas"]["AppAutomateApp"]
        >();
      });

      test.skip("deleteApp", async () => {
      const { client, randomFlutterAndroidAppId} = appAutomateContext;
        const appId = await randomFlutterAndroidAppId();
        const data = await client.deleteFlutterApp(platform, appId);
        expect(data).toBeDefined();
        expect(data.success).toBeDefined();
        expect(data.success.message).toBeDefined();
        expectTypeOf(data.success.message).toMatchTypeOf<string>();
      });
    });

    describe("Flutter iOS Apps", (test) => {
      const platform = FlutterPlatform.ios;

      test("uploadFlutterApp", async () => {
      const { client } = appAutomateContext;
        const zipped = zipSync({
          "example.app": new Uint8Array([1, 2, 3, 4, 5]),
        });
        // TODO: find valid zip for flutter example.app

        const data = await client.uploadFlutterApp(platform, {
          file: new Blob([zipped], { type: "application/zip" }),
          filename: "example.zip",
          custom_id: "example-app",
        });

        expect(data).toBeDefined();
        expect(data.test_package_url).toBeDefined();
        expectTypeOf(data.test_package_url).toMatchTypeOf<string>();
      });

      test("getFlutterApps", async () => {
      const { client } = appAutomateContext;
        const data = await client.getFlutterApps(platform);
        expect(data).toBeDefined();
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<
          components["schemas"]["AppAutomateTestPackage"][]
        >();
      });

      test("getAppById", async () => {
      const { client, randomFlutteriOSTestPackageId} = appAutomateContext;
        const appId = await randomFlutteriOSTestPackageId();
        const data = await client.getFlutterApp(platform, appId);
        expect(data).toBeDefined();
        expect(data.custom_id).toEqual("example-app");
        expectTypeOf(data).toMatchTypeOf<
          components["schemas"]["AppAutomateTestPackage"]
        >();
      });

      test.skip("deleteApp", async () => {
      const { client, randomFlutteriOSTestPackageId} = appAutomateContext;
        const appId = await randomFlutteriOSTestPackageId();
        const data = await client.deleteFlutterApp(platform, appId);
        expect(data).toBeDefined();
        expect(data.success).toBeDefined();
        expect(data.success.message).toBeDefined();
        expectTypeOf(data.success.message).toMatchTypeOf<string>();
      });
    });
  });

  describe("Espresso Apps", () => {
    test("uploadEspressoApp", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadEspressoApp({
        url: "https://github.com/aws-samples/aws-device-farm-sample-app-for-android/raw/f3025888cec435e547e85abc965e040f5da85910/prebuilt/app-debug.apk",
        filename: "example.apk",
        custom_id: "example-app",
      });

      expect(data).toBeDefined();
      expect(data.app_url).toBeDefined();
      expectTypeOf(data.app_url).toMatchTypeOf<string>();
    });

    test("getEspressoApps", async () => {
      const { client } = appAutomateContext;
      const data = await client.getEspressoApps();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"][]
      >();
    });

    test("getAppsByCustomId", async () => {
      const { client, randomEspressoAppId} = appAutomateContext;
      const appId = await randomEspressoAppId();
      const data = await client.getEspressoApp(appId);
      expect(data).toBeDefined();
      expect(data.custom_id).toEqual("example-app");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"]
      >();
    });

    test.skip("deleteApp", async () => {
      const { client, randomEspressoAppId} = appAutomateContext;
      const appId = await randomEspressoAppId();
      const data = await client.deleteEspressoApp(appId);
      expect(data).toBeDefined();
      expect(data.success).toBeDefined();
      expect(data.success.message).toBeDefined();
      expectTypeOf(data.success.message).toMatchTypeOf<string>();
    });
  });

  describe("XCUITest Apps", () => {
    test("uploadXCUITestApp", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadXCUITestApp({
        // [BROWSERSTACK_INVALID_XCUI_APP] Invalid XCUI App: Please upload a valid IPA file for XCUI App.
        url: "https://github.com/aws-samples/aws-device-farm-sample-app-for-ios/raw/58e48234db510bd4fbf643643e8808c5d6a13845/prebuilt/prebuiltXCUITests.ipa",
        filename: "prebuiltXCUITests.ipa",
        custom_id: "example-app",
      });

      expect(data).toBeDefined();
      expect(data.app_url).toBeDefined();
      expectTypeOf(data.app_url).toMatchTypeOf<string>();
    });

    test("getXCUITestApps", async () => {
      const { client } = appAutomateContext;
      const data = await client.getXCUITestApps();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"][]
      >();
    });

    test("getAppsByCustomId", async () => {
      const { client, randomXCUITestAppId} = appAutomateContext;
      const appId = await randomXCUITestAppId();
      const data = await client.getXCUITestApp(appId);
      expect(data).toBeDefined();
      expect(data.custom_id).toEqual("example-app");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"]
      >();
    });

    test.skip("deleteApp", async () => {
      const { client, randomXCUITestAppId} = appAutomateContext;
      const appId = await randomXCUITestAppId();
      const data = await client.deleteXCUITestApp(appId);
      expect(data).toBeDefined();
      expect(data.success).toBeDefined();
      expect(data.success.message).toBeDefined();
      expectTypeOf(data.success.message).toMatchTypeOf<string>();
    });
  }, 15_000);

  describe("Detox Android Apps", (test) => {
    test("uploadDetoxApp", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadDetoxAndroidApp("app", {
        url: "https://github.com/aws-samples/aws-device-farm-sample-app-for-android/raw/f3025888cec435e547e85abc965e040f5da85910/prebuilt/app-debug.apk",
        filename: "example.apk",
        custom_id: "example-app",
      });

      expect(data).toBeDefined();
      expect(data.app_url).toBeDefined();
      expectTypeOf(data.app_url).toMatchTypeOf<string>();
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"]
      >();
    });

    test("uploadDetoxAppClient", async () => {
      const { client } = appAutomateContext;
      const data = await client.uploadDetoxAndroidApp("app-client", {
        url: "https://github.com/aws-samples/aws-device-farm-sample-app-for-android/raw/f3025888cec435e547e85abc965e040f5da85910/prebuilt/app-debug.apk",
        filename: "example.apk",
        custom_id: "example-app",
      });

      expect(data).toBeDefined();
      expect(data.app_url).toBeDefined();
      expectTypeOf(data.app_url).toMatchTypeOf<string>();
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"]
      >();
    });
  });
});
