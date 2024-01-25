import { describe, expect, test } from "vitest";
import type { BrowserStackTestContext } from "./setup";


describe("ScreenshotsClient", () => {

  test<BrowserStackTestContext>("getBrowsers", async ({ screenshots: { client } }) => {
    const data = await client.getBrowsers();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
  });

});
