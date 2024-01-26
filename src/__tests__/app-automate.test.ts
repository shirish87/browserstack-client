import { components } from "@/generated/openapi";
import { describe, expect, expectTypeOf, test } from "vitest";
import type { BrowserStackTestContext } from "./setup";

describe("AppAutomateClient", () => {

  describe("Media Files", () => {

    test<BrowserStackTestContext>("uploadBuildTerminalLogs", async ({
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

    test<BrowserStackTestContext>("getGroupMediaFiles", async ({
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

});
