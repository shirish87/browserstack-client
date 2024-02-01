import { APIClient, APIFetchOptions, BrowserStackOptions } from "@/api-client.ts"
import { env } from "@/env.ts"
import { BrowserStackError } from "@/error.ts"
import { components, operations } from "@/generated/openapi.ts"
import type { ChildProcess } from "node:child_process";

export type LocalTestingOptions = Omit<BrowserStackOptions, "username">;

/**
 * Represents a client for interacting with the BrowserStack Local API.
 */
export class LocalTestingClient extends APIClient {
  private readonly authToken: string;

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
    query?: Omit<operations["getLocalBinaryInstances"]["parameters"]["query"], "auth_token">,
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
    query?: Omit<operations["getLocalBinaryInstances"]["parameters"]["query"], "auth_token">,
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
    query?: Omit<operations["disconnectLocalBinaryInstance"]["parameters"]["query"], "auth_token">,
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
   * @param osArch - The operating system architecture for which to download the binary.
   * @param dirPath - The file path where the binary will be saved.
   * @param filenamePrefix - The prefix for the downloaded binary file name inside the ZIP file. Default is "BrowserStackLocal".
   * @param fileMode - The file mode to set for the downloaded binary file. Default is 0o755.
   * @param options - Additional options for the API fetch request.
   * @returns A Promise that resolves when the binary is successfully downloaded and saved.
   */
  async downloadBinary(
    osArch: operations["downloadLocalBinary"]["parameters"]["path"]["osArch"],
    dirPath: string,
    filenamePrefix: string = "BrowserStackLocal",
    fileMode: number = 0o755,
    options?: APIFetchOptions<operations["downloadLocalBinary"]>
  ): Promise<string> {
    return this.sdk
      .GET(`/browserstack-local/BrowserStackLocal-{osArch}.zip`, {
        ...options,
        params: {
          path: {
            osArch,
          },
        },
        parseAs: "arrayBuffer",
      })
      .then((r) => r.response.arrayBuffer())
      .then(async (buffer) => {
        // local imports to avoid bundling in browser
        const { writeFile, unlink, stat } = await import("node:fs/promises");
        const { unzipSync } = await import("fflate");
        const { join } = await import("node:path");

        const files = unzipSync(new Uint8Array(buffer), {
          filter: (file) => {
            return file.name.startsWith(filenamePrefix);
          },
        });

        const entries = Object.keys(files);
        if (!entries.length) {
          throw new BrowserStackError("Local binary not found in zip");
        }

        const filePath = join(dirPath.toString(), entries[0]);

        try {
          await writeFile(filePath, files[entries[0]], { mode: fileMode });
          return filePath;
        } catch (err) {
          try {
            if ((await stat(filePath)).isFile()) {
              await unlink(filePath);
            }
          } catch {
            /* ignore best-effort cleanup error */
          }

          throw err;
        }
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

  /**
   * Runs the downloaded Local binary file with the specified flags and options.
   *
   * @param binFilePath - The path to the executable binary file.
   * @param flags - An array of flags to pass to the executable.
   * @param onData - A callback function to handle stdout data received from the executable.
   * @param onError - A callback function to handle stderr data received from the executable.
   * @param startTimeout - The timeout duration in milliseconds for the executable to start.
   * @param stdoutSuccessMessage - The success message to look for in the stdout of the executable.
   * @returns A promise that resolves with the child process when the executable starts successfully.
   * @throws If an error occurs while executing the binary file.
   */
  async runBinary(
    binFilePath: string,
    flags: LocalBinaryFlag[] = [],
    onData: (data: string) => void = () => {},
    onError: (data: string) => void = () => {},
    startTimeout: number = 10_000,
    stdoutSuccessMessage: string = "[SUCCESS]",
  ): Promise<ChildProcess> {
    // local imports to avoid bundling in browser
    const { execFile } = await import("node:child_process");

    const child = execFile(
      binFilePath,
      ["--key", this.authToken, "--enable-logging-for-api", ...flags],
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }

        onData?.(stdout);
        onError?.(stderr);
      }
    );

    // watch for stdout '[SUCCESS] You can now access your local server(s) in our remote browser'
    // or fail if startTimeout has elapsed
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(reject, startTimeout);

      if (onError) {
        child.stderr?.on("data", onError);
      }

      child.stdout?.on("data", (data: string) => {
        onData?.(data);

        if (data.toUpperCase().includes(stdoutSuccessMessage)) {
          clearTimeout(timeout);
          resolve(child);
        }
      });
    });
  }
}

// TODO: typesafe binary flags to serialize to string[]
export type LocalBinaryFlag = string;
