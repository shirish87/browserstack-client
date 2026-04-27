import { vi } from "vitest";
import { type BrowserStackOptions } from "@dot-slash/browserstack-core";
import { TestManagementClient } from "../index";

export function createMockTestManagementClient(options?: BrowserStackOptions): TestManagementClient {
  return new TestManagementClient(options);
}

export { vi };
