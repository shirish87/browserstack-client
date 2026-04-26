import { describe, expect, it } from "vitest";
import { captureErrorBody } from "../body-capture";

function mkResponse(body: string, contentType = "application/json", status = 400): Response {
  return new Response(body, { status, headers: { "content-type": contentType } });
}

describe("captureErrorBody", () => {
  it("parses JSON content-type into parsed + text", async () => {
    const r = mkResponse('{"error":"x"}');
    const cap = await captureErrorBody(r, 1024);
    expect(cap.contentType).toBe("application/json");
    expect(cap.text).toBe('{"error":"x"}');
    expect(cap.parsed).toEqual({ error: "x" });
    expect(cap.truncated).toBe(false);
  });

  it("returns text only for non-JSON content types", async () => {
    const r = mkResponse("plain text", "text/plain");
    const cap = await captureErrorBody(r, 1024);
    expect(cap.text).toBe("plain text");
    expect(cap.parsed).toBeUndefined();
  });

  it("truncates at maxBytes", async () => {
    const big = "x".repeat(10_000);
    const r = mkResponse(big, "text/plain");
    const cap = await captureErrorBody(r, 100);
    expect(cap.text!.length).toBe(100);
    expect(cap.truncated).toBe(true);
  });

  it("falls back to text when JSON parse fails", async () => {
    const r = mkResponse("not{json", "application/json");
    const cap = await captureErrorBody(r, 1024);
    expect(cap.text).toBe("not{json");
    expect(cap.parsed).toBeUndefined();
    expect(cap.truncated).toBe(false);
  });
});
