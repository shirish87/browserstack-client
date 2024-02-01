import { components } from "@/generated/openapi.ts"
import { BrowserStack } from "@/index.ts"
import { stat } from "node:fs/promises";
import { beforeAll, describe, expect, expectTypeOf, test } from "vitest";
import type { BrowserStackTestContext } from "./setup.ts";

describe("LocalClient", () => {
  beforeAll(async () => {
    const binDir = process.env.RUNNER_TEMP ?? process.env.TMPDIR ?? "/tmp";
    const key = process.env.VITE_BROWSERSTACK_KEY ?? "";

    const client = new BrowserStack.LocalTestingClient({ key });
    const binFilePath = await client.downloadBinary("linux-x64", binDir);

    const fstat = await stat(binFilePath);
    expect(fstat.isFile()).toEqual(true);
    expect((fstat.mode & 0o777).toString(8)).toEqual("755");

    const child = await client.runBinary(binFilePath);

    return async () => {
      // local imports to avoid bundling
      const { unlink } = await import("node:fs/promises");

      child.kill();
      await unlink(binFilePath);
    };
  }, 30_000);

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
  }, 20_000);

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
  }, 20_000);

  test<BrowserStackTestContext>("disconnectBinaryInstance", async ({
    localTesting: { client, randomBinaryInstanceId },
  }) => {
    const localInstanceId = await randomBinaryInstanceId();
    const data = await client.disconnectBinaryInstance(localInstanceId);
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);
    expect(data).toMatch(/successfully disconnected/i);
    expectTypeOf(data).toMatchTypeOf<string>();
  }, 20_000);
});
