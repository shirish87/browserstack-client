import { BrowserStackOptions } from "@browserstack-client/core";
import { GeneratedAccessibilityClient } from "@browserstack-client/openapi/accessibility/client";

export type { BrowserStackOptions } from "@browserstack-client/core";

export class AccessibilityClient extends GeneratedAccessibilityClient {
  constructor(options?: BrowserStackOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api-accessibility.browserstack.com",
      "https://api-accessibility.browserstack.com",
      "@browserstack-client/accessibility",
      "6.0.0"
    );
  }
}
