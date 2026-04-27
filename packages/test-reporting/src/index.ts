import { BrowserStackOptions } from "@dot-slash/browserstack-core";
import { GeneratedTestReportingClient } from "@dot-slash/browserstack-openapi/test-reporting/client";

export class TestReportingClient extends GeneratedTestReportingClient {
  constructor(options?: BrowserStackOptions & { uploadBaseUrl?: string }) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api-automation.browserstack.com/ext/v1",
      options?.uploadBaseUrl ?? "https://upload-automation.browserstack.com",
      "@dot-slash/browserstack-test-reporting",
      __PKG_VERSION__
    );
  }
}