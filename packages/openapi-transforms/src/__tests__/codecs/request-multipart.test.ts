import { describe, expect, it } from "vitest";
import { multipartRequestCodec } from "../../codecs/request-multipart.js";

describe("multipartRequestCodec", () => {
  it("builds FormData with file field + extra fields", () => {
    const file = new Blob(["hello"], { type: "text/plain" });
    const r = multipartRequestCodec.encode(
      { file, filename: "hi.txt", extra: "abc" },
      { fileField: "file", filenameFrom: "$.filename" },
    );
    expect(r.body).toBeInstanceOf(FormData);
    expect(r.headers ?? {}).not.toHaveProperty("content-type");
    const fd = r.body as FormData;
    expect(fd.get("extra")).toBe("abc");
    const f = fd.get("file") as File;
    expect(f.name).toBe("hi.txt");
  });
  it("throws on missing file field", () => {
    expect(() => multipartRequestCodec.encode({ filename: "x" }, { fileField: "file", filenameFrom: "$.filename" })).toThrow(/missing file field/);
  });
});
