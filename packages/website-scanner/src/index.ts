import { BrowserStackOptions } from "@dot-slash/browserstack-core";
import { GeneratedWebsiteScannerClient } from "@dot-slash/browserstack-openapi/website-scanner/client";

export class WebsiteScannerClient extends GeneratedWebsiteScannerClient {
  constructor(options?: BrowserStackOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api-scanner.browserstack.com",
      "https://api-scanner.browserstack.com",
      "@dot-slash/browserstack-website-scanner",
      __PKG_VERSION__
    );
  }
}
