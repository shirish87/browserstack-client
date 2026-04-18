import { describe, expect, it } from "vitest";
import { emitErrorAlias } from "../../codegen/emit-error-type.js";

describe("emitErrorAlias", () => {
  it("builds union of error bodies from response schemas", () => {
    const src = emitErrorAlias("getAutomateProject", [400, 401, 404]);
    expect(src).toBe(
      `export type GetAutomateProjectError = HttpError<\n` +
      `  | operations["getAutomateProject"]["responses"][400]["content"]["application/json"]\n` +
      `  | operations["getAutomateProject"]["responses"][401]["content"]["application/json"]\n` +
      `  | operations["getAutomateProject"]["responses"][404]["content"]["application/json"]\n` +
      `>;`
    );
  });
  it("omits HttpError<never> when no error responses", () => {
    const src = emitErrorAlias("getX", []);
    expect(src).toBe("export type GetXError = HttpError<unknown>;");
  });
});
