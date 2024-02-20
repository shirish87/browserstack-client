import {
  APIClient,
  APIFetchOptions,
  BrowserStackOptions,
} from "@/api-client.ts";
import { BrowserStackError } from "@/error.ts";
import { components, operations } from "@/generated/openapi.ts";

/**
 * Represents a client for interacting with the BrowserStack JavaScript Testing API.
 * @see https://www.browserstack.com/docs/automate/javascript-testing/api
 * @public
 */
export class JSTestingClient extends APIClient {
  /**
   * Constructs a new instance of the JSTestingClient class.
   * @param options - Optional configuration options for the client.
   */
  constructor(options?: BrowserStackOptions) {
    super({
      ...options,
      baseUrl: options?.baseUrl ?? "https://api.browserstack.com/5",
    });
  }

  /**
   * Retrieves the account status.
   *
   * @returns A Promise that resolves to the account status.
   */
  getAccountStatus(): Promise<components["schemas"]["Status"]> {
    return this.makeGetRequest("/status");
  }

  getBrowsers<T extends true>(
    query?: operations["getBrowsers"]["parameters"]["query"] & { flat?: T },
    options?: APIFetchOptions<operations["getBrowsers"]>
  ): Promise<components["schemas"]["BrowserList"]>;

  getBrowsers<T extends false>(
    query?: operations["getBrowsers"]["parameters"]["query"] & { flat?: T },
    options?: APIFetchOptions<operations["getBrowsers"]>
  ): Promise<components["schemas"]["BrowserMap"]>;

  /**
   * Retrieves a list of browsers from the server.
   *
   * @param options - The fetch options for the request.
   * @returns A promise that resolves to a fetch response containing the list of browsers.
   */
  getBrowsers(
    query?: operations["getBrowsers"]["parameters"]["query"],
    options?: APIFetchOptions<operations["getBrowsers"]>
  ): Promise<
    components["schemas"]["BrowserList"] | components["schemas"]["BrowserMap"]
  > {
    return this.makeGetRequest("/browsers", {
      ...options,
      params: {
        query: {
          ...query,
          flat: typeof query?.flat === "boolean" ? query.flat : true,
        },
      },
    });
  }

  /**
   * Creates a worker for JS testing.
   *
   * @param body - The request body.
   * @param options - The API fetch options.
   * @returns A promise that resolves to the worker response.
   */
  createWorker(
    body: operations["createWorker"]["requestBody"]["content"]["application/json"],
    options?: APIFetchOptions<operations["createWorker"]>
  ) {
    return this.makePostRequest("/worker", {
      ...options,
      body,
    });
  }

  /**
   * Retrieves a list of workers.
   *
   * @param options - Optional parameters for the API request.
   * @returns A promise that resolves to an array of Worker objects.
   */
  getWorkers(
    options?: APIFetchOptions<operations["getWorkers"]>
  ): Promise<components["schemas"]["Worker"][]> {
    return this.makeGetRequest("/workers", options);
  }

  /**
   * Retrieves a worker by its ID.
   *
   * @param workerId The ID of the worker.
   * @param options Additional options for the API request.
   * @returns A Promise that resolves to the retrieved worker.
   */
  getWorker(
    workerId: number,
    options?: APIFetchOptions<operations["getWorker"]>
  ): Promise<components["schemas"]["Worker"]> {
    return this.makeGetRequest("/worker/{workerId}", {
      ...options,
      params: {
        path: {
          workerId,
        },
      },
    });
  }

  /**
   * Deletes a worker by worker ID.
   *
   * @param workerId The ID of the worker to delete.
   * @param options Optional API fetch options.
   * @returns A promise that resolves when the worker is deleted.
   */
  deleteWorker(
    workerId: number,
    options?: APIFetchOptions<operations["deleteWorker"]>
  ) {
    return this.makeDeleteRequest("/worker/{workerId}", {
      ...options,
      params: {
        path: {
          workerId,
        },
      },
    });
  }

