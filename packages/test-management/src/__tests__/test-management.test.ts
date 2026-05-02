import { assert, describe, expect, it } from "vitest";
import { BrowserStackError, HttpError, env } from "@dot-slash/browserstack-core";
import { makeClient, makeErrorResponse } from "./setup.ts";
import { TestManagementClient } from "../index.ts";

// ---------------------------------------------------------------------------
// Fixtures — wire format (snake_case, wrapped as the API returns)
// ---------------------------------------------------------------------------

// Projects
const PROJECTS_WIRE = {
  projects: [
    {
      name: "API Tests",
      identifier: "PR-4",
      urls: { self: "https://test-management.browserstack.com/projects/317606" },
      duplicates_tc_count: 0,
    },
  ],
};

const PROJECT_WIRE = {
  project: {
    name: "API Tests",
    identifier: "PR-4",
    description: "integration test project",
    urls: { self: "https://test-management.browserstack.com/projects/317606" },
    duplicates_tc_count: 0,
  },
};

const CREATE_PROJECT_WIRE = {
  project: {
    name: "New Project",
    identifier: "PR-99",
    description: "created by test",
    urls: { self: "https://test-management.browserstack.com/projects/999999" },
    duplicates_tc_count: 0,
  },
};

// Folders
const FOLDERS_WIRE = {
  folders: [
    {
      id: 45480002,
      name: "mock-folder",
      description: "",
      parent_id: null,
      cases_count: 11,
      sub_folders_count: 0,
      links: { sub_folders: "/api/v2/projects/PR-4/folders/45480002/sub-folders" },
      urls: { self: "https://test-management.browserstack.com/projects/317606/folder/45480002/test-cases" },
    },
  ],
};

const FOLDER_WIRE = {
  folder: {
    id: 45480002,
    name: "mock-folder",
    description: "",
    parent_id: null,
    cases_count: 11,
    sub_folders_count: 0,
    links: { sub_folders: "/api/v2/projects/PR-4/folders/45480002/sub-folders" },
    urls: { self: "https://test-management.browserstack.com/projects/317606/folder/45480002/test-cases" },
  },
};

const CREATE_FOLDER_WIRE = {
  folder: {
    id: 45490001,
    name: "new-folder",
    description: "created folder",
    parent_id: null,
    cases_count: 0,
    sub_folders_count: 0,
    links: { sub_folders: "/api/v2/projects/PR-4/folders/45490001/sub-folders" },
    urls: { self: "https://test-management.browserstack.com/projects/317606/folder/45490001/test-cases" },
  },
};

// Test Cases
const TEST_CASES_WIRE = {
  test_cases: [
    {
      case_type: "Other",
      priority: "Medium",
      status: "Active",
      folder_id: 45480002,
      issues: [],
      created_at: "2026-04-25T20:23:02.000Z",
      last_updated_at: "2026-04-25T20:23:04.000Z",
      created_by: "user@example.com",
      updated_by: "user@example.com",
      folder_path: [45480002],
      tags: [],
      template: "test_case_steps",
      description: null,
      preconditions: null,
      name: "mock-test-case",
      is_shared: false,
      identifier: "TC-157",
      automation_status: "not_automated",
      owner: "user@example.com",
      attachments: [],
      steps: [],
      custom_fields: [],
      urls: {
        self: "https://test-management.browserstack.com/projects/317606/folder/45480002/test-cases/102863558",
      },
    },
  ],
};

const CREATE_TEST_CASE_WIRE = {
  data: {
    test_case: {
      case_type: "Other",
      priority: "Medium",
      status: "Active",
      folder_id: 45480002,
      issues: [],
      created_at: "2026-04-25T20:23:02.000Z",
      last_updated_at: "2026-04-25T20:23:04.000Z",
      created_by: "user@example.com",
      updated_by: "user@example.com",
      folder_path: [45480002],
      tags: [],
      template: "test_case_steps",
      description: null,
      preconditions: null,
      name: "new-test-case",
      is_shared: false,
      identifier: "TC-200",
      automation_status: "not_automated",
      owner: "user@example.com",
      attachments: [],
      steps: [],
      custom_fields: [],
      urls: {
        self: "https://test-management.browserstack.com/projects/317606/folder/45480002/test-cases/102999999",
      },
    },
  },
};

