import { TestManagementClient, BrowserStackOptions } from "../index";
import { resolveAccessKey, resolveUsername } from "@browserstack-client/core";
import { assert } from "vitest";

export interface TestManagementTestContext {
  testManagement: {
    client: TestManagementClient;
    randomProjectId(): Promise<string>;
    randomFolderId(projectId: string): Promise<number>;
    randomTestCaseId(projectId: string): Promise<string>;
    randomTestRunId(projectId: string): Promise<string>;
    randomTestPlanId(projectId: string): Promise<string>;
  };
}

const getOptions = (): BrowserStackOptions => ({
  username: resolveUsername(),
  accessKey: resolveAccessKey(),
});

const client = new TestManagementClient(getOptions());

const randomProjectId = async (): Promise<string> => {
  const projects = await client.getTestManagementProjects();
  assert(Array.isArray(projects) && projects.length > 0, "No test management projects found");
  const project = projects[Math.floor(Math.random() * projects.length)]!;
  assert(project.identifier !== undefined, "Project has no identifier");
  return project.identifier;
};

export const testManagementContext: TestManagementTestContext["testManagement"] = {
  client,
  randomProjectId,
  randomFolderId: async (projectId: string): Promise<number> => {
    const folders = await client.getTestManagementFolders(projectId);
    assert(Array.isArray(folders) && folders.length > 0, "No folders found");
    const folder = folders[Math.floor(Math.random() * folders.length)]!;
    assert(folder.id !== undefined, "Folder has no id");
    return folder.id;
  },
  randomTestCaseId: async (projectId: string): Promise<string> => {
    const cases = await client.getTestManagementTestCases(projectId);
    assert(Array.isArray(cases) && cases.length > 0, "No test cases found");
    const tc = cases[Math.floor(Math.random() * cases.length)]!;
    assert(tc.identifier !== undefined, "TestCase has no identifier");
    return tc.identifier;
  },
  randomTestRunId: async (projectId: string): Promise<string> => {
    const runs = await client.getTestManagementTestRuns(projectId);
    assert(Array.isArray(runs) && runs.length > 0, "No test runs found");
    const run = runs[Math.floor(Math.random() * runs.length)]!;
    assert(run.identifier !== undefined, "TestRun has no identifier");
    return run.identifier;
  },
  randomTestPlanId: async (projectId: string): Promise<string> => {
    const plans = await client.getTestManagementTestPlans(projectId);
    assert(Array.isArray(plans) && plans.length > 0, "No test plans found");
    const plan = plans[Math.floor(Math.random() * plans.length)]!;
    assert(plan.identifier !== undefined, "TestPlan has no identifier");
    return plan.identifier;
  },
};
