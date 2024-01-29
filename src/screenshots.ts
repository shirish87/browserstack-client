import { APIClient, APIClientOptions } from "@/api";
import type { operations } from "@/generated/openapi";
import type { FetchOptions } from "openapi-fetch";

/**
 * ScreenshotsClient represents a client for interacting with the BrowserStack Screenshots API.
 * @see https://www.browserstack.com/screenshots/api
 * @public
 */
export class ScreenshotsClient extends APIClient {
  /**
   * Constructs a new instance of the ScreenshotsClient class.
   * @param options - Optional configuration options for the client.
   */
  constructor(options?: APIClientOptions) {
    super({
      ...options,
      baseUrl: options?.baseUrl ?? "https://www.browserstack.com",
    });
  }

  /**
   * Retrieves the list of available browsers for taking screenshots.
   * @param options - Optional fetch options for the request.
   * @returns A promise that resolves to the response from the API.
   */
  getBrowsers(options?: FetchOptions<operations["getScreenshotsBrowsers"]>) {
    return this.makeGetRequest("/screenshots/browsers.json", options);
  }

  /**
   * Creates a new screenshots job.
   * @param body - The request body for creating the job.
   * @param options - Optional fetch options for the request.
   * @returns A promise that resolves to the response from the API.
   */
  createJob(
    body: operations["createScreenshotsJob"]["requestBody"]["content"]["application/json"],
    options?: FetchOptions<operations["createScreenshotsJob"]>
  ) {
    return this.makePostRequest("/screenshots", {
      ...options,
      body,
    });
  }

  /**
   * Retrieves the details of a screenshots job.
   * @param jobId - The ID of the job to retrieve.
   * @param options - Optional fetch options for the request.
   * @returns A promise that resolves to the response from the API.
   */
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
