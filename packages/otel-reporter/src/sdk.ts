import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { Resource } from "@opentelemetry/resources";
import { trace, type Tracer } from "@opentelemetry/api";
import type { OtelConfig } from "./config.js";

let _sdk: NodeSDK | null = null;

export function initSDK(cfg: OtelConfig): void {
  if (_sdk) return; // idempotent

  const resource = new Resource({ "service.name": "browserstack-otel-reporter" });

  const traceExporter = new OTLPTraceExporter({
    url: cfg.endpoint ? `${cfg.endpoint}/v1/traces` : undefined,
    timeoutMillis: cfg.exportTimeoutMs,
  });

  const logExporter = new OTLPLogExporter({
    url: cfg.endpoint ? `${cfg.endpoint}/v1/logs` : undefined,
    timeoutMillis: cfg.exportTimeoutMs,
  });

  _sdk = new NodeSDK({
    resource,
    spanProcessor: new BatchSpanProcessor(traceExporter, {
      maxExportBatchSize: cfg.batchSize,
      scheduledDelayMillis: cfg.batchTimeoutMs,
      exportTimeoutMillis: cfg.exportTimeoutMs,
    }),
    logRecordProcessor: new BatchLogRecordProcessor(logExporter, {
      maxExportBatchSize: cfg.batchSize,
      scheduledDelayMillis: cfg.batchTimeoutMs,
      exportTimeoutMillis: cfg.exportTimeoutMs,
    }),
  });

  _sdk.start();
}

export function getTracer(): Tracer {
  return trace.getTracer("browserstack-otel-reporter");
}

export async function shutdownSDK(): Promise<void> {
  if (_sdk) {
    await _sdk.shutdown();
    _sdk = null;
  }
}
