import { BrowserStackError } from "@/error";
import { components, paths } from "@/generated/openapi";
import { servers } from "@/generated/openapi.json";
import pkginfo from "@/pkginfo";
import createClient, { ClientOptions, FetchOptions } from "openapi-fetch";
import {
  FilterKeys,
  HasRequiredKeys,
  PathsWithMethod,
} from "openapi-typescript-helpers";

const [{ variables }, { variables: cloudVars }] = servers;

const defaultBaseUrl = `${variables.scheme.default}://${
  variables.host.default
}${variables.basePath ? variables.basePath.default : ""}`;
const apiCloudBaseUrl = `${cloudVars.scheme.default}://${
  cloudVars.host.default
}${cloudVars.basePath ? cloudVars.basePath.default : ""}`;

export interface BrowserStackOptions extends ClientOptions {
  username?: string;
  key?: string;
}

/**
 * @internal
 */
export type ExtraRequestOptions =
  | { useSdkCloud?: boolean | undefined }
  | undefined;

export type APIFetchOptions<T> = Omit<FetchOptions<T>, "params" | "body">;

/**
 * @internal
 */
export class APIClient {
  protected readonly sdk: ReturnType<typeof createClient<paths>>;

  protected readonly sdkCloud: ReturnType<typeof createClient<paths>>;

  constructor(options: BrowserStackOptions) {
    const username = options.username ?? process.env.BROWSERSTACK_USERNAME;
    if (typeof username !== "string" || !username.trim().length) {
      throw new BrowserStackError("Missing options.username");
    }

    const key = options.key ?? process.env.BROWSERSTACK_KEY;
    if (typeof key !== "string" || !key.trim().length) {
      throw new BrowserStackError("Missing options.key");
    }

    const clientOptions: ClientOptions = {
      ...options,
      baseUrl: options.baseUrl ?? defaultBaseUrl,
      headers: {
        ...options.headers,
        Authorization: `Basic ${Buffer.from(`${username}:${key}`).toString(
          "base64"
        )}`,
        "User-Agent": pkginfo.userAgent,
      },
    };

    this.sdk = createClient<paths>(clientOptions);

    this.sdkCloud = createClient<paths>({
      ...clientOptions,
      baseUrl: apiCloudBaseUrl,
    });
  }

  /**
   * @internal
   */
  protected async makeGetRequest<P extends PathsWithMethod<paths, "get">>(
    path: P,
    ...init: HasRequiredKeys<
      FetchOptions<FilterKeys<paths[P], "get">>
    > extends never
      ? [(FetchOptions<FilterKeys<paths[P], "get">> | undefined)?]
      : [FetchOptions<FilterKeys<paths[P], "get">>]
  ) {
    const response = await this.sdk.GET(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path,
        response,
        ...init,
      });
    }

    return response.data;
  }

  /**
   * @internal
   */
  protected async makePostRequest<P extends PathsWithMethod<paths, "post">>(
    path: P,
    ...init: HasRequiredKeys<
      FetchOptions<FilterKeys<paths[P], "post">>
    > extends never
      ? [(FetchOptions<FilterKeys<paths[P], "post">> | undefined)?]
      : [FetchOptions<FilterKeys<paths[P], "post">>]
  ) {
    const response = await this.sdk.POST(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path,
        response,
        ...init,
      });
    }

    return response.data;
  }

  /**
   * @internal
   */
  protected async makeCloudGetRequest<P extends PathsWithMethod<paths, "get">>(
    path: P,
    ...init: HasRequiredKeys<
      FetchOptions<FilterKeys<paths[P], "get">>
    > extends never
      ? [(FetchOptions<FilterKeys<paths[P], "get">> | undefined)?]
      : [FetchOptions<FilterKeys<paths[P], "get">>]
  ) {
    const response = await this.sdkCloud.GET(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path,
        response,
        ...init,
      });
    }

    return response.data;
  }

  /**
   * @internal
   */
  protected async makeCloudPostRequest<
    P extends PathsWithMethod<paths, "post">
  >(
    path: P,
    ...init: HasRequiredKeys<
      FetchOptions<FilterKeys<paths[P], "post">>
    > extends never
      ? [(FetchOptions<FilterKeys<paths[P], "post">> | undefined)?]
      : [FetchOptions<FilterKeys<paths[P], "post">>]
  ) {
    const response = await this.sdkCloud.POST(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path,
        response,
        ...init,
      });
    }

    return response.data;
  }

  /**
   * @internal
   */
  protected async makePutRequest<P extends PathsWithMethod<paths, "put">>(
    path: P,
    ...init: HasRequiredKeys<
      FetchOptions<FilterKeys<paths[P], "put">>
    > extends never
      ? [(FetchOptions<FilterKeys<paths[P], "put">> | undefined)?]
      : [FetchOptions<FilterKeys<paths[P], "put">>]
  ) {
    const response = await this.sdk.PUT(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path,
        response,
        ...init,
      });
    }

    return response.data;
  }

  /**
   * @internal
   */
  protected async makePatchRequest<P extends PathsWithMethod<paths, "patch">>(
    path: P,
    ...init: HasRequiredKeys<
      FetchOptions<FilterKeys<paths[P], "patch">>
    > extends never
      ? [(FetchOptions<FilterKeys<paths[P], "patch">> | undefined)?]
      : [FetchOptions<FilterKeys<paths[P], "patch">>]
  ) {
    const response = await this.sdk.PATCH(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path,
        response,
        ...init,
      });
    }

    return response.data;
  }

  /**
   * @internal
   */
  protected async makeDeleteRequest<P extends PathsWithMethod<paths, "delete">>(
    path: P,
    ...init: HasRequiredKeys<
      FetchOptions<FilterKeys<paths[P], "delete">>
    > extends never
      ? [(FetchOptions<FilterKeys<paths[P], "delete">> | undefined)?]
      : [FetchOptions<FilterKeys<paths[P], "delete">>]
  ) {
    const response = await this.sdk.DELETE(path, ...init);
    if (response.error || !response.data) {
      throw new BrowserStackError(`Request failed`, {
        path,
        response,
        ...init,
      });
    }

    return response.data;
  }

  getAccountStatus(
    options?: FetchOptions<paths["/status"]["get"]>
  ): Promise<components["schemas"]["Status"]> {
    return this.makeGetRequest("/status", options);
  }
}
