import { APIClient, APIClientOptions } from "@/api";
import type { FetchOptions } from "openapi-fetch";
import type { operations } from "./generated/openapi";

export default class ScreenshotsClient extends APIClient {
  constructor(options?: APIClientOptions) {
    super({
      ...options,
      baseUrl: options?.baseUrl ?? "https://www.browserstack.com",
    });
  }

  getBrowsers(options?: FetchOptions<operations["getScreenshotsBrowsers"]>) {
    return this.makeGetRequest("/screenshots/browsers.json", options);
  }

}
