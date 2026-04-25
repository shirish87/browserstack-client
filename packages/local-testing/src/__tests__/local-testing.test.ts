import { binaryPath } from "@browserstack-client/local-testing-binary";
import { components } from "@browserstack-client/openapi";
import { LocalTestingBinary } from "@browserstack-client/local-testing-binary";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import { beforeAll, describe, expect, expectTypeOf, test } from "vitest";
import { localTestingContext } from "./setup.ts";

const LONG_TIMEOUT = 30_000;

describe("LocalClient", () => {
  beforeAll(async () => {
    const binHome = join(process.env.RUNNER_TEMP ?? process.env.TMPDIR ?? "/tmp", ".browserstack");
    const accessKey = process.env.BROWSERSTACK_ACCESS_KEY ?? process.env.BROWSERSTACK_KEY ?? "";

    const client = new LocalTestingBinary({ accessKey, binHome });
    await client.start();
    expect(client.state).toEqual("started");

    return async () => {
      // BrowserStackLocal process instance not found
      await client.stop().catch(() => null);
      await unlink(await binaryPath(binHome));
    };
  });

  test("getBinaryInstances", async () => {
    const { client } = localTestingContext;
    const data = await client.getBinaryInstances();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expectTypeOf(data).toMatchTypeOf<
      components["schemas"]["LocalBinaryInstance"][]
    >();
  });

  test("getBinaryInstance", async () => {
    const { client, randomBinaryInstanceId } = localTestingContext;
    const localInstanceId = await randomBinaryInstanceId();
    const data = await client.getBinaryInstance(localInstanceId);
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Object);
    expect(data.id).toEqual(localInstanceId);
    expectTypeOf(data).toMatchTypeOf<
      components["schemas"]["LocalBinaryInstance"]
    >();
  });

  test("disconnectBinaryInstance", async () => {
    const { client, randomBinaryInstanceId } = localTestingContext;
    const localInstanceId = await randomBinaryInstanceId();
    const data = await client.disconnectBinaryInstance(localInstanceId);
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);
    // server sometimes returns an HTML page
    // console.info(data);
    // expect(data).toMatch(/successfully disconnected/i);
    expectTypeOf(data).toMatchTypeOf<string>();
  });

  test("downloadBinary-darwin-x64", async () => {
    const { client } = localTestingContext;
    const { content, filename } = await client.downloadBinary("darwin-x64");
    expect(content).toBeDefined();
    expect(content).toBeInstanceOf(Uint8Array);
    expect(content.length).toBeGreaterThan(0);
    expectTypeOf(filename).toMatchTypeOf<string>();
  });
}, LONG_TIMEOUT);
