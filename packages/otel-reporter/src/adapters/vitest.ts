import { getTracer } from "../sdk.js";
import { incrementSpanCount } from "../flush.js";
import { SpanStatusCode, type Span } from "@opentelemetry/api";

export function activateVitest(): void {
  try {
    require.resolve("vitest", { paths: [process.cwd()] });
  } catch {
    return; // vitest not present — no-op
  }

  // Install as a Vitest reporter via the internal __vitest_reporters__ array.
  // This is a best-effort hook — if the array is not present, activation is skipped.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalAny = globalThis as any;
  const reporters: object[] = (globalAny.__vitest_reporters__ ??= []);

  let rootSpan: Span | null = null;
  const testSpans = new Map<string, Span>();

  reporters.push({
    onInit() {
      rootSpan = getTracer().startSpan("test.run");
      rootSpan.setAttribute("test.framework", "vitest");
    },
    onTestBegin(test: { name: string; suite?: { name: string }; file?: { name: string } }) {
      const span = getTracer().startSpan("test.case");
      span.setAttribute("test.name", test.name);
      span.setAttribute("test.suite", test.suite?.name ?? "");
      span.setAttribute("test.file", test.file?.name ?? "");
      testSpans.set(test.name, span);
    },
    onTestEnd(test: { name: string }, result: { state: string; duration?: number; error?: Error }) {
      const span = testSpans.get(test.name);
      if (!span) return;
      const status = result.state === "pass" ? "passed" : result.state === "skip" ? "skipped" : "failed";
      span.setAttribute("test.status", status);
      if (result.duration) span.setAttribute("test.duration_ms", result.duration);
      if (result.error) {
        span.setAttribute("test.error.message", result.error.message);
        span.setStatus({ code: SpanStatusCode.ERROR });
      }
      span.end();
      testSpans.delete(test.name);
      incrementSpanCount();
    },
    onFinished() {
      if (rootSpan) {
        rootSpan.end();
        incrementSpanCount();
      }
    },
  });
}
