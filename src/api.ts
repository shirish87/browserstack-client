import { paths } from "@/generated/openapi";
import { servers } from "@/generated/openapi.json";
import pkginfo from "@/pkginfo";
import createClient, { ClientOptions, FetchOptions } from "openapi-fetch";
import { FilterKeys, HasRequiredKeys, PathsWithMethod } from "openapi-typescript-helpers";


const [ { variables } ] = servers;
const defaultBaseUrl = `${variables.scheme.default}://${variables.host.default}${variables.basePath.default}`;

export interface APIClientOptions extends ClientOptions {
  username?: string
  key?: string
}

export class APIClient {

  protected readonly sdk: ReturnType<typeof createClient<paths>>;

  constructor(options: APIClientOptions) {
    const username = options.username ?? process.env.BROWSERSTACK_USERNAME;
    // assert(username, "username is required");

    const key = options.key ?? process.env.BROWSERSTACK_KEY;
    // assert(key, "key is required");

    this.sdk = createClient<paths>({
      ...options,
      baseUrl: options.baseUrl ?? defaultBaseUrl,
      headers: {
        ...options.headers,
        "Authorization": `Basic ${Buffer.from(`${username}:${key}`).toString("base64")}`,
        "User-Agent": pkginfo.userAgent,
      },
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
      throw new Error(`Error fetching ${path}: ${res.error}`);
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
      throw new Error(`Error fetching ${path}: ${res.error}`);
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
      throw new Error(`Error fetching ${path}: ${res.error}`);
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
      throw new Error(`Error fetching ${path}: ${res.error}`);
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
      throw new Error(`Error fetching ${path}: ${res.error}`);
    }

    return res.data;
  }

  getAccountStatus(options?: FetchOptions<paths["/status"]["get"]>) {
    return this.sdk.GET("/status", options);
  }

}
