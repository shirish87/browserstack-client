import { describe, expect, it } from "vitest";
import { z } from "zod";
import { unmodelledKeys } from "./drift";

describe("unmodelledKeys", () => {
  const Inner = z.looseObject({ id: z.number() });
  const Schema = z.looseObject({
    name: z.string(),
    inner: Inner.nullish(),
    list: z.array(Inner),
    bag: z.record(z.string(), Inner),
    either: z.union([z.looseObject({ kind: z.literal("a"), a: z.string() }), z.looseObject({ kind: z.literal("b"), b: z.string() })]),
    merged: z.looseObject({ x: z.number() }).and(z.looseObject({ y: z.number() })),
    get self() {
      return Schema.nullish();
    },
  });

  it("reports nothing when every key is modelled", () => {
    expect(unmodelledKeys(Schema, { name: "n", inner: { id: 1 }, list: [{ id: 1 }], bag: { k: { id: 2 } }, either: { kind: "a", a: "s" }, merged: { x: 1, y: 2 } })).toEqual([]);
  });

  it("reports unknown keys with their path, through arrays, records, optionals and unions", () => {
    const found = unmodelledKeys(Schema, {
      name: "n",
      surprise: 1,
      inner: { id: 1, extraInner: true },
      list: [{ id: 1 }, { id: 2, extraInList: 1 }],
      bag: { k: { id: 2, extraInBag: 1 } },
      either: { kind: "b", b: "s", extraInUnion: 1 },
      merged: { x: 1, y: 2, z: 3 },
      self: { name: "child", deeper: 1 },
    });
    expect(found.sort()).toEqual(
      ["$.surprise", "$.inner.extraInner", "$.list[1].extraInList", "$.bag.k.extraInBag", "$.either.extraInUnion", "$.merged.z", "$.self.deeper"].sort(),
    );
  });

  it("ignores null and absent values", () => {
    expect(unmodelledKeys(Schema, { name: "n", inner: null, list: [], bag: {}, either: { kind: "a", a: "s" }, merged: { x: 1, y: 1 } })).toEqual([]);
  });

  it("finds an unknown key nested under a property that only one side of an intersection models", () => {
    const Left = z.looseObject({ id: z.number() });
    const Right = z.looseObject({ details: z.looseObject({ name: z.string() }) });
    const Both = Left.and(Right);
    // `details` is unknown to Left but modelled by Right, so only `details.surprise` is truly unmodelled.
    expect(unmodelledKeys(Both, { id: 1, details: { name: "n", surprise: 1 } })).toEqual(["$.details.surprise"]);
    expect(unmodelledKeys(Both, { id: 1, details: { name: "n" }, topLevel: 1 })).toEqual(["$.topLevel"]);
  });
});
