export interface RetryOptions {
  /** Retries after the first attempt. */
  retries?: number;
  baseDelayMs?: number;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Transient faults worth another attempt. A 4xx is the API's answer and is never retried. */
const isTransient = (status: number): boolean => status === 429 || status >= 500;

/**
 * Wraps `fetch` so the live contract tests aren't failed by a passing 5xx, rate limit or dropped connection.
 * Genuine contract mismatches (4xx, a changed response shape) still surface on the first attempt.
 */
export function retryingFetch(fetchFn: typeof fetch, { retries = 2, baseDelayMs = 500 }: RetryOptions = {}): typeof fetch {
  return async (input, init) => {
    for (let attempt = 0; ; attempt++) {
      const last = attempt >= retries;
      try {
        const res = await fetchFn(input, init);
        if (!isTransient(res.status) || last) return res;
      } catch (error) {
        if (last) throw error;
      }
      await sleep(baseDelayMs * 2 ** attempt);
    }
  };
}
