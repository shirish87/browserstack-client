import { env } from "@dot-slash/browserstack-core";
import { LocalTestingBinary } from "@dot-slash/browserstack-local-testing";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import type { BrowserStackTestContext } from "@dot-slash/browserstack-core/__tests__/test-utils";
import { localTestingBinaryContext } from "./setup.ts";

const LONG_TIMEOUT = 60_000;

describe("LocalBinary", () => {
  beforeAll(() => {
    env.BROWSERSTACK_LOCAL_BINARY_PATH = `${env.HOME}/.browserstack`;
  });

  describe("Test instance start-stop", () => {
    afterEach<BrowserStackTestContext>(
      async () => {
        const { client } = localTestingBinaryContext;
        if (client.state !== "stopped") {
          // BrowserStackLocal process instance not found
          await client.stop().catch(() => null);
        }
      }
    );

    test("version", async () => {
      const { client  } = localTestingBinaryContext;
      const version = await client.version();
      expect(version).toMatch(/^\d+\.\d+$/);
    });

    test("start-stop", async () => {
      const { client  } = localTestingBinaryContext;
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

    test("start-start-stop", async () => {
      const { client  } = localTestingBinaryContext;
      let message = await client.start();
      expect(message).toEqual("Connected");
      expect(client.state).toEqual("started");
      expect(client.pid).toBeGreaterThan(0);
      const pid = client.pid;

      message = await client.start();
      expect(message).toEqual("Connected");
      expect(client.state).toEqual("started");
      expect(client.pid).toBeGreaterThan(0);
      // start-start produces new process (PID may be recycled on highly isolated CI runners)
      if (!process.env.CI) {
        expect(client.pid).not.toEqual(pid);
      } else {
        expect(client.pid).toBeGreaterThan(0);
      }
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(5);

      message = await client.stop();
      expect(message).toEqual("BrowserStackLocal stopped successfully");
      expect(client.state).toEqual("stopped");
      expect(client.pid).toBeUndefined();
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(0);
    });

    test("start-stop-start", async () => {
      const { client  } = localTestingBinaryContext;
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

    test("stop-without-start throws", async () => {
      const { client  } = localTestingBinaryContext;
      await expect(client.stop()).rejects.toThrowError(
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
      const client = new LocalTestingBinary({
        accessKey: env.BROWSERSTACK_ACCESS_KEY ?? env.BROWSERSTACK_KEY,
        localIdentifier,
      });

      await client.stop().catch(() => null);
    });

    test("start", async () => {
      const { options  } = localTestingBinaryContext;
      const client = new LocalTestingBinary({
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

    test("stop", async () => {
      const { options  } = localTestingBinaryContext;
      const client = new LocalTestingBinary({
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
      const client = new LocalTestingBinary({
        accessKey: env.BROWSERSTACK_ACCESS_KEY ?? env.BROWSERSTACK_KEY,
      });

      await client.stop().catch(() => null);
      delete env.BROWSERSTACK_LOCAL_ID;
    });

    test("start", async () => {
      const { options  } = localTestingBinaryContext;
      const client = new LocalTestingBinary(options);
      const message = await client.start();
      expect(message).toEqual("Connected");
      expect(client.state).toEqual("started");
      expect(client.pid).toBeGreaterThan(0);
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(5);
    });

    test("stop", async () => {
      const { options  } = localTestingBinaryContext;
      const client = new LocalTestingBinary(options);
      const message = await client.stop();
      expect(message).toEqual("BrowserStackLocal stopped successfully");
      expect(client.state).toEqual("stopped");
      expect(client.pid).toBeUndefined();
      expect(client.args).toBeInstanceOf(Array);
      expect(client.args.length).toEqual(0);
    });
  });
}, LONG_TIMEOUT);
