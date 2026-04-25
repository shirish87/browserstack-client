import { describe, expect, test } from "vitest";
import { testManagementContext } from "./setup.ts";
import { resolveUsername } from "@browserstack-client/core";

const TIMEOUT = 30_000;
const LONG_TIMEOUT = 60_000;

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
    }, TIMEOUT);

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
    }, TIMEOUT);

    test("moveTestManagementFolder", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();

      const parent = await client.createTestManagementFolder(projectId, { folder: { name: `parent-${Date.now()}`, description: "" } });
      const child = await client.createTestManagementFolder(projectId, { folder: { name: `child-${Date.now()}`, description: "" } });

      const moved = await client.moveTestManagementFolder(projectId, child!.id!, { parentId: parent!.id });
      expect(moved!.id).toBe(child!.id);

      await client.deleteTestManagementFolder(projectId, child!.id!);
      await client.deleteTestManagementFolder(projectId, parent!.id!);
    }, TIMEOUT);
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

      const created = await client.createTestManagementTestCase(projectId, folderId, { testCase: { name: `tc-${Date.now()}`, description: "test case" } });
      expect(created!.identifier).toBeDefined();
      const caseId = created!.identifier!;

      const updated = await client.updateTestManagementTestCase(projectId, caseId, { testCase: { name: `tc-${Date.now()}-updated` } });
      expect(updated!.identifier).toBe(caseId);

      await client.deleteTestManagementTestCase(projectId, caseId);
    }, TIMEOUT);

    test.skip("archiveTestManagementTestCase + unarchiveTestManagementTestCase (paid feature)", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const folderId = await randomFolderId(projectId);

      const created = await client.createTestManagementTestCase(projectId, folderId, { testCase: { name: `tc-archive-${Date.now()}` } });
      const caseId = created!.identifier!;

      const archived = await client.archiveTestManagementTestCase(projectId, caseId);
      expect(archived!.identifier).toBe(caseId);

      const unarchived = await client.unarchiveTestManagementTestCase(projectId, caseId);
      expect(unarchived!.identifier).toBe(caseId);

      await client.deleteTestManagementTestCase(projectId, caseId);
    }, TIMEOUT);

    test("moveTestManagementTestCase", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const sourceFolderId = await randomFolderId(projectId);

      const newFolder = await client.createTestManagementFolder(projectId, { folder: { name: `dest-${Date.now()}`, description: "" } });
      const created = await client.createTestManagementTestCase(projectId, sourceFolderId, { testCase: { name: `tc-move-${Date.now()}` } });
      const caseId = created!.identifier!;

      const moved = await client.moveTestManagementTestCase(projectId, caseId, { destinationFolderId: newFolder!.id! });
      expect(moved!.identifier).toBe(caseId);

      await client.deleteTestManagementTestCase(projectId, caseId);
      await client.deleteTestManagementFolder(projectId, newFolder!.id!);
    }, TIMEOUT);

    test.skip("bulkArchiveTestManagementTestCases + bulkUnarchiveTestManagementTestCases + bulkDeleteTestManagementTestCases (paid feature)", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const folderId = await randomFolderId(projectId);

      const tc1 = await client.createTestManagementTestCase(projectId, folderId, { testCase: { name: `bulk-1-${Date.now()}` } });
      const tc2 = await client.createTestManagementTestCase(projectId, folderId, { testCase: { name: `bulk-2-${Date.now()}` } });
      const ids = [tc1!.identifier!, tc2!.identifier!];

      await client.bulkArchiveTestManagementTestCases(projectId, { ids });
      await client.bulkUnarchiveTestManagementTestCases(projectId, { ids });
      await client.bulkDeleteTestManagementTestCases(projectId, { ids });
    }, LONG_TIMEOUT);

    test("bulkEditTestManagementTestCases", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const folderId = await randomFolderId(projectId);

      const tc1 = await client.createTestManagementTestCase(projectId, folderId, { testCase: { name: `bulk-edit-1-${Date.now()}` } });
      const tc2 = await client.createTestManagementTestCase(projectId, folderId, { testCase: { name: `bulk-edit-2-${Date.now()}` } });
      const ids = [tc1!.identifier!, tc2!.identifier!];

      const result = await client.bulkEditTestManagementTestCases(projectId, { ids, testCase: { ids, tags: ["bulk-edit-test"] } as never });
      expect(result).toBeDefined();

      await client.deleteTestManagementTestCase(projectId, ids[0]!);
      await client.deleteTestManagementTestCase(projectId, ids[1]!);
    }, TIMEOUT);

    test("getTestManagementTestCaseAttachments", async () => {
      const { client, randomProjectId, randomTestCaseId } = testManagementContext;
      const projectId = await randomProjectId();
      const testCaseId = await randomTestCaseId(projectId);
      const attachments = await client.getTestManagementTestCaseAttachments(projectId, testCaseId);
      expect(Array.isArray(attachments)).toBe(true);
    });

    test("addTestManagementTestCaseAttachment + deleteTestManagementTestCaseAttachment", async () => {
      const { client, randomProjectId, randomFolderId } = testManagementContext;
      const projectId = await randomProjectId();
      const folderId = await randomFolderId(projectId);

      const tc = await client.createTestManagementTestCase(projectId, folderId, { testCase: { name: `tc-attach-${Date.now()}` } });
      const testCaseId = tc!.identifier!;

      const content = new Blob(["test attachment content"], { type: "text/plain" });
      await client.addTestManagementTestCaseAttachment(projectId, testCaseId, { file: content, fileName: "test.txt" });

      const attachments = await client.getTestManagementTestCaseAttachments(projectId, testCaseId);
      const list = attachments as Array<{ id: number }>;
      expect(list.length).toBeGreaterThan(0);
      const attachmentId = list[0]!.id;

      await client.deleteTestManagementTestCaseAttachment(projectId, testCaseId, attachmentId);
      await client.deleteTestManagementTestCase(projectId, testCaseId);
    }, TIMEOUT);

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
    }, TIMEOUT);

    test("getTestManagementTestRunTestCases", async () => {
      const { client, randomProjectId, randomTestRunId } = testManagementContext;
      const projectId = await randomProjectId();
      const testRunId = await randomTestRunId(projectId);
      const cases = await client.getTestManagementTestRunTestCases(projectId, testRunId);
      expect(Array.isArray(cases)).toBe(true);
    }, TIMEOUT);

    test("updateTestManagementTestRun", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();

      const created = await client.createTestManagementTestRun(projectId, {
        testRun: { name: `run-update-${Date.now()}`, includeAll: false, testCases: [] },
      });
      const runId = created!.identifier!;

      const updated = await client.updateTestManagementTestRun(projectId, runId, {
        testRun: { name: `run-update-${Date.now()}-updated` },
      });
      expect(updated!.identifier).toBe(runId);

      await client.deleteTestManagementTestRun(projectId, runId);
    }, TIMEOUT);

    test("assignTestManagementTestRunTestCases", async () => {
      const { client, randomProjectId, randomTestCaseId } = testManagementContext;
      const projectId = await randomProjectId();
      const testCaseId = await randomTestCaseId(projectId);

      const run = await client.createTestManagementTestRun(projectId, {
        testRun: { name: `run-assign-${Date.now()}`, includeAll: false, testCases: [testCaseId] },
      });
      const runId = run!.identifier!;

      const username = resolveUsername()!;
      const result = await client.assignTestManagementTestRunTestCases(projectId, runId, {
        assignTo: [{ testCaseId, assignee: username }],
      });
      expect(result).toBeDefined();

      await client.deleteTestManagementTestRun(projectId, runId);
    }, TIMEOUT);

    test("addTestManagementTestRunResults + getTestManagementTestRunTestCaseResults", async () => {
      const { client, randomProjectId, randomTestCaseId } = testManagementContext;
      const projectId = await randomProjectId();
      const testCaseId = await randomTestCaseId(projectId);

      const run = await client.createTestManagementTestRun(projectId, {
        testRun: { name: `run-results-${Date.now()}`, includeAll: false, testCases: [testCaseId] },
      });
      const runId = run!.identifier!;

      const added = await client.addTestManagementTestRunResults(projectId, runId, {
        testResult: { status: "passed" },
        testCaseId,
      });
      expect(added).toBeDefined();

      const results = await client.getTestManagementTestRunTestCaseResults(projectId, runId, testCaseId);
      expect(Array.isArray(results)).toBe(true);

      await client.deleteTestManagementTestRun(projectId, runId);
    }, TIMEOUT);

    test("getTestManagementTestResultAttachments + addTestManagementTestResultAttachment + deleteTestManagementTestResultAttachment", async () => {
      const { client, randomProjectId, randomTestCaseId } = testManagementContext;
      const projectId = await randomProjectId();
      const testCaseId = await randomTestCaseId(projectId);

      const run = await client.createTestManagementTestRun(projectId, {
        testRun: { name: `run-result-attach-${Date.now()}`, includeAll: false, testCases: [testCaseId] },
      });
      const runId = run!.identifier!;

      await client.addTestManagementTestRunResults(projectId, runId, {
        testResult: { status: "passed" },
        testCaseId,
      });

      const runResults = await client.getTestManagementTestRunResults(projectId, runId);
      const resultId = (runResults as Array<{ id: number }>)[0]!.id;

      const attachments = await client.getTestManagementTestResultAttachments(projectId, resultId);
      expect(Array.isArray(attachments)).toBe(true);

      const content = new Blob(["result attachment"], { type: "text/plain" });
      await client.addTestManagementTestResultAttachment(projectId, resultId, { file: content, fileName: "result.txt" });

      const attachmentsAfter = await client.getTestManagementTestResultAttachments(projectId, resultId);
      const attachList = attachmentsAfter as Array<{ id: number }>;
      expect(attachList.length).toBeGreaterThan(0);

      await client.deleteTestManagementTestResultAttachment(projectId, resultId, attachList[0]!.id);
      await client.deleteTestManagementTestRun(projectId, runId);
    }, LONG_TIMEOUT);

    test("closeTestManagementTestRun", async () => {
      const { client, randomProjectId } = testManagementContext;
      const projectId = await randomProjectId();
      const created = await client.createTestManagementTestRun(projectId, {
        testRun: { name: `run-close-${Date.now()}`, includeAll: false, testCases: [] },
      });
      const closed = await client.closeTestManagementTestRun(projectId, created!.identifier!);
      expect(closed!.identifier).toBe(created!.identifier);
    }, TIMEOUT);

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
    }, TIMEOUT);

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

    test("createTestManagementConfiguration + getTestManagementConfiguration", async () => {
      const { client } = testManagementContext;
      const created = await client.createTestManagementConfiguration({ name: `cfg-${Date.now()}` });
      expect(created).toBeDefined();
      expect(created!.id).toBeDefined();
      const configId = String(created!.id!);

      const fetched = await client.getTestManagementConfiguration(configId);
      expect(fetched!.id).toBe(created!.id);
    }, TIMEOUT);
  });

  describe("CustomFields", () => {
    test("getTestManagementCustomFields", async () => {
      const { client } = testManagementContext;
      const fields = await client.getTestManagementCustomFields();
      expect(Array.isArray(fields)).toBe(true);
    });

    test.skip("createTestManagementCustomField + updateTestManagementCustomField + deleteTestManagementCustomField (paid feature)", async () => {
      const { client } = testManagementContext;

      const created = await client.createTestManagementCustomField({
        fieldName: `cf-${Date.now()}`,
        fieldType: "string",
        fieldEntityType: "test_case",
      });
      expect(created).toBeDefined();
      expect(created!.id).toBeDefined();
      const fieldId = created!.id!;

      const updated = await client.updateTestManagementCustomField(fieldId, {
        fieldName: `cf-${Date.now()}-updated`,
      });
      expect(updated).toBeDefined();

      await client.deleteTestManagementCustomField(fieldId);
    }, TIMEOUT);
  });

});
