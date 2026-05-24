import { describe, expect, it } from "vitest";
import { BrowserStackError, HttpError, env } from "@dot-slash/browserstack-core";
import { makeClient, makeErrorResponse } from "./setup.ts";
import { TestReportingClient } from "../index.ts";

// Fixture data (wire-format snake_case — live API captures)
const PROJECTS_WIRE = {
  projects: [
    { id: 25033, name: "BrowserStack Samples", group_id: 2259240, created_by: 23803, created_at: "2024-03-14T09:26:37.000+00:00", updated_at: "2026-04-27T21:17:10.000+00:00", observability_url: "https://observability.browserstack.com/projects/BrowserStack+Samples/builds" },
    { id: 25242, name: "cypress-examples-recipes", group_id: 2259240, created_by: 23803, created_at: "2024-03-16T06:19:20.000+00:00", updated_at: "2026-04-27T21:16:57.000+00:00", observability_url: "https://observability.browserstack.com/projects/cypress-examples-recipes/builds" },
  ],
  pagination: { has_next: false, next_page: null },
};

const PROJECT_BUILDS_WIRE = {
  id: 25033,
  name: "BrowserStack Samples",
  builds: [],
  pagination: { has_next: false, next_page: null },
};

const BUILD_DETAIL_WIRE = {
  id: 101,
  name: "main-build",
  status: "passed",
  created_at: "2026-04-27T10:00:00.000Z",
  updated_at: "2026-04-27T10:30:00.000Z",
  build_hid: "bld_abc123",
  framework: "pytest",
  duration: 1800,
  project_id: 25033,
};

const START_BUILD_WIRE = { success: true, build_hashed_id: "bld_newbuild123" };

const FINISH_BUILD_WIRE = { success: true, message: "Build finished successfully." };

const START_TEST_RUN_WIRE = { success: true, test_run_id: "tr-001" };

