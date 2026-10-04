import { describe, expect, it, vi } from "vitest";
import { buildUploadParams, reportJUnit } from "./ci-report.mjs";

const env = {
  GITHUB_REPOSITORY: "shirish87/browserstack-client",
  GITHUB_RUN_ID: "123",
  GITHUB_RUN_NUMBER: "45",
  GITHUB_RUN_ATTEMPT: "2",
  GITHUB_REF_NAME: "main",
  GITHUB_SHA: "abcdef1234567890",
  GITHUB_SERVER_URL: "https://github.com",
  GITHUB_WORKFLOW: "CI",
};

describe("buildUploadParams", () => {
  it("derives project, build name, identifier, CI url and VCS metadata from the GitHub env", () => {
    const p = buildUploadParams(env, "linux");
    expect(p.projectName).toBe("shirish87/browserstack-client");
    expect(p.buildName).toBe("CI #45 (main)");
    expect(p.buildIdentifier).toBe("123-2");
    expect(p.ci).toBe("https://github.com/shirish87/browserstack-client/actions/runs/123");
    expect(p.tags).toBe("ci,linux,main");
    expect(p.versionControl).toMatchObject({ sha: "abcdef1234567890", shortSha: "abcdef1", branch: "main" });
  });

  it("falls back to local defaults outside GitHub Actions", () => {
    const p = buildUploadParams({}, "local");
    expect(p.projectName).toBe("browserstack-client");
    expect(p.buildName).toMatch(/^local /);
  });
});

describe("reportJUnit", () => {
  const read = async () => new Blob(["<testsuites/>"]);

  it("uploads the junit file and reports success", async () => {
    const uploadReport = vi.fn(async () => ({ status: "success" }));
    const res = await reportJUnit({ client: { uploadReport }, file: "junit.xml", env, label: "linux", read });
    expect(res.ok).toBe(true);
    expect(uploadReport).toHaveBeenCalledWith(expect.objectContaining({ fileName: "junit.xml", format: "junit", projectName: "shirish87/browserstack-client" }));
  });

  it("never throws when the upload fails", async () => {
    const uploadReport = vi.fn(async () => { throw new Error("BrowserStack unreachable"); });
    const res = await reportJUnit({ client: { uploadReport }, file: "junit.xml", env, label: "linux", read });
    expect(res).toEqual({ ok: false, error: "BrowserStack unreachable" });
  });

  it("never throws when the report file is missing", async () => {
    const uploadReport = vi.fn();
    const res = await reportJUnit({ client: { uploadReport }, file: "nope.xml", env, label: "linux", read: async () => { throw new Error("ENOENT"); } });
    expect(res.ok).toBe(false);
    expect(uploadReport).not.toHaveBeenCalled();
  });
});
