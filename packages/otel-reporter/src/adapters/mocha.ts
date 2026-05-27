import { getTracer } from "../sdk.js";
import { incrementSpanCount } from "../flush.js";
import { SpanStatusCode, type Span } from "@opentelemetry/api";

export function activateMocha(): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let MochaModule: any;
  try {
    MochaModule = require(require.resolve("mocha", { paths: [process.cwd()] }));
  } catch {
    return; // mocha not present — no-op
  }

  const runner = MochaModule.Runner?.prototype ?? MochaModule.default?.Runner?.prototype;
  if (!runner) return;

  const originalRun = runner.run as (...args: unknown[]) => unknown;
  let rootSpan: Span | null = null;
  const testSpans = new Map<string, Span>();

  runner.run = function (...args: unknown[]) {
    rootSpan = getTracer().startSpan("test.run");
    rootSpan.setAttribute("test.framework", "mocha");

    this.on("test", (test: { fullTitle(): string; file?: string }) => {
      const span = getTracer().startSpan("test.case");
      span.setAttribute("test.name", test.fullTitle());
      span.setAttribute("test.file", test.file ?? "");
      testSpans.set(test.fullTitle(), span);
    });

    this.on("pass", (test: { fullTitle(): string }) => {
      const span = testSpans.get(test.fullTitle());
      if (span) {
        span.setAttribute("test.status", "passed");
        span.end();
        testSpans.delete(test.fullTitle());
        incrementSpanCount();
      }
    });

    this.on("fail", (test: { fullTitle(): string }, err: Error) => {
      const span = testSpans.get(test.fullTitle());
      if (span) {
        span.setAttribute("test.status", "failed");
        span.setAttribute("test.error.message", err.message);
        span.setAttribute("test.error.stack", err.stack ?? "");
        span.setStatus({ code: SpanStatusCode.ERROR });
        span.end();
        testSpans.delete(test.fullTitle());
        incrementSpanCount();
      }
    });

    this.on("pending", (test: { fullTitle(): string }) => {
      const span = testSpans.get(test.fullTitle());
      if (span) {
        span.setAttribute("test.status", "skipped");
        span.end();
        testSpans.delete(test.fullTitle());
        incrementSpanCount();
      }
    });

    this.on("end", () => {
      if (rootSpan) {
        rootSpan.end();
        incrementSpanCount();
      }
    });

    return originalRun.apply(this, args);
  };
}
