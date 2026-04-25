import { BrowserStackOptions } from "@browserstack-client/core";
import { GeneratedAppAutomateClient } from "@browserstack-client/openapi/app-automate/client";

export type { BrowserStackOptions } from "@browserstack-client/core";

export class AppAutomateClient extends GeneratedAppAutomateClient {
  constructor(options?: BrowserStackOptions) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api.browserstack.com",
      "https://api-cloud.browserstack.com",
      "@browserstack-client/app-automate",
      "6.0.0"
    );
  }
}

export enum FlutterPlatform {
  android = "android",
  ios = "ios",
}
