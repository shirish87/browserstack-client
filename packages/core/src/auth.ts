/**
 * Build an HTTP Basic Authentication header value.
 * @internal
 */
export function buildBasicAuthHeader(username: string, accessKey: string): string {
  return `Basic ${btoa(`${username}:${accessKey}`)}`;
}
