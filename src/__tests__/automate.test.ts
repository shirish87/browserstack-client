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
  });

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
