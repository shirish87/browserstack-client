import { BrowserStackOptions } from "@browserstack-client/core";
import { GeneratedAutomateClient } from "@browserstack-client/openapi/automate/client";

export type { BrowserStackOptions } from "@browserstack-client/core";

export class AutomateClient extends GeneratedAutomateClient {
  constructor(options?: BrowserStackOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api.browserstack.com",
      "https://api-cloud.browserstack.com",
      "@browserstack-client/automate",
      "6.0.0"
    );
  }
}
