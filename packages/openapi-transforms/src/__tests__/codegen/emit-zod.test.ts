import { describe, expect, it } from "vitest";
import { emitZodModule } from "../../codegen/typescript/emit-zod";

const emit = (schemas: Record<string, unknown>) => emitZodModule({ schemas: schemas as never });

describe("emitZodModule", () => {
  it("emits a loose object with required, optional and nullable properties", () => {
    const out = emit({
      Thing: {
        type: "object",
        required: ["id", "label"],
        properties: {
          id: { type: "integer" },
          label: { type: "string", nullable: true },
          note: { type: "string" },
          flag: { type: "boolean", nullable: true },
        },
      },
    });
    expect(out).toContain("export const ThingSchema = z.looseObject({");
    expect(out).toContain("id: z.number(),");
    expect(out).toContain("label: z.string().nullable(),");
    expect(out).toContain("note: z.string().nullish(),");
    expect(out).toContain("flag: z.boolean().nullish(),");
    expect(out).toContain("export type Thing = z.infer<typeof ThingSchema>;");
  });

  it("uses the same camelCase keys the client produces and quotes keys that need it", () => {
    const out = emit({
      Node: {
        type: "object",
        properties: {
          display_name: { type: "string" },
          session_id: { type: "string" },
          TEST_FAILURE: { type: "array", items: { type: "string" } },
          "in progress": { type: "integer" },
          tcmTestRunIdentifier: { type: "string" },
        },
      },
    });
    expect(out).toContain("displayName: z.string().nullish(),");
    expect(out).toContain("sessionId: z.string().nullish(),");
    expect(out).toContain("TEST_FAILURE: z.array(z.string()).nullish(),");
    expect(out).toContain('"in progress": z.number().nullish(),');
    expect(out).toContain("tcmTestRunIdentifier: z.string().nullish(),");
  });

  it("references other schemas through getters so recursive and forward references work", () => {
    const out = emit({
      Node: {
        type: "object",
        properties: {
          children: { type: "array", items: { $ref: "#/components/schemas/Node" } },
          details: { $ref: "#/components/schemas/Details", nullable: true },
        },
      },
      Details: { type: "object", properties: { status: { type: "string" } } },
    });
    expect(out).toContain("get children() { return z.array(NodeSchema).nullish(); },");
    expect(out).toContain("get details() { return DetailsSchema.nullish(); },");
  });

  it("keeps enums open (string) and documents the known values", () => {
    const out = emit({ S: { type: "object", properties: { status: { type: "string", enum: ["passed", "failed"] } } } });
    expect(out).toContain("/** Known values: passed, failed */");
    expect(out).toContain("status: z.string().nullish(),");
    expect(out).not.toContain("z.enum(");
  });

  it("maps free-form objects and typed additionalProperties to records", () => {
    const out = emit({
      Bag: {
        type: "object",
        properties: {
          anything: { type: "object", additionalProperties: true },
          counts: { type: "object", additionalProperties: { type: "integer" } },
        },
      },
    });
    expect(out).toContain("anything: z.record(z.string(), z.unknown()).nullish(),");
    expect(out).toContain("counts: z.record(z.string(), z.number()).nullish(),");
  });

  it("intersects allOf members and orders aliases after their dependencies", () => {
    const out = emit({
      Child: { allOf: [{ $ref: "#/components/schemas/Base" }, { type: "object", properties: { extra: { type: "string" } } }] },
      Base: { type: "object", properties: { id: { type: "integer" } } },
    });
    expect(out.indexOf("export const BaseSchema")).toBeLessThan(out.indexOf("export const ChildSchema"));
    expect(out).toContain("BaseSchema.and(z.looseObject({");
  });

  it("emits arrays of $ref at the top level", () => {
    const out = emit({ Item: { type: "object", properties: { id: { type: "integer" } } }, Items: { type: "array", items: { $ref: "#/components/schemas/Item" } } });
    expect(out).toContain("export const ItemsSchema = z.array(ItemSchema);");
  });

  it("falls back to unknown for unsupported shapes rather than throwing", () => {
    const out = emit({ Odd: { type: "object", properties: { x: {} } } });
    expect(out).toContain("x: z.unknown().nullish(),");
  });

  it("starts with a generated-file banner and the zod import", () => {
    const out = emit({});
    expect(out).toMatch(/^\/\/ GENERATED/);
    expect(out).toContain('import { z } from "zod";');
  });

  it("emits only the closure of the requested root schemas", () => {
    const out = emitZodModule({
      schemas: {
        Root: { type: "object", properties: { child: { $ref: "#/components/schemas/Used" } } },
        Used: { type: "object", properties: { id: { type: "integer" } } },
        Unrelated: { type: "object", properties: { x: { type: "string" } } },
      },
      roots: ["Root"],
    });
    expect(out).toContain("export const RootSchema");
    expect(out).toContain("export const UsedSchema");
    expect(out).not.toContain("UnrelatedSchema");
  });
});
