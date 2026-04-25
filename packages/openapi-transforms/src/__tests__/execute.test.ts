import { describe, expect, it, vi } from "vitest";
import { executeOperation } from "../execute";
import { CodecRegistry } from "../registry";
import { registerAllBuiltins } from "../codecs/index";
import { NetworkError, HttpError, DecodeError, TransformError, ClientError } from "../errors";

function makeRegistry() {
  const r = new CodecRegistry();
  registerAllBuiltins(r);
  return r;
}

describe("executeOperation happy path", () => {
  it("GET + json codec returns parsed body", async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response('{"ok":true}', { status: 200, headers: { "content-type": "application/json" } }));
    const r = await executeOperation({
      operationId: "op", method: "GET", url: "http://x/a",
      registry: makeRegistry(),
      responseCodec: "json", responseCodecConfig: {},
    }, fetchFn);
    expect(r).toEqual({ ok: true });
    expect(fetchFn).toHaveBeenCalledOnce();
  });
  it("POST with json request codec sends serialized body + content-type", async () => {
    let captured: RequestInit | undefined;
    const fetchFn = vi.fn<typeof fetch>(async (_url, init) => {
      captured = init;
      return new Response('{}', { status: 200, headers: { "content-type": "application/json" } });
    });
    await executeOperation({
      operationId: "op", method: "POST", url: "http://x/a",
      registry: makeRegistry(),
      requestCodec: "json", requestCodecConfig: {}, requestInput: { a: 1 },
      responseCodec: "json", responseCodecConfig: {},
    }, fetchFn);
    expect(captured?.method).toBe("POST");
    expect(captured?.body).toBe('{"a":1}');
    const headers = captured?.headers as Record<string, string>;
    expect(headers["content-type"]).toBe("application/json");
  });
});

describe("executeOperation error paths", () => {
  it("wraps fetch reject as NetworkError", async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => { throw new Error("ECONNRESET"); });
    await expect(executeOperation({
      operationId: "op", method: "GET", url: "http://x",
      registry: makeRegistry(), responseCodec: "json", responseCodecConfig: {},
    }, fetchFn)).rejects.toBeInstanceOf(NetworkError);
  });
  it("wraps non-2xx as HttpError with status/headers/body", async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response('{"error":"bad"}', {
      status: 400, statusText: "Bad Request",
      headers: { "content-type": "application/json", "x-request-id": "rid-1" },
    }));
    try {
      await executeOperation({
        operationId: "op", method: "GET", url: "http://x",
        registry: makeRegistry(), responseCodec: "json", responseCodecConfig: {},
      }, fetchFn);
      throw new Error("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(HttpError);
      const h = e as HttpError;
      expect(h.status).toBe(400);
      expect(h.requestId).toBe("rid-1");
      expect(h.body.parsed).toEqual({ error: "bad" });
      expect(h.message).toBe("bad");
    }
  });
  it("wraps codec decode failure as DecodeError", async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response("not{json", { status: 200, headers: { "content-type": "application/json" } }));
    await expect(executeOperation({
      operationId: "op", method: "GET", url: "http://x",
      registry: makeRegistry(), responseCodec: "json", responseCodecConfig: {},
    }, fetchFn)).rejects.toBeInstanceOf(DecodeError);
  });
  it("wraps codec transform failure as TransformError", async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response('{"other":1}', { status: 200 }));
    await expect(executeOperation({
      operationId: "op", method: "GET", url: "http://x",
      registry: makeRegistry(),
      responseCodec: "json-unwrap", responseCodecConfig: { path: "$.missing" },
    }, fetchFn)).rejects.toBeInstanceOf(TransformError);
  });
  it("wraps encode failure as ClientError", async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => new Response('{}', { status: 200 }));
    await expect(executeOperation({
      operationId: "op", method: "POST", url: "http://x",
      registry: makeRegistry(),
      requestCodec: "multipart", requestCodecConfig: { fileField: "file", filenameFrom: "$.filename" },
      requestInput: { /* no file */ },
      responseCodec: "json", responseCodecConfig: {},
    }, fetchFn)).rejects.toBeInstanceOf(ClientError);
  });
});
