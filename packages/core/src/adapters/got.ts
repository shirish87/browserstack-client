/**
 * Converts a Got instance into a fetch-compatible function.
 *
 * Example:
 * ```ts
 * import got from 'got';
 * import { createGotAdapter } from '@dot-slash/browserstack-core/adapters';
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
type GotLike = (url: string, options: {
  method: string;
  headers: Record<string, string>;
  body: string | Buffer | undefined;
  throwHttpErrors: boolean;
  signal?: AbortSignal;
}) => Promise<{
  rawBody: Uint8Array<ArrayBuffer>;
  statusCode: number;
  headers: Record<string, string>;
}>;

export function createGotAdapter(got: GotLike): typeof fetch {
  return async (input, init) => {
    const url = typeof input === "string" ? input : (input instanceof Request ? input.url : input.toString());
    const method = (init?.method ?? "GET").toUpperCase();
    const body = typeof init?.body === "string" || init?.body instanceof Buffer ? init.body : undefined;

    const gotResp = await got(url, {
      method,
      headers: Object.fromEntries(new Headers(init?.headers ?? {}).entries()),
      body,
      throwHttpErrors: false,
      signal: init?.signal ?? undefined,
    });

    return new Response(new Blob([gotResp.rawBody]), {
      status: gotResp.statusCode,
      headers: new Headers(gotResp.headers),
    });
  };
}
