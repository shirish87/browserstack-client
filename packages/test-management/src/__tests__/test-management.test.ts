import { describe, expect, test } from "vitest";
import { testManagementContext } from "./setup.ts";

describe("TestManagementClient", () => {

  describe("Projects", () => {
    test("getTestManagementProjects", async () => {
      const { client } = testManagementContext;
      const projects = await client.getTestManagementProjects();
      expect(Array.isArray(projects)).toBe(true);
      const list = projects as NonNullable<typeof projects>;
      expect(list.length).toBeGreaterThan(0);
      expect(list[0]!.identifier).toBeDefined();
      expect(list[0]!.name).toBeDefined();
    });

    test("createTestManagementProject + getTestManagementProject + updateTestManagementProject + deleteTestManagementProject", async () => {
      const { client } = testManagementContext;
      const name = `test-project-${Date.now()}`;

      const created = await client.createTestManagementProject({ project: { name, description: "test" } });
      expect(created!.name).toBe(name);
      expect(created!.identifier).toBeDefined();
      const projectId = created!.identifier!;

      const fetched = await client.getTestManagementProject(projectId);
      expect(fetched!.identifier).toBe(projectId);
      expect(fetched!.name).toBe(name);

      const updated = await client.updateTestManagementProject(projectId, { project: { description: "updated" } });
      expect(updated!.identifier).toBe(projectId);

      const deleted = await client.deleteTestManagementProject(projectId);
      expect(deleted).toBeDefined();
    }, 30_000);

    test("getTestManagementProject", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const project = await client.getTestManagementProject(projectId);
      expect(project!.identifier).toBe(projectId);
    });
  });

  describe("Folders", () => {
    test("getTestManagementFolders", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const folders = await client.getTestManagementFolders(projectId);
      expect(Array.isArray(folders)).toBe(true);
    });

    test("createTestManagementFolder + getTestManagementFolder + updateTestManagementFolder + deleteTestManagementFolder", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const name = `folder-${Date.now()}`;

      const created = await client.createTestManagementFolder(projectId, { folder: { name, description: "test folder" } });
      expect(created!.name).toBe(name);
      expect(created!.id).toBeDefined();
      const folderId = created!.id!;

      const fetched = await client.getTestManagementFolder(projectId, folderId);
      expect(fetched!.id).toBe(folderId);

      const updated = await client.updateTestManagementFolder(projectId, folderId, { folder: { name: `${name}-updated` } });
      expect(updated!.id).toBe(folderId);

      await client.deleteTestManagementFolder(projectId, folderId);
    }, 30_000);

    test("moveTestManagementFolder", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();

      const parent = await client.createTestManagementFolder(projectId, { folder: { name: `parent-${Date.now()}`, description: "" } });
      const child = await client.createTestManagementFolder(projectId, { folder: { name: `child-${Date.now()}`, description: "" } });

      const moved = await client.moveTestManagementFolder(projectId, child!.id!, { parentId: parent!.id });
      expect(moved!.id).toBe(child!.id);

      await client.deleteTestManagementFolder(projectId, child!.id!);
      await client.deleteTestManagementFolder(projectId, parent!.id!);
    }, 30_000);
  });

  describe("TestCases", () => {
    test("getTestManagementTestCases", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const cases = await client.getTestManagementTestCases(projectId);
      expect(Array.isArray(cases)).toBe(true);
    });

    test("createTestManagementTestCase + updateTestManagementTestCase + deleteTestManagementTestCase", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const folderId = await randomFolderId(projectId);

      const created = await client.createTestManagementTestCase(projectId, folderId, { name: `tc-${Date.now()}`, description: "test case" });
      expect(created!.identifier).toBeDefined();
      const caseId = created!.identifier!;

      const updated = await client.updateTestManagementTestCase(projectId, caseId, { name: `tc-${Date.now()}-updated` });
      expect(updated!.identifier).toBe(caseId);

      await client.deleteTestManagementTestCase(projectId, caseId);
    }, 30_000);

    test("archiveTestManagementTestCase + unarchiveTestManagementTestCase", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const folderId = await randomFolderId(projectId);

      const created = await client.createTestManagementTestCase(projectId, folderId, { name: `tc-archive-${Date.now()}` });
      const caseId = created!.identifier!;

      const archived = await client.archiveTestManagementTestCase(projectId, caseId);
      expect(archived!.identifier).toBe(caseId);

      const unarchived = await client.unarchiveTestManagementTestCase(projectId, caseId);
      expect(unarchived!.identifier).toBe(caseId);

      await client.deleteTestManagementTestCase(projectId, caseId);
    }, 30_000);

    test("moveTestManagementTestCase", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const sourceFolderId = await randomFolderId(projectId);

      const newFolder = await client.createTestManagementFolder(projectId, { folder: { name: `dest-${Date.now()}`, description: "" } });
      const created = await client.createTestManagementTestCase(projectId, sourceFolderId, { name: `tc-move-${Date.now()}` });
      const caseId = created!.identifier!;

      const moved = await client.moveTestManagementTestCase(projectId, caseId, { destinationFolderId: newFolder!.id! });
      expect(moved!.identifier).toBe(caseId);

      await client.deleteTestManagementTestCase(projectId, caseId);
      await client.deleteTestManagementFolder(projectId, newFolder!.id!);
    }, 30_000);

    test("bulkArchiveTestManagementTestCases + bulkUnarchiveTestManagementTestCases + bulkDeleteTestManagementTestCases", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const folderId = await randomFolderId(projectId);

      const tc1 = await client.createTestManagementTestCase(projectId, folderId, { name: `bulk-1-${Date.now()}` });
      const tc2 = await client.createTestManagementTestCase(projectId, folderId, { name: `bulk-2-${Date.now()}` });
      const ids = [tc1!.identifier!, tc2!.identifier!];

      await client.bulkArchiveTestManagementTestCases(projectId, { ids });
      await client.bulkUnarchiveTestManagementTestCases(projectId, { ids });
      await client.bulkDeleteTestManagementTestCases(projectId, { ids });
    }, 60_000);

    test("getTestManagementTestCaseAttachments", async () => {
      const { client, randomProjectId, randomTestCaseId } = testManagementContext;
      const projectId = await randomProjectId();
      const testCaseId = await randomTestCaseId(projectId);
      const attachments = await client.getTestManagementTestCaseAttachments(projectId, testCaseId);
      expect(Array.isArray(attachments)).toBe(true);
    });

    test("getTestManagementTestCaseResults", async () => {
      const { client, randomProjectId, randomTestCaseId } = testManagementContext;
      const projectId = await randomProjectId();
      const testCaseId = await randomTestCaseId(projectId);
      const results = await client.getTestManagementTestCaseResults(projectId, testCaseId);
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe("TestRuns", () => {
    test("getTestManagementTestRuns", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const runs = await client.getTestManagementTestRuns(projectId);
      expect(Array.isArray(runs)).toBe(true);
    });

    test("createTestManagementTestRun + getTestManagementTestRun + patchTestManagementTestRun + deleteTestManagementTestRun", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();

      const created = await client.createTestManagementTestRun(projectId, {
        testRun: { name: `run-${Date.now()}`, includeAll: true },
      });
      expect(created!.identifier).toBeDefined();
      const runId = created!.identifier!;

      const fetched = await client.getTestManagementTestRun(projectId, runId);
      expect(fetched!.identifier).toBe(runId);

      const patched = await client.patchTestManagementTestRun(projectId, runId, {
        testRun: { name: `run-${Date.now()}-patched` },
      });
      expect(patched!.identifier).toBe(runId);

      await client.deleteTestManagementTestRun(projectId, runId);
    }, 30_000);

    test("getTestManagementTestRunTestCases", async () => {
      const { client, randomProjectId, randomTestRunId } = testManagementContext;
      const projectId = await randomProjectId();
      const testRunId = await randomTestRunId(projectId);
      const cases = await client.getTestManagementTestRunTestCases(projectId, testRunId);
      expect(Array.isArray(cases)).toBe(true);
    });

    test("closeTestManagementTestRun", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const created = await client.createTestManagementTestRun(projectId, {
        testRun: { name: `run-close-${Date.now()}`, includeAll: false, testCases: [] },
      });
      const closed = await client.closeTestManagementTestRun(projectId, created!.identifier!);
      expect(closed!.identifier).toBe(created!.identifier);
    }, 30_000);

    test("getTestManagementTestRunResults", async () => {
      const { client, randomProjectId, randomTestRunId } = testManagementContext;
      const projectId = await randomProjectId();
      const testRunId = await randomTestRunId(projectId);
      const results = await client.getTestManagementTestRunResults(projectId, testRunId);
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe("TestPlans", () => {
    test("getTestManagementTestPlans", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const plans = await client.getTestManagementTestPlans(projectId);
      expect(Array.isArray(plans)).toBe(true);
    });

    test("createTestManagementTestPlan + getTestManagementTestPlan + updateTestManagementTestPlan", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();

      const created = await client.createTestManagementTestPlan(projectId, {
        testPlan: { name: `plan-${Date.now()}` },
      });
      expect(created!.identifier).toBeDefined();
      const planId = created!.identifier!;

      const fetched = await client.getTestManagementTestPlan(projectId, planId);
      expect(fetched!.identifier).toBe(planId);

      const updated = await client.updateTestManagementTestPlan(projectId, planId, {
        testPlan: { name: `plan-${Date.now()}-updated` },
      });
      expect(updated!.identifier).toBe(planId);
    }, 30_000);

    test("getTestManagementTestPlanTestRuns", async () => {
      const { client, randomProjectId, randomTestPlanId } = testManagementContext;
      const projectId = await randomProjectId();
      const planId = await randomTestPlanId(projectId);
      const runs = await client.getTestManagementTestPlanTestRuns(projectId, planId);
      expect(Array.isArray(runs)).toBe(true);
    });
  });

  describe("Configurations", () => {
    test("getTestManagementConfigurations", async () => {
      const { client } = testManagementContext;
      const configs = await client.getTestManagementConfigurations();
      expect(Array.isArray(configs)).toBe(true);
    });

    test("createTestManagementConfiguration", async () => {
      const { client } = testManagementContext;
      const created = await client.createTestManagementConfiguration({ name: `cfg-${Date.now()}` });
      expect(created).toBeDefined();
    }, 30_000);
  });

  describe("CustomFields", () => {
    test("getTestManagementCustomFields", async () => {
      const { client } = testManagementContext;
      const fields = await client.getTestManagementCustomFields();
      expect(Array.isArray(fields)).toBe(true);
    });
  });

});
