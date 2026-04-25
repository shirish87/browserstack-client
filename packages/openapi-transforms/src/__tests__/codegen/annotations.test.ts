import { describe, expect, it } from "vitest";
import { readAnnotations } from "../../codegen/annotations";
import { CodecRegistry } from "../../registry";
import { registerAllBuiltins } from "../../codecs/index";

const registry = (() => { const r = new CodecRegistry(); registerAllBuiltins(r); return r; })();

describe("readAnnotations", () => {
  it("returns defaults when no annotations", () => {
    const a = readAnnotations({}, registry, "opId");
    expect(a.responseCodec).toBe("json");
    expect(a.responseCodecConfig).toEqual({});
    expect(a.requestCodec).toBe("json");
    expect(a.custom).toEqual({ response: false, request: false });
  });
  it("parses x-response-transform", () => {
    const a = readAnnotations({
      "x-response-transform": { codec: "json-unwrap", config: { path: "$.project" } },
    }, registry, "opId");
    expect(a.responseCodec).toBe("json-unwrap");
    expect(a.responseCodecConfig).toEqual({ path: "$.project" });
  });
  it("throws on unknown codec", () => {
    expect(() => readAnnotations({
      "x-response-transform": { codec: "no-such-codec" },
    }, registry, "opId")).toThrow(/unknown response codec/);
  });
  it("throws on invalid config per schema", () => {
    expect(() => readAnnotations({
      "x-response-transform": { codec: "json-unwrap", config: { path: 123 } },
    }, registry, "opId")).toThrow(/config\.path/);
  });
  it("x-response-custom skips method emission", () => {
    const a = readAnnotations({ "x-response-custom": true }, registry, "opId");
    expect(a.custom.response).toBe(true);
  });
  it("throws with operationId + config path when annotation invalid", () => {
    expect(() => readAnnotations(
      { "x-response-transform": { codec: "json-unwrap", config: { path: 123 } } },
      registry, "getBad"
    )).toThrow(/getBad.*x-response-transform.config.*path/);
  });
});
