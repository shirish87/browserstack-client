import { components } from "@/generated/openapi";
import { describe, expect, expectTypeOf, test } from "vitest";
import type { BrowserStackTestContext } from "./setup";

describe("JSTestingClient", () => {

  describe("Browsers", () => {

    test<BrowserStackTestContext>("getBrowsersFlat", async ({ jsTesting: { client } }) => {
      const data = await client.getBrowsers();
      expect(data).toBeDefined();
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["BrowserList"]>();
    });

    test<BrowserStackTestContext>("getBrowsersMap", async ({ jsTesting: { client } }) => {
      const data = await client.getBrowsers({ flat: false });
      expect(data).toBeDefined();
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["BrowserMap"]>();
    });
  });

  describe("Workers", () => {

    test<BrowserStackTestContext>("createWorker", async ({ jsTesting: { client } }) => {
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

    test<BrowserStackTestContext>("getWorkers", async ({ jsTesting: { client } }) => {
      const data = await client.getWorkers();
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["Worker"][]>();
    });

    test<BrowserStackTestContext>("getWorker", async ({ jsTesting: { client, randomWorkerId } }) => {
      const workerId = await randomWorkerId();
      const data = await client.getWorker(workerId);
      expect(data).toBeDefined();
      expect(data.id).toBeDefined();
      expect(data.id).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<components["schemas"]["Worker"]>();
    });

    test<BrowserStackTestContext>("deleteWorker", async ({ jsTesting: { client, randomWorkerId } }) => {
      const workerId = await randomWorkerId();
      const data = await client.deleteWorker(workerId);
      expect(data).toBeDefined();
      expect(data.time).toBeDefined();
      expectTypeOf(data).toMatchTypeOf<{ time: number }>();
    });
  });
}, 10_000);
