import { describe, expect, test } from "vitest";
import { testManagementContext } from "./setup.ts";
import { resolveUsername } from "@browserstack-client/core";

const TIMEOUT = 30_000;
const LONG_TIMEOUT = 60_000;

describe("TestManagementClient", () => {

  describe("Projects", () => {
    test("getTestManagementProjects", async () => {
      const { client } = testManagementContext;
      const projects = await client.getProjects();
      expect(Array.isArray(projects)).toBe(true);
      const list = projects as NonNullable<typeof projects>;
      expect(list.length).toBeGreaterThan(0);
      expect(list[0]!.identifier).toBeDefined();
      expect(list[0]!.name).toBeDefined();
    });

    test("createTestManagementProject + getTestManagementProject + updateTestManagementProject + deleteTestManagementProject", async () => {
      const { client } = testManagementContext;
      const name = `test-project-${Date.now()}`;

      const created = await client.createProject({ project: { name, description: "test" } });
      expect(created!.name).toBe(name);
      expect(created!.identifier).toBeDefined();
      const projectId = created!.identifier!;

      const fetched = await client.getProject(projectId);
      expect(fetched!.identifier).toBe(projectId);
      expect(fetched!.name).toBe(name);

      const updated = await client.updateProject(projectId, { project: { description: "updated" } });
      expect(updated!.identifier).toBe(projectId);

      const deleted = await client.deleteProject(projectId);
      expect(deleted).toBeDefined();
    }, TIMEOUT);

    test("getTestManagementProject", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const project = await client.getProject(projectId);
      expect(project!.identifier).toBe(projectId);
    });
  });

  describe("Folders", () => {
    test("getTestManagementFolders", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const folders = await client.getFolders(projectId);
      expect(Array.isArray(folders)).toBe(true);
    });

    test("createTestManagementFolder + getTestManagementFolder + updateTestManagementFolder + deleteTestManagementFolder", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const name = `folder-${Date.now()}`;

      const created = await client.createFolder(projectId, { folder: { name, description: "test folder" } });
      expect(created!.name).toBe(name);
      expect(created!.id).toBeDefined();
      const folderId = created!.id!;

      const fetched = await client.getFolder(projectId, folderId);
      expect(fetched!.id).toBe(folderId);

      const updated = await client.updateFolder(projectId, folderId, { folder: { name: `${name}-updated` } });
      expect(updated!.id).toBe(folderId);

      await client.deleteFolder(projectId, folderId);
    }, TIMEOUT);

    test("moveTestManagementFolder", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();

      const parent = await client.createFolder(projectId, { folder: { name: `parent-${Date.now()}`, description: "" } });
      const child = await client.createFolder(projectId, { folder: { name: `child-${Date.now()}`, description: "" } });

      const moved = await client.moveFolder(projectId, child!.id!, { parentId: parent!.id });
      expect(moved!.id).toBe(child!.id);

      await client.deleteFolder(projectId, child!.id!);
      await client.deleteFolder(projectId, parent!.id!);
    }, TIMEOUT);
  });

  describe("TestCases", () => {
    test("getTestManagementTestCases", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const cases = await client.getTestCases(projectId);
      expect(Array.isArray(cases)).toBe(true);
    });

    test("createTestManagementTestCase + updateTestManagementTestCase + deleteTestManagementTestCase", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const folderId = await randomFolderId(projectId);

      const created = await client.createTestCase(projectId, folderId, { testCase: { name: `tc-${Date.now()}`, description: "test case" } });
      expect(created!.identifier).toBeDefined();
      const caseId = created!.identifier!;

      const updated = await client.updateTestCase(projectId, caseId, { testCase: { name: `tc-${Date.now()}-updated` } });
      expect(updated!.identifier).toBe(caseId);

      await client.deleteTestCase(projectId, caseId);
    }, TIMEOUT);

    test.skip("archiveTestManagementTestCase + unarchiveTestManagementTestCase (paid feature)", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const folderId = await randomFolderId(projectId);

      const created = await client.createTestCase(projectId, folderId, { testCase: { name: `tc-archive-${Date.now()}` } });
      const caseId = created!.identifier!;

      const archived = await client.archiveTestCase(projectId, caseId);
      expect(archived!.identifier).toBe(caseId);

      const unarchived = await client.unarchiveTestCase(projectId, caseId);
      expect(unarchived!.identifier).toBe(caseId);

      await client.deleteTestCase(projectId, caseId);
    }, TIMEOUT);

    test("moveTestManagementTestCase", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const sourceFolderId = await randomFolderId(projectId);

      const newFolder = await client.createFolder(projectId, { folder: { name: `dest-${Date.now()}`, description: "" } });
      const created = await client.createTestCase(projectId, sourceFolderId, { testCase: { name: `tc-move-${Date.now()}` } });
      const caseId = created!.identifier!;

      const moved = await client.moveTestCase(projectId, caseId, { destinationFolderId: newFolder!.id! });
      expect(moved!.identifier).toBe(caseId);

      await client.deleteTestCase(projectId, caseId);
      await client.deleteFolder(projectId, newFolder!.id!);
    }, TIMEOUT);

    test.skip("bulkArchiveTestManagementTestCases + bulkUnarchiveTestManagementTestCases + bulkDeleteTestManagementTestCases (paid feature)", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const folderId = await randomFolderId(projectId);

      const tc1 = await client.createTestCase(projectId, folderId, { testCase: { name: `bulk-1-${Date.now()}` } });
      const tc2 = await client.createTestCase(projectId, folderId, { testCase: { name: `bulk-2-${Date.now()}` } });
      const ids = [tc1!.identifier!, tc2!.identifier!];

      await client.bulkArchiveTestCases(projectId, { ids });
      await client.bulkUnarchiveTestCases(projectId, { ids });
      await client.bulkDeleteTestCases(projectId, { ids });
    }, LONG_TIMEOUT);

    test("bulkEditTestManagementTestCases", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const folderId = await randomFolderId(projectId);

      const tc1 = await client.createTestCase(projectId, folderId, { testCase: { name: `bulk-edit-1-${Date.now()}` } });
      const tc2 = await client.createTestCase(projectId, folderId, { testCase: { name: `bulk-edit-2-${Date.now()}` } });
      const ids = [tc1!.identifier!, tc2!.identifier!];

      const result = await client.bulkEditTestCases(projectId, { ids, testCase: { ids, tags: ["bulk-edit-test"] } as never });
      expect(result).toBeDefined();

      await client.deleteTestCase(projectId, ids[0]!);
      await client.deleteTestCase(projectId, ids[1]!);
    }, TIMEOUT);

    test("getTestManagementTestCaseAttachments", async () => {
      const { client, randomProjectId, randomTestCaseId } = testManagementContext;
      const projectId = await randomProjectId();
      const testCaseId = await randomTestCaseId(projectId);
      const attachments = await client.getTestCaseAttachments(projectId, testCaseId);
      expect(Array.isArray(attachments)).toBe(true);
    });

    test("addTestManagementTestCaseAttachment + deleteTestManagementTestCaseAttachment", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const folderId = await randomFolderId(projectId);

      const tc = await client.createTestCase(projectId, folderId, { testCase: { name: `tc-attach-${Date.now()}` } });
      const testCaseId = tc!.identifier!;

      const content = new Blob(["test attachment content"], { type: "text/plain" });
      await client.addTestCaseAttachment(projectId, testCaseId, { file: content, fileName: "test.txt" });

      const attachments = await client.getTestCaseAttachments(projectId, testCaseId);
      const list = attachments as Array<{ id: number }>;
      expect(list.length).toBeGreaterThan(0);
      const attachmentId = list[0]!.id;

      await client.deleteTestCaseAttachment(projectId, testCaseId, attachmentId);
      await client.deleteTestCase(projectId, testCaseId);
    }, TIMEOUT);

    test("getTestManagementTestCaseResults", async () => {
      const { client, randomProjectId, randomTestCaseId } = testManagementContext;
      const projectId = await randomProjectId();
      const testCaseId = await randomTestCaseId(projectId);
      const results = await client.getTestCaseResults(projectId, testCaseId);
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe("TestRuns", () => {
    test("getTestManagementTestRuns", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const runs = await client.getTestRuns(projectId);
      expect(Array.isArray(runs)).toBe(true);
    });

    test("createTestManagementTestRun + getTestManagementTestRun + patchTestManagementTestRun + deleteTestManagementTestRun", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();

      const created = await client.createTestRun(projectId, {
        testRun: { name: `run-${Date.now()}`, includeAll: true },
      });
      expect(created!.identifier).toBeDefined();
      const runId = created!.identifier!;

      const fetched = await client.getTestRun(projectId, runId);
      expect(fetched!.identifier).toBe(runId);

      const patched = await client.patchTestRun(projectId, runId, {
        testRun: { name: `run-${Date.now()}-patched` },
      });
      expect(patched!.identifier).toBe(runId);

      await client.deleteTestRun(projectId, runId);
    }, TIMEOUT);

    test("getTestManagementTestRunTestCases", async () => {
      const { client, randomProjectId, randomTestRunId } = testManagementContext;
      const projectId = await randomProjectId();
      const testRunId = await randomTestRunId(projectId);
      const cases = await client.getTestRunTestCases(projectId, testRunId);
      expect(Array.isArray(cases)).toBe(true);
    }, TIMEOUT);

    test("updateTestManagementTestRun", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();

      const created = await client.createTestRun(projectId, {
        testRun: { name: `run-update-${Date.now()}`, includeAll: false, testCases: [] },
      });
      const runId = created!.identifier!;

      const updated = await client.updateTestRun(projectId, runId, {
        testRun: { name: `run-update-${Date.now()}-updated` },
      });
      expect(updated!.identifier).toBe(runId);

      await client.deleteTestRun(projectId, runId);
    }, TIMEOUT);

    test("assignTestManagementTestRunTestCases", async () => {
      const { client, randomProjectId, randomTestCaseId } = testManagementContext;
      const projectId = await randomProjectId();
      const testCaseId = await randomTestCaseId(projectId);

      const run = await client.createTestRun(projectId, {
        testRun: { name: `run-assign-${Date.now()}`, includeAll: false, testCases: [testCaseId] },
      });
      const runId = run!.identifier!;

      const username = resolveUsername()!;
      const result = await client.assignTestRunTestCases(projectId, runId, {
        assignTo: [{ testCaseId, assignee: username }],
      });
      expect(result).toBeDefined();

      await client.deleteTestRun(projectId, runId);
    }, TIMEOUT);

    test("addTestManagementTestRunResults + getTestManagementTestRunTestCaseResults", async () => {
      const { client, randomProjectId, randomTestCaseId } = testManagementContext;
      const projectId = await randomProjectId();
      const testCaseId = await randomTestCaseId(projectId);

      const run = await client.createTestRun(projectId, {
        testRun: { name: `run-results-${Date.now()}`, includeAll: false, testCases: [testCaseId] },
      });
      const runId = run!.identifier!;

      const added = await client.addTestRunResults(projectId, runId, {
        testResult: { status: "passed" },
        testCaseId,
      });
      expect(added).toBeDefined();

      const results = await client.getTestRunTestCaseResults(projectId, runId, testCaseId);
      expect(Array.isArray(results)).toBe(true);

      await client.deleteTestRun(projectId, runId);
    }, TIMEOUT);

    test("getTestManagementTestResultAttachments + addTestManagementTestResultAttachment + deleteTestManagementTestResultAttachment", async () => {
      const { client, randomProjectId, randomTestCaseId } = testManagementContext;
      const projectId = await randomProjectId();
      const testCaseId = await randomTestCaseId(projectId);

      const run = await client.createTestRun(projectId, {
        testRun: { name: `run-result-attach-${Date.now()}`, includeAll: false, testCases: [testCaseId] },
      });
      const runId = run!.identifier!;

      await client.addTestRunResults(projectId, runId, {
        testResult: { status: "passed" },
        testCaseId,
      });

      const runResults = await client.getTestRunResults(projectId, runId);
      const resultId = (runResults as Array<{ id: number }>)[0]!.id;

      const attachments = await client.getTestResultAttachments(projectId, resultId);
      expect(Array.isArray(attachments)).toBe(true);

      const content = new Blob(["result attachment"], { type: "text/plain" });
      await client.addTestResultAttachment(projectId, resultId, { file: content, fileName: "result.txt" });

      const attachmentsAfter = await client.getTestResultAttachments(projectId, resultId);
      const attachList = attachmentsAfter as Array<{ id: number }>;
      expect(attachList.length).toBeGreaterThan(0);

      await client.deleteTestResultAttachment(projectId, resultId, attachList[0]!.id);
      await client.deleteTestRun(projectId, runId);
    }, LONG_TIMEOUT);

    test("closeTestManagementTestRun", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const created = await client.createTestRun(projectId, {
        testRun: { name: `run-close-${Date.now()}`, includeAll: false, testCases: [] },
      });
      const closed = await client.closeTestRun(projectId, created!.identifier!);
      expect(closed!.identifier).toBe(created!.identifier);
    }, TIMEOUT);

    test("getTestManagementTestRunResults", async () => {
      const { client, randomProjectId, randomTestRunId } = testManagementContext;
      const projectId = await randomProjectId();
      const testRunId = await randomTestRunId(projectId);
      const results = await client.getTestRunResults(projectId, testRunId);
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe("TestPlans", () => {
    test("getTestManagementTestPlans", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const plans = await client.getTestPlans(projectId);
      expect(Array.isArray(plans)).toBe(true);
    });

    test("createTestManagementTestPlan + getTestManagementTestPlan + updateTestManagementTestPlan", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();

      const created = await client.createTestPlan(projectId, {
        testPlan: { name: `plan-${Date.now()}` },
      });
      expect(created!.identifier).toBeDefined();
      const planId = created!.identifier!;

      const fetched = await client.getTestPlan(projectId, planId);
      expect(fetched!.identifier).toBe(planId);

      const updated = await client.updateTestPlan(projectId, planId, {
        testPlan: { name: `plan-${Date.now()}-updated` },
      });
      expect(updated!.identifier).toBe(planId);
    }, TIMEOUT);

    test("getTestManagementTestPlanTestRuns", async () => {
      const { client, randomProjectId, randomTestPlanId } = testManagementContext;
      const projectId = await randomProjectId();
      const planId = await randomTestPlanId(projectId);
      const runs = await client.getTestPlanTestRuns(projectId, planId);
      expect(Array.isArray(runs)).toBe(true);
    });
  });

  describe("Configurations", () => {
    test("getTestManagementConfigurations", async () => {
      const { client } = testManagementContext;
      const configs = await client.getConfigurations();
      expect(Array.isArray(configs)).toBe(true);
    });

    test("createTestManagementConfiguration + getTestManagementConfiguration", async () => {
      const { client } = testManagementContext;
      const created = await client.createConfiguration({ name: `cfg-${Date.now()}` });
      expect(created).toBeDefined();
      expect(created!.id).toBeDefined();
      const configId = String(created!.id!);

      const fetched = await client.getConfiguration(configId);
      expect(fetched!.id).toBe(created!.id);
    }, TIMEOUT);
  });

  describe("CustomFields", () => {
    test("getTestManagementCustomFields", async () => {
      const { client } = testManagementContext;
      const fields = await client.getCustomFields();
      expect(Array.isArray(fields)).toBe(true);
    });

    test.skip("createTestManagementCustomField + updateTestManagementCustomField + deleteTestManagementCustomField (paid feature)", async () => {
      const { client } = testManagementContext;

      const created = await client.createCustomField({
        fieldName: `cf-${Date.now()}`,
        fieldType: "string",
        fieldEntityType: "test_case",
      });
      expect(created).toBeDefined();
      expect(created!.id).toBeDefined();
      const fieldId = created!.id!;

      const updated = await client.updateCustomField(fieldId, {
        fieldName: `cf-${Date.now()}-updated`,
      });
      expect(updated).toBeDefined();

      await client.deleteCustomField(fieldId);
    }, TIMEOUT);
  });

});
