import { APIClient, APIClientOptions } from "@/api";

export default class ScreenshotsClient extends APIClient {
  constructor(options?: APIClientOptions) {
    super({
      ...options,
      baseUrl: options?.baseUrl ?? "https://www.browserstack.com",
    });
  }

  getBrowsers() {
    return this.sdk.GET("/screenshots/browsers.json", {});
  }

}
