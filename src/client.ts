import { FetchOptions, FetchResponse } from "openapi-fetch";
import { APIClient } from "@/api";
import { components, operations } from "@/generated/openapi";

export class BrowserStackClient extends APIClient {
  async getBrowsers<T extends true>(
    options?: FetchOptionsFlat<T>
  ): Promise<FetchResponse<BrowserList>>;

  async getBrowsers<T extends false>(
    options?: FetchOptionsFlat<T>
  ): Promise<FetchResponse<BrowserMap>>;

  async getBrowsers(
    options?: FetchOptions<operations["getBrowsers"]>
  ): Promise<FetchResponse<BrowserList | BrowserMap>> {
    return this.sdk.GET("/browsers", {
      ...options,
      params: {
        ...options?.params,
        query: {
          ...options?.params?.query,
          flat:
            typeof options?.params?.query?.flat === "boolean"
              ? options.params.query.flat
              : true,
        },
      },
    });
  }
}

export type FetchOptionsFlat<T extends boolean> = FetchOptions<
  Omit<operations["getBrowsers"], "parameters"> & {
    parameters: Omit<operations["getBrowsers"]["parameters"], "query"> & {
      query?: Omit<operations["getBrowsers"]["parameters"]["query"], "flat"> & {
        flat?: T;
      };
    };
  }
>;

export type BrowserMap = Omit<operations["getBrowsers"], "responses"> & {
  responses: Omit<operations["getBrowsers"]["responses"], 200> & {
    /** @description Successful operation */
    200: {
      content: {
        "application/json": components["schemas"]["BrowserMap"];
      };
    };
  };
};

export type BrowserList = Omit<operations["getBrowsers"], "responses"> & {
  responses: Omit<operations["getBrowsers"]["responses"], 200> & {
    /** @description Successful operation */
    200: {
      content: {
        "application/json": components["schemas"]["BrowserList"];
      };
    };
  };
};
