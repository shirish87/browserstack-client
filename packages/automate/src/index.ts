import { BrowserStackOptions } from "@dot-slash/browserstack-core";
import { GeneratedAutomateClient } from "@dot-slash/browserstack-openapi/automate/client";
export type * from "@dot-slash/browserstack-openapi/automate/client";

export class AutomateClient extends GeneratedAutomateClient {
  constructor(options?: BrowserStackOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api.browserstack.com",
      "https://api-cloud.browserstack.com",
      "@dot-slash/browserstack-automate",
      __PKG_VERSION__
    );
  }
}

