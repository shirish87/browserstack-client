/** Route of the session deep-dive. `test` (a test key) preselects that test's time window. */
export function sessionHref(buildId: string, sessionId: string, test?: string): string {
  const base = `/builds/${encodeURIComponent(buildId)}/sessions/${encodeURIComponent(sessionId)}`;
  return test ? `${base}?test=${encodeURIComponent(test)}` : base;
}
