import { BrowserStackOptions, resolveAccessKey, resolveUsername } from "@browserstack-client/core";
import { TestReportingClient } from "../index";
import { assert } from "vitest";

export interface TestReportingTestContext {
  testReporting: {
    client: TestReportingClient;
    randomProjectId(): Promise<number>;
    randomBuildUuid(projectId: number): Promise<string>;
    randomBuildHashedId(projectId: number): Promise<string>;
  };
}

const getOptions = (): BrowserStackOptions => ({
  username: resolveUsername(),
  accessKey: resolveAccessKey(),
});

const client = new TestReportingClient(getOptions());

export const testReportingContext: TestReportingTestContext["testReporting"] = {
  client,
  randomProjectId: async (): Promise<number> => {
    const resp = await client.getProjects();
    const projects = (resp as { projects?: Array<{ id: number }> })?.projects ?? (resp as Array<{ id: number }>);
    assert(Array.isArray(projects) && projects.length > 0, "No test reporting projects found");
    const project = projects[Math.floor(Math.random() * projects.length)]!;
    assert(project.id !== undefined, "Project has no id");
    return project.id;
  },
  randomBuildUuid: async (projectId: number): Promise<string> => {
    const resp = await client.getProjectBuilds(projectId);
    const builds = (resp as { builds?: Array<{ buildId: string }> })?.builds ?? (resp as Array<{ buildId: string }>);
    assert(Array.isArray(builds) && builds.length > 0, "No builds found for project");
    const build = builds[Math.floor(Math.random() * builds.length)]!;
    assert(build.buildId !== undefined, "Build has no buildId");
    return build.buildId;
  },
  randomBuildHashedId: async (projectId: number): Promise<string> => {
    const resp = await client.getProjectBuilds(projectId);
    const builds = (resp as { builds?: Array<{ buildId: string }> })?.builds ?? (resp as Array<{ buildId: string }>);
    assert(Array.isArray(builds) && builds.length > 0, "No builds found for project");
    const build = builds[Math.floor(Math.random() * builds.length)]!;
    assert(build.buildId !== undefined, "Build has no buildId");
    return build.buildId;
  },
};