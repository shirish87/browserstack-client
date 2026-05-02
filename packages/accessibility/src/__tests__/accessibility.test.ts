import { describe, expect, it } from "vitest";
import { BrowserStackError, HttpError, env } from "@dot-slash/browserstack-core";
import { makeClient, makeErrorResponse } from "./setup.ts";
import { AccessibilityClient } from "../index.ts";

// Fixture data (wire-format snake_case)
// getWorkflowAnalyzerReports → WorkflowAnalyzerReportList: { reports: [...], pagination: {...} }
const WA_REPORTS_WIRE = {
  reports: [
    {
      id: 101,
      name: "Homepage scan",
      status: "completed",
      wcagVersion: "2.1",
      scanType: "workflow",
      issueSummary: { issueCount: 5, pageCount: 1, componentCount: 3 },
    },
    {
      id: 102,
      name: "Checkout scan",
      status: "completed",
      wcagVersion: "2.1",
      scanType: "workflow",
      issueSummary: { issueCount: 2, pageCount: 1, componentCount: 1 },
    },
  ],
  pagination: { has_next: false },
};

// getWorkflowAnalyzerReportSummary → WorkflowAnalyzerReportSummary
const WA_REPORT_SUMMARY_WIRE = {
  id: 101,
  name: "Homepage scan",
  status: "completed",
  wcagVersion: "2.1",
  scanType: "workflow",
  time: "2026-04-20T10:00:00.000Z",
  issueSummary: { issueCount: 5, pageCount: 1, componentCount: 3 },
  scoreData: { score: 82 },
};

// getAssistedTestReports → AssistedTestReportList: { reports: [...], pagination: {...} }
const ASSISTED_REPORTS_WIRE = {
  reports: [
    {
      id: 201,
      name: "Manual login flow",
      status: "completed",
      wcagVersion: "2.1",
      assistedTestType: "guided",
      issueSummary: { issueCount: 3, pageCount: 1, componentCount: 2 },
    },
  ],
  pagination: { has_next: false },
};

// getWebsiteScannerScans → WebsiteScannerScanList: { scans: [...], pagination: {...} }
const WEBSITE_SCANS_WIRE = {
  scans: [
    {
      id: 301,
      name: "Full site crawl",
      status: "completed",
      scan_url: "https://example.com",
      wcagVersion: "2.1",
      pageCount: 12,
      active: true,
      recurring: false,
    },
    {
      id: 302,
      name: "Blog crawl",
      status: "running",
      scan_url: "https://example.com/blog",
      wcagVersion: "2.1",
      pageCount: 5,
      active: true,
      recurring: false,
    },
  ],
  pagination: { has_next: false },
};

// getAutomatedTestProjects → AutomatedTestsProjectList: { projects: [...], pagination: {...} }
const AUTOMATED_PROJECTS_WIRE = {
  projects: [
    {
      id: 401,
      name: "Selenium Suite",
      createdAt: "2026-03-01T08:00:00.000Z",
    },
    {
      id: 402,
      name: "Cypress Suite",
      createdAt: "2026-03-15T09:00:00.000Z",
    },
  ],
  pagination: { has_next: false },
};

// getAutomatedTestBuilds → AutomatedTestsBuildList: { builds: [...], pagination: {...} }
const AUTOMATED_BUILDS_WIRE = {
  builds: [
    {
      id: 501,
      name: "Build #1",
      status: "passed",
      projectId: 401,
      thBuildId: "abc-build-id-001",
      startedAt: "2026-04-25T10:00:00.000Z",
      wcagVersion: "2.1",
    },
    {
      id: 502,
      name: "Build #2",
      status: "passed",
      projectId: 401,
      thBuildId: "abc-build-id-002",
      startedAt: "2026-04-26T11:00:00.000Z",
      wcagVersion: "2.1",
    },
  ],
  pagination: { has_next: false },
};

