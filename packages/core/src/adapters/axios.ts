/**
 * Converts an Axios instance into a fetch-compatible function.
 * Consumers pass this as `fetchFn` when constructing any product client.
 *
 * Trade-off: Axios response streaming is not supported; body is collected.
 * ArrayBuffer responses work via `responseType: "arraybuffer"`.
 *
 * Example:
 * ```ts
 * import axios from 'axios';
 * import { createAxiosAdapter } from '@dot-slash/browserstack-core/adapters';
 *
 * const axiosInstance = axios.create({
 *   // proxy config, interceptors, etc.
 * });
 *
 * const client = new AutomateClient({
 *   username: 'user',
 *   accessKey: 'accessKey',
 *   fetchFn: createAxiosAdapter(axiosInstance),
 * });
 * ```
 */
interface AxiosLike {
  request(config: {
    url: string;
    method: string;
    headers: Record<string, string>;
    data: BodyInit | null | undefined;
    responseType: "arraybuffer";
    validateStatus: (status: number) => boolean;
    signal?: AbortSignal;
  }): Promise<{
    data: ArrayBuffer;
    status: number;
    statusText: string;
    headers: Record<string, string>;
  }>;
}

export function createAxiosAdapter(axios: AxiosLike): typeof fetch {
  return async (input, init) => {
    const url = typeof input === "string" ? input : (input instanceof Request ? input.url : input.toString());
    const method = (init?.method ?? "GET").toUpperCase();
    const headers = Object.fromEntries(
      new Headers(init?.headers ?? {}).entries()
    );

    const axiosResp = await axios.request({
      url,
      method,
      headers,
      data: init?.body,
      responseType: "arraybuffer",
      validateStatus: () => true, // Don't throw on any status
      signal: init?.signal,
    });

    return new Response(axiosResp.data, {
      status: axiosResp.status,
      statusText: axiosResp.statusText,
      headers: new Headers(axiosResp.headers),
    });
  };
}
