import { BrowserStackOptions } from "@browserstack-client/core";
import { GeneratedTestManagementClient } from "@browserstack-client/openapi/test-management/client";

export type { BrowserStackOptions } from "@browserstack-client/core";

export class TestManagementClient extends GeneratedTestManagementClient {
  constructor(options?: BrowserStackOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://test-management.browserstack.com",
      "https://test-management.browserstack.com",
      "@browserstack-client/test-management",
      "6.0.0"
    );
  }
}
