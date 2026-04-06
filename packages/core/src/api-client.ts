import { env } from "./env.js";
import { BrowserStackError } from "./error.js";
import { buildBasicAuthHeader } from "./auth.js";
import { makePkgInfo } from "./pkginfo.js";

function nonEmpty(value: string | undefined): string | undefined {
  return value?.trim?.()?.length ? value.trim() : undefined;
}

/**
 * Resolves the BrowserStack access key from options or environment variables.
 * Checks the provided value, BROWSERSTACK_ACCESS_KEY, and BROWSERSTACK_KEY in order.
 * @returns The resolved access key, or undefined if not found.
 */
export function resolveAccessKey(optionsAccessKey?: string): string | undefined {
  return nonEmpty(optionsAccessKey) ?? nonEmpty(env.BROWSERSTACK_ACCESS_KEY) ?? nonEmpty(env.BROWSERSTACK_KEY);
}

/**
 * Resolves the BrowserStack username from options or environment variables.
 * @returns The resolved username, or undefined if not found.
 */
export function resolveUsername(optionsUsername?: string): string | undefined {
  return nonEmpty(optionsUsername) ?? nonEmpty(env.BROWSERSTACK_USERNAME);
}
import type {
  ClientOptions,
  FetchOptions,
  FetchResponse,
  MaybeOptionalInit,
} from "openapi-fetch";
import createClient from "openapi-fetch";
import type { PathsWithMethod } from "openapi-typescript-helpers";

export interface BrowserStackOptions extends Partial<ClientOptions> {
  username?: string;
  accessKey?: string;
  /**
   * Custom HTTP fetch function. Can be a proxy-wrapping fetch, an Axios adapter, Got adapter, etc.
   * Defaults to the global fetch.
   */
  fetchFn?: typeof fetch;
  /**
   * @internal
   */
  usernameOptional?: boolean;
}

export type APIFetchOptions<T> = Omit<FetchOptions<T>, "params" | "body">;

/**
 * @internal
 */
export class APIClient<Paths extends {}> {
  protected readonly sdk: ReturnType<typeof createClient<Paths>>;
  protected readonly sdkCloud: ReturnType<typeof createClient<Paths>>;

  constructor(
    options: BrowserStackOptions,
    baseUrl: string,
    cloudBaseUrl: string,
    pkgName: string,
    pkgVersion: string
  ) {
    const username = resolveUsername(options.username);
    if (
      options.usernameOptional !== true &&
      (typeof username !== "string" || !username.trim().length)
    ) {
      throw new BrowserStackError("Missing options.username");
    }

    const accessKey = resolveAccessKey(options.accessKey);
    if (typeof accessKey !== "string" || !accessKey.trim().length) {
      throw new BrowserStackError("Missing options.accessKey");
    }

    const pkginfo = makePkgInfo(pkgName, pkgVersion);

    const clientOptions: ClientOptions = {
      ...options,
      baseUrl: options.baseUrl ?? baseUrl,
      headers: {
        ...options.headers,
        Authorization: username
          ? buildBasicAuthHeader(username, accessKey)
          : undefined,
        "User-Agent": pkginfo.userAgent,
      },
      fetch: options.fetchFn,
    };

    this.sdk = createClient<Paths>(clientOptions);

    this.sdkCloud = createClient<Paths>({
      ...clientOptions,
      baseUrl: cloudBaseUrl,
    });
  }

  /**
   * @internal
   */
  protected async makeGetRequest<
    Path extends PathsWithMethod<Paths, "get">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "get">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { get: infer M } ? M : never>["data"]
    >
  > {
    const response = await this.sdk.GET(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }

  /**
   * @internal
   */
  protected async makePostRequest<
    Path extends PathsWithMethod<Paths, "post">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "post">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { post: infer M } ? M : never>["data"]
    >
  > {
    const response = await this.sdk.POST(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }

  /**
   * @internal
   */
  protected async makeCloudGetRequest<
    Path extends PathsWithMethod<Paths, "get">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "get">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { get: infer M } ? M : never>["data"]
    >
  > {
    const response = await this.sdkCloud.GET(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }

  /**
   * @internal
   */
  protected async makeCloudPostRequest<
    Path extends PathsWithMethod<Paths, "post">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "post">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { post: infer M } ? M : never>["data"]
    >
  > {
    const response = await this.sdkCloud.POST(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }

  /**
   * @internal
   */
  protected async makePutRequest<
    Path extends PathsWithMethod<Paths, "put">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "put">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { put: infer M } ? M : never>["data"]
    >
  > {
    const response = await this.sdk.PUT(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }

  /**
   * @internal
   */
  protected async makePatchRequest<
    Path extends PathsWithMethod<Paths, "patch">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "patch">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { patch: infer M } ? M : never>["data"]
    >
  > {
    const response = await this.sdk.PATCH(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }

  /**
   * @internal
   */
  protected async makeDeleteRequest<
    Path extends PathsWithMethod<Paths, "delete">
  >(
    path: Path,
    ...init: MaybeOptionalInit<Paths[Path], "delete">
  ): Promise<
    NonNullable<
      FetchResponse<Paths[Path] extends { delete: infer M } ? M : never>["data"]
    >
  > {
    const response = await this.sdk.DELETE(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path: path as string,
        response,
        ...init,
      });
    }

    return response.data as any;
  }
}
