import { env } from "@/env.ts";
import { BrowserStack } from "@/index.ts";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import type { BrowserStackTestContext } from "./setup.ts";

describe("LocalBinary", () => {
  beforeAll(() => {
    env.BROWSERSTACK_LOCAL_BINARY_PATH = `${env.HOME}/.browserstack`;
  });

  describe("Test instance start-stop", () => {
    afterEach<BrowserStackTestContext>(
      async ({ localTestingBinary: { client } }) => {
        // BrowserStackLocal process instance not found
        await client.stop().catch(() => null);
      }
    );

    test<BrowserStackTestContext>("version", async ({
      localTestingBinary: { client },
    }) => {
      const version = await client.version();
      expect(version).toMatch(/^\d+\.\d+$/);
    });

    test<BrowserStackTestContext>("start-stop", async ({
      localTestingBinary: { client },
    }) => {
      let message = await client.start();
      expect(message).toEqual("Connected");
      expect(client.state).toEqual("started");
      expect(client.pid).toBeGreaterThan(0);
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(5);

      message = await client.stop();
      expect(message).toEqual("BrowserStackLocal stopped successfully");
      expect(client.state).toEqual("stopped");
      expect(client.pid).toBeUndefined();
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(0);
    });

    test<BrowserStackTestContext>("start-start-stop", async ({
      localTestingBinary: { client },
    }) => {
      let message = await client.start();
      expect(message).toEqual("Connected");
      expect(client.state).toEqual("started");
      expect(client.pid).toBeGreaterThan(0);
      const pid = client.pid;

      message = await client.start();
      expect(message).toEqual("Connected");
      expect(client.state).toEqual("started");
      expect(client.pid).toBeGreaterThan(0);
      // start-start produces new process
      expect(client.pid).not.toEqual(pid);
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(5);

      message = await client.stop();
      expect(message).toEqual("BrowserStackLocal stopped successfully");
      expect(client.state).toEqual("stopped");
      expect(client.pid).toBeUndefined();
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(0);
    });

    test<BrowserStackTestContext>("start-stop-start", async ({
      localTestingBinary: { client },
    }) => {
      let message = await client.start();
      expect(message).toEqual("Connected");
      expect(client.state).toEqual("started");

      message = await client.stop();
      expect(message).toEqual("BrowserStackLocal stopped successfully");
      expect(client.state).toEqual("stopped");
      expect(client.pid).toBeUndefined();
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(0);

      message = await client.start();
      expect(message).toEqual("Connected");
      expect(client.state).toEqual("started");
      expect(client.pid).toBeGreaterThan(0);
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(5);
    });

    test<BrowserStackTestContext>("stop-without-start throws", async ({
      localTestingBinary: { client },
    }) => {
      expect(client.stop()).rejects.toThrowError(
        "BrowserStackLocal process instance not found"
      );
      expect(client.pid).toBeUndefined();
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(0);
    });
  });

  describe("Independent start-stop w/ user-supplied localIdentifier", () => {
    const localIdentifier = Date.now().toString();

    afterAll(async () => {
      const client = new BrowserStack.LocalTestingBinary({
        key: env.VITE_BROWSERSTACK_KEY,
        localIdentifier,
      });

      await client.stop().catch(() => null);
    });

    test<BrowserStackTestContext>("start", async ({
      localTestingBinary: { options },
    }) => {
      const client = new BrowserStack.LocalTestingBinary({
        ...options,
        localIdentifier,
      });
      const message = await client.start();
      expect(message).toEqual("Connected");
      expect(client.state).toEqual("started");
      expect(client.pid).toBeGreaterThan(0);
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(5);
    });

    test<BrowserStackTestContext>("stop", async ({
      localTestingBinary: { options },
    }) => {
      const client = new BrowserStack.LocalTestingBinary({
        ...options,
        localIdentifier,
      });
      const message = await client.stop();
      expect(message).toEqual("BrowserStackLocal stopped successfully");
      expect(client.state).toEqual("stopped");
      expect(client.pid).toBeUndefined();
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(0);
    });
  });

  describe("Independent start-stop w/ env.BROWSERSTACK_LOCAL_ID", () => {
    beforeAll(() => {
      env.BROWSERSTACK_LOCAL_ID = "1707124150037";
    });

    afterAll(async () => {
      const client = new BrowserStack.LocalTestingBinary({
        key: env.VITE_BROWSERSTACK_KEY,
      });

      await client.stop().catch(() => null);
      delete env.BROWSERSTACK_LOCAL_ID;
    });

    test<BrowserStackTestContext>("start", async ({
      localTestingBinary: { options },
    }) => {
      const client = new BrowserStack.LocalTestingBinary(options);
      const message = await client.start();
      expect(message).toEqual("Connected");
      expect(client.state).toEqual("started");
      expect(client.pid).toBeGreaterThan(0);
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(5);
    });

    test<BrowserStackTestContext>("stop", async ({
      localTestingBinary: { options },
    }) => {
      const client = new BrowserStack.LocalTestingBinary(options);
      const message = await client.stop();
      expect(message).toEqual("BrowserStackLocal stopped successfully");
      expect(client.state).toEqual("stopped");
      expect(client.pid).toBeUndefined();
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(0);
    });
  });
}, 60_000);
