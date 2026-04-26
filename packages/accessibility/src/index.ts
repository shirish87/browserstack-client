import { BrowserStackOptions } from "@browserstack-client/core";
import { GeneratedAccessibilityClient } from "@browserstack-client/openapi/accessibility/client";

export class AccessibilityClient extends GeneratedAccessibilityClient {
  constructor(options?: BrowserStackOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api-accessibility.browserstack.com",
      "https://api-accessibility.browserstack.com",
      "@browserstack-client/accessibility",
      __PKG_VERSION__
    );
  }
}
