import { BrowserStackOptions } from "@browserstack-client/core";
import { GeneratedTestReportingClient } from "@browserstack-client/openapi/test-reporting/client";

export class TestReportingClient extends GeneratedTestReportingClient {
  constructor(options?: BrowserStackOptions & { uploadBaseUrl?: string }) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api-automation.browserstack.com/ext/v1",
      options?.uploadBaseUrl ?? "https://upload-automation.browserstack.com",
      "@browserstack-client/test-reporting",
      "6.0.0"
    );
  }
}