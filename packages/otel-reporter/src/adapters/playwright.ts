import type { Reporter, Suite, TestCase, TestResult, TestStep } from "@playwright/test/reporter";
import { SpanStatusCode, type Span } from "@opentelemetry/api";
import { getTracer } from "../sdk.js";
import { incrementSpanCount, incrementLogCount } from "../flush.js";
import { readConfig } from "../config.js";

export class PlaywrightAdapter implements Reporter {
  private rootSpan: Span | null = null;
  private testSpans = new Map<string, Span>();
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private total = 0;

  onBegin(_config: unknown, _suite: unknown): void {
    this.rootSpan = getTracer().startSpan("test.run");
    this.rootSpan.setAttribute("test.framework", "playwright");
  }

  onTestBegin(test: TestCase, result: TestResult): void {
    if (!this.rootSpan) return;
    this.total++;
    const span = getTracer().startSpan("test.case");
    const titlePath = test.titlePath();
    span.setAttribute("test.name", test.title);
    span.setAttribute("test.suite", titlePath.slice(0, -1).join(" > "));
    span.setAttribute("test.file", test.location.file);
    span.setAttribute("test.retry", result.retry);
    this.testSpans.set(test.title + result.retry, span);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const key = test.title + result.retry;
    const span = this.testSpans.get(key);
    if (!span) return;

    span.setAttribute("test.status", result.status);
    span.setAttribute("test.duration_ms", result.duration);
    if (result.status === "passed") {
      this.passed++;
    } else if (result.status === "failed" || result.status === "timedOut") {
      this.failed++;
      if (result.errors && result.errors.length > 0) {
        span.setAttribute("test.error.message", result.errors[0].message ?? "");
        span.setAttribute("test.error.stack", result.errors[0].stack ?? "");
      }
      span.setStatus({ code: SpanStatusCode.ERROR });
    } else {
      this.skipped++;
    }

    const cfg = readConfig();
    for (const attachment of result.attachments) {
      if (attachment.body) {
        const sizeBytes = attachment.body.length;
        if (sizeBytes <= cfg.attachmentThresholdBytes) {
          span.addEvent("attachment", {
            "attachment.name": attachment.name,
            "attachment.content_type": attachment.contentType,
            "attachment.encoding": "base64",
            "attachment.body": attachment.body.toString("base64"),
          });
          incrementLogCount();
        } else {
          span.setAttribute("attachment.name", attachment.name);
          span.setAttribute("attachment.size_bytes", sizeBytes);
          span.setAttribute("attachment.url", attachment.path ?? "");
        }
      } else if (attachment.path) {
        span.addEvent("attachment", {
          "attachment.name": attachment.name,
          "attachment.content_type": attachment.contentType,
          "attachment.path": attachment.path,
        });
      }
    }

    span.end();
    this.testSpans.delete(key);
    incrementSpanCount();
  }

  onStepBegin(_test: TestCase, _result: TestResult, _step: TestStep): void {
    // Steps are not currently tracked as separate spans.
  }

  onEnd(_result: unknown): void {
    if (!this.rootSpan) return;
    this.rootSpan.setAttribute("test.total", this.total);
    this.rootSpan.setAttribute("test.passed", this.passed);
    this.rootSpan.setAttribute("test.failed", this.failed);
    this.rootSpan.setAttribute("test.skipped", this.skipped);
    this.rootSpan.end();
    incrementSpanCount();
  }
}
