import { describe, it, expect } from "vitest";
import { buildFlushSentinel } from "../flush.js";

describe("buildFlushSentinel", () => {
  it("formats ok sentinel", () => {
    const line = buildFlushSentinel({ spans: 42, logs: 7, status: "ok" });
    expect(line).toBe('BROWSERSTACK_WATCH_FLUSH:{"spans":42,"logs":7,"status":"ok"}');
  });

  it("formats error sentinel with reason", () => {
    const line = buildFlushSentinel({ spans: 3, logs: 0, status: "error", reason: "timeout" });
    expect(line).toBe('BROWSERSTACK_WATCH_FLUSH:{"spans":3,"logs":0,"status":"error","reason":"timeout"}');
  });

  it("omits reason when ok", () => {
    const line = buildFlushSentinel({ spans: 0, logs: 0, status: "ok" });
    expect(line).not.toContain("reason");
  });
});
