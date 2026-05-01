import { describe, expect, it } from "vitest";
import { BrowserStackError, HttpError, env } from "@dot-slash/browserstack-core";
import { makeClient, makeErrorResponse } from "./setup.ts";
import { ScreenshotsClient } from "../client.ts";

// Fixture data (wire-format snake_case)
const BROWSERS = [
  { os: "Windows", os_version: "XP", browser: "opera", device: null, browser_version: "11.6", real_mobile: null },
  { os: "Windows", os_version: "11", browser: "chrome", device: null, browser_version: "147.0", real_mobile: null },
];

const CREATE_JOB = {
  job_id: "scjob123",
  state: "queue_d",
  screenshots: [
    {
      id: "sc1",
      state: "pending",
      url: "https://example.com",
      os: "Windows",
      os_version: "11",
      browser: "chrome",
      browser_version: "147.0",
      created_at: "2026-05-01T09:00:00.000Z",
      updated_at: "2026-05-01T09:00:01.000Z",
      thumb_url: null,
      image_url: null,
      aws_image_url: null,
    },
  ],
  callback_url: null,
  win_res: "1024x768",
  mac_res: null,
  quality: "compressed",
  wait_time: 5,
  orientation: null,
  browsers: [],
};

const JOB_DONE = {
  job_id: "scjob123",
  id: "scjob123",
  state: "done",
  screenshots: [
    {
      id: "sc1",
      state: "done",
      url: "https://example.com",
      os: "Windows",
      os_version: "11",
      browser: "chrome",
      browser_version: "147.0",
      created_at: "2026-05-01T09:00:00.000Z",
      updated_at: "2026-05-01T09:00:05.000Z",
      thumb_url: "https://s3.amazonaws.com/thumb.jpg",
      image_url: "https://s3.amazonaws.com/image.jpg",
      aws_image_url: "https://s3.amazonaws.com/image.jpg",
    },
  ],
  callback_url: null,
  win_res: "1024x768",
  mac_res: null,
  quality: "compressed",
  wait_time: 5,
  orientation: null,
  browsers: [],
};

describe("ScreenshotsClient", () => {
  describe("Credentials", () => {
    it("throws BrowserStackError when no credentials available", () => {
      const savedUser = env.BROWSERSTACK_USERNAME;
      const savedKey = env.BROWSERSTACK_ACCESS_KEY;
      const savedKeyAlt = env.BROWSERSTACK_KEY;
      delete env.BROWSERSTACK_USERNAME;
      delete env.BROWSERSTACK_ACCESS_KEY;
      delete env.BROWSERSTACK_KEY;
      try {
        expect(() => new ScreenshotsClient({ username: "", accessKey: "" })).toThrow(BrowserStackError);
      } finally {
        env.BROWSERSTACK_USERNAME = savedUser;
        env.BROWSERSTACK_ACCESS_KEY = savedKey;
        env.BROWSERSTACK_KEY = savedKeyAlt;
      }
    });
  });

  describe("getBrowsers", () => {
    it("returns array of browser objects", async () => {
      const client = makeClient(BROWSERS);
      const data = await client.getBrowsers();
      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(2);
      expect((data as typeof BROWSERS)[0].os).toBe("Windows");
      expect((data as typeof BROWSERS)[0].browser).toBe("opera");
      expect((data as typeof BROWSERS)[1].browser).toBe("chrome");
    });

    it("throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getBrowsers()).rejects.toThrow(HttpError);
    });
  });

  describe("createJob", () => {
    it("returns job with jobId and custom id field", async () => {
      const client = makeClient(CREATE_JOB);
      const data = await client.createJob({
        url: "https://example.com",
        browsers: [{ os: "Windows", osVersion: "11", browser: "chrome", browserVersion: "147.0", device: null }],
      });
      expect(data).toBeDefined();
      expect(data.jobId).toBe("scjob123");
      expect(data.id).toBe("scjob123");
    });

    it("throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(
        client.createJob({
          url: "https://example.com",
          browsers: [{ os: "Windows", osVersion: "11", browser: "chrome", browserVersion: "147.0", device: null }],
        })
      ).rejects.toThrow(HttpError);
    });
  });

  describe("getJob", () => {
    it("returns job with jobId, id, and state done", async () => {
      const client = makeClient(JOB_DONE);
      const data = await client.getJob("scjob123");
      expect(data).toBeDefined();
      expect(data.jobId).toBe("scjob123");
      expect(data.id).toBe("scjob123");
      expect(data.state).toBe("done");
    });

    it("throws HttpError on 404", async () => {
      const client = makeClient(makeErrorResponse(404, "Job not found"));
      await expect(client.getJob("notexist")).rejects.toThrow(HttpError);
    });
  });

  describe("trackJob", () => {
    it("resolves with completed screenshots when job is done", async () => {
      const client = makeClient(JOB_DONE);
      const screenshots = await client.trackJob("scjob123", undefined, undefined, 0);
      expect(screenshots).toBeInstanceOf(Array);
      expect(screenshots).toHaveLength(1);
      expect(screenshots[0].id).toBe("sc1");
      expect(screenshots[0].state).toBe("done");
    });

    it("calls onScreenshot callback for each completed screenshot", async () => {
      const client = makeClient(JOB_DONE);
      const seen: string[] = [];
      const screenshots = await client.trackJob(
        "scjob123",
        (sc) => { seen.push(sc.id); },
        undefined,
        0
      );
      expect(screenshots).toHaveLength(1);
      expect(seen).toContain("sc1");
    });
  });
});
