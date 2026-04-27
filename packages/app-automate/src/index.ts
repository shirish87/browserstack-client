import { BrowserStackOptions } from "@dot-slash/browserstack-core";
import { GeneratedAppAutomateClient } from "@dot-slash/browserstack-openapi/app-automate/client";

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
      "@dot-slash/browserstack-app-automate",
      __PKG_VERSION__
    );
  }
}


