import { BrowserStackOptions } from "@dot-slash/browserstack-core";
import { GeneratedTestManagementClient } from "@dot-slash/browserstack-openapi/test-management/client";

export class TestManagementClient extends GeneratedTestManagementClient {
  constructor(options?: BrowserStackOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://test-management.browserstack.com",
      "https://test-management.browserstack.com",
      "@dot-slash/browserstack-test-management",
      __PKG_VERSION__
    );
  }
}
