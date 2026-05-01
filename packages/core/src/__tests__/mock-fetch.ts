import { vi } from "vitest";

export type MockEntry =
  | Record<string, unknown>   // JSON object → 200 application/json
  | unknown[]                 // JSON array → 200 application/json
  | string                    // plain text → 200 text/plain
  | Response;                 // pre-built Response (for errors, special status)

function toResponse(entry: MockEntry): Response {
  if (entry instanceof Response) return entry;
  if (typeof entry === "string") {
    return new Response(entry, {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  }
  return new Response(JSON.stringify(entry), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export function mockFetch(responses: MockEntry[]): typeof fetch {
  const queue = [...responses];
  return vi.fn(async (_url: string | URL | Request, _init?: RequestInit) => {
    const entry = queue.shift();
    if (entry === undefined) {
      throw new Error(
        `mockFetch: called more times than responses provided (${responses.length} total)`
      );
    }
    return toResponse(entry);
  }) as unknown as typeof fetch;
}

export function makeErrorResponse(status: number, message: string): Response {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}
