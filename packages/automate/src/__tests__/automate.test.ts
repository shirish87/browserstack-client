import { components } from "@browserstack-client/openapi";
import type { DeepCamelCase } from "@browserstack-client/openapi-transforms";
import { describe, expect, expectTypeOf, test } from "vitest";
import { automateContext } from "./setup.ts";

const TIMEOUT = 10_000;
const EXTENDED_TIMEOUT = 15_000;

describe("AutomateClient", () => {

  describe("Account", () => {

    test("getAutomatePlan", async () => {
      const { client } = automateContext;
      const data = await client.getPlan();
      expect(data).toBeDefined();
      expect(data.automatePlan).toBeDefined();
      expectTypeOf(data).toMatchTypeOf<DeepCamelCase<components["schemas"]["AutomatePlan"]>>();
    });
  });

  test("getAutomateBrowsers", async () => {
    const { client } = automateContext;
    const data = await client.getBrowsers();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expectTypeOf(data).toMatchTypeOf<DeepCamelCase<components["schemas"]["BrowserList"]>>();
  }, TIMEOUT);

  describe("Project", () => {
    test("getAutomateProjects", async () => {
      const { client } = automateContext;
      const data = await client.getProjects();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AutomateProject"]>[]
      >();
    });

    test("getAutomateProject", async () => {
      const { client, randomProjectId } = automateContext;
      const projectId = await randomProjectId();
      const data = await client.getProject(String(projectId));
      expect(data).toBeDefined();
      expect(data.id).toBeDefined();
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AutomateProject"]>
      >();
    });

    test("updateAutomateProject", async () => {
      const { client, randomProjectId } = automateContext;
      const projectId = await randomProjectId();
      const name = `pricing-project-${Date.now()}`;
      const data = await client.updateProject(String(projectId), { name });
      expect(data).toBeDefined();
      expect(data.id).toBeDefined();
      expect(data.name).toBe(name);
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AutomateProject"]>
      >();
    });

    test("getAutomateProjectBadgeKey", async () => {
      const { client, randomProjectId } = automateContext;
      const projectId = await randomProjectId();
      const data = await client.getProjectBadgeKey(String(projectId));
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toEqualTypeOf<string>();
    });
  });

  describe("Build", () => {
    test("getAutomateBuilds", async () => {
      const { client } = automateContext;
      const data = await client.getBuilds();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AutomateBuild"]>[]
      >();
    });

    test("getAutomateBuild", async () => {
      const { client, randomBuildId } = automateContext;
      const buildId = await randomBuildId();
      const data = await client.getBuild(buildId);
      expect(data).toBeDefined();
    });

    describe("updateAutomateBuild", () => {
      test("name", async () => {
        const { client, randomBuildId } = automateContext;
        const buildId = await randomBuildId();
        const name = `pricing-build-${Date.now()}`;
        const data = await client.updateBuild(buildId, { name });
        expect(data).toBeDefined();
        if ("automationBuild" in data) {
          expect(data.automationBuild.name).toEqual(name);
        }
      });

      test("build_tag", async () => {
        const { client, randomBuildId } = automateContext;
        const buildId = await randomBuildId();
        const tag = `pricing-build-${Date.now()}`;
        const data = await client.updateBuild(buildId, { buildTag: tag });
        expect(data).toBeDefined();
        if ("automationBuild" in data) {
          expect(data.automationBuild.buildTag).toEqual(tag);
        }
      });
    });

    test("uploadAutomateBuildTerminalLogs", async () => {
      const { client, randomBuildId } = automateContext;
      const buildId = await randomBuildId();
      const data = await client.uploadBuildTerminalLogs(buildId, {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        fileName: "terminal.txt",
      });

      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<string>();
    }, TIMEOUT);
  });

  describe("Session", () => {
    test("getAutomateSessions", async () => {
      const { client, randomBuildId } = automateContext;
      const buildId = await randomBuildId();
      const data = await client.getSessions(buildId);
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AutomateSession"]>[]
      >();
    });

    test("getAutomateSession", async () => {
      const { client, randomSessionId } = automateContext;
      const sessionId = await randomSessionId();
      const data = await client.getSession(sessionId);
      expect(data).toBeDefined();
      expect(data).haveOwnProperty("status");
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AutomateSession"]>
      >();
    });

    describe("updateAutomateSession", () => {
      test("status/reason", async () => {
        const { client, randomSessionId } = automateContext;
        const sessionId = await randomSessionId();
        const data = await client.updateSession(sessionId, {
          status: "failed",
          reason: "Session failed",
        });

        expect(data).toBeDefined();
        expect(data).haveOwnProperty("status");
        expect(data.status).toEqual("failed");
        expectTypeOf(data).toMatchTypeOf<
          DeepCamelCase<components["schemas"]["AutomateSession"]>
        >();
      });

      test("name", async () => {
        const { client, randomSessionId } = automateContext;
        const sessionId = await randomSessionId();
        const data = await client.updateSession(sessionId, {
          name: "pricing-session",
        });

        expect(data).toBeDefined();
        expect(data).haveOwnProperty("name");
        expect(data.name).toEqual("pricing-session");
        expectTypeOf(data).toMatchTypeOf<
          DeepCamelCase<components["schemas"]["AutomateSession"]>
        >();
      });
    });

    test("uploadAutomateSessionTerminalLogs", async () => {
      const { client, randomSessionId } = automateContext;
      const sessionId = await randomSessionId();
      const data = await client.uploadSessionTerminalLogs(sessionId, {
        file: new Blob(["Logs Logs Logs"], { type: "text/plain" }),
        fileName: "terminal.txt",
      });

      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<string>();
    }, TIMEOUT);
  });

  describe("Media Files", () => {
    test("uploadAutomateMediaFile", async () => {
      const { client } = automateContext;
      const data = await client.uploadMediaFile({
        file: new Blob(["test"], { type: "text/plain" }),
        fileName: "test.txt",
      });
      expect(data).toBeDefined();
      expect(data.mediaUrl).toBeDefined();
      expectTypeOf(data.mediaUrl).toEqualTypeOf<string>();
    }, TIMEOUT);

    test("getAutomateMediaFiles", async () => {
      const { client } = automateContext;
      const data = await client.getMediaFiles();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      expectTypeOf(data).toMatchTypeOf<
        DeepCamelCase<components["schemas"]["AutomateMediaFile"]>[]
      >();
    });

    test("deleteAutomateMediaFile", async () => {
      const { client } = automateContext;
      await client.uploadMediaFile({
        file: new Blob(["delete-me"], { type: "text/plain" }),
        fileName: "delete-me.txt",
      });
      const files = await client.getMediaFiles();
      expect(files.length).toBeGreaterThan(0);
      const mediaId = files[files.length - 1].mediaId;
      const data = await client.deleteMediaFile(mediaId);
      expect(data).toBeDefined();
      expect(data).haveOwnProperty("success");
      expect(data.success).toEqual(true);
    }, EXTENDED_TIMEOUT);
  });
});
