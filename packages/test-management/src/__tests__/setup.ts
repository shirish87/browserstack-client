import { mockFetch, makeErrorResponse, type MockEntry } from "../../../core/src/__tests__/mock-fetch.ts";
import { TestManagementClient } from "../index.ts";

export function makeClient(...responses: MockEntry[]) {
  return new TestManagementClient({ username: "u", accessKey: "k", fetchFn: mockFetch(responses) });
}

export { mockFetch, makeErrorResponse };
