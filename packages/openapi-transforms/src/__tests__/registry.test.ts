import { describe, expect, it } from "vitest";
import { CodecRegistry, type ResponseCodec, type RequestCodec } from "../registry.js";

const stubSchema = { "~standard": { version: 1, vendor: "stub", validate: (v: unknown) => ({ value: v }) } } as any;

const jsonResp: ResponseCodec<{}, unknown> = {
  name: "json",
  contentTypes: ["application/json"],
  configSchema: stubSchema,
  async decode(response) { return response.json(); },
};

const jsonReq: RequestCodec<unknown, {}> = {
  name: "json",
  contentType: "application/json",
  configSchema: stubSchema,
  encode(input) { return { body: JSON.stringify(input), headers: { "content-type": "application/json" } }; },
};

describe("CodecRegistry", () => {
  it("registers and resolves response codecs", () => {
    const r = new CodecRegistry();
    r.registerResponse(jsonResp);
    expect(r.resolveResponse("json")).toBe(jsonResp);
  });
  it("registers and resolves request codecs independently", () => {
    const r = new CodecRegistry();
    r.registerRequest(jsonReq);
    expect(r.resolveRequest("json")).toBe(jsonReq);
  });
  it("throws on duplicate registration", () => {
    const r = new CodecRegistry();
    r.registerResponse(jsonResp);
    expect(() => r.registerResponse(jsonResp)).toThrow(/already registered/);
  });
  it("throws on unknown name at resolve", () => {
    const r = new CodecRegistry();
    expect(() => r.resolveResponse("missing")).toThrow(/unknown response codec/i);
  });
});
