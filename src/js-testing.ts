import { APIClient, APIFetchOptions, BrowserStackOptions } from "@/api-client";
import { components, operations } from "@/generated/openapi";

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

  getAccountStatus(
    options?: APIFetchOptions<operations["getStatus"]["parameters"]["query"]>
  ): Promise<components["schemas"]["Status"]> {
    return this.makeGetRequest("/status", options);
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

  createWorker(
    body: operations["createWorker"]["requestBody"]["content"]["application/json"],
    options?: APIFetchOptions<operations["createWorker"]>
  ) {
    return this.makePostRequest("/worker", {
      ...options,
      body,
    });
  }

  getWorkers(
    options?: APIFetchOptions<operations["getWorkers"]>
  ): Promise<components["schemas"]["Worker"][]> {
    return this.makeGetRequest("/workers", options);
  }

  getWorker(
    workedId: number,
    options?: APIFetchOptions<operations["getWorker"]>
  ): Promise<components["schemas"]["Worker"]> {
    return this.makeGetRequest("/worker/{workedId}", {
      ...options,
      params: {
        path: {
          workedId,
        },
      },
    });
  }

  deleteWorker(
    workedId: number,
    options?: APIFetchOptions<operations["deleteWorker"]>
  ) {
    return this.makeDeleteRequest("/worker/{workedId}", {
      ...options,
      params: {
        path: {
          workedId,
        },
      },
    });
  }
}
