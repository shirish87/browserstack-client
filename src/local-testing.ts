import {
  APIClient,
  APIFetchOptions,
  BrowserStackOptions,
} from "@/api-client.ts";
import { env } from "@/env.ts";
import { BrowserStackError } from "@/error.ts";
import { components, operations } from "@/generated/openapi.ts";
import { unzipSync } from "fflate";

export type LocalTestingOptions = Omit<BrowserStackOptions, "username">;

/**
 * Represents a client for interacting with the BrowserStack Local API.
 */
export class LocalTestingClient extends APIClient {
  protected readonly authToken: string;

  /**
   * Constructs a new instance of the ScreenshotsClient class.
   * @param options - Optional configuration options for the client.
   */
  constructor(options?: LocalTestingOptions) {
    super({
      ...options,
      baseUrl: options?.baseUrl ?? "https://www.browserstack.com",
      usernameOptional: true,
    });

    const authToken = options?.key ?? env.BROWSERSTACK_KEY;
    if (typeof authToken !== "string" || !authToken.trim().length) {
      throw new BrowserStackError("Missing options.key");
    }

    this.authToken = authToken;
  }

  /**
   * Retrieves a list of recent Local binary instances from the server.
   *
   * @param options - The fetch options for the request.
   * @returns A promise that resolves to a fetch response containing the list of active Local instances.
   */
  getBinaryInstances(
    query?: Omit<
      operations["getLocalBinaryInstances"]["parameters"]["query"],
      "auth_token"
    >,
    options?: APIFetchOptions<operations["getLocalBinaryInstances"]>
  ): Promise<components["schemas"]["LocalBinaryInstance"][]> {
    return this.makeGetRequest("/local/v1/list", {
      ...options,
      params: {
        query: {
          ...query,
          auth_token: this.authToken,
        },
      },
    }).then((r) => r.instances);
  }

  /**
   * Retrieves details of a Local binary instance from the server.
   *
   * @param localInstanceId The ID of the local binary instance to retrieve.
   * @param query Optional query parameters for the request.
   * @param options Optional fetch options for the request.
   * @returns A promise that resolves to the retrieved local binary instance.
   * @throws {BrowserStackError} If no local binary instance is found with the specified ID.
   */
  getBinaryInstance(
    localInstanceId: string,
    query?: Omit<
      operations["getLocalBinaryInstances"]["parameters"]["query"],
      "auth_token"
    >,
    options?: APIFetchOptions<operations["getLocalBinaryInstance"]>
  ): Promise<components["schemas"]["LocalBinaryInstance"]> {
    return this.makeGetRequest(`/local/v1/{localInstanceId}`, {
      ...options,
      params: {
        path: {
          localInstanceId,
        },
        query: {
          ...query,
          auth_token: this.authToken,
        },
      },
    }).then((r) => {
      if (!r.instances.length) {
        throw new BrowserStackError(
          `No Local binary instance found with id "${localInstanceId}"`
        );
      }

      return r.instances[0];
    });
  }

  /**
   * Disconnects a binary instance.
   *
   * @param localInstanceId - The ID of the local binary instance to disconnect.
   * @param query - Optional query parameters for the request.
   * @param options - Optional API fetch options.
   * @returns A promise that resolves to a string representing the message from the server.
   */
  disconnectBinaryInstance(
    localInstanceId: string,
    query?: Omit<
      operations["disconnectLocalBinaryInstance"]["parameters"]["query"],
      "auth_token"
    >,
    options?: APIFetchOptions<operations["disconnectLocalBinaryInstance"]>
  ): Promise<string> {
    return this.makeDeleteRequest(`/local/v1/{localInstanceId}`, {
      ...options,
      params: {
        path: {
          localInstanceId,
        },
        query: {
          ...query,
          auth_token: this.authToken,
        },
      },
    }).then((r) => r.message);
  }

  /**
   * Downloads the BrowserStackLocal binary for the specified operating system architecture and saves it to the specified file path.
   * Note that the file is downloaded to memory for the unzip operation.
   * If the file is large, this method may fail with an out of memory error.
   * This method is intended for use in Node.js environments and will fail in the browser.
   *
   * @internal
   * @param osArch - The operating system architecture for which to download the binary.
   * @param dirPath - The file path where the binary will be saved.
   * @param filenamePrefix - The prefix for the downloaded binary file name inside the ZIP file. Default is "BrowserStackLocal".
   * @param fileMode - The file mode to set for the downloaded binary file. Default is 0o755.
   * @param options - Additional options for the API fetch request.
   * @returns A Promise that resolves when the binary is successfully downloaded and saved.
   */
  downloadBinary(
    osArch: operations["downloadLocalBinary"]["parameters"]["path"]["osArch"],
    filenamePrefix: string = "BrowserStackLocal",
    options?: APIFetchOptions<operations["downloadLocalBinary"]>
  ): Promise<{
    content: Uint8Array;
    filename: string;
  }> {
    return this.sdk
      .GET("/browserstack-local/BrowserStackLocal-{osArch}.zip", {
        ...options,
        params: {
          path: {
            osArch,
          },
        },
        parseAs: "arrayBuffer",
      })
      .then(({ data: buffer }) => {
        if (!buffer) {
          throw new BrowserStackError(
            `Failed to download BrowserStackLocal-${osArch}.zip: Unexpected response.`
          );
        }

        const files = unzipSync(new Uint8Array(buffer), {
          filter: (file) => {
            return file.name.startsWith(filenamePrefix);
          },
        });

        const entries = Object.keys(files);
        if (!entries.length) {
          throw new BrowserStackError(
            `Local binary not found in BrowserStackLocal-${osArch}.zip`
          );
        }

        const content = files[entries[0]];
        return { content, filename: entries[0] };
      })
      .catch((err) => {
        if (err instanceof BrowserStackError) {
          throw err;
        }

        throw new BrowserStackError(
          `Failed to write local binary to disk: ${err.message}: ${err.stack}`
        );
      });
  }
}
