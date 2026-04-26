import { BrowserStackOptions } from "@browserstack-client/core";
import { GeneratedAppAutomateClient } from "@browserstack-client/openapi/app-automate/client";

export class AppAutomateClient extends GeneratedAppAutomateClient {
  static readonly FlutterPlatform = {
    android: "android",
    ios: "ios",
  } as const;

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


