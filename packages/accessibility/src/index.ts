import { BrowserStackOptions } from "@dot-slash/browserstack-core";
import { GeneratedAccessibilityClient } from "@dot-slash/browserstack-openapi/accessibility/client";

export class AccessibilityClient extends GeneratedAccessibilityClient {
  constructor(options?: BrowserStackOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api-accessibility.browserstack.com",
      "https://api-accessibility.browserstack.com",
      "@dot-slash/browserstack-accessibility",
      __PKG_VERSION__
    );
  }
}
