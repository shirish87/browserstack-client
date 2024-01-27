import { paths } from "@/generated/openapi";
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

export interface APIClientOptions extends ClientOptions {
  username?: string;
  key?: string;
}

export type ExtraRequestOptions =
  | { useSdkCloud?: boolean | undefined }
  | undefined;

export class APIClient {
  protected readonly sdk: ReturnType<typeof createClient<paths>>;

  protected readonly sdkCloud: ReturnType<typeof createClient<paths>>;

  constructor(options: APIClientOptions) {
    const username = options.username ?? process.env.BROWSERSTACK_USERNAME;
    // assert(username, "username is required");

    const key = options.key ?? process.env.BROWSERSTACK_KEY;
    // assert(key, "key is required");

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

  protected async makeGetRequest<P extends PathsWithMethod<paths, "get">>(
    path: P,
    ...init: HasRequiredKeys<
      FetchOptions<FilterKeys<paths[P], "get">>
    > extends never
      ? [(FetchOptions<FilterKeys<paths[P], "get">> | undefined)?]
      : [FetchOptions<FilterKeys<paths[P], "get">>]
  ) {
    const res = await this.sdk.GET(path, ...init);
    if (res.error || !res.data) {
      throw new Error(`Error: ${JSON.stringify(res.error)}`);
    }

    return res.data;
  }

  protected async makePostRequest<P extends PathsWithMethod<paths, "post">>(
    path: P,
    ...init: HasRequiredKeys<
      FetchOptions<FilterKeys<paths[P], "post">>
    > extends never
      ? [(FetchOptions<FilterKeys<paths[P], "post">> | undefined)?]
      : [FetchOptions<FilterKeys<paths[P], "post">>]
  ) {
    const res = await this.sdk.POST(path, ...init);
    if (res.error || !res.data) {
      throw new Error(`Error: ${JSON.stringify(res.error)}`);
    }

    return res.data;
  }

  protected async makeCloudGetRequest<P extends PathsWithMethod<paths, "get">>(
    path: P,
    ...init: HasRequiredKeys<
      FetchOptions<FilterKeys<paths[P], "get">>
    > extends never
      ? [(FetchOptions<FilterKeys<paths[P], "get">> | undefined)?]
      : [FetchOptions<FilterKeys<paths[P], "get">>]
  ) {
    const res = await this.sdkCloud.GET(path, ...init);
    if (res.error || !res.data) {
      throw new Error(`Error: ${JSON.stringify(res.error)}`);
    }

    return res.data;
  }

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
    const res = await this.sdkCloud.POST(path, ...init);
    if (res.error || !res.data) {
      throw new Error(`Error: ${JSON.stringify(res.error)}`);
    }

    return res.data;
  }

  protected async makePutRequest<P extends PathsWithMethod<paths, "put">>(
    path: P,
    ...init: HasRequiredKeys<
      FetchOptions<FilterKeys<paths[P], "put">>
    > extends never
      ? [(FetchOptions<FilterKeys<paths[P], "put">> | undefined)?]
      : [FetchOptions<FilterKeys<paths[P], "put">>]
  ) {
    const res = await this.sdk.PUT(path, ...init);
    if (res.error || !res.data) {
      throw new Error(`Error: ${JSON.stringify(res.error)}`);
    }

    return res.data;
  }

  protected async makePatchRequest<P extends PathsWithMethod<paths, "patch">>(
    path: P,
    ...init: HasRequiredKeys<
      FetchOptions<FilterKeys<paths[P], "patch">>
    > extends never
      ? [(FetchOptions<FilterKeys<paths[P], "patch">> | undefined)?]
      : [FetchOptions<FilterKeys<paths[P], "patch">>]
  ) {
    const res = await this.sdk.PATCH(path, ...init);
    if (res.error || !res.data) {
      throw new Error(`Error: ${JSON.stringify(res.error)}`);
    }

    return res.data;
  }

  protected async makeDeleteRequest<P extends PathsWithMethod<paths, "delete">>(
    path: P,
    ...init: HasRequiredKeys<
      FetchOptions<FilterKeys<paths[P], "delete">>
    > extends never
      ? [(FetchOptions<FilterKeys<paths[P], "delete">> | undefined)?]
      : [FetchOptions<FilterKeys<paths[P], "delete">>]
  ) {
    const res = await this.sdk.DELETE(path, ...init);
    if (res.error || !res.data) {
      throw new Error(`Error: ${JSON.stringify(res.error)}`);
    }

    return res.data;
  }

  protected fixInvalidJSONResponse<O>(data: any) {
    let response: O | undefined = data;

    if (typeof data === "string" && data.match(/^http\//i)) {
      // HTTP/1.1 0 Unknown Reason-Phrase
      // Status: 0 Unknown Reason-Phrase
      try {
        const r = data.split("\n").at(-1);
        if (r) {
          response = JSON.parse(r);
        }
      } catch (err) {
        /* ignore */
      }
    }

    if (!response) {
      throw new Error(`Invalid response: ${data}`);
    }

    return response;
  }

  getAccountStatus(options?: FetchOptions<paths["/status"]["get"]>) {
    return this.sdk.GET("/status", options);
  }
}
