import { mockFetch, makeErrorResponse, type MockEntry } from "../../../core/src/__tests__/mock-fetch.ts";
import { ScreenshotsClient } from "../client.ts";

export function makeClient(...responses: MockEntry[]) {
  return new ScreenshotsClient({ username: "u", accessKey: "k", fetchFn: mockFetch(responses) });
}

export { mockFetch, makeErrorResponse };
