import { describe, expect, it } from "vitest";
import { sanitize } from "../scripts/sanitize.mjs";

describe("sanitize", () => {
  it("drops presigned query strings and auth tokens from URLs", () => {
    const out = sanitize({ u: "https://bucket.s3.amazonaws.com/a/b.txt?X-Amz-Signature=abc&X-Amz-Credential=AKIAXYZ" });
    expect(out.u).toBe("https://bucket.s3.amazonaws.com/a/b.txt");
    expect(sanitize("https://automate.browserstack.com/s/1?auth_token=secret")).toBe("https://automate.browserstack.com/s/1");
  });

  it("replaces 40-char ids consistently so references still line up", () => {
    const id = "0e24b3620c0aa594a3b7b4ae8e4db2d0355968ca";
    const out = sanitize({ details: { session_id: id }, url: `https://x/y/${id}/logs` });
    expect(out.details.session_id).not.toBe(id);
    expect(out.url).toContain(out.details.session_id);
    expect(out.details.session_id).toMatch(/^[0-9a-f]{40}$/);
  });

  it("anonymises people, numeric user ids and local paths", () => {
    process.env.SANITIZE_NAMES = "Jane Doe,jdoe";
    const out = sanitize({ user: "Jane Doe", note: "owner jdoe", user_id: 4242, at: "/tmp/runner-1/x/scratchpad/pw/tests/example.spec.js:11:36" });
    delete process.env.SANITIZE_NAMES;
    expect(JSON.stringify(out)).not.toMatch(/jane|doe|4242|runner-1/i);
    expect(out.user).toBe("Test User");
    expect(out.at).toBe("/work/tests/example.spec.js:11:36");
  });

  it("rewrites any absolute local path, including file:// URLs inside node_modules", () => {
    const out = sanitize("at async fn (file:///tmp/runner-1/x/proj/node_modules/expect-webdriverio/lib/a.js:7:24)");
    expect(out).toBe("at async fn (/work/node_modules/expect-webdriverio/lib/a.js:7:24)");
    expect(sanitize("/home/someone/project/lib/util.js:3:1")).toBe("/work/lib/util.js:3:1");
  });

  it("leaves unrelated values untouched", () => {
    expect(sanitize({ n: 5, ok: true, s: "hello", a: [1, "two"], z: null })).toEqual({ n: 5, ok: true, s: "hello", a: [1, "two"], z: null });
  });

  it("drops the share token from public build links, which grant unauthenticated access", () => {
    const out = sanitize({ public_url: "https://automate.browserstack.com/dashboard/v2/public-build/bUhRbUlUWjlWMm5s--86ec8f3c5886b87f1a7a4f1ed737cf9" });
    expect(out.public_url).toBe("https://automate.browserstack.com/dashboard/v2/public-build/TOKEN");
  });

  it("anonymises device serials, per-install app paths and sanitises plain-text logs", () => {
    const out = sanitize('"appium:udid":"35061FDH2004UK","deviceUDID":"35061FDH2004UK" /data/app/~~qOlIuPvfb0I2Qlr20LHnDQ==/org.x-s3V8DqHJEXpzp27eVCqPYg==/base.apk');
    expect(out).not.toMatch(/35061FDH2004UK|qOlIuPvfb0I2Qlr20LHnDQ|s3V8DqHJEXpzp27eVCqPYg/);
  });
});
