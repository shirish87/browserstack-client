import { components } from "@/generated/openapi";
import { describe, expect, expectTypeOf, test } from "vitest";
import type { BrowserStackTestContext } from "./setup";

describe("AppAutomateClient", () => {

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

      if (Array.isArray(data)) {
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateMediaFile"][]>();
      } else {
        expect(data.message).toBeDefined();
        expectTypeOf(data.message).toMatchTypeOf<string>();
      }
    });

    test<BrowserStackTestContext>("getMediaFilesByCustomId", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getMediaFilesByCustomId("terminal-logs");
      expect(data).toBeDefined();

      if (Array.isArray(data)) {
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expect(data[0].custom_id).toEqual("terminal-logs");
        expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateMediaFile"][]>();
      } else {
        expect(data.message).toBeDefined();
        expectTypeOf(data.message).toMatchTypeOf<string>();
      }
    });

    test<BrowserStackTestContext>("getGroupMediaFiles", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getGroupMediaFiles();
      expect(data).toBeDefined();

      if (Array.isArray(data)) {
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateMediaFile"][]>();
      } else {
        expect(data.message).toBeDefined();
        expectTypeOf(data.message).toMatchTypeOf<string>();
      }
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

  describe("Apps", () => {

    test<BrowserStackTestContext>("uploadApp", async ({
      appAutomate: { client },
    }) => {
      const data = await client.uploadApp({
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
      const data = await client.getApps();
      expect(data).toBeDefined();

      if (Array.isArray(data)) {
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateApp"][]>();
      } else {
        expect(data.message).toBeDefined();
        expectTypeOf(data.message).toMatchTypeOf<string>();
      }
    });

    test<BrowserStackTestContext>("getAppsByCustomId", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getAppsByCustomId("example-app");
      expect(data).toBeDefined();

      if (Array.isArray(data)) {
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expect(data[0].custom_id).toEqual("example-app");
        expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateApp"][]>();
      } else {
        expect(data.message).toBeDefined();
        expectTypeOf(data.message).toMatchTypeOf<string>();
      }
    });

    test<BrowserStackTestContext>("getGroupApps", async ({
      appAutomate: { client },
    }) => {
      const data = await client.getGroupApps();
      expect(data).toBeDefined();

      if (Array.isArray(data)) {
        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
        expectTypeOf(data).toMatchTypeOf<components["schemas"]["AppAutomateApp"][]>();
      } else {
        expect(data.message).toBeDefined();
        expectTypeOf(data.message).toMatchTypeOf<string>();
      }
    });

    test<BrowserStackTestContext>("deleteApp", async ({
      appAutomate: { client, randomAppId },
    }) => {
      const mediaId = await randomAppId();
      const data = await client.deleteApp(mediaId);
      expect(data).toBeDefined();
      expect(data.success).toBeDefined();
      expect(data.success).toBe(true);
      expectTypeOf(data.success).toMatchTypeOf<boolean>();
    });
  });
});
