import { vi } from "vitest";
import { TestManagementClient, type BrowserStackOptions } from "../index";

export function createMockTestManagementClient(options?: BrowserStackOptions): TestManagementClient {
  return new TestManagementClient(options);
}

export { vi };
