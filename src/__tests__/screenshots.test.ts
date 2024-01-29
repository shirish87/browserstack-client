import { components } from "@/generated/openapi";
import { describe, expect, expectTypeOf, test } from "vitest";
import type { BrowserStackTestContext } from "./setup";

describe("ScreenshotsClient", () => {
  test<BrowserStackTestContext>("getBrowsers", async ({
    screenshots: { client },
  }) => {
    const data = await client.getBrowsers();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["BrowserList"]>([]);
  });

  test<BrowserStackTestContext>("createJob", async ({
    screenshots: { client },
  }) => {
    const browsers = await client.getBrowsers();
    const data = await client.createJob({
      url: "https://www.browserstack.com",
      browsers: browsers.slice(0, 1),
    });
    expect(data).toBeDefined();
    expect(data.job_id).toBeDefined();
    expectTypeOf(data.job_id).toMatchTypeOf<string>();
  });

  test<BrowserStackTestContext>("getJob", async ({
    screenshots: { client },
  }) => {
    const browsers = await client.getBrowsers();
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
  }, 20_000);
});
