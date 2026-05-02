import { describe, expect, it } from "vitest";
import { BrowserStackError, HttpError, env } from "@dot-slash/browserstack-core";
import { makeClient, makeErrorResponse } from "./setup.ts";
import { AppAutomateClient } from "../index.ts";

// Fixture data (wire-format snake_case)
const PLAN = { automate_plan: "Free", terminal_access: "Public", parallel_sessions_running: 0, team_parallel_sessions_max_allowed: 5, parallel_sessions_max_allowed: 5, queued_sessions: 0, queued_sessions_max_allowed: 5 };

const DEVICES = [{ os: "ios", os_version: "26", device: "iPhone 15 Pro Max", real_mobile: true, device_tier: "Tier 4", device_limit: 5 }, { os: "android", os_version: "14.0", device: "Samsung Galaxy S24", real_mobile: true, device_tier: "Tier 1", device_limit: 5 }];

const APPS = [{ app_name: "example.apk", app_version: "1.0", app_url: "bs://abc123app", app_id: "abc123app", uploaded_at: "2026-04-27 21:16:33 UTC", bypass_secure_screen_restriction: "false" }, { app_name: "sample.apk", app_version: "2.0", app_url: "bs://def456app", app_id: "def456app", uploaded_at: "2026-04-26 10:00:00 UTC", bypass_secure_screen_restriction: "false" }];

const UPLOAD_APP = { app_url: "bs://abc123app", app_id: "abc123app", uploaded_at: "2026-04-27 21:16:33 UTC" };

const DELETE_APP = { success: true, app_id: "abc123app" };

// builds wire format: json-unwrap $[*].automation_build
const BUILDS_WIRE = [{ automation_build: { name: "mock-build", hashed_id: "abc123build", duration: 120, status: "failed", build_tag: "mock-tag", public_url: "https://app-automate.browserstack.com/dashboard/v2/public-build/mock" } }, { automation_build: { name: "mock-build-2", hashed_id: "def456build", duration: null, status: "running", build_tag: null, public_url: null } }];

// build wire format: json-unwrap $.build (the generated client uses responseCodecConfig: {"path":"$.build"})
const BUILD_WIRE = { build: { automation_build: { name: "mock-build", duration: 120, status: "failed", hashed_id: "abc123build", build_tag: "mock-tag" }, sessions: [{ automation_session: { name: "mock-session", duration: 90, os: "android", os_version: "14.0", device: "Samsung Galaxy S24", status: "failed", hashed_id: "abc123session", reason: "Session failed", build_name: "mock-build", project_name: "mock-project", build_hashed_id: "abc123build" } }] } };

const UPDATE_BUILD = { automation_build: { name: "updated-build", duration: 120, status: "failed", hashed_id: "abc123build", build_tag: "new-tag" } };

const DELETE_BUILD = { status: "ok", message: "Build with id abc123build has been queued for deletion." };

// session wire format: json-unwrap $.automation_session
const SESSION_WIRE = { automation_session: { name: "mock-session", duration: 90, os: "android", os_version: "14.0", device: "Samsung Galaxy S24", status: "failed", hashed_id: "abc123session", reason: "Session failed", build_name: "mock-build", project_name: "mock-project", build_hashed_id: "abc123build", logs: "https://app-automate.browserstack.com/builds/abc123build/sessions/abc123session/logs", browserstack_status: "timeout", created_at: "2026-04-20T19:18:45.000Z", browser_url: "https://app-automate.browserstack.com/builds/abc123build/sessions/abc123session", public_url: "https://app-automate.browserstack.com/builds/abc123build/sessions/abc123session?auth_token=mock" } };

const UPDATE_SESSION_WIRE = { automation_session: { name: "updated-session", duration: 90, os: "android", os_version: "14.0", device: "Samsung Galaxy S24", status: "passed", hashed_id: "abc123session", reason: "Session passed", build_name: "mock-build", project_name: "mock-project", build_hashed_id: "abc123build" } };

const DELETE_SESSION = { status: "ok", message: "Session with id abc123session has been queued for deletion." };

const PROJECTS = [{ id: 12345678, name: "mock-project", group_id: 2259240, user_id: 23803, created_at: "2026-04-19T05:16:49.000Z", updated_at: "2026-04-26T15:58:35.000Z", sub_group_id: 0 }];

const PROJECT_WIRE = { project: { id: 12345678, name: "mock-project", group_id: 2259240, user_id: 23803, created_at: "2026-04-19T05:16:49.000Z", updated_at: "2026-04-26T15:58:35.000Z", sub_group_id: 0, builds: [] } };

