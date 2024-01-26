import { components } from "@/generated/openapi";
import { describe, expect, expectTypeOf, test } from "vitest";
import type { BrowserStackTestContext } from "./setup";


describe("AutomateClient", () => {

  test<BrowserStackTestContext>("getPlan", async ({ automate: { client } }) => {
    const data = await client.getPlan();
    expect(data).toBeDefined();
    expect(data.automate_plan).toBeDefined();
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomatePlan"]>();
  });

  test<BrowserStackTestContext>("getBrowsers", async ({ automate: { client } }) => {
    const data = await client.getBrowsers();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["BrowserList"]>();
  }, 10_000);

  test<BrowserStackTestContext>("getProjects", async ({ automate: { client } }) => {
    const data = await client.getProjects();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomateProject"][]>();
  });

  test<BrowserStackTestContext>("getProject", async ({ automate: { client, randomProjectId } }) => {
    const projectId = await randomProjectId();
    const data = await client.getProject(projectId);
    expect(data).toBeDefined();
    expect(data.id).toBeDefined();
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomateProject"] & { builds: components["schemas"]["AutomateBuild"][] }>();
  });

  test<BrowserStackTestContext>("updateProject", async ({ automate: { client, randomProjectId } }) => {
    const projectId = await randomProjectId();
    const name = "pricing-project";
    const data = await client.updateProject(projectId, { name });
    expect(data).toBeDefined();
    expect(data.id).toBeDefined();
    expect(data.name).toBe(name);
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomateProject"]>();
  });

  test.skip<BrowserStackTestContext>("deleteProject", async ({ automate: { client, randomProjectId } }) => {
    const projectId = await randomProjectId();
    const data = await client.deleteProject(projectId);
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Object);
    expect(data).haveOwnProperty("status");
    expect(data).haveOwnProperty("message");
  });

  test<BrowserStackTestContext>("getBadgeKey", async ({ automate: { client, randomProjectId } }) => {
    const projectId = await randomProjectId();
    const data = await client.getBadgeKey(projectId);
    expect(data).toBeDefined();
    expect(data.length).toBeGreaterThan(0);
    expectTypeOf(data).toBeString();
  });

  test<BrowserStackTestContext>("getBuilds", async ({ automate: { client } }) => {
    const data = await client.getBuilds();
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomateBuild"][]>();
  });

  test<BrowserStackTestContext>("getBuild", async ({ automate: { client, randomBuildId } }) => {
    const buildId = await randomBuildId();
    const data = await client.getBuild(buildId);
    expect(data).toBeDefined();
    expect(data).haveOwnProperty("status");
    expect(data.sessions).toBeDefined();
    expect(data.sessions).toBeInstanceOf(Array);
    expect(data.sessions.length).toBeGreaterThan(0);
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomateBuild"] & { sessions: components["schemas"]["AutomateSession"][] }>();
  });

  describe('updateBuild', () => {
    test<BrowserStackTestContext>("name", async ({ automate: { client, randomBuildId } }) => {
      const buildId = await randomBuildId();
      const name = `pricing-build-${Date.now()}`;
      const data = await client.updateBuild(buildId, { name });
      expect(data).toBeDefined();

      if ('name' in data) {
        expect(data.name).toEqual(name);
      } else {
        expect(data.error).toBeUndefined();
      }
    });

    test<BrowserStackTestContext>("build_tag", async ({ automate: { client, randomBuildId } }) => {
      const buildId = await randomBuildId();
      const tag = `pricing-build-${Date.now()}`;
      const data = await client.updateBuild(buildId, { build_tag: tag });
      expect(data).toBeDefined();

      if ('build_tag' in data) {
        expect(data.build_tag).toEqual(tag);
      } else {
        expect(data.error).toBeUndefined();
      }
    });
  });

  test<BrowserStackTestContext>("getSessions", async ({ automate: { client, randomBuildId } }) => {
    const buildId = await randomBuildId();
    const data = await client.getSessions(buildId);
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomateSession"][]>();
  });

  test<BrowserStackTestContext>("getSession", async ({ automate: { client, randomSessionId } }) => {
    const sessionId = await randomSessionId();
    const data = await client.getSession(sessionId);
    expect(data).toBeDefined();
    expect(data).haveOwnProperty("status");
    expectTypeOf(data).toMatchTypeOf<components["schemas"]["AutomateSession"]>();
  });

});
