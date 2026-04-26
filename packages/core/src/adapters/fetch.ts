/**
 * Wrap any fetch-compatible function so it can be passed as `fetchFn`.
 * Identity adapter — useful for explicit proxy-wrapping patterns.
 *
 * Example:
 * ```ts
 * import fetch from 'node-fetch';
 * import { createFetchAdapter } from '@browserstack-client/core/adapters';
 *
 * const client = new AutomateClient({
 *   username: 'user',
 *   accessKey: 'accessKey',
 *   fetchFn: createFetchAdapter(fetch),
 * });
 * ```
 */
export function createFetchAdapter(fn: typeof fetch): typeof fetch {
  return fn;
}
