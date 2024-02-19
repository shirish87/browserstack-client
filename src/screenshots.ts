import {
  APIClient,
  APIFetchOptions,
  BrowserStackOptions,
} from "@/api-client.ts";
import { BrowserStackError } from "@/error.ts";
import type { components, operations } from "@/generated/openapi.ts";
import type { FetchOptions } from "openapi-fetch";

/**
 * ScreenshotsClient represents a client for interacting with the BrowserStack Screenshots API.
 * @see https://www.browserstack.com/screenshots/api
 * @public
 */
export class ScreenshotsClient extends APIClient {
  /**
   * @internal
   */
  private static readonly jobCompleteStates = ["done", "error"];

  /**
   * Constructs a new instance of the ScreenshotsClient class.
   * @param options - Optional configuration options for the client.
   */
  constructor(options?: BrowserStackOptions) {
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
    options?: APIFetchOptions<operations["createScreenshotsJob"]>
  ) {
    return this.makePostRequest("/screenshots", {
      ...options,
      body,
    }).then((job) => ({
      ...job,
      id: job.job_id,
    }));
  }

  /**
   * Retrieves the details of a screenshots job.
   * @param jobId - The ID of the job to retrieve.
   * @param options - Optional fetch options for the request.
   * @returns A promise that resolves to the response from the API.
   */
  getJob(
    jobId: string,
    options?: APIFetchOptions<operations["getScreenshotsJob"]>
  ) {
    return this.makeGetRequest(`/screenshots/{jobId}.json`, {
      ...options,
      params: {
        path: {
          jobId,
        },
      },
    }).then((job) => ({
      ...job,
      id: job.id ?? job.job_id,
    }));
  }

  /**
   * Tracks the progress of a screenshot job and retrieves the screenshots associated with it.
   *
   * @param jobId - The ID of the job to track.
   * @param onScreenshot - Optional callback function that will be called when a new screenshot is added to the result.
   * @param pollInterval - The interval (in milliseconds) at which the job status should be polled. Default is 10000ms.
   * @returns A promise that resolves with an array of screenshots when the job is completed.
   */
  trackJob(
    jobId: string,
    onScreenshot?: (
      screenshot: components["schemas"]["Screenshot"]
    ) => void | Promise<void>,
    options?: APIFetchOptions<operations["getScreenshotsJob"]>,
    pollInterval = 10_000
  ): Promise<components["schemas"]["Screenshot"][]> {
    return new Promise((resolve, reject) => {
      const result: Map<string, components["schemas"]["Screenshot"]> =
        new Map();
      let abortController: AbortController | undefined;

      const end = (err?: Error) => {
        console.error(err);
        clearInterval(interval);
        abortController?.abort?.();

        if (err) {
          reject(
            err instanceof BrowserStackError
              ? err
              : new BrowserStackError(err.message, err)
          );
        } else {
          resolve(Array.from(result.values()));
        }
      };

      const interval = setInterval(async () => {
        abortController = options?.signal ? undefined : new AbortController();

        const job = await this.getJob(jobId, {
          ...options,
          signal: options?.signal ?? abortController?.signal,
        }).catch(end);

        if (!job) return;

        const screenshots = job.screenshots ?? [];

        for (const screenshot of screenshots) {
          if (ScreenshotsClient.jobCompleteStates.includes(screenshot.state)) {
            if (!result.has(screenshot.id)) {
              result.set(screenshot.id, screenshot);
            }

            await onScreenshot?.(screenshot);
          }
        }

        if (screenshots.length === result.size) {
          end();
        }
      }, pollInterval);
    });
  }
}
