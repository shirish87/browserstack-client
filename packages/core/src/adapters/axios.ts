// @ts-nocheck
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
 * import { createAxiosAdapter } from '@browserstack-client/core/adapters';
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
export function createAxiosAdapter(
  axios: any // AxiosInstance
): typeof fetch {
  return async (input, init) => {
    const url = typeof input === "string" ? input : input.url;
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
    });

    return new Response(axiosResp.data, {
      status: axiosResp.status,
      statusText: axiosResp.statusText,
      headers: new Headers(
        axiosResp.headers as Record<string, string>
      ),
    });
  };
}
