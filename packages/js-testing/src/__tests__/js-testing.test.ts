import { components } from "@browserstack-client/openapi";
import { afterAll, describe, expect, expectTypeOf, test } from "vitest";
import type { BrowserStackTestContext } from "./setup.ts";
import { JSTestingClient } from "@browserstack-client/js-testing";
import { jsTestingContext } from "./setup.ts";

describe("JSTestingClient", () => {

  test("getAccountStatus", async () => {
      const { client } = jsTestingContext;
    const data = await client.getAccountStatus();
    expect(data).toBeDefined();
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["Status"]>();
  });

  describe("Browsers", () => {

    test("getBrowsersFlat", async () => {
      const { client } = jsTestingContext;
      const data = await client.getBrowsers();
      expect(data).toBeDefined();
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["BrowserList"]>();
    });

    test("getBrowsersMap", async () => {
      const { client } = jsTestingContext;
      const data = await client.getBrowsers({ flat: false });
      expect(data).toBeDefined();
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["BrowserMap"]>();
    });
  });

  describe("Launch", () => {
    let instance: Awaited<ReturnType<JSTestingClient["launch"]>> | undefined;

    afterAll(async () => {
      await instance?.terminate?.();
    });

    // takes a long time for worker to start
    test("launch", async () => {
      const { client } = jsTestingContext;
      instance = await client.launch({
        os: "Windows",
        os_version: "10",
        browser: "Chrome",
        browser_version: "latest",
        url: "https://www.google.com",
      });

      expect(instance).toBeDefined();
      expect(instance.id).toBeDefined();
      expect(instance.id).toBeGreaterThan(0);
      expect(instance.updateURL).toBeInstanceOf(Function);
      expect(instance.getScreenshot).toBeInstanceOf(Function);
      expectTypeOf(instance.getScreenshot).toMatchTypeOf<() => Promise<ArrayBuffer>>();
      expect(instance.getScreenshotURL).toBeInstanceOf(Function);
      expectTypeOf(instance.getScreenshotURL).toMatchTypeOf<() => Promise<string>>();
      expect(instance.terminate).toBeInstanceOf(Function);
      expectTypeOf(instance).toMatchTypeOf<components["schemas"]["Worker"]>();
    });
  });

  describe("Workers", () => {

    test("createWorker", async () => {
      const { client } = jsTestingContext;
      const data = await client.createWorker({
        os: "Windows",
        os_version: "10",
        browser: "Chrome",
        browser_version: "latest",
        url: "https://www.google.com",
        timeout: 30,
      });

      expect(data).toBeDefined();
      expect(data.id).toBeDefined();
      expect(data.id).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<{ id: number }>();
    });

    test("getWorkers", async () => {
      const { client } = jsTestingContext;
      const data = await client.getWorkers();
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["Worker"][]>();
    });

    test("getWorker", async () => {
      const { client, randomWorkerId} = jsTestingContext;
      const workerId = await randomWorkerId();
      const data = await client.getWorker(workerId);
      expect(data).toBeDefined();
      expect(data.id).toBeDefined();
      expect(data.id).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["Worker"]>();
    });

    test("ensureWorkerRunning", async () => {
      const { client, randomWorkerId} = jsTestingContext;
      const workerId = await randomWorkerId();
      const data = await client.ensureWorkerRunning(workerId);
      expect(data).toBeDefined();
      expect(data.id).toBeDefined();
      expect(data.id).toBeGreaterThan(0);
      expect(data.status).toBeDefined();
      expect(data.status).toEqual("running");
    });

    test("updateWorkerURL", async () => {
      const { client, randomWorkerId} = jsTestingContext;
      const workerId = await randomWorkerId();
      const data = await client.updateWorkerURL(workerId, { url: "https://www.msn.com" });
      expect(data).toBeDefined();
      expect(data.message).toBeDefined();
      expect(data.message.length).toBeGreaterThan(0);
      // sometimes this is "Worker updated"
      // expect(data.message).toEqual("Browser updated with new url");
    });

    test("getWorkerScreenshot-png", async () => {
      const { client, randomWorkerId} = jsTestingContext;
      const workerId = await randomWorkerId();
      const data = await client.getWorkerScreenshot(workerId, "png");
      expect(data).toBeDefined();
      expect(data.byteLength).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<ArrayBuffer>();
    });

    test("getWorkerScreenshot-json", async () => {
      const { client, randomWorkerId} = jsTestingContext;
      const workerId = await randomWorkerId();
      const data = await client.getWorkerScreenshot(workerId, "json");
      expect(data).toBeDefined();
      expect(data.url).toBeDefined();
      expect(data.url.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<{ url: string }>();
    });

    test("getWorkerScreenshot-xml", async () => {
      const { client, randomWorkerId} = jsTestingContext;
      const workerId = await randomWorkerId();
      const data = await client.getWorkerScreenshot(workerId, "xml");
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<string>();
    });

    test("deleteWorker", async () => {
      const { client, randomWorkerId} = jsTestingContext;
      const workerId = await randomWorkerId();
      const data = await client.deleteWorker(workerId);
      expect(data).toBeDefined();
      expectTypeOf(data).toMatchTypeOf<{ message: string, time?: number }>();
    });
  });
}, 20_000);
