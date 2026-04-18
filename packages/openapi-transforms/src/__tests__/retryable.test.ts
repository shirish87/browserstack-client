import { describe, expect, it } from "vitest";
import { isRetryable } from "../retryable.js";

describe("isRetryable", () => {
  it("network always retryable", () => {
    expect(isRetryable("network")).toBe(true);
  });
  it("http: 408, 429, 500..599 except 501/505 retryable", () => {
    expect(isRetryable("http", 408)).toBe(true);
    expect(isRetryable("http", 429)).toBe(true);
    expect(isRetryable("http", 500)).toBe(true);
    expect(isRetryable("http", 503)).toBe(true);
    expect(isRetryable("http", 501)).toBe(false);
    expect(isRetryable("http", 505)).toBe(false);
    expect(isRetryable("http", 400)).toBe(false);
    expect(isRetryable("http", 404)).toBe(false);
  });
  it("decode/transform/client/validation not retryable", () => {
    expect(isRetryable("decode")).toBe(false);
    expect(isRetryable("transform")).toBe(false);
    expect(isRetryable("client")).toBe(false);
    expect(isRetryable("validation")).toBe(false);
  });
});
