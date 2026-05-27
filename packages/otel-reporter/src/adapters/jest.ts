import { getTracer } from "../sdk.js";
import { incrementSpanCount } from "../flush.js";
import { SpanStatusCode } from "@opentelemetry/api";

export function activateJest(): void {
  // Jest circus: if __jestCircusDispatch is on globalThis, patch it.
  // If jest-circus is not present or dispatch hook is not available, no-op.
  try {
    require.resolve("jest-circus/runner", { paths: [process.cwd()] });
  } catch {
    return; // jest-circus not present — no-op
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalAny = globalThis as any;
  const origDispatch = globalAny.__jestCircusDispatch;
  if (typeof origDispatch !== "function") return;

  const rootSpan = getTracer().startSpan("test.run");
  rootSpan.setAttribute("test.framework", "jest");

  globalAny.__jestCircusDispatch = async (
    event: { name: string; test?: { name: string; parent?: { name: string }; __otelSpan?: unknown }; error?: Error },
    state: unknown
  ) => {
    if (event.name === "test_started" && event.test) {
      const span = getTracer().startSpan("test.case");
      span.setAttribute("test.name", event.test.name);
      span.setAttribute("test.suite", event.test.parent?.name ?? "");
      event.test.__otelSpan = span;
    }

    if (event.name === "test_done" && event.test) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const span = event.test.__otelSpan as any;
      if (span) {
        const status = event.error ? "failed" : "passed";
        span.setAttribute("test.status", status);
        if (event.error) {
          span.setAttribute("test.error.message", event.error.message);
          span.setStatus({ code: SpanStatusCode.ERROR });
        }
        span.end();
        incrementSpanCount();
      }
    }

    if (event.name === "run_finish") {
      rootSpan.end();
      incrementSpanCount();
    }

    return origDispatch(event, state);
  };
}
