import { vi } from "vitest";
import { TestManagementClient } from "../index";

export function createMockTestManagementClient(options?: any): TestManagementClient {
  const client = new TestManagementClient(options);
  return client;
}

export { vi };
