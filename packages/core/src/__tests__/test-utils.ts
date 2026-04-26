import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { assert } from "vitest";

export interface BrowserStackTestContext {
  automate: {
    client: unknown;
    randomProjectId(): Promise<number>;
    randomBuildId(): Promise<string>;
    randomSessionId(): Promise<string>;
    randomMediaId(): Promise<string>;
  };
  screenshots: {
    client: unknown;
  };
  appAutomate: {
    client: unknown;
    randomProjectId(): Promise<number>;
    randomBuildId(): Promise<string>;
    randomSessionId(): Promise<string>;
    randomMediaId(): Promise<string>;
    randomAppiumAppId(): Promise<string>;
    randomFlutterAndroidAppId(): Promise<string>;
    randomFlutteriOSTestPackageId(): Promise<string>;
    randomEspressoAppId(): Promise<string>;
    randomXCUITestAppId(): Promise<string>;
  };
  jsTesting: {
    client: unknown;
    randomWorkerId(): Promise<number>;
  };
  localTesting: {
    client: unknown;
    randomBinaryInstanceId(): Promise<string>;
  };
  localTestingBinary: {
    client: unknown;
    options: Record<string, unknown>;
  };
}

export function getTestCredentials() {
  return {
    username: process.env.BROWSERSTACK_USERNAME ?? process.env.VITE_BROWSERSTACK_USERNAME,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY ?? process.env.BROWSERSTACK_KEY ?? process.env.VITE_BROWSERSTACK_KEY,
  };
}

export function getLocalBinaryPath(): string {
  return process.env.VITE_BROWSERSTACK_LOCAL_BINARY_PATH ??
    join(homedir() ?? tmpdir(), ".browserstack");
}

export function pickRandom<T>(items: T[]): T {
  assert(items.length > 0, `Cannot pick from empty array`);
  return items[Math.floor(Math.random() * items.length)];
}
