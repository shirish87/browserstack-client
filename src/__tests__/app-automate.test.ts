import { FlutterPlatform } from "@/app-automate.ts"
import { components } from "@/generated/openapi.ts"
import { zipSync } from "fflate";
import { describe, expect, expectTypeOf, test } from "vitest";
import type { BrowserStackTestContext } from "./setup.ts";

describe("AppAutomateClient", () => {
  describe("Devices", () => {
    test<BrowserStackTestContext>("getDevices", async ({
      appAutomate: { client },
    }) => {
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
    test<BrowserStackTestContext>("getPlan", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getPlan();
      expect(data).toBeDefined();
      expect(data.automate_plan).toBeDefined();
      expect(data.automate_plan.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomatePlan"]>();
    });
  });

  describe("Projects", () => {
    test<BrowserStackTestContext>("getProjects", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getProjects();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateProject"][]
      >();
    });

    test<BrowserStackTestContext>("getProject", async ({
      appAutomate: { client, randomProjectId },
    }) => {
      const projectId = await randomProjectId();
      const data = await client.getProject(projectId);
      expect(data).toBeDefined();
      expect(data.builds).toBeInstanceOf(Array);
      expect(data.builds.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateProject"]
      >();
    });

    test<BrowserStackTestContext>("updateProject", async ({
      appAutomate: { client, randomProjectId },
    }) => {
      const projectId = await randomProjectId();
      const data = await client.updateProject(projectId, {
        name: "pricing-project",
      });

      expect(data).toBeDefined();
      expect(data.name).toBeDefined();
      expect(data.name).toEqual("pricing-project");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateProject"]
      >();
    });

    test<BrowserStackTestContext>("getBadgeKey", async ({
      appAutomate: { client, randomProjectId },
    }) => {
      const projectId = await randomProjectId();
      const data = await client.getBadgeKey(projectId);
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toBeString();
    });

    test.skip<BrowserStackTestContext>("deleteProject", async ({
      appAutomate: { client, randomProjectId },
    }) => {
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
    test<BrowserStackTestContext>("getBuilds", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getBuilds();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateBuild"][]
      >();
    });

    test<BrowserStackTestContext>("getBuild", async ({
      appAutomate: { client, randomBuildId },
    }) => {
      const buildId = await randomBuildId();
      const data = await client.getBuild(buildId);
      expect(data).toBeDefined();
      expect(data.sessions).toBeInstanceOf(Array);
      expect(data.sessions.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AutomateBuild"]
      >();
    });

    test<BrowserStackTestContext>("updateBuild", async ({
      appAutomate: { client, randomBuildId },
    }) => {
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

    test<BrowserStackTestContext>("uploadBuildTerminalLogs", async ({
      appAutomate: { client, randomBuildId },
    }) => {
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

    test.skip<BrowserStackTestContext>("deleteBuild", async ({
      appAutomate: { client, randomBuildId },
    }) => {
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
    test<BrowserStackTestContext>("getSession", async ({
      appAutomate: { client, randomSessionId },
    }) => {
      const sessionId = await randomSessionId();
      const data = await client.getSession(sessionId);
      expect(data).toBeDefined();
      expect(data).haveOwnProperty("status");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateSession"]
      >();
    });

    test<BrowserStackTestContext>("updateSessionStatus", async ({
      appAutomate: { client, randomSessionId },
    }) => {
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

    test<BrowserStackTestContext>("uploadSessionTerminalLogs", async ({
      appAutomate: { client, randomSessionId },
    }) => {
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
      test<BrowserStackTestContext>("getSessionLogs", async ({
        appAutomate: { client, randomBuildId },
      }) => {
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

      test<BrowserStackTestContext>("getSessionDeviceLogs", async ({
        appAutomate: { client, randomBuildId },
      }) => {
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

      test<BrowserStackTestContext>("getSessionAppiumLogs", async ({
        appAutomate: { client, randomBuildId },
      }) => {
        const buildId = await randomBuildId();
        const { sessions } = await client.getBuild(buildId);
        const data = await client.getSessionAppiumLogs(
          buildId,
          sessions[0].hashed_id
        );
        expect(data).toBeDefined();
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<string>();
      });

      test.skip<BrowserStackTestContext>("getSessionNetworkLogs", async ({
        appAutomate: { client, randomBuildId },
      }) => {
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

      test<BrowserStackTestContext>("getSessionAppProfilingDataV1", async ({
        appAutomate: { client, randomBuildId },
      }) => {
        const buildId = await randomBuildId();
        const { sessions } = await client.getBuild(buildId);
        const data = await client.getSessionAppProfilingDataV1(
          buildId,
          sessions[0].hashed_id
        );
        expect(data).toBeDefined();
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<
          components["schemas"]["AppAutomateAppProfilingV1"][]
        >();
      });

      test.skip<BrowserStackTestContext>("getSessionAppProfilingDataV2", async ({
        appAutomate: { client, randomBuildId },
      }) => {
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

      test.skip<BrowserStackTestContext>("deleteSession", async ({
        appAutomate: { client, randomSessionId },
      }) => {
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
    test<BrowserStackTestContext>("uploadMediaFile", async ({
      appAutomate: { client },
    }) => {
      const data = await client.uploadMediaFile({
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        filename: "terminal.txt",
        custom_id: "terminal-logs",
      });

      expect(data).toBeDefined();
      expect(data.media_url).toBeDefined();
      expectTypeOf(data.media_url).toMatchTypeOf<string>();
    });

    test<BrowserStackTestContext>("getMediaFiles", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getMediaFiles();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateMediaFile"][]
      >();
    });

    test<BrowserStackTestContext>("getMediaFilesByCustomId", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getMediaFilesByCustomId("terminal-logs");
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].custom_id).toEqual("terminal-logs");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateMediaFile"][]
      >();
    });

    test<BrowserStackTestContext>("getGroupMediaFiles", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getGroupMediaFiles();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateMediaFile"][]
      >();
    });

    test<BrowserStackTestContext>("deleteMediaFile", async ({
      appAutomate: { client, randomMediaId },
    }) => {
      const mediaId = await randomMediaId();
      const data = await client.deleteMediaFile(mediaId);
      expect(data).toBeDefined();
      expect(data.success).toBeDefined();
      expect(data.success).toBe(true);
      expectTypeOf(data.success).toMatchTypeOf<boolean>();
    });
  });

  describe("Appium Apps", () => {
    test<BrowserStackTestContext>("uploadApp", async ({
      appAutomate: { client },
    }) => {
      const data = await client.uploadAppiumApp({
        url: "https://github.com/markushi/android-ui/raw/a589fad7b74ace063c2b0e90741d43225b200a18/example.apk",
        filename: "example.apk",
        custom_id: "example-app",
      });

      expect(data).toBeDefined();
      expect(data.app_url).toBeDefined();
      expectTypeOf(data.app_url).toMatchTypeOf<string>();
    });

    test<BrowserStackTestContext>("getApps", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getAppiumApps();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"][]
      >();
    });

    test<BrowserStackTestContext>("getAppsByCustomId", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getAppiumAppsByCustomId("example-app");
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].custom_id).toEqual("example-app");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"][]
      >();
    });

    test<BrowserStackTestContext>("getGroupApps", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getAppiumGroupApps();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"][]
      >();
    });

    test<BrowserStackTestContext>("deleteApp", async ({
      appAutomate: { client, randomAppiumAppId: randomAppId },
    }) => {
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

      test("uploadFlutterApp", async ({ appAutomate: { client } }) => {
        const data = await client.uploadFlutterApp(platform, {
          url: "https://github.com/TheAlphamerc/flutter_ecommerce_app/releases/download/v1.0.0/app-release.apk",
          filename: "example.apk",
          custom_id: "example-app",
        });

        expect(data).toBeDefined();
        expect(data.app_url).toBeDefined();
        expectTypeOf(data.app_url).toMatchTypeOf<string>();
      });

      test("getFlutterApps", async ({ appAutomate: { client } }) => {
        const data = await client.getFlutterApps(platform);
        expect(data).toBeDefined();
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<
          components["schemas"]["AppAutomateApp"][]
        >();
      });

      test("getAppById", async ({
        appAutomate: { client, randomFlutterAndroidAppId },
      }) => {
        const appId = await randomFlutterAndroidAppId();
        const data = await client.getFlutterApp(platform, appId);
        expect(data).toBeDefined();
        expect(data.custom_id).toEqual("example-app");
        expectTypeOf(data).toMatchTypeOf<
          components["schemas"]["AppAutomateApp"]
        >();
      });

      test("deleteApp", async ({
        appAutomate: { client, randomFlutterAndroidAppId },
      }) => {
        const appId = await randomFlutterAndroidAppId();
        const data = await client.deleteFlutterApp(platform, appId);
        expect(data).toBeDefined();
        expect(data.success).toBeDefined();
        expect(data.success.message).toBeDefined();
        expectTypeOf(data.success.message).toMatchTypeOf<string>();
      });
    });

    describe.skip<BrowserStackTestContext>("Flutter iOS Apps", (test) => {
      const platform = FlutterPlatform.ios;

      test("uploadFlutterApp", async ({ appAutomate: { client } }) => {
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

      test("getFlutterApps", async ({ appAutomate: { client } }) => {
        const data = await client.getFlutterApps(platform);
        expect(data).toBeDefined();
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<
          components["schemas"]["AppAutomateTestPackage"][]
        >();
      });

      test("getAppById", async ({
        appAutomate: { client, randomFlutteriOSTestPackageId },
      }) => {
        const appId = await randomFlutteriOSTestPackageId();
        const data = await client.getFlutterApp(platform, appId);
        expect(data).toBeDefined();
        expect(data.custom_id).toEqual("example-app");
        expectTypeOf(data).toMatchTypeOf<
          components["schemas"]["AppAutomateTestPackage"]
        >();
      });

      test("deleteApp", async ({
        appAutomate: { client, randomFlutteriOSTestPackageId },
      }) => {
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
    test<BrowserStackTestContext>("uploadEspressoApp", async ({
      appAutomate: { client },
    }) => {
      const data = await client.uploadEspressoApp({
        url: "https://github.com/aws-samples/aws-device-farm-sample-app-for-android/raw/f3025888cec435e547e85abc965e040f5da85910/prebuilt/app-debug.apk",
        filename: "example.apk",
        custom_id: "example-app",
      });

      expect(data).toBeDefined();
      expect(data.app_url).toBeDefined();
      expectTypeOf(data.app_url).toMatchTypeOf<string>();
    });

    test<BrowserStackTestContext>("getEspressoApps", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getEspressoApps();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"][]
      >();
    });

    test<BrowserStackTestContext>("getAppsByCustomId", async ({
      appAutomate: { client, randomEspressoAppId },
    }) => {
      const appId = await randomEspressoAppId();
      const data = await client.getEspressoApp(appId);
      expect(data).toBeDefined();
      expect(data.custom_id).toEqual("example-app");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"]
      >();
    });

    test<BrowserStackTestContext>("deleteApp", async ({
      appAutomate: { client, randomEspressoAppId },
    }) => {
      const appId = await randomEspressoAppId();
      const data = await client.deleteEspressoApp(appId);
      expect(data).toBeDefined();
      expect(data.success).toBeDefined();
      expect(data.success.message).toBeDefined();
      expectTypeOf(data.success.message).toMatchTypeOf<string>();
    });
  });

  describe("XCUITest Apps", () => {
    test<BrowserStackTestContext>("uploadXCUITestApp", async ({
      appAutomate: { client },
    }) => {
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

    test<BrowserStackTestContext>("getXCUITestApps", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getXCUITestApps();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"][]
      >();
    });

    test<BrowserStackTestContext>("getAppsByCustomId", async ({
      appAutomate: { client, randomXCUITestAppId },
    }) => {
      const appId = await randomXCUITestAppId();
      const data = await client.getXCUITestApp(appId);
      expect(data).toBeDefined();
      expect(data.custom_id).toEqual("example-app");
      expectTypeOf(data).toMatchTypeOf<
        components["schemas"]["AppAutomateApp"]
      >();
    });

    test<BrowserStackTestContext>("deleteApp", async ({
      appAutomate: { client, randomXCUITestAppId },
    }) => {
      const appId = await randomXCUITestAppId();
      const data = await client.deleteXCUITestApp(appId);
      expect(data).toBeDefined();
      expect(data.success).toBeDefined();
      expect(data.success.message).toBeDefined();
      expectTypeOf(data.success.message).toMatchTypeOf<string>();
    });
  }, 15_000);

  describe.skip<BrowserStackTestContext>("Detox Android Apps", (test) => {
    test("uploadDetoxApp", async ({ appAutomate: { client } }) => {
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

    test("uploadDetoxAppClient", async ({ appAutomate: { client } }) => {
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