// Test Runs
const TEST_RUNS_WIRE = {
  test_runs: [
    {
      identifier: "TR-1",
      name: "mock-test-run",
      description: "",
      status: "in_progress",
      created_at: "2026-04-25T20:00:00.000Z",
      updated_at: "2026-04-25T20:00:01.000Z",
      created_by: "user@example.com",
      include_all: true,
      test_cases_count: 5,
    },
  ],
};

const TEST_RUN_WIRE = {
  test_run: {
    identifier: "TR-1",
    name: "mock-test-run",
    description: "",
    status: "in_progress",
    created_at: "2026-04-25T20:00:00.000Z",
    updated_at: "2026-04-25T20:00:01.000Z",
    created_by: "user@example.com",
    include_all: true,
    test_cases_count: 5,
  },
};

const CREATE_TEST_RUN_WIRE = {
  test_run: {
    identifier: "TR-42",
    name: "new-test-run",
    description: "",
    status: "in_progress",
    created_at: "2026-04-26T10:00:00.000Z",
    updated_at: "2026-04-26T10:00:01.000Z",
    created_by: "user@example.com",
    include_all: false,
    test_cases_count: 0,
  },
};

// Test Plans
const TEST_PLANS_WIRE = {
  test_plans: [
    {
      identifier: "TP-1",
      name: "mock-test-plan",
      description: "",
      created_at: "2026-04-20T10:00:00.000Z",
      updated_at: "2026-04-20T10:00:01.000Z",
      created_by: "user@example.com",
      test_runs_count: 2,
    },
  ],
};

const TEST_PLAN_WIRE = {
  test_plan: {
    identifier: "TP-1",
    name: "mock-test-plan",
    description: "",
    created_at: "2026-04-20T10:00:00.000Z",
    updated_at: "2026-04-20T10:00:01.000Z",
    created_by: "user@example.com",
    test_runs_count: 2,
  },
};

// Configurations
const CONFIGURATIONS_WIRE = {
  configurations: [
    {
      id: 1001,
      name: "Chrome on Windows",
      device: null,
      os: "Windows",
      os_version: "11",
      browser: "chrome",
      browser_version: "latest",
      created_at: "2026-03-01T00:00:00.000Z",
    },
    {
      id: 1002,
      name: "Safari on macOS",
      device: null,
      os: "OS X",
      os_version: "Ventura",
      browser: "safari",
      browser_version: "16",
      created_at: "2026-03-02T00:00:00.000Z",
    },
  ],
};

