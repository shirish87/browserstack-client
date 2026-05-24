import { describe, expect, it } from "vitest";
import { BrowserStackError, HttpError, env } from "@dot-slash/browserstack-core";
import { makeClient, makeErrorResponse } from "./setup.ts";
import { WebsiteScannerClient } from "../index.ts";

const AUTH_CONFIGS_WIRE = {
  success: true,
  data: { auth_configs: [{ id: 1, name: "Login config" }, { id: 2, name: "Basic auth" }] },
};

const SCANS_WIRE = {
  success: true,
  data: {
    projects: [
      { id: 101, name: "Full site crawl", active: true, recurring: false, isRunning: false },
      { id: 102, name: "Blog crawl", active: true, recurring: true, isRunning: true },
    ],
    info: { total: 2 },
  },
};

const SCAN_WIRE = {
  success: true,
  data: { id: 101, name: "Full site crawl", active: true, recurring: false, isRunning: false },
};

const TRIGGER_RUN_WIRE = { success: true, data: { reportId: 501 } };

const SCAN_RUNS_WIRE = {
  success: true,
  data: { total: 2, page: 1 },
};

const RUN_STATUS_WIRE = {
  success: true,
  status: "completed",
};

describe("WebsiteScannerClient", () => {
  describe("Credentials", () => {
    it("accepts valid username and accessKey", () => {
      expect(() => new WebsiteScannerClient({ username: "user", accessKey: "key" })).not.toThrow();
    });

    it("makeClient helper creates a client with mock fetch", () => {
      expect(makeClient()).toBeInstanceOf(WebsiteScannerClient);
    });

    it("throws BrowserStackError when no credentials available", () => {
      const savedUser = env.BROWSERSTACK_USERNAME;
      const savedKey = env.BROWSERSTACK_ACCESS_KEY;
      const savedKeyAlt = env.BROWSERSTACK_KEY;
      delete env.BROWSERSTACK_USERNAME;
      delete env.BROWSERSTACK_ACCESS_KEY;
      delete env.BROWSERSTACK_KEY;
      try {
        expect(() => new WebsiteScannerClient({ username: "", accessKey: "" })).toThrow(BrowserStackError);
      } finally {
        env.BROWSERSTACK_USERNAME = savedUser;
        env.BROWSERSTACK_ACCESS_KEY = savedKey;
        env.BROWSERSTACK_KEY = savedKeyAlt;
      }
    });
  });

  describe("Auth Configs", () => {
    it("listWebsiteScannerAuthConfigs returns auth config list", async () => {
      const client = makeClient(AUTH_CONFIGS_WIRE);
      const data = await client.listWebsiteScannerAuthConfigs();
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it("listWebsiteScannerAuthConfigs throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.listWebsiteScannerAuthConfigs()).rejects.toThrow(HttpError);
    });
  });

  describe("Scans", () => {
    it("listWebsiteScannerScans returns scan list", async () => {
      const client = makeClient(SCANS_WIRE);
      const data = await client.listWebsiteScannerScans();
      expect(data.success).toBe(true);
      expect(data.data!.projects).toHaveLength(2);
      expect(data.data!.projects![0].id).toBe(101);
      expect(data.data!.projects![1].isRunning).toBe(true);
    });

    it("listWebsiteScannerScans throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.listWebsiteScannerScans()).rejects.toThrow(HttpError);
    });

    it("getWebsiteScannerScan returns a single scan", async () => {
      const client = makeClient(SCAN_WIRE);
      const data = await client.getWebsiteScannerScan(101);
      expect(data.success).toBe(true);
      expect(data.data!.id).toBe(101);
      expect(data.data!.name).toBe("Full site crawl");
    });

    it("getWebsiteScannerScan throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Not found"));
      await expect(client.getWebsiteScannerScan(99999)).rejects.toThrow(HttpError);
    });
  });

  describe("Scan Runs", () => {
    it("triggerWebsiteScannerScanRun returns trigger result", async () => {
      const client = makeClient(TRIGGER_RUN_WIRE);
      const data = await client.triggerWebsiteScannerScanRun(101);
      expect(data.success).toBe(true);
    });

    it("triggerWebsiteScannerScanRun throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Scan not found"));
      await expect(client.triggerWebsiteScannerScanRun(99999)).rejects.toThrow(HttpError);
    });

    it("listWebsiteScannerScanRuns returns run list", async () => {
      const client = makeClient(SCAN_RUNS_WIRE);
      const data = await client.listWebsiteScannerScanRuns(101);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    it("getWebsiteScannerScanRunStatus returns run status", async () => {
      const client = makeClient(RUN_STATUS_WIRE);
      const data = await client.getWebsiteScannerScanRunStatus(101, 501);
      expect(data.success).toBe(true);
      expect(data.status).toBe("completed");
    });

    it("getWebsiteScannerScanRunStatus throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Run not found"));
      await expect(client.getWebsiteScannerScanRunStatus(101, 99999)).rejects.toThrow(HttpError);
    });
  });
});
