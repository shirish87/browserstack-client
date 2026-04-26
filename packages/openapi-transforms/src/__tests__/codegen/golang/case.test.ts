import { describe, expect, it } from "vitest";
import { toPascalCase, toGoPackageName } from "../../../codegen/golang/case";

describe("toPascalCase", () => {
  it("converts snake_case", () => {
    expect(toPascalCase("hashed_id")).toBe("HashedId");
  });
  it("converts kebab-case", () => {
    expect(toPascalCase("app-automate")).toBe("AppAutomate");
  });
  it("converts single word", () => {
    expect(toPascalCase("name")).toBe("Name");
  });
  it("handles already-pascal", () => {
    expect(toPascalCase("HashedId")).toBe("HashedId");
  });
  it("handles mixed separators", () => {
    expect(toPascalCase("hashed_id-value")).toBe("HashedIdValue");
  });
});

describe("toGoPackageName", () => {
  it("uses last segment for normal products", () => {
    expect(toGoPackageName("automate")).toBe("automate");
    expect(toGoPackageName("test-management")).toBe("management");
    expect(toGoPackageName("test-reporting")).toBe("reporting");
    expect(toGoPackageName("screenshots")).toBe("screenshots");
    expect(toGoPackageName("accessibility")).toBe("accessibility");
  });
  it("uses exception map for stdlib conflicts", () => {
    expect(toGoPackageName("local-testing")).toBe("localtesting");
    expect(toGoPackageName("local-testing-binary")).toBe("localbinary");
    expect(toGoPackageName("app-automate")).toBe("appautomate");
  });
});