// Custom Fields
const CUSTOM_FIELDS_WIRE = {
  custom_fields: [
    {
      id: "cf-001",
      field_name: "automation_framework",
      field_type: "string",
      field_entity_type: "test_case",
      created_at: "2026-03-01T00:00:00.000Z",
      updated_at: "2026-03-01T00:00:00.000Z",
    },
    {
      id: "cf-002",
      field_name: "sprint_number",
      field_type: "number",
      field_entity_type: "test_run",
      created_at: "2026-03-05T00:00:00.000Z",
      updated_at: "2026-03-05T00:00:00.000Z",
    },
  ],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("TestManagementClient", () => {
  describe("Credentials", () => {
    it("accepts valid username and accessKey", () => {
      expect(() => new TestManagementClient({ username: "user", accessKey: "key" })).not.toThrow();
    });

    it("makeClient helper creates a client with mock fetch", () => {
      const client = makeClient();
      expect(client).toBeInstanceOf(TestManagementClient);
    });

    it("throws BrowserStackError when no credentials available", () => {
      const savedUser = env.BROWSERSTACK_USERNAME;
      const savedKey = env.BROWSERSTACK_ACCESS_KEY;
      const savedKeyAlt = env.BROWSERSTACK_KEY;
      delete env.BROWSERSTACK_USERNAME;
      delete env.BROWSERSTACK_ACCESS_KEY;
      delete env.BROWSERSTACK_KEY;
      try {
        expect(() => new TestManagementClient({ username: "", accessKey: "" })).toThrow(BrowserStackError);
      } finally {
        env.BROWSERSTACK_USERNAME = savedUser;
        env.BROWSERSTACK_ACCESS_KEY = savedKey;
        env.BROWSERSTACK_KEY = savedKeyAlt;
      }
    });
  });

  describe("Projects", () => {
    it("getProjects returns camelCase array of projects", async () => {
      const client = makeClient(PROJECTS_WIRE);
      const data = await client.getProjects();
      assert(Array.isArray(data));
      expect(data).toHaveLength(1);
      expect(data[0]!.identifier).toBe("PR-4");
      expect(data[0]!.name).toBe("API Tests");
    });

    it("getProjects throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getProjects()).rejects.toThrow(HttpError);
    });

    it("getProject returns single project with identifier", async () => {
      const client = makeClient(PROJECT_WIRE);
      const data = await client.getProject("PR-4");
      expect(data).toBeDefined();
      expect(data!.identifier).toBe("PR-4");
      expect(data!.name).toBe("API Tests");
    });

    it("getProject throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Project not found"));
      await expect(client.getProject("PR-9999")).rejects.toThrow(HttpError);
    });

    it("createProject returns project with identifier", async () => {
      const client = makeClient(CREATE_PROJECT_WIRE);
      const data = await client.createProject({ project: { name: "New Project", description: "created by test" } });
      expect(data).toBeDefined();
      expect(data!.identifier).toBe("PR-99");
      expect(data!.name).toBe("New Project");
    });
  });

  describe("Folders", () => {
    it("getFolders returns camelCase array of folders", async () => {
      const client = makeClient(FOLDERS_WIRE);
      const data = await client.getFolders("PR-4");
      assert(Array.isArray(data));
      expect(data).toHaveLength(1);
      expect(data[0]!.id).toBe(45480002);
      expect(data[0]!.name).toBe("mock-folder");
    });

    it("getFolders throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getFolders("PR-4")).rejects.toThrow(HttpError);
    });

    it("getFolder returns single folder with id", async () => {
      const client = makeClient(FOLDER_WIRE);
      const data = await client.getFolder("PR-4", 45480002);
      expect(data).toBeDefined();
      expect(data!.id).toBe(45480002);
      expect(data!.name).toBe("mock-folder");
    });

    it("getFolder throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Folder not found"));
      await expect(client.getFolder("PR-4", 99999999)).rejects.toThrow(HttpError);
    });

    it("createFolder returns new folder with id and name", async () => {
      const client = makeClient(CREATE_FOLDER_WIRE);
      const data = await client.createFolder("PR-4", { folder: { name: "new-folder", description: "created folder" } });
      expect(data).toBeDefined();
      expect(data!.id).toBe(45490001);
      expect(data!.name).toBe("new-folder");
    });
  });

  describe("TestCases", () => {
    it("getTestCases returns camelCase array of test cases", async () => {
      const client = makeClient(TEST_CASES_WIRE);
      const data = await client.getTestCases("PR-4");
      assert(Array.isArray(data));
      expect(data).toHaveLength(1);
      expect(data[0]!.identifier).toBe("TC-157");
      expect(data[0]!.name).toBe("mock-test-case");
    });

    it("getTestCases throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getTestCases("PR-4")).rejects.toThrow(HttpError);
    });

    it("getTestCases with folderId filter returns filtered results", async () => {
      const client = makeClient(TEST_CASES_WIRE);
      const data = await client.getTestCases("PR-4", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, 45480002);
      assert(Array.isArray(data));
      expect(data[0]!.folderId).toBe(45480002);
    });

    it("createTestCase returns new test case with identifier", async () => {
      const client = makeClient(CREATE_TEST_CASE_WIRE);
      const data = await client.createTestCase("PR-4", 45480002, { testCase: { name: "new-test-case" } });
      expect(data).toBeDefined();
      assert(data !== undefined);
      expect(data.identifier).toBe("TC-200");
      expect(data.name).toBe("new-test-case");
    });
  });

  describe("TestRuns", () => {
    it("getTestRuns returns camelCase array of test runs", async () => {
      const client = makeClient(TEST_RUNS_WIRE);
      const data = await client.getTestRuns("PR-4");
      assert(Array.isArray(data));
      expect(data).toHaveLength(1);
      expect(data[0]!.identifier).toBe("TR-1");
      expect(data[0]!.name).toBe("mock-test-run");
    });

    it("getTestRuns throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getTestRuns("PR-4")).rejects.toThrow(HttpError);
    });

    it("getTestRun returns single test run with identifier", async () => {
      const client = makeClient(TEST_RUN_WIRE);
      const data = await client.getTestRun("PR-4", "TR-1");
      expect(data).toBeDefined();
      expect(data!.identifier).toBe("TR-1");
      expect(data!.name).toBe("mock-test-run");
    });

    it("getTestRun throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Test run not found"));
      await expect(client.getTestRun("PR-4", "TR-9999")).rejects.toThrow(HttpError);
    });

    it("createTestRun returns new test run with identifier", async () => {
      const client = makeClient(CREATE_TEST_RUN_WIRE);
      const data = await client.createTestRun("PR-4", { testRun: { name: "new-test-run", includeAll: false } });
      expect(data).toBeDefined();
      expect(data!.identifier).toBe("TR-42");
      expect(data!.name).toBe("new-test-run");
    });
  });

  describe("TestPlans", () => {
    it("getTestPlans returns camelCase array of test plans", async () => {
      const client = makeClient(TEST_PLANS_WIRE);
      const data = await client.getTestPlans("PR-4");
      assert(Array.isArray(data));
      expect(data).toHaveLength(1);
      expect(data[0]!.identifier).toBe("TP-1");
      expect(data[0]!.name).toBe("mock-test-plan");
    });

    it("getTestPlan returns single test plan with identifier", async () => {
      const client = makeClient(TEST_PLAN_WIRE);
      const data = await client.getTestPlan("PR-4", "TP-1");
      expect(data).toBeDefined();
      expect(data!.identifier).toBe("TP-1");
      expect(data!.name).toBe("mock-test-plan");
    });
  });

  describe("Configurations", () => {
    it("getConfigurations returns camelCase array of configurations", async () => {
      const client = makeClient(CONFIGURATIONS_WIRE);
      const data = await client.getConfigurations();
      assert(Array.isArray(data));
      expect(data).toHaveLength(2);
      expect(data[0]!.id).toBe(1001);
      expect(data[0]!.name).toBe("Chrome on Windows");
      expect(data[1]!.id).toBe(1002);
    });

    it("getConfigurations throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getConfigurations()).rejects.toThrow(HttpError);
    });
  });

  describe("CustomFields", () => {
    it("getCustomFields returns camelCase array of custom fields", async () => {
      const client = makeClient(CUSTOM_FIELDS_WIRE);
      const data = await client.getCustomFields();
      assert(Array.isArray(data));
      expect(data).toHaveLength(2);
      expect(data[0]!.fieldName).toBe("automation_framework");
      expect(data[0]!.fieldType).toBe("string");
      expect(data[1]!.fieldName).toBe("sprint_number");
    });

    it("getCustomFields throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getCustomFields()).rejects.toThrow(HttpError);
    });
  });
});
