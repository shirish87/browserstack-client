import { components } from "@/generated/openapi";
import { describe, expect, expectTypeOf, test } from "vitest";
import type { BrowserStackTestContext } from "./setup";

describe("AppAutomateClient", () => {

  describe("Devices", () => {

      test<BrowserStackTestContext>("getDevices", async ({
        appAutomate: { client },
      }) => {
        const data = await client.getDevices();
        expect(data).toBeDefined();
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateDevice"][]>();
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
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateMediaFile"][]>();
    });

    test<BrowserStackTestContext>("getMediaFilesByCustomId", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getMediaFilesByCustomId("terminal-logs");
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].custom_id).toEqual("terminal-logs");
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateMediaFile"][]>();
    });

    test<BrowserStackTestContext>("getGroupMediaFiles", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getGroupMediaFiles();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateMediaFile"][]>();
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
        url: "https://github.com/markushi/android-ui/raw/master/example.apk",
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
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateApp"][]>();
    });

    test<BrowserStackTestContext>("getAppsByCustomId", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getAppiumAppsByCustomId("example-app");
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expect(data[0].custom_id).toEqual("example-app");
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateApp"][]>();
    });

    test<BrowserStackTestContext>("getGroupApps", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getAppiumGroupApps();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateApp"][]>();
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

    test<BrowserStackTestContext>("uploadFlutterApp", async ({
      appAutomate: { client },
    }) => {
      const data = await client.uploadFlutterApp({
        url: "https://github.com/TheAlphamerc/flutter_ecommerce_app/releases/download/v1.0.0/app-release.apk",
        filename: "example.apk",
        custom_id: "example-app",
      });

      expect(data).toBeDefined();
      expect(data.app_url).toBeDefined();
      expectTypeOf(data.app_url).toMatchTypeOf<string>();
    });

    test<BrowserStackTestContext>("getFlutterApps", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getFlutterApps();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateApp"][]>();
    });

    test<BrowserStackTestContext>("getAppsByCustomId", async ({
      appAutomate: { client, randomFlutterAppId },
    }) => {
      const appId = await randomFlutterAppId();
      const data = await client.getFlutterApp(appId);
      expect(data).toBeDefined();
      expect(data.custom_id).toEqual("example-app");
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateApp"]>();
    });

    test<BrowserStackTestContext>("deleteApp", async ({
      appAutomate: { client, randomFlutterAppId },
    }) => {
      const appId = await randomFlutterAppId();
      const data = await client.deleteFlutterApp(appId);
      expect(data).toBeDefined();
      expect(data.success).toBeDefined();
      expect(data.success.message).toBeDefined();
      expectTypeOf(data.success.message).toMatchTypeOf<string>();
    });
  });

  describe("Espresso Apps", () => {

    test<BrowserStackTestContext>("uploadEspressoApp", async ({
      appAutomate: { client },
    }) => {
      const data = await client.uploadEspressoApp({
        url: "https://github.com/TheAlphamerc/flutter_ecommerce_app/releases/download/v1.0.0/app-release.apk",
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
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateApp"][]>();
    });

    test<BrowserStackTestContext>("getAppsByCustomId", async ({
      appAutomate: { client, randomEspressoAppId },
    }) => {
      const appId = await randomEspressoAppId();
      const data = await client.getEspressoApp(appId);
      expect(data).toBeDefined();
      expect(data.custom_id).toEqual("example-app");
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateApp"]>();
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

  describe.skip("XCUITest Apps", () => {

    test<BrowserStackTestContext>("uploadXCUITestApp", async ({
      appAutomate: { client },
    }) => {
      const data = await client.uploadXCUITestApp({
        // [BROWSERSTACK_INVALID_XCUI_APP] Invalid XCUI App: Please upload a valid IPA file for XCUI App.
        url: "https://github.com/TheAlphamerc/flutter_ecommerce_app/releases/download/v1.0.0/app-release.apk",
        filename: "example.apk",
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
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateApp"][]>();
    });

    test<BrowserStackTestContext>("getAppsByCustomId", async ({
      appAutomate: { client, randomXCUITestAppId },
    }) => {
      const appId = await randomXCUITestAppId();
      const data = await client.getXCUITestApp(appId);
      expect(data).toBeDefined();
      expect(data.custom_id).toEqual("example-app");
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateApp"]>();
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
  });
});
