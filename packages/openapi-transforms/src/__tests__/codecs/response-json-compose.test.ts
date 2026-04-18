import { describe, expect, it } from "vitest";
import { jsonComposeCodec } from "../../codecs/response-json-compose.js";

const ctx = { operationId: "op", method: "GET", url: "http://x" };

describe("jsonComposeCodec", () => {
  it("assembles base object plus merged fields", async () => {
    const body = JSON.stringify({
      build: {
        automation_build: { hashed_id: "abc", name: "my build" },
        sessions: [
          { automation_session: { hashed_id: "s1" } },
          { automation_session: { hashed_id: "s2" } },
        ],
      },
    });
    const out = await jsonComposeCodec.decode(new Response(body), {
      base: "$.build.automation_build",
      merge: { sessions: "$.build.sessions[*].automation_session" },
    }, ctx);
    expect(out).toEqual({ hashed_id: "abc", name: "my build", sessions: [{ hashed_id: "s1" }, { hashed_id: "s2" }] });
  });
  it("works with no merge (base only)", async () => {
    const out = await jsonComposeCodec.decode(new Response('{"x":{"a":1}}'), { base: "$.x" }, ctx);
    expect(out).toEqual({ a: 1 });
  });
});
