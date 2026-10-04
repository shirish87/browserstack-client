import { describe, expect, it } from "vitest";
import { coverageOf, tallyBy, type TmCase } from "./tm";

const tc = (over: Partial<TmCase> = {}): TmCase => ({ identifier: "TC-1", title: "t", caseType: "Functional", automationStatus: "automated", priority: "High", status: "Active", owner: "a@b.c", createdAt: "2026-10-04T16:00:00.000Z", tags: [], url: undefined, ...over });

describe("tallyBy", () => {
  it("counts values, labels a missing one 'Not set', and ranks by count then name", () => {
    expect(tallyBy([tc({ priority: "High" }), tc({ priority: "High" }), tc({ priority: null }), tc({ priority: "Low" })], (c) => c.priority)).toEqual([
      { label: "High", count: 2 },
      { label: "Low", count: 1 },
      { label: "Not set", count: 1 },
    ]);
  });
});

describe("coverageOf", () => {
  it("reports how much of the library is automated", () => {
    const c = coverageOf([tc(), tc(), tc({ automationStatus: "not_automated" }), tc({ automationStatus: null })]);
    expect(c.total).toBe(4);
    expect(c.automated).toBe(2);
    expect(c.automatedRatio).toBe(0.5);
  });
  it("is empty-safe", () => {
    expect(coverageOf([])).toMatchObject({ total: 0, automated: 0, automatedRatio: null });
  });
});