const BADGE_KEY = "c1p0WFAvMkYvRDE5RVVzL1huNGNoMWVwWU0xazVSUTI2Vk5MTVdXNWVsZz0tLTRzS1oreitibWdCYm5lcmZOMTIxaXc9PQ==";

const MEDIA_FILES = [{ media_name: "test.txt", media_url: "media://abc123media", media_id: "abc123media", uploaded_at: "2026-04-24 19:04:52 UTC" }, { media_name: "sample.txt", media_url: "media://def456media", media_id: "def456media", uploaded_at: "2026-04-24 18:05:58 UTC" }];

const UPLOAD_MEDIA = { media_url: "media://abc123media", media_id: "abc123media" };

const DELETE_MEDIA = { success: true, message: "Media with id abc123media has been deleted." };

const TERMINAL_LOGS_RESPONSE = "Terminal logs uploaded successfully.";

const APPIUM_LOGS = "2026-04-20 19:18:46:0 [Appium] Welcome to Appium v1.22.3\n2026-04-20 19:18:46:0 [Appium] Non-default server args: {}\n";

const DEVICE_LOGS = "04-20 19:18:46.000  1234  1234 I ActivityManager: START u0 {cmp=com.example/.MainActivity}\n";

const SESSION_LOGS_TEXT = "2026-04-20 19:18:46:0 REQUEST [2026-04-20 19:18:46:0] POST /session/abc123session/url {\"url\":\"https://www.example.com\"}\n2026-04-20 19:18:46:0 RESPONSE {\"state\":\"success\"}\n";

// Network logs are JSON (HAR format)
const NETWORK_LOGS = { log: { version: "1.2", creator: { name: "BrowserStack", version: "1.0" }, entries: [] } };

