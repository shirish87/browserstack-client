/**
 * Converts a Got instance into a fetch-compatible function.
 *
 * Example:
 * ```ts
 * import got from 'got';
 * import { createGotAdapter } from '@browserstack-client/core/adapters';
 *
 * const gotInstance = got.extend({
 *   // proxy config, hooks, etc.
 * });
 *
 * const client = new AutomateClient({
 *   username: 'user',
 *   accessKey: 'accessKey',
 *   fetchFn: createGotAdapter(gotInstance),
 * });
 * ```
 */
export function createGotAdapter(
  got: any // Got
): typeof fetch {
  return async (input, init) => {
    const url = typeof input === "string" ? input : input.url;
    const method = (init?.method ?? "GET").toUpperCase();

    const gotResp = await got(url, {
      method,
      headers: Object.fromEntries(new Headers(init?.headers ?? {}).entries()),
      body: init?.body as string | Buffer | undefined,
      throwHttpErrors: false, // Don't throw on any status
    });

    return new Response(gotResp.rawBody, {
      status: gotResp.statusCode,
      headers: new Headers(
        gotResp.headers as Record<string, string>
      ),
    });
  };
}
