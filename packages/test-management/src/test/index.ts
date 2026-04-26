import { vi } from "vitest";
import { type BrowserStackOptions } from "@browserstack-client/core";
import { TestManagementClient } from "../index";

export function createMockTestManagementClient(options?: BrowserStackOptions): TestManagementClient {
  return new TestManagementClient(options);
}

export { vi };
