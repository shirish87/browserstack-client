import { describe, it, expect, beforeEach } from "vitest";
import { readConfig, parseBytes } from "../config.js";

describe("parseBytes", () => {
  it("parses MB", () => expect(parseBytes("5MB")).toBe(5 * 1024 * 1024));
  it("parses KB", () => expect(parseBytes("64KB")).toBe(64 * 1024));
  it("parses plain bytes", () => expect(parseBytes("1024")).toBe(1024));
  it("throws on invalid", () => expect(() => parseBytes("abc")).toThrow());
});

describe("readConfig", () => {
  beforeEach(() => {
    delete process.env.BROWSERSTACK_WATCH_ENDPOINT;
    delete process.env.BROWSERSTACK_WATCH_BATCH_SIZE;
    delete process.env.BROWSERSTACK_WATCH_BATCH_TIMEOUT;
    delete process.env.BROWSERSTACK_WATCH_EXPORT_TIMEOUT;
    delete process.env.BROWSERSTACK_WATCH_ATTACHMENT_THRESHOLD;
  });

  it("returns defaults when env is empty", () => {
    const cfg = readConfig();
    expect(cfg.batchSize).toBe(512);
    expect(cfg.batchTimeoutMs).toBe(5000);
    expect(cfg.exportTimeoutMs).toBe(10000);
    expect(cfg.attachmentThresholdBytes).toBe(5 * 1024 * 1024);
    expect(cfg.endpoint).toBe("");
  });

  it("reads BROWSERSTACK_WATCH_ENDPOINT", () => {
    process.env.BROWSERSTACK_WATCH_ENDPOINT = "https://otel.example.com";
    expect(readConfig().endpoint).toBe("https://otel.example.com");
  });

  it("reads BROWSERSTACK_WATCH_BATCH_SIZE", () => {
    process.env.BROWSERSTACK_WATCH_BATCH_SIZE = "256";
    expect(readConfig().batchSize).toBe(256);
  });

  it("reads BROWSERSTACK_WATCH_ATTACHMENT_THRESHOLD in MB", () => {
    process.env.BROWSERSTACK_WATCH_ATTACHMENT_THRESHOLD = "10MB";
    expect(readConfig().attachmentThresholdBytes).toBe(10 * 1024 * 1024);
  });
});
