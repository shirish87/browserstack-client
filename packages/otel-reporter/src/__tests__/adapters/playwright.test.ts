import { describe, it, expect, vi, beforeEach } from "vitest";

// Stable mock tracer shared across all getTracer() calls
const mockSpanFactory = () => ({
  setAttribute: vi.fn(),
  setStatus: vi.fn(),
  addEvent: vi.fn(),
  end: vi.fn(),
});

const mockTracer = {
  startSpan: vi.fn(() => mockSpanFactory()),
};

// Mock OTEL tracer before importing the adapter
vi.mock("../../sdk.js", () => ({
  getTracer: vi.fn(() => mockTracer),
}));

vi.mock("../../flush.js", () => ({
  incrementSpanCount: vi.fn(),
  incrementLogCount: vi.fn(),
}));

vi.mock("../../config.js", () => ({
  readConfig: vi.fn(() => ({
    endpoint: "",
    batchSize: 512,
    batchTimeoutMs: 5000,
    exportTimeoutMs: 10000,
    attachmentThresholdBytes: 5 * 1024 * 1024,
  })),
}));

import { PlaywrightAdapter } from "../../adapters/playwright.js";
import * as flushModule from "../../flush.js";
import * as sdkModule from "../../sdk.js";

describe("PlaywrightAdapter", () => {
  let adapter: PlaywrightAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new PlaywrightAdapter();
  });

  it("starts root span on onBegin", () => {
    const mockTracer = sdkModule.getTracer();
    adapter.onBegin({} as any, {} as any);
    expect(mockTracer.startSpan).toHaveBeenCalledWith("test.run");
  });

  it("sets test.framework on root span", () => {
    const mockSpan = { setAttribute: vi.fn(), setStatus: vi.fn(), addEvent: vi.fn(), end: vi.fn() };
    vi.mocked(sdkModule.getTracer().startSpan).mockReturnValueOnce(mockSpan as any);
    adapter.onBegin({} as any, {} as any);
    expect(mockSpan.setAttribute).toHaveBeenCalledWith("test.framework", "playwright");
  });

  it("increments span count on onTestEnd", () => {
    adapter.onBegin({} as any, {} as any);
    const fakeTest = {
      title: "my test",
      titlePath: () => ["suite", "my test"],
      location: { file: "test.spec.ts", line: 1, column: 1 },
    } as any;
    const fakeResult = { retry: 0, status: "passed", duration: 123, attachments: [], errors: [] } as any;
    adapter.onTestBegin(fakeTest, fakeResult);
    adapter.onTestEnd(fakeTest, fakeResult);
    expect(flushModule.incrementSpanCount).toHaveBeenCalled();
  });

  it("sets test.status passed on passed test", () => {
    const mockRootSpan = { setAttribute: vi.fn(), setStatus: vi.fn(), addEvent: vi.fn(), end: vi.fn() };
    const mockTestSpan = { setAttribute: vi.fn(), setStatus: vi.fn(), addEvent: vi.fn(), end: vi.fn() };
    vi.mocked(sdkModule.getTracer().startSpan)
      .mockReturnValueOnce(mockRootSpan as any)
      .mockReturnValueOnce(mockTestSpan as any);
    adapter.onBegin({} as any, {} as any);
    const fakeTest = {
      title: "my test",
      titlePath: () => ["suite", "my test"],
      location: { file: "test.spec.ts", line: 1, column: 1 },
    } as any;
    const fakeResult = { retry: 0, status: "passed", duration: 123, attachments: [], errors: [] } as any;
    adapter.onTestBegin(fakeTest, fakeResult);
    adapter.onTestEnd(fakeTest, fakeResult);
    expect(mockTestSpan.setAttribute).toHaveBeenCalledWith("test.status", "passed");
  });

  it("ends root span and increments count on onEnd", () => {
    const mockRootSpan = { setAttribute: vi.fn(), setStatus: vi.fn(), addEvent: vi.fn(), end: vi.fn() };
    vi.mocked(sdkModule.getTracer().startSpan).mockReturnValueOnce(mockRootSpan as any);
    adapter.onBegin({} as any, {} as any);
    adapter.onEnd({} as any);
    expect(mockRootSpan.end).toHaveBeenCalled();
    expect(flushModule.incrementSpanCount).toHaveBeenCalled();
  });
});
