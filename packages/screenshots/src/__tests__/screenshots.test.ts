import { components } from "@dot-slash/browserstack-openapi";
import type { DeepCamelCase } from "@dot-slash/browserstack-openapi-transforms";
import { describe, expect, expectTypeOf, test } from "vitest";
import { screenshotsContext } from "./setup.ts";

const LONG_TIMEOUT = 30_000;

describe("ScreenshotsClient", () => {
  let browsers: DeepCamelCase<components["schemas"]["BrowserList"]>;

  test("getScreenshotsBrowsers", async () => {
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
    expectTypeOf(data).toMatchTypeOf<DeepCamelCase<components["schemas"]["BrowserList"]>>();
  });

  test("createJob", async ({ skip }) => {
    if (!browsers) skip();

    const { client } = screenshotsContext;
    const data = await client.createJob({
      url: "https://www.browserstack.com",
      browsers: browsers.slice(0, 1),
    });
    expect(data).toBeDefined();
    expect(data.jobId).toBeDefined();
    expectTypeOf(data.jobId).toMatchTypeOf<string>();
  });

  test("getJob", async ({ skip }) => {
    if (!browsers) skip();

    const { client } = screenshotsContext;
    const job = await client.createJob({
      url: "https://www.browserstack.com",
      browsers: browsers.slice(0, 1),
    });
    expect(job).toBeDefined();
    expect(job.jobId).toBeDefined();

    const jobId = job.jobId;
    const data = await client.getJob(jobId);
    expect(data).toBeDefined();
    expect(data.id).toEqual(jobId);
    expectTypeOf(data).toMatchTypeOf<DeepCamelCase<components["schemas"]["ScreenshotsJob"]>>();
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
      DeepCamelCase<components["schemas"]["Screenshot"]>[]
    >();
  });
}, LONG_TIMEOUT);