  /**
   * Updates the URL of a worker.
   *
   * @param workerId - The ID of the worker.
   * @param body - The request body containing the updated URL.
   * @param options - Optional API fetch options.
   * @returns A promise that resolves with the response from the server.
   */
  updateWorkerURL(
    workerId: number,
    body: operations["updateWorkerURL"]["requestBody"]["content"]["application/json"],
    options?: APIFetchOptions<operations["updateWorkerURL"]>
  ) {
    return this.makePutRequest("/worker/{workerId}/url.json", {
      ...options,
      params: {
        path: {
          workerId,
        },
      },
      body,
    });
  }

  getWorkerScreenshot(
    workerId: number,
    format: "png",
    options?: APIFetchOptions<operations["getWorkerScreenshot"]>
  ): Promise<ArrayBuffer>;

  getWorkerScreenshot(
    workerId: number,
    format: "json",
    options?: APIFetchOptions<operations["getWorkerScreenshot"]>
  ): Promise<{ url: string }>;

  getWorkerScreenshot(
    workerId: number,
    format: "xml",
    options?: APIFetchOptions<operations["getWorkerScreenshot"]>
  ): Promise<string>;

  /**
   * Takes a screenshot of a worker.
   *
   * @param workerId - The ID of the worker.
   * @param format - The format of the screenshot (e.g., "png", "json", "xml").
   * @param options - Additional options for the API request.
   * @returns A Promise that resolves to the screenshot data.
   */
  getWorkerScreenshot(
    workerId: number,
    format: operations["getWorkerScreenshot"]["parameters"]["path"]["format"],
    options?: APIFetchOptions<operations["getWorkerScreenshot"]>
  ) {
    return this.makeGetRequest("/worker/{workerId}/screenshot.{format}", {
      ...options,
      params: {
        path: {
          workerId,
          format: format ?? "png",
        },
      },
      parseAs:
        format === "json" ? "json" : format === "xml" ? "text" : "arrayBuffer",
    });
  }

  /**
   * Awaits a worker with the specified workerId to attain "running" status.
   *
   * @param workerId - The ID of the worker to retrieve.
   * @param options - Optional API fetch options.
   * @param pollInterval - The interval (in milliseconds) at which to poll for the worker status. Default is 10000ms.
   * @returns A promise that resolves with the running worker.
   */
  ensureWorkerRunning(
    workerId: number,
    options?: APIFetchOptions<operations["getWorker"]>,
    pollInterval = 10_000
  ): Promise<components["schemas"]["Worker"]> {
    return new Promise((resolve, reject) => {
      let abortController: AbortController | undefined;

      const end = (err?: Error, result?: components["schemas"]["Worker"]) => {
        clearInterval(interval);
        abortController?.abort?.();

        if (err) {
          reject(
            err instanceof BrowserStackError
              ? err
              : new BrowserStackError(err.message, err)
          );
        } else if (result) {
          resolve(result);
        }
      };

      const interval = setInterval(async () => {
        abortController = options?.signal ? undefined : new AbortController();

        const worker = await this.getWorker(workerId, {
          ...options,
          signal: options?.signal ?? abortController?.signal,
        }).catch(end);

        if (!worker) return;

        if (!worker.id) {
          // worker was terminated
          end(new BrowserStackError(`Worker ${workerId} is no longer running`));
        } else if (worker.status === "running") {
          // worker is running
          end(undefined, worker);
        }
      }, pollInterval);
    });
  }

  /**
   * High-level abstraction for launching a worker-browser with the specified options.
   *
   * @param body The request body for creating the worker.
   * @param options The options for creating the worker.
   * @returns A promise that resolves to the launched worker.
   */
  async launch(
    body: operations["createWorker"]["requestBody"]["content"]["application/json"],
    options?: APIFetchOptions<operations["createWorker"]> & {
      pollInterval?: number;
    }
  ) {
    const { pollInterval, ...createWorkerOptions } = options ?? {};
    const { id } = await this.createWorker(body, createWorkerOptions);
    const worker = await this.ensureWorkerRunning(id, undefined, pollInterval);

    const instance = {
      ...worker,
      updateURL: (url: string) => this.updateWorkerURL(worker.id, { url }),
      getScreenshot: () => this.getWorkerScreenshot(worker.id, "png"),
      getScreenshotURL: () =>
        this.getWorkerScreenshot(worker.id, "json").then((data) => data.url),
      terminate: async () =>
        this.deleteWorker(worker.id).then((r) => {
          instance.status = undefined;
          return r;
        }),
    };

    return instance;
  }
}