describe("AppAutomateClient", () => {
  describe("Credentials", () => {
    it("accepts valid username and accessKey", () => {
      expect(() => new AppAutomateClient({ username: "user", accessKey: "key" })).not.toThrow();
    });

    it("makeClient helper creates a client with mock fetch", () => {
      const client = makeClient();
      expect(client).toBeInstanceOf(AppAutomateClient);
    });

    it("throws BrowserStackError when no credentials available", () => {
      const savedUser = env.BROWSERSTACK_USERNAME;
      const savedKey = env.BROWSERSTACK_ACCESS_KEY;
      const savedKeyAlt = env.BROWSERSTACK_KEY;
      delete env.BROWSERSTACK_USERNAME;
      delete env.BROWSERSTACK_ACCESS_KEY;
      delete env.BROWSERSTACK_KEY;
      try {
        expect(() => new AppAutomateClient({ username: "", accessKey: "" })).toThrow(BrowserStackError);
      } finally {
        env.BROWSERSTACK_USERNAME = savedUser;
        env.BROWSERSTACK_ACCESS_KEY = savedKey;
        env.BROWSERSTACK_KEY = savedKeyAlt;
      }
    });
  });

  describe("getPlan", () => {
    it("returns camelCase plan data", async () => {
      const client = makeClient(PLAN);
      const data = await client.getPlan();
      expect(data).toBeDefined();
      expect(data.automatePlan).toBe("Free");
      expect(data.parallelSessionsMaxAllowed).toBe(5);
      expect(data.parallelSessionsRunning).toBe(0);
    });

    it("throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getPlan()).rejects.toThrow(HttpError);
    });
  });

  describe("getDevices", () => {
    it("returns array of device objects", async () => {
      const client = makeClient(DEVICES);
      const data = await client.getDevices();
      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(2);
      expect(data[0].os).toBe("ios");
      expect(data[0].device).toBe("iPhone 15 Pro Max");
      expect(data[0].realMobile).toBe(true);
      expect(data[1].os).toBe("android");
    });

    it("throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getDevices()).rejects.toThrow(HttpError);
    });
  });

  describe("Apps", () => {
    it("getApps returns array of apps with camelCase fields", async () => {
      const client = makeClient(APPS);
      const data = await client.getApps();
      expect(data).toBeInstanceOf(Array);
      if (!Array.isArray(data)) throw new Error("Expected array");
      expect(data).toHaveLength(2);
      expect(data[0].appId).toBe("abc123app");
      expect(data[0].appUrl).toMatch(/^bs:\/\//);
      expect(data[1].appId).toBe("def456app");
      expect(data[1].appUrl).toMatch(/^bs:\/\//);
    });

    it("uploadApp returns appUrl starting with bs://", async () => {
      const client = makeClient(UPLOAD_APP);
      const data = await client.uploadApp({
        file: new Blob(["fake apk content"], { type: "application/octet-stream" }),
        fileName: "example.apk",
      });
      expect(data).toBeDefined();
      expect(data.appUrl).toMatch(/^bs:\/\//);
      expect(data.appId).toBe("abc123app");
    });

    it("deleteApp returns success", async () => {
      const client = makeClient(DELETE_APP);
      const data = await client.deleteApp("abc123app");
      expect(data).toBeDefined();
      expect(data.success).toBe(true);
    });

    it("deleteApp throws HttpError on 404 for missing app", async () => {
      const client = makeClient(makeErrorResponse(404, "App not found"));
      await expect(client.deleteApp("missing")).rejects.toThrow(HttpError);
    });

    it("uploadApp throws HttpError on 422 with bad input", async () => {
      const client = makeClient(makeErrorResponse(422, "Unprocessable Entity"));
      await expect(client.uploadApp({ file: new Blob([""]), fileName: "" })).rejects.toThrow(HttpError);
    });

    it("getApps throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getApps()).rejects.toThrow(HttpError);
    });
  });

  describe("Builds", () => {
    it("getBuilds returns unwrapped array of builds", async () => {
      const client = makeClient(BUILDS_WIRE);
      const data = await client.getBuilds();
      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe("mock-build");
      expect(data[0].hashedId).toBe("abc123build");
      expect(data[0].status).toBe("failed");
      expect(data[0].buildTag).toBe("mock-tag");
      expect(data[1].name).toBe("mock-build-2");
      expect(data[1].status).toBe("running");
    });

    it("getBuild returns build with sessions", async () => {
      const client = makeClient(BUILD_WIRE);
      const data = await client.getBuild("abc123build");
      expect(data).toBeDefined();
      expect(data.automationBuild).toBeDefined();
      const build = (data as { automationBuild: { name: string; hashedId: string; status: string }; sessions: unknown[] }).automationBuild;
      expect(build.name).toBe("mock-build");
      expect(build.hashedId).toBe("abc123build");
      expect(build.status).toBe("failed");
    });

    it("updateBuild returns updated build data", async () => {
      const client = makeClient(UPDATE_BUILD);
      const data = await client.updateBuild("abc123build", { buildTag: "new-tag" });
      expect(data).toBeDefined();
      expect(data).toHaveProperty("automationBuild");
      const build = (data as { automationBuild: { name: string } }).automationBuild;
      expect(build.name).toBe("updated-build");
    });

    it("deleteBuild returns status ok", async () => {
      const client = makeClient(DELETE_BUILD);
      const data = await client.deleteBuild("abc123build");
      expect(data).toBeDefined();
      expect(data.status).toBe("ok");
    });

    it("getBuilds throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getBuilds()).rejects.toThrow(HttpError);
    });

    it("getBuild throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Build not found"));
      await expect(client.getBuild("notexist")).rejects.toThrow(HttpError);
    });
  });

  describe("Sessions", () => {
    it("getSession returns unwrapped session data", async () => {
      const client = makeClient(SESSION_WIRE);
      const data = await client.getSession("abc123session");
      expect(data).toBeDefined();
      expect(data.hashedId).toBe("abc123session");
      expect(data.status).toBe("failed");
      expect(data.browserstackStatus).toBe("timeout");
      expect(data.publicUrl).toBeDefined();
    });

    it("updateSession returns updated session data", async () => {
      const client = makeClient(UPDATE_SESSION_WIRE);
      const data = await client.updateSession("abc123session", { status: "passed", reason: "Session passed" });
      expect(data).toBeDefined();
      expect(data.hashedId).toBe("abc123session");
      expect(data.status).toBe("passed");
    });

    it("deleteSession returns status ok", async () => {
      const client = makeClient(DELETE_SESSION);
      const data = await client.deleteSession("abc123session");
      expect(data).toBeDefined();
      expect(data.status).toBe("ok");
    });

    it("getSession throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Session not found"));
      await expect(client.getSession("notexist")).rejects.toThrow(HttpError);
    });

    it("getSession throws HttpError on 401", async () => {
      await expect(makeClient(makeErrorResponse(401, "HTTP Basic: Access denied.")).getSession("abc"))
        .rejects.toThrow(HttpError);
    });
  });

  describe("Logs", () => {
    it("getAppiumLogs returns text string", async () => {
      const client = makeClient(APPIUM_LOGS);
      const data = await client.getAppiumLogs("abc123build", "abc123session");
      expect(typeof data).toBe("string");
      expect(data).toContain("Appium");
    });

    it("getDeviceLogs returns text string", async () => {
      const client = makeClient(DEVICE_LOGS);
      const data = await client.getDeviceLogs("abc123build", "abc123session");
      expect(typeof data).toBe("string");
      expect(data).toContain("ActivityManager");
    });

    it("getSessionLogs returns text string", async () => {
      const client = makeClient(SESSION_LOGS_TEXT);
      const data = await client.getSessionLogs("abc123build", "abc123session");
      expect(typeof data).toBe("string");
      expect(data).toContain("REQUEST");
      expect(data).toContain("RESPONSE");
    });

    it("getNetworkLogs returns JSON object", async () => {
      const client = makeClient(NETWORK_LOGS);
      const data = await client.getNetworkLogs("abc123build", "abc123session");
      expect(data).toBeDefined();
      expect(data).toHaveProperty("log");
    });

    it("getAppiumLogs throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Session not found"));
      await expect(client.getAppiumLogs("notexist", "notexist")).rejects.toThrow(HttpError);
    });
  });

  describe("Terminal log uploads", () => {
    it("uploadSessionTerminalLogs returns text response", async () => {
      const client = makeClient(TERMINAL_LOGS_RESPONSE);
      const data = await client.uploadSessionTerminalLogs("abc123session", {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        fileName: "terminal.txt",
      });
      expect(typeof data).toBe("string");
      expect(data.length).toBeGreaterThan(0);
    });

    it("uploadBuildTerminalLogs returns text response", async () => {
      const client = makeClient(TERMINAL_LOGS_RESPONSE);
      const data = await client.uploadBuildTerminalLogs("abc123build", {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        fileName: "terminal.txt",
      });
      expect(typeof data).toBe("string");
      expect(data.length).toBeGreaterThan(0);
    });

    it("uploadSessionTerminalLogs throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(
        client.uploadSessionTerminalLogs("abc123session", {
          file: new Blob(["Logs"], { type: "text/plain" }),
          fileName: "terminal.txt",
        })
      ).rejects.toThrow(HttpError);
    });
  });

  describe("Media files", () => {
    it("getMediaFiles returns array of media files", async () => {
      const client = makeClient(MEDIA_FILES);
      const data = await client.getMediaFiles();
      expect(data).toBeInstanceOf(Array);
      if (!Array.isArray(data)) throw new Error("Expected array");
      expect(data).toHaveLength(2);
      expect(data[0].mediaId).toBe("abc123media");
      expect(data[0].mediaUrl).toBe("media://abc123media");
      expect(data[0].mediaName).toBe("test.txt");
    });

    it("uploadMediaFile returns media url and id", async () => {
      const client = makeClient(UPLOAD_MEDIA);
      const data = await client.uploadMediaFile({
        file: new Blob(["test"], { type: "text/plain" }),
        fileName: "test.txt",
      });
      expect(data).toBeDefined();
      expect(data.mediaUrl).toBe("media://abc123media");
      expect(data.mediaId).toBe("abc123media");
    });

    it("deleteMediaFile returns success true", async () => {
      const client = makeClient(DELETE_MEDIA);
      const data = await client.deleteMediaFile("abc123media") as { success: boolean; message: string };
      expect(data).toBeDefined();
      expect(data.success).toBe(true);
      expect(data.message).toContain("abc123media");
    });

    it("getMediaFiles throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getMediaFiles()).rejects.toThrow(HttpError);
    });

    it("deleteMediaFile throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Media not found"));
      await expect(client.deleteMediaFile("notexist")).rejects.toThrow(HttpError);
    });
  });

  describe("Projects", () => {
    it("getProjects returns array of projects", async () => {
      const client = makeClient(PROJECTS);
      const data = await client.getProjects();
      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe(12345678);
      expect(data[0].name).toBe("mock-project");
    });

    it("getProject returns unwrapped project with camelCase fields", async () => {
      const client = makeClient(PROJECT_WIRE);
      const data = await client.getProject("12345678");
      expect(data).toBeDefined();
      expect(data.id).toBe(12345678);
      expect(data.name).toBe("mock-project");
      expect(data.groupId).toBe(2259240);
    });

    it("getProjectBadgeKey returns badge key string", async () => {
      const client = makeClient(BADGE_KEY);
      const data = await client.getProjectBadgeKey("12345678");
      expect(typeof data).toBe("string");
      expect(data.length).toBeGreaterThan(0);
      expect(data).toBe(BADGE_KEY);
    });

    it("getProject throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Project not found"));
      await expect(client.getProject("99999")).rejects.toThrow(HttpError);
    });
  });
});
