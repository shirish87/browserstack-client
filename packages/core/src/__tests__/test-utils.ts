import { assert } from "vitest";

export interface BrowserStackTestContext {
  automate: {
    client: any;
    randomProjectId(): Promise<number>;
    randomBuildId(): Promise<string>;
    randomSessionId(): Promise<string>;
    randomMediaId(): Promise<string>;
  };
  screenshots: {
    client: any;
  };
  appAutomate: {
    client: any;
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
    client: any;
    randomWorkerId(): Promise<number>;
  };
  localTesting: {
    client: any;
    randomBinaryInstanceId(): Promise<string>;
  };
  localTestingBinary: {
    client: any;
    options: any;
  };
}

export function getTestCredentials() {
  return {
    username: process.env.BROWSERSTACK_USERNAME ?? process.env.VITE_BROWSERSTACK_USERNAME,
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY ?? process.env.BROWSERSTACK_KEY ?? process.env.VITE_BROWSERSTACK_KEY,
  };
}

export function getLocalBinaryPath(): string {
  const { homedir, tmpdir } = require("node:os");
  const { join } = require("node:path");
  return process.env.VITE_BROWSERSTACK_LOCAL_BINARY_PATH ??
    join(homedir() ?? tmpdir(), ".browserstack");
}

export function pickRandom<T>(items: T[]): T {
  assert(items.length > 0, `Cannot pick from empty array`);
  return items[Math.floor(Math.random() * items.length)];
}
