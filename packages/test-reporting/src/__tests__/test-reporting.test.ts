import { describe, expect, test } from "vitest";
import { testReportingContext } from "./setup.ts";

const TIMEOUT = 30_000;
const LONG_TIMEOUT = 60_000;

describe("TestReportingClient", () => {

  describe("Projects", () => {
    test("getTestReportingProjects", async () => {
      const { client } = testReportingContext;
      const resp = await client.getTestReportingProjects();
      const projects = (resp as { projects?: unknown[] })?.projects ?? resp;
      expect(Array.isArray(projects)).toBe(true);
    }, TIMEOUT);
  });

  describe("Builds", () => {
    test("getTestReportingProjectBuilds", async () => {
      const { client, randomProjectId } = testReportingContext;
      const projectId = await randomProjectId();
      const resp = await client.getTestReportingProjectBuilds(projectId);
      const builds = (resp as { builds?: unknown[] })?.builds ?? resp;
      expect(Array.isArray(builds)).toBe(true);
    }, TIMEOUT);

    test.skip("getTestReportingBuild (paid feature)", async () => {
      const { client, randomProjectId, randomBuildUuid } = testReportingContext;
      const projectId = await randomProjectId();
      const buildUuid = await randomBuildUuid(projectId);
      const build = await client.getTestReportingBuild(buildUuid);
      expect(build).toBeDefined();
      expect((build as { buildId?: string })?.buildId ?? (build as { id?: string })?.id).toBeDefined();
    }, TIMEOUT);

    test.skip("getTestReportingLatestBuild (paid feature)", async () => {
      const { client, randomProjectId } = testReportingContext;
      const projectId = await randomProjectId();
      const resp = await client.getTestReportingProjects();
      const projects = (resp as { projects?: Array<{ name: string; id: number }> })?.projects ?? (resp as Array<{ name: string; id: number }>);
      const project = projects.find((p) => p.id === projectId);
      expect(project?.name).toBeDefined();
      const build = await client.getTestReportingLatestBuild(project!.name);
      expect(build).toBeDefined();
    }, TIMEOUT);

    test.skip("updateTestReportingBuild (paid feature)", async () => {
      const { client, randomProjectId, randomBuildUuid } = testReportingContext;
      const projectId = await randomProjectId();
      const buildUuid = await randomBuildUuid(projectId);
      const tag = `test-tag-${Date.now()}`;
      const result = await client.updateTestReportingBuild(buildUuid, { buildTags: [tag] });
      expect(result).toBeDefined();
    }, TIMEOUT);
  });

  describe("TestRuns", () => {
    test("getTestReportingTestRuns", async () => {
      const { client, randomProjectId, randomBuildUuid } = testReportingContext;
      const projectId = await randomProjectId();
      const buildUuid = await randomBuildUuid(projectId);
      const resp = await client.getTestReportingTestRuns(buildUuid);
      expect(resp).toBeDefined();
    }, TIMEOUT);
  });

  describe("SelfHealing", () => {
    test.skip("getTestReportingSelfHealingReport (paid feature)", async () => {
      const { client, randomProjectId, randomBuildUuid } = testReportingContext;
      const projectId = await randomProjectId();
      const buildUuid = await randomBuildUuid(projectId);
      const report = await client.getTestReportingSelfHealingReport(buildUuid);
      expect(report).toBeDefined();
    }, TIMEOUT);
  });

  describe("QualityGates", () => {
    test.skip("getTestReportingQualityGateStatus (paid feature)", async () => {
      const { client, randomProjectId, randomBuildUuid } = testReportingContext;
      const projectId = await randomProjectId();
      const buildUuid = await randomBuildUuid(projectId);
      const status = await client.getTestReportingQualityGateStatus(buildUuid);
      expect(status).toBeDefined();
    }, TIMEOUT);

    test.skip("getTestReportingQualityGateSettings (paid feature)", async () => {
      const { client, randomProjectId } = testReportingContext;
      const projectId = await randomProjectId();
      const resp = await client.getTestReportingProjects();
      const projects = (resp as { projects?: Array<{ name: string; id: number }> })?.projects ?? (resp as Array<{ name: string; id: number }>);
      const project = projects.find((p) => p.id === projectId);
      expect(project?.name).toBeDefined();
      const settings = await client.getTestReportingQualityGateSettings(project!.name);
      expect(settings).toBeDefined();
    }, TIMEOUT);

    test("createTestReportingQualityGateProfile + getTestReportingQualityGateProfile + updateTestReportingQualityGateProfile + toggleTestReportingQualityGateProfile + deleteTestReportingQualityGateProfile", async () => {
      const { client, randomProjectId } = testReportingContext;
      const projectId = await randomProjectId();
      const resp = await client.getTestReportingProjects();
      const projects = (resp as { projects?: Array<{ name: string; id: number }> })?.projects ?? (resp as Array<{ name: string; id: number }>);
      const project = projects.find((p) => p.id === projectId);
      const projectName = project!.name;

      const created = await client.createTestReportingQualityGateProfile(projectName, {
        name: `test-profile-${Date.now()}`,
        enabled: true,
        isGlobalProfile: false,
        rules: [],
      });
      expect((created as { uuid?: string })?.uuid).toBeDefined();
      const profileUuid = (created as { uuid: string }).uuid;

      const fetched = await client.getTestReportingQualityGateProfile(projectName, profileUuid);
      expect(fetched).toBeDefined();

      await client.updateTestReportingQualityGateProfile(projectName, profileUuid, {
        name: `test-profile-${Date.now()}-updated`,
        enabled: true,
        isGlobalProfile: false,
        rules: [],
      });

      await client.toggleTestReportingQualityGateProfile(projectName, profileUuid, { enabled: false });

      await client.deleteTestReportingQualityGateProfile(projectName, profileUuid);
    }, LONG_TIMEOUT);
  });

  describe("Ingestion", () => {
    test("startTestReportingBuild + startTestReportingTestRun + finishTestReportingTestRun + finishTestReportingBuild", async () => {
      const { client } = testReportingContext;
      const now = new Date().toISOString();

      const started = await client.startTestReportingBuild({
        name: `sdk-ingestion-test-${Date.now()}`,
        projectName: "sdk-integration-tests",
        startedAt: now,
        framework: { name: "vitest", version: "1.0.0" },
      });
      expect((started as { buildHashedId?: string })?.buildHashedId).toBeDefined();
      const buildHashedId = (started as { buildHashedId: string }).buildHashedId;

      const testStarted = await client.startTestReportingTestRun(buildHashedId, {
        name: "sdk test run",
        fileName: "test.ts",
        scopes: ["SDK", "Integration"],
        startedAt: now,
      });
      expect((testStarted as { uuid?: string })?.uuid).toBeDefined();
      const testRunUuid = (testStarted as { uuid: string }).uuid;

      await client.finishTestReportingTestRun(buildHashedId, testRunUuid, {
        result: "passed",
        finishedAt: new Date().toISOString(),
        fileName: "test.ts",
        scopes: ["SDK", "Integration"],
      });

      await client.finishTestReportingBuild(buildHashedId, {
        finishedAt: new Date().toISOString(),
      });
    }, LONG_TIMEOUT);
  });

  describe("Upload", () => {
    test("uploadTestReportingReport (JUnit)", async () => {
      const { client } = testReportingContext;
      const junitXml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites>
  <testsuite name="SDK test" tests="1" failures="0">
    <testcase name="sample test" classname="SdkTest" time="0.001"/>
  </testsuite>
</testsuites>`;
      const result = await client.uploadTestReportingReport({
        file: new Blob([junitXml], { type: "application/xml" }),
        fileName: "results.xml",
        projectName: "sdk-integration-tests",
        buildName: `sdk-junit-upload-${Date.now()}`,
        format: "junit",
      });
      expect(result).toBeDefined();
    }, LONG_TIMEOUT);
  });

});