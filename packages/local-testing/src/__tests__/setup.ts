import { mockFetch, makeErrorResponse, type MockEntry } from "../../../core/src/__tests__/mock-fetch.ts";
import { LocalTestingClient } from "../client.ts";

export function makeClient(...responses: MockEntry[]) {
  return new LocalTestingClient({ accessKey: "k", fetchFn: mockFetch(responses) });
}

export { mockFetch, makeErrorResponse };
