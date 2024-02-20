import { binaryPath } from "@/fs-utils.ts";
import { components } from "@/generated/openapi.ts";
import { LocalTestingBinary } from "@/local-testing-binary.ts";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { beforeAll, describe, expect, expectTypeOf, test } from "vitest";
import type { BrowserStackTestContext } from "./setup.ts";

describe("LocalClient", () => {
  beforeAll(async () => {
    const binHome = join(process.env.RUNNER_TEMP ?? process.env.TMPDIR ?? "/tmp", ".browserstack");
    const key = process.env.VITE_BROWSERSTACK_KEY ?? "";

    const client = new LocalTestingBinary({ key, binHome });
    await client.start();
    expect(client.state).toEqual("started");

    return async () => {
      // BrowserStackLocal process instance not found
      await client.stop().catch(() => null);
      await unlink(await binaryPath(binHome));
    };
  });

  test<BrowserStackTestContext>("getBinaryInstances", async ({
    localTesting: { client },
  }) => {
    const data = await client.getBinaryInstances();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expectTypeOf(data).toMatchTypeOf<
      components["schemas"]["LocalBinaryInstance"][]
    >();
  });

  test<BrowserStackTestContext>("getBinaryInstance", async ({
    localTesting: { client, randomBinaryInstanceId },
  }) => {
    const localInstanceId = await randomBinaryInstanceId();
    const data = await client.getBinaryInstance(localInstanceId);
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Object);
    expect(data.id).toEqual(localInstanceId);
    expectTypeOf(data).toMatchTypeOf<
      components["schemas"]["LocalBinaryInstance"]
    >();
  });

  test<BrowserStackTestContext>("disconnectBinaryInstance", async ({
    localTesting: { client, randomBinaryInstanceId },
  }) => {
    const localInstanceId = await randomBinaryInstanceId();
    const data = await client.disconnectBinaryInstance(localInstanceId);
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);
    // server sometimes returns an HTML page
    // console.info(data);
    // expect(data).toMatch(/successfully disconnected/i);
    expectTypeOf(data).toMatchTypeOf<string>();
  });
}, 30_000);