describe("AccessibilityClient", () => {
  describe("Credentials", () => {
    it("accepts valid username and accessKey", () => {
      expect(() => new AccessibilityClient({ username: "user", accessKey: "key" })).not.toThrow();
    });

    it("makeClient helper creates a client with mock fetch", () => {
      const client = makeClient();
      expect(client).toBeInstanceOf(AccessibilityClient);
    });

    it("throws BrowserStackError when no credentials available", () => {
      const savedUser = env.BROWSERSTACK_USERNAME;
      const savedKey = env.BROWSERSTACK_ACCESS_KEY;
      const savedKeyAlt = env.BROWSERSTACK_KEY;
      delete env.BROWSERSTACK_USERNAME;
      delete env.BROWSERSTACK_ACCESS_KEY;
      delete env.BROWSERSTACK_KEY;
      try {
        expect(() => new AccessibilityClient({ username: "", accessKey: "" })).toThrow(BrowserStackError);
      } finally {
        env.BROWSERSTACK_USERNAME = savedUser;
        env.BROWSERSTACK_ACCESS_KEY = savedKey;
        env.BROWSERSTACK_KEY = savedKeyAlt;
      }
    });
  });

  describe("Workflow Analyzer", () => {
    it("getWorkflowAnalyzerReports returns report list with reports array", async () => {
      const client = makeClient(WA_REPORTS_WIRE);
      const data = await client.getWorkflowAnalyzerReports();
      expect(data).toBeDefined();
      expect(data.reports).toBeInstanceOf(Array);
      expect(data.reports).toHaveLength(2);
      expect(data.reports![0].id).toBe(101);
      expect(data.reports![0].name).toBe("Homepage scan");
      expect(data.reports![0].status).toBe("completed");
      expect(data.reports![1].id).toBe(102);
    });

    it("getWorkflowAnalyzerReports throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getWorkflowAnalyzerReports()).rejects.toThrow(HttpError);
    });

    it("getWorkflowAnalyzerReports throws HttpError on 403 (plan restriction)", async () => {
      const client = makeClient(makeErrorResponse(403, "Access denied: plan restriction"));
      await expect(client.getWorkflowAnalyzerReports()).rejects.toThrow(HttpError);
    });

    it("getWorkflowAnalyzerReportSummary returns report summary", async () => {
      const client = makeClient(WA_REPORT_SUMMARY_WIRE);
      const data = await client.getWorkflowAnalyzerReportSummary(101);
      expect(data).toBeDefined();
      expect(data.id).toBe(101);
      expect(data.name).toBe("Homepage scan");
      expect(data.status).toBe("completed");
      expect(data.wcagVersion).toBe("2.1");
      expect(data.issueSummary).toBeDefined();
      expect(data.issueSummary!.issueCount).toBe(5);
    });

    it("getWorkflowAnalyzerReportSummary throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Report not found"));
      await expect(client.getWorkflowAnalyzerReportSummary(99999)).rejects.toThrow(HttpError);
    });
  });

  describe("Assisted Tests", () => {
    it("getAssistedTestReports returns report list with reports array", async () => {
      const client = makeClient(ASSISTED_REPORTS_WIRE);
      const data = await client.getAssistedTestReports();
      expect(data).toBeDefined();
      expect(data.reports).toBeInstanceOf(Array);
      expect(data.reports).toHaveLength(1);
      expect(data.reports![0].id).toBe(201);
      expect(data.reports![0].name).toBe("Manual login flow");
      expect(data.reports![0].status).toBe("completed");
    });

    it("getAssistedTestReports throws HttpError on 403 (plan restriction)", async () => {
      const client = makeClient(makeErrorResponse(403, "Access denied: plan restriction"));
      await expect(client.getAssistedTestReports()).rejects.toThrow(HttpError);
    });
  });

  describe("Website Scanner", () => {
    it("getWebsiteScannerScans returns scan list with scans array", async () => {
      const client = makeClient(WEBSITE_SCANS_WIRE);
      const data = await client.getWebsiteScannerScans();
      expect(data).toBeDefined();
      expect(data.scans).toBeInstanceOf(Array);
      expect(data.scans).toHaveLength(2);
      expect(data.scans![0].id).toBe(301);
      expect(data.scans![0].name).toBe("Full site crawl");
      expect(data.scans![0].status).toBe("completed");
      expect(data.scans![1].status).toBe("running");
    });

    it("getWebsiteScannerScans throws HttpError on 403 (plan restriction)", async () => {
      const client = makeClient(makeErrorResponse(403, "Access denied: plan restriction"));
      await expect(client.getWebsiteScannerScans()).rejects.toThrow(HttpError);
    });
  });

  describe("Automated Tests", () => {
    it("getAutomatedTestProjects returns project list with projects array", async () => {
      const client = makeClient(AUTOMATED_PROJECTS_WIRE);
      const data = await client.getAutomatedTestProjects();
      expect(data).toBeDefined();
      expect(data.projects).toBeInstanceOf(Array);
      expect(data.projects).toHaveLength(2);
      expect(data.projects![0].id).toBe(401);
      expect(data.projects![0].name).toBe("Selenium Suite");
      expect(data.projects![1].id).toBe(402);
      expect(data.projects![1].name).toBe("Cypress Suite");
    });

    it("getAutomatedTestProjects throws HttpError on 403 (plan restriction)", async () => {
      const client = makeClient(makeErrorResponse(403, "Access denied: plan restriction"));
      await expect(client.getAutomatedTestProjects()).rejects.toThrow(HttpError);
    });

    it("getAutomatedTestBuilds returns build list with builds array", async () => {
      const client = makeClient(AUTOMATED_BUILDS_WIRE);
      const data = await client.getAutomatedTestBuilds();
      expect(data).toBeDefined();
      expect(data.builds).toBeInstanceOf(Array);
      expect(data.builds).toHaveLength(2);
      expect(data.builds![0].id).toBe(501);
      expect(data.builds![0].name).toBe("Build #1");
      expect(data.builds![0].status).toBe("passed");
      expect(data.builds![0].projectId).toBe(401);
      expect(data.builds![1].id).toBe(502);
    });
  });
});
