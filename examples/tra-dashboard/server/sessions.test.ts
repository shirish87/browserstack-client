import { describe, expect, it } from "vitest";
import { SessionStore } from "./sessions";

const creds = { username: "u", accessKey: "k" };

describe("SessionStore", () => {
  it("creates unguessable ids and returns the session", () => {
    const store = new SessionStore({ ttlMs: 1000 });
    const a = store.create(creds);
    const b = store.create(creds);
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThanOrEqual(43);
    expect(store.get(a)).toEqual(creds);
  });

  it("expires idle sessions but slides the window on use", () => {
    let t = 0;
    const store = new SessionStore({ ttlMs: 1000, now: () => t });
    const id = store.create(creds);
    t = 800;
    expect(store.get(id)).toEqual(creds); // touches
    t = 1700;
    expect(store.get(id)).toEqual(creds);
    t = 2800;
    expect(store.get(id)).toBeUndefined();
  });

  it("destroys sessions and ignores unknown ids", () => {
    const store = new SessionStore({ ttlMs: 1000 });
    const id = store.create(creds);
    store.destroy(id);
    expect(store.get(id)).toBeUndefined();
    expect(store.get(undefined)).toBeUndefined();
  });
});
