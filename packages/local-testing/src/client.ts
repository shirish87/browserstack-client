import {
  ExecuteOptions,
  BrowserStackOptions,
  resolveAccessKey,
} from "@browserstack-client/core";
import { BrowserStackError, OpenAPIError } from "@browserstack-client/core";
import { operations, components } from "@browserstack-client/openapi/local-testing";
import { GeneratedLocalTestingClient } from "@browserstack-client/openapi/local-testing/client";
import { unzipSync } from "fflate";

export type LocalTestingOptions = Omit<BrowserStackOptions, "username">;

export class LocalTestingClient extends GeneratedLocalTestingClient {
  protected readonly authToken: string;

  constructor(options?: LocalTestingOptions) {
    super(
      {
        ...options,
        usernameOptional: true,
      },
      options?.baseUrl ?? "https://www.browserstack.com",
      "https://api-cloud.browserstack.com",
      "@browserstack-client/local-testing",
      "6.0.0"
    );

    const authToken = resolveAccessKey(options?.accessKey);
    if (typeof authToken !== "string" || !authToken.trim().length) {
      throw new BrowserStackError("Missing options.accessKey");
    }

    this.authToken = authToken;
  }

  getBinaryInstances(
    query?: Omit<
      operations["getLocalBinaryInstances"]["parameters"]["query"],
      "auth_token"
    >,
    options?: ExecuteOptions
  ): Promise<components["schemas"]["LocalBinaryInstance"][]> {
    return (this.execute({
      operationId: "getLocalBinaryInstances",
      method: "GET" as const,
      path: "/local/v1/list",
      params: {
        query: {
          ...query,
          auth_token: this.authToken,
        } as Record<string, unknown>,
      },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      signal: options?.signal,
    }) as Promise<operations["getLocalBinaryInstances"]["responses"][200]["content"]["application/json"]>).then((r) => r.instances);
  }

  getBinaryInstance(
    localInstanceId: string,
    query?: Omit<
      operations["getLocalBinaryInstances"]["parameters"]["query"],
      "auth_token"
    >,
    options?: ExecuteOptions
  ): Promise<components["schemas"]["LocalBinaryInstance"]> {
    return (this.execute({
      operationId: "getLocalBinaryInstance",
      method: "GET" as const,
      path: "/local/v1/{localInstanceId}",
      params: {
        path: { localInstanceId },
        query: {
          ...query,
          auth_token: this.authToken,
        } as Record<string, unknown>,
      },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      signal: options?.signal,
    }) as Promise<operations["getLocalBinaryInstance"]["responses"][200]["content"]["application/json"]>).then((r) => {
      if (!r.instances.length) {
        throw new BrowserStackError(
          `No Local binary instance found with id "${localInstanceId}"`
        );
      }

      return r.instances[0];
    });
  }

  disconnectBinaryInstance(
    localInstanceId: string,
    query?: Omit<
      operations["disconnectLocalBinaryInstance"]["parameters"]["query"],
      "auth_token"
    >,
    options?: ExecuteOptions
  ): Promise<string> {
    return (this.execute({
      operationId: "disconnectLocalBinaryInstance",
      method: "DELETE" as const,
      path: "/local/v1/{localInstanceId}",
      params: {
        path: { localInstanceId },
        query: {
          ...query,
          auth_token: this.authToken,
        } as Record<string, unknown>,
      },
      requestCodec: "json",
      requestCodecConfig: {},
      responseCodec: "json",
      responseCodecConfig: {},
      baseUrl: "sdk" as const,
      signal: options?.signal,
    }) as Promise<operations["disconnectLocalBinaryInstance"]["responses"][200]["content"]["application/json"]>).then((r) => r.message);
  }

  downloadBinary(
    osArch: operations["downloadLocalBinary"]["parameters"]["path"]["osArch"],
    filenamePrefix: string = "BrowserStackLocal",
    options?: ExecuteOptions
  ): Promise<{
    content: Uint8Array;
    filename: string;
  }> {
    const url = `${this.baseUrls.sdk}/browserstack-local/BrowserStackLocal-${encodeURIComponent(osArch)}.zip`;
    return this.fetchFn(url, { signal: options?.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new BrowserStackError(
            `Failed to download BrowserStackLocal-${osArch}.zip: HTTP ${response.status}`
          );
        }
        return new Uint8Array(await response.arrayBuffer());
      })
      .then((buffer) => {
        const files = unzipSync(buffer, {
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
        if (err instanceof BrowserStackError || err instanceof OpenAPIError) {
          throw err;
        }

        throw new BrowserStackError(
          `Failed to download local binary: ${err.message}: ${err.stack}`
        );
      });
  }
}
