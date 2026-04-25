import { describe, expect, it } from "vitest";
import { defaultErrorMessage } from "../error-message";

describe("defaultErrorMessage", () => {
  it("returns undefined for null/undefined", () => {
    expect(defaultErrorMessage(undefined)).toBeUndefined();
    expect(defaultErrorMessage(null)).toBeUndefined();
  });
  it("trims long strings to 512 chars", () => {
    const s = "x".repeat(1000);
    expect(defaultErrorMessage(s)).toHaveLength(512);
  });
  it("picks .error first", () => {
    expect(defaultErrorMessage({ error: "a", message: "b" })).toBe("a");
  });
  it("falls back to .message, errors[0], .detail, .description", () => {
    expect(defaultErrorMessage({ message: "m" })).toBe("m");
    expect(defaultErrorMessage({ errors: ["e"] })).toBe("e");
    expect(defaultErrorMessage({ detail: "d" })).toBe("d");
    expect(defaultErrorMessage({ description: "desc" })).toBe("desc");
  });
  it("returns undefined when no known key matches", () => {
    expect(defaultErrorMessage({ foo: 1 })).toBeUndefined();
  });
});