describe("TestReportingClient", () => {
  describe("Credentials", () => {
    it("accepts valid username and accessKey", () => {
      expect(() => new TestReportingClient({ username: "user", accessKey: "key" })).not.toThrow();
    });

    it("makeClient helper creates a client with mock fetch", () => {
      const client = makeClient();
      expect(client).toBeInstanceOf(TestReportingClient);
    });

    it("throws BrowserStackError when no credentials available", () => {
      const savedUser = env.BROWSERSTACK_USERNAME;
      const savedKey = env.BROWSERSTACK_ACCESS_KEY;
      const savedKeyAlt = env.BROWSERSTACK_KEY;
      delete env.BROWSERSTACK_USERNAME;
      delete env.BROWSERSTACK_ACCESS_KEY;
      delete env.BROWSERSTACK_KEY;
      try {
        expect(() => new TestReportingClient({ username: "", accessKey: "" })).toThrow(BrowserStackError);
      } finally {
        env.BROWSERSTACK_USERNAME = savedUser;
        env.BROWSERSTACK_ACCESS_KEY = savedKey;
        env.BROWSERSTACK_KEY = savedKeyAlt;
      }
    });
  });

  describe("getProjects", () => {
    it("returns projects array with id, name, and pagination", async () => {
      const client = makeClient(PROJECTS_WIRE);
      const data = await client.getProjects();
      const projects = (data as { projects?: Array<{ id: number; name: string }> }).projects ?? [];
      expect(Array.isArray(projects)).toBe(true);
      expect(projects).toHaveLength(2);
      expect(projects[0]!.id).toBe(25033);
      expect(projects[0]!.name).toBe("BrowserStack Samples");
      expect(projects[1]!.id).toBe(25242);
      const pagination = (data as { pagination?: { hasNext: boolean; nextPage: null } }).pagination;
      expect(pagination).toBeDefined();
      expect(pagination!.hasNext).toBe(false);
      expect(pagination!.nextPage).toBeNull();
    });

    it("throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getProjects()).rejects.toThrow(HttpError);
    });
  });

  describe("getProjectBuilds", () => {
    it("returns project with builds array (even if empty) and pagination", async () => {
      const client = makeClient(PROJECT_BUILDS_WIRE);
      const data = await client.getProjectBuilds(25033);
      const builds = (data as { builds?: unknown[] }).builds ?? [];
      expect(Array.isArray(builds)).toBe(true);
      expect(builds).toHaveLength(0);
      expect((data as { id?: number }).id).toBe(25033);
      expect((data as { name?: string }).name).toBe("BrowserStack Samples");
      const pagination = (data as { pagination?: { hasNext: boolean } }).pagination;
      expect(pagination).toBeDefined();
      expect(pagination!.hasNext).toBe(false);
    });

    it("throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Project not found"));
      await expect(client.getProjectBuilds(99999)).rejects.toThrow(HttpError);
    });
  });

  describe("getBuild", () => {
    it("returns build detail with camelCase fields", async () => {
      const client = makeClient(BUILD_DETAIL_WIRE);
      const data = await client.getBuild("bld_abc123");
      expect(data).toBeDefined();
      expect((data as { name?: string }).name).toBe("main-build");
      expect((data as { status?: string }).status).toBe("passed");
      expect((data as { buildHid?: string }).buildHid).toBe("bld_abc123");
      expect((data as { projectId?: number }).projectId).toBe(25033);
      expect((data as { duration?: number }).duration).toBe(1800);
    });

    it("throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Build not found"));
      await expect(client.getBuild("nonexistent")).rejects.toThrow(HttpError);
    });
  });

  describe("startBuild", () => {
    it("returns success true and buildHashedId", async () => {
      const client = makeClient(START_BUILD_WIRE);
      const data = await client.startBuild({
        name: "my-build",
        projectName: "sdk-integration-tests",
        startedAt: "2026-04-27T10:00:00.000Z",
        framework: { name: "vitest", version: "1.0.0" },
      });
      expect(data).toBeDefined();
      expect((data as { success?: boolean }).success).toBe(true);
      expect((data as { buildHashedId?: string }).buildHashedId).toBe("bld_newbuild123");
    });

    it("throws HttpError on 422", async () => {
      const client = makeClient(makeErrorResponse(422, "Unprocessable Entity"));
      await expect(
        client.startBuild({ name: "", projectName: "", startedAt: "", framework: { name: "vitest", version: "1.0.0" } })
      ).rejects.toThrow(HttpError);
    });
  });

  describe("finishBuild", () => {
    it("returns success true and message", async () => {
      const client = makeClient(FINISH_BUILD_WIRE);
      const data = await client.finishBuild("bld_newbuild123", {
        finishedAt: "2026-04-27T10:30:00.000Z",
      });
      expect(data).toBeDefined();
      expect((data as { success?: boolean }).success).toBe(true);
      expect((data as { message?: string }).message).toBe("Build finished successfully.");
    });

    it("throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(
        client.finishBuild("bld_newbuild123", { finishedAt: "2026-04-27T10:30:00.000Z" })
      ).rejects.toThrow(HttpError);
    });
  });

  describe("startTestRun", () => {
    it("returns success true and test_run_id", async () => {
      const client = makeClient(START_TEST_RUN_WIRE);
      const data = await client.startTestRun("bld_newbuild123", {
        name: "sdk test run",
        startedAt: "2026-04-27T10:00:00.000Z",
        fileName: "sdk.test.ts",
        scopes: ["integration"],
      });
      expect(data).toBeDefined();
      expect((data as { success?: boolean }).success).toBe(true);
      expect((data as { testRunId?: string }).testRunId).toBe("tr-001");
    });
  });

  describe("uploadReport", () => {
    function makeCapturingClient() {
      let capturedUrl = "";
      let capturedBody: FormData | undefined;
      const fetchFn = async (url: string | URL | Request, init?: RequestInit) => {
        capturedUrl = url.toString();
        capturedBody = init?.body as FormData;
        return new Response(JSON.stringify({ status: "success", message: "ok" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      };
      const client = new TestReportingClient({ username: "u", accessKey: "k", fetchFn });
      return { client, getCaptured: () => ({ url: capturedUrl, body: capturedBody }) };
    }

    it("sends to upload-automation.browserstack.com, not api-automation", async () => {
      const { client, getCaptured } = makeCapturingClient();
      await client.uploadReport({
        file: new Blob(["<xml/>"], { type: "text/xml" }),
        fileName: "report.xml",
        projectName: "my-project",
        buildName: "build-1",
      });
      expect(getCaptured().url).toMatch(/^https:\/\/upload-automation\.browserstack\.com/);
      expect(getCaptured().url).not.toMatch(/api-automation/);
    });

    it("uses 'data' as the file form field name, not 'file'", async () => {
      const { client, getCaptured } = makeCapturingClient();
      await client.uploadReport({
        file: new Blob(["<xml/>"], { type: "text/xml" }),
        fileName: "report.xml",
        projectName: "my-project",
        buildName: "build-1",
      });
      const fd = getCaptured().body!;
      expect(fd.get("data")).toBeInstanceOf(Blob);
      expect(fd.get("file")).toBeNull();
    });

    it("sends projectName and buildName as camelCase form fields", async () => {
      const { client, getCaptured } = makeCapturingClient();
      await client.uploadReport({
        file: new Blob(["<xml/>"], { type: "text/xml" }),
        fileName: "report.xml",
        projectName: "my-project",
        buildName: "build-1",
        format: "allure",
        tags: "regression",
      });
      const fd = getCaptured().body!;
      expect(fd.get("projectName")).toBe("my-project");
      expect(fd.get("buildName")).toBe("build-1");
      expect(fd.get("format")).toBe("allure");
      expect(fd.get("tags")).toBe("regression");
      // snake_case variants must NOT appear
      expect(fd.get("project_name")).toBeNull();
      expect(fd.get("build_name")).toBeNull();
    });
  });
});
