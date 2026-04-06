import { components } from "@browserstack-client/openapi";
import { describe, expect, expectTypeOf, test } from "vitest";
import type { BrowserStackTestContext } from "./setup.ts";
import { screenshotsContext } from "./setup.ts";

describe("ScreenshotsClient", () => {
  let browsers: components["schemas"]["BrowserList"];

  test("getBrowsers", async () => {
    const { client } = screenshotsContext;
    const data = await client.getBrowsers();
    expect(data).toBeDefined();

    // The Screenshots API may return { success: true } instead of a browser
    // list when the feature is not available for the current account/plan.
    if (!Array.isArray(data)) {
      console.warn("Screenshots API did not return a browser list — skipping dependent tests");
      return;
    }

    browsers = data;
    expect(data.length).toBeGreaterThan(0);
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["BrowserList"]>([]);
  });

  test("createJob", async ({ skip }) => {
    if (!browsers) skip();

    const { client } = screenshotsContext;
    const data = await client.createJob({
      url: "https://www.browserstack.com",
      browsers: browsers.slice(0, 1),
    });
    expect(data).toBeDefined();
    expect(data.job_id).toBeDefined();
    expectTypeOf(data.job_id).toMatchTypeOf<string>();
  });

  test("getJob", async ({ skip }) => {
    if (!browsers) skip();

    const { client } = screenshotsContext;
    const job = await client.createJob({
      url: "https://www.browserstack.com",
      browsers: browsers.slice(0, 1),
    });
    expect(job).toBeDefined();
    expect(job.job_id).toBeDefined();

    const jobId = job.job_id;
    const data = await client.getJob(jobId);
    expect(data).toBeDefined();
    expect(data.id).toEqual(jobId);
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["ScreenshotsJob"]>();
  });

  // fails due to job.state=queued_all until test timeout
  test("launch", async () => {
    const { client } = screenshotsContext;
    const data = await client.getBrowsers();
    if (!Array.isArray(data)) return;

    const screenshots = await client.launch({
      url: "https://www.google.com",
      browsers: data.slice(0, 1),
    });
    expect(screenshots).toBeDefined();
    expect(screenshots.length).toBeGreaterThan(0);
    expectTypeOf(screenshots).toMatchTypeOf<
      components["schemas"]["Screenshot"][]
    >();
  });
}, 30_000);
