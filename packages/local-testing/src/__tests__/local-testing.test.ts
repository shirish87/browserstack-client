import { describe, expect, it } from "vitest";
import { BrowserStackError, HttpError, env } from "@dot-slash/browserstack-core";
import { makeClient, makeErrorResponse } from "./setup.ts";
import { LocalTestingClient } from "../client.ts";

// Fixture data — fields match LocalBinaryInstance schema (already camelCase in spec)
const INSTANCES = {
  api_version: "v1",
  meta_data: { params: { controller: "local/v1/local_api", action: "list", format: "json" } },
  instances: [
    { id: "lt-inst-abc123", email: "user@example.com", lastActiveOn: "2026-05-01T09:00:00.000Z", startTime: "2026-05-01T09:00:00.000Z", localIdentifier: "ident-abc123" },
    { id: "lt-inst-def456", email: "user@example.com", lastActiveOn: "2026-05-01T08:00:00.000Z", startTime: "2026-05-01T08:00:00.000Z", localIdentifier: "ident-def456" },
  ],
};

const INSTANCE = {
  api_version: "v1",
  instances: [
    { id: "lt-inst-abc123", email: "user@example.com", lastActiveOn: "2026-05-01T09:00:00.000Z", startTime: "2026-05-01T09:00:00.000Z", localIdentifier: "ident-abc123" },
  ],
};

const DISCONNECT = { message: "BrowserStackLocal disconnected successfully.", api_version: "v1" };

describe("LocalTestingClient", () => {
  describe("Credentials", () => {
    it("accepts valid accessKey without username", () => {
      expect(() => new LocalTestingClient({ accessKey: "k" })).not.toThrow();
    });

    it("makeClient helper creates a client with mock fetch", () => {
      const client = makeClient();
      expect(client).toBeInstanceOf(LocalTestingClient);
    });

    it("throws BrowserStackError when no accessKey available", () => {
      const savedKey = env.BROWSERSTACK_ACCESS_KEY;
      const savedKeyAlt = env.BROWSERSTACK_KEY;
      delete env.BROWSERSTACK_ACCESS_KEY;
      delete env.BROWSERSTACK_KEY;
      try {
        expect(() => new LocalTestingClient({ accessKey: "" })).toThrow(BrowserStackError);
      } finally {
        env.BROWSERSTACK_ACCESS_KEY = savedKey;
        env.BROWSERSTACK_KEY = savedKeyAlt;
      }
    });
  });

  describe("getBinaryInstances", () => {
    it("returns array of instances with id and localIdentifier fields", async () => {
      const client = makeClient(INSTANCES);
      const data = await client.getBinaryInstances();
      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(2);
      expect(data[0].id).toBe("lt-inst-abc123");
      expect(data[0].localIdentifier).toBe("ident-abc123");
      expect(data[1].id).toBe("lt-inst-def456");
      expect(data[1].localIdentifier).toBe("ident-def456");
    });

    it("returns empty array when no instances", async () => {
      const client = makeClient({ api_version: "v1", meta_data: {}, instances: [] });
      const data = await client.getBinaryInstances();
      expect(data).toBeInstanceOf(Array);
      expect(data).toHaveLength(0);
    });

    it("throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getBinaryInstances()).rejects.toThrow(HttpError);
    });
  });

  describe("getBinaryInstance", () => {
    it("returns single instance for given id", async () => {
      const client = makeClient(INSTANCE);
      const data = await client.getBinaryInstance("lt-inst-abc123");
      expect(data).toBeDefined();
      expect(data.id).toBe("lt-inst-abc123");
      expect(data.localIdentifier).toBe("ident-abc123");
    });

    it("throws BrowserStackError when instances array is empty", async () => {
      const client = makeClient({ api_version: "v1", instances: [] });
      await expect(client.getBinaryInstance("lt-inst-missing")).rejects.toThrow(BrowserStackError);
    });

    it("throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.getBinaryInstance("lt-inst-abc123")).rejects.toThrow(HttpError);
    });
  });

  describe("disconnectBinaryInstance", () => {
    it("returns message string containing 'disconnected'", async () => {
      const client = makeClient(DISCONNECT);
      const data = await client.disconnectBinaryInstance("lt-inst-abc123");
      expect(typeof data).toBe("string");
      expect(data).toContain("disconnected");
    });

    it("throws HttpError on 401", async () => {
      const client = makeClient(makeErrorResponse(401, "Unauthorized"));
      await expect(client.disconnectBinaryInstance("lt-inst-abc123")).rejects.toThrow(HttpError);
    });
  });
});
