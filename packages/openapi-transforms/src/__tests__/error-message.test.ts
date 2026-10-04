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
  it("extracts code and message from an S3-style XML error (Automate log endpoints)", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<Error><Code>NoSuchKey</Code><Message>The specified key does not exist.</Message><Key>abc/abc-selenium-logs.txt</Key><RequestId>X</RequestId></Error>`;
    expect(defaultErrorMessage(xml)).toBe("NoSuchKey: The specified key does not exist.");
  });
  it("falls back to the code, or nothing, for sparse or non-error XML", () => {
    expect(defaultErrorMessage("<Error><Code>AccessDenied</Code></Error>")).toBe("AccessDenied");
    expect(defaultErrorMessage("<?xml version=\"1.0\"?><root><x>1</x></root>")).toBeUndefined();
  });
  it("leaves an nginx HTML error page without a message so the status line is used", () => {
    expect(defaultErrorMessage("<html>\n<head><title>404 Not Found</title></head>\n<body><h1>404 Not Found</h1></body></html>")).toBeUndefined();
  });
});
