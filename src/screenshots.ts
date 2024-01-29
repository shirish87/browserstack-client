import { APIClient, APIClientOptions } from "@/api";
import type { operations } from "@/generated/openapi";
import type { FetchOptions } from "openapi-fetch";

export class ScreenshotsClient extends APIClient {
  constructor(options?: APIClientOptions) {
    super({
      ...options,
      baseUrl: options?.baseUrl ?? "https://www.browserstack.com",
    });
  }

  getBrowsers(options?: FetchOptions<operations["getScreenshotsBrowsers"]>) {
    return this.makeGetRequest("/screenshots/browsers.json", options);
  }

  createJob(
    body: operations["createScreenshotsJob"]["requestBody"]["content"]["application/json"],
    options?: FetchOptions<operations["createScreenshotsJob"]>
  ) {
    return this.makePostRequest("/screenshots", {
      ...options,
      body,
    });
  }

  getJob(
    jobId: string,
    options?: FetchOptions<operations["getScreenshotsJob"]>
  ) {
    return this.makeGetRequest(`/screenshots/{jobId}.json`, {
      ...options,
      params: {
        path: {
          jobId,
        },
      },
    });
  }
}
