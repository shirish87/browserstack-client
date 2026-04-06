import {
  LocalTestingBinary,
  LocalTestingBinaryOptions,
} from "@browserstack-client/local-testing-binary";
import { resolveAccessKey } from "@browserstack-client/core";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";

export interface BrowserStackTestContext {
  localTestingBinary: {
    client: LocalTestingBinary;
    options: LocalTestingBinaryOptions;
  };
}

function defaultBinHome(): string {
  return join(homedir() ?? tmpdir(), ".browserstack");
}

const localBinaryOptions: LocalTestingBinaryOptions = {
  accessKey: resolveAccessKey(),
  binHome:
    process.env.BROWSERSTACK_LOCAL_BINARY_PATH ||
    process.env.VITE_BROWSERSTACK_LOCAL_BINARY_PATH ||
    defaultBinHome(),
};

const localTestingBinary = new LocalTestingBinary(localBinaryOptions);

export const localTestingBinaryContext: BrowserStackTestContext["localTestingBinary"] = {
  client: localTestingBinary,
  options: localBinaryOptions,
};
