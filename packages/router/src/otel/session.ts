import type { LiveEvent, LiveLog } from "./parse.ts";
import {
  EXIT_FAILURE,
  EXIT_OK,
  EXIT_TIMEOUT,
  type OtelTimeouts,
  type PairCounts,
  type PairKind,
  type TestResult,
  type TraFailure,
  type TraIngestClient,
  type TraLog,
  type TraceError,
  type TraceSnapshot,
} from "./types.ts";

type CloseReason = "end" | "timeout" | "parent-end" | "shutdown" | "idle";

interface Tracked {
  spanId: string;
  parentSpanId?: string;
  kind: PairKind;
  logKind: LiveEvent["logKind"];
  name: string;
  fileName: string;
  scopes: string[];
  hookType: string;
  location?: string;
  tags?: string[];
  projectName: string;
  buildName: string;
  frameworkName: string;
  frameworkVersion: string;
  startMs: number;
  endMs: number;
  openedAtMs: number;
  state: "pending" | "open" | "closed";
  traId?: string;
  synthetic: boolean;
  finishAttempts: number;
  deferredClose: boolean;
  autocloseNoted: boolean;
  closeReason?: CloseReason;
  result?: TestResult;
  exception?: { error: string; backtrace?: string };
  exitCode?: number;
  countedStart: boolean;
}

interface TraceState {
  traceId: string;
  spans: Map<string, Tracked>;
  buildHashedId: string | null;
  buildOwnerSpanId: string | null;
  syntheticBuild: boolean;
  closed: boolean;
  sawFailure: boolean;
  sawTimeout: boolean;
  sawImbalance: boolean;
  explicitExitCode?: number;
  abandoned: boolean;
  lastActivityAt: number;
  errors: TraceError[];
  pairs: Record<PairKind, PairCounts>;
  meta?: LiveEvent;
}

const PAIR_KINDS: PairKind[] = ["build", "test", "hook", "step"];
const MAX_DEPTH = 32;
const MAX_RETAINED_TRACES = 256;
const MAX_FINISH_PASSES = 1000;
const MAX_ERROR_NOTES = 100;
const MAX_RECORDED_ERRORS = 20;
const MAX_MESSAGE_CHARS = 10_000;

function clip(value: string, max: number): string {
  return value.length <= max ? value : value.slice(0, max);
}

function emptyPairs(): Record<PairKind, PairCounts> {
  return {
    build: { started: 0, finished: 0 },
    test: { started: 0, finished: 0 },
    hook: { started: 0, finished: 0 },
    step: { started: 0, finished: 0 },
  };
}

function iso(ms: number): string {
  return new Date(ms).toISOString();
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export class OtelSessionStore {
  private readonly traces = new Map<string, TraceState>();
  private chain: Promise<unknown> = Promise.resolve();

  constructor(
    private readonly client: TraIngestClient,
    private readonly timeouts: OtelTimeouts,
    private readonly now: () => number,
  ) {}

  enqueue<T>(work: () => Promise<T>): Promise<T> {
    const run = this.chain.then(work, work);
    this.chain = run.then(() => undefined, () => undefined);
    return run;
  }

  apply(events: LiveEvent[], logs: LiveLog[], now = this.now()): Promise<TraceSnapshot[]> {
    return this.enqueue(async () => {
      const touched = new Set<string>();
      for (const event of events) {
        if (event.phase !== "start") continue;
        touched.add(event.traceId);
        await this.applyEvent(event, now);
      }
      for (const log of logs) {
        touched.add(log.traceId);
        await this.applyLog(log);
      }
      for (const event of events) {
        if (event.phase !== "end") continue;
        touched.add(event.traceId);
        await this.applyEvent(event, now);
      }
      return [...touched].map((traceId) => this.snapshot(this.trace(traceId)));
    });
  }

  sweep(now = this.now()): Promise<TraceSnapshot[]> {
    return this.enqueue(async () => {
      for (const trace of this.traces.values()) {
        if (trace.closed) continue;
        await this.sweepTrace(trace, now);
      }
      return [...this.traces.values()].map((trace) => this.snapshot(trace));
    });
  }

  snapshots(traceId?: string | null): Promise<TraceSnapshot[]> {
    return this.enqueue(async () => {
      if (traceId) {
        const trace = this.traces.get(traceId);
        return trace ? [this.snapshot(trace)] : [];
      }
      return [...this.traces.values()].map((trace) => this.snapshot(trace));
    });
  }

  shutdown(now = this.now()): Promise<TraceSnapshot[]> {
    return this.enqueue(async () => {
      for (const trace of this.traces.values()) {
        if (trace.closed) continue;
        await this.finishTrace(trace, "shutdown", now);
      }
      return [...this.traces.values()].map((trace) => this.snapshot(trace));
    });
  }

  private trace(traceId: string, now = this.now()): TraceState {
    let trace = this.traces.get(traceId);
    if (!trace) {
      this.evictClosed();
      trace = {
        traceId,
        spans: new Map(),
        buildHashedId: null,
        buildOwnerSpanId: null,
        syntheticBuild: false,
        closed: false,
        sawFailure: false,
        sawTimeout: false,
        sawImbalance: false,
        abandoned: false,
        lastActivityAt: now,
        errors: [],
        pairs: emptyPairs(),
      };
      this.traces.set(traceId, trace);
    }
    return trace;
  }

  private evictClosed(): void {
    if (this.traces.size < MAX_RETAINED_TRACES) return;
    for (const [id, candidate] of this.traces) {
      if (this.traces.size < MAX_RETAINED_TRACES) return;
      if (candidate.closed) this.traces.delete(id);
    }
  }

  private async applyEvent(event: LiveEvent, now: number): Promise<void> {
    const trace = this.trace(event.traceId, now);
    trace.lastActivityAt = now;
    trace.meta = event;
    if (event.phase === "start") {
      await this.openSpan(trace, event, now, false);
      return;
    }
    await this.endSpan(trace, event, now);
  }

  private async openSpan(trace: TraceState, event: LiveEvent, now: number, synthetic: boolean): Promise<boolean> {
    const existing = trace.spans.get(event.spanId);
    if (existing) return existing.state !== "closed" || existing.countedStart;
    if (trace.closed && event.kind === "build") return false;

    const tracked = this.track(event, now, synthetic);
    trace.spans.set(tracked.spanId, tracked);

    if (event.kind === "build" && trace.buildHashedId && trace.buildOwnerSpanId) {
      if (trace.syntheticBuild) {
        const previous = trace.spans.get(trace.buildOwnerSpanId);
        if (previous && previous.state !== "closed") {
          previous.state = "closed";
          previous.closeReason = "end";
        }
        trace.buildOwnerSpanId = tracked.spanId;
        tracked.state = "open";
        tracked.traId = trace.buildHashedId;
        tracked.countedStart = true;
        trace.syntheticBuild = false;
        return true;
      }
      tracked.state = "closed";
      tracked.closeReason = "end";
      this.note(trace, {
        code: "duplicate-build",
        message: `Trace ${trace.traceId} already has build ${trace.buildHashedId}; span "${event.name}" was not started again`,
        spanId: event.spanId,
        exitCode: EXIT_FAILURE,
      });
      trace.sawImbalance = true;
      return true;
    }

    if ((event.kind === "test" || event.kind === "hook" || event.kind === "step") && !trace.buildHashedId) {
      tracked.state = "pending";
      return true;
    }

    return this.startOnTRA(trace, tracked);
  }

  private track(event: LiveEvent, now: number, synthetic: boolean): Tracked {
    return {
      spanId: event.spanId,
      parentSpanId: event.parentSpanId,
      kind: event.kind,
      logKind: event.logKind,
      name: event.kind === "build" ? event.buildName : event.name,
      fileName: event.fileName,
      scopes: event.scopes,
      hookType: event.hookType,
      location: event.location,
      tags: event.tags,
      projectName: event.projectName,
      buildName: event.buildName,
      frameworkName: event.frameworkName,
      frameworkVersion: event.frameworkVersion,
      startMs: event.startMs > 0 ? event.startMs : now,
      endMs: event.endMs,
      openedAtMs: now,
      state: "pending",
      synthetic,
      finishAttempts: 0,
      deferredClose: false,
      autocloseNoted: false,
      result: event.result,
      exception: event.exception,
      exitCode: event.exitCode,
      countedStart: false,
    };
  }

  private async startOnTRA(trace: TraceState, span: Tracked): Promise<boolean> {
    if (span.countedStart) {
      span.state = "open";
      return true;
    }
    if (span.kind !== "build" && !trace.buildHashedId) {
      const ensured = await this.ensureBuild(trace, span);
      if (!ensured) return false;
    }
    if (span.countedStart) {
      span.state = "open";
      return true;
    }
    try {
      if (span.kind === "build") {
        const startedAt = iso(span.startMs);
        const response = await this.client.startBuild({
          name: span.buildName || span.name,
          projectName: span.projectName,
          startedAt,
          framework: { name: span.frameworkName, version: span.frameworkVersion },
          tags: span.tags,
        });
        if (!response.buildHashedId) throw new Error("TRA startBuild response did not include buildHashedId");
        trace.buildHashedId = response.buildHashedId;
        trace.buildOwnerSpanId = span.spanId;
        trace.syntheticBuild = span.synthetic;
        span.traId = response.buildHashedId;
      } else if (span.kind === "test" || span.kind === "hook") {
        const buildHashedId = trace.buildHashedId;
        if (!buildHashedId) throw new Error(`TRA build id missing for ${span.kind} "${span.name}"`);
        if (span.kind === "test") {
          const response = await this.client.startTestRun(buildHashedId, {
            name: span.name,
            fileName: span.fileName,
            scopes: span.scopes,
            startedAt: iso(span.startMs),
            tags: span.tags,
            location: span.location,
          });
          const uuid = response.uuid ?? response.testRunId;
          if (!uuid) throw new Error("TRA startTestRun response did not include uuid");
          span.traId = uuid;
        } else {
          const response = await this.client.startHookRun(buildHashedId, {
            hookType: span.hookType,
            name: span.name,
            fileName: span.fileName,
            scopes: span.scopes,
            startedAt: iso(span.startMs),
            testRunId: this.nearestTestUuid(trace, span),
            tags: span.tags,
            location: span.location,
          });
          const uuid = response.uuid ?? response.testRunId;
          if (!uuid) throw new Error("TRA startHookRun response did not include uuid");
          span.traId = uuid;
        }
      }
      span.state = "open";
      span.countedStart = true;
      trace.pairs[span.kind].started += 1;
      if (span.kind === "build") await this.flushPending(trace);
      return true;
    } catch (error) {
      span.state = "pending";
      this.note(trace, {
        code: "tra_start_failed",
        message: messageOf(error),
        spanId: span.spanId,
        exitCode: EXIT_FAILURE,
      });
      trace.sawImbalance = true;
      return false;
    }
  }

  private async ensureBuild(trace: TraceState, hint: Tracked): Promise<boolean> {
    if (trace.buildHashedId) return true;
    const syntheticId = `build:${trace.traceId}`;
    let owner = trace.spans.get(syntheticId);
    if (!owner) {
      owner = {
        ...hint,
        spanId: syntheticId,
        parentSpanId: undefined,
        kind: "build",
        logKind: "TEST_LOG",
        name: hint.buildName || hint.name,
        synthetic: true,
        state: "pending",
        countedStart: false,
        finishAttempts: 0,
        deferredClose: false,
        autocloseNoted: false,
        traId: undefined,
        openedAtMs: hint.openedAtMs,
      };
      trace.spans.set(syntheticId, owner);
    }
    const started = await this.startOnTRA(trace, owner);
    if (started) {
      this.note(trace, {
        code: "missing-build",
        message: `Opened a build for trace ${trace.traceId} because ${hint.kind} "${hint.name}" arrived before a build span (exit 1)`,
        spanId: hint.spanId,
        exitCode: EXIT_FAILURE,
      });
      trace.sawImbalance = true;
    }
    return started;
  }

  private async flushPending(trace: TraceState): Promise<void> {
    const pending = [...trace.spans.values()].filter((span) => span.state === "pending" && span.kind !== "build");
    pending.sort((a, b) => this.depth(trace, a.spanId) - this.depth(trace, b.spanId));
    for (const span of pending) {
      await this.startOnTRA(trace, span);
    }
    const closing = pending.filter((span) => span.deferredClose && span.state !== "closed");
    closing.sort((a, b) => this.depth(trace, b.spanId) - this.depth(trace, a.spanId));
    for (const span of closing) {
      await this.closeSpan(trace, span, "end", this.now());
    }
  }

  private async endSpan(trace: TraceState, event: LiveEvent, now: number): Promise<void> {
    let tracked = trace.spans.get(event.spanId);
    if (tracked?.state === "closed") return;
    if (!tracked) {
      const opened = await this.openSpan(trace, event, now, true);
      tracked = trace.spans.get(event.spanId);
      if (!opened || !tracked) return;
      if (event.kind !== "step") {
        this.note(trace, {
          code: "missing-start",
          message: `End for ${event.kind} "${event.name}" had no matching start; a start was recorded so the pair stays balanced (exit 1)`,
          spanId: event.spanId,
          exitCode: EXIT_FAILURE,
        });
        trace.sawImbalance = true;
      }
    }
    tracked.endMs = event.endMs > 0 ? event.endMs : now;
    tracked.result = event.result ?? tracked.result;
    tracked.exception = event.exception ?? tracked.exception;
    if (event.exitCode !== undefined) tracked.exitCode = event.exitCode;
    if (event.kind === "build" && event.exitCode !== undefined) trace.explicitExitCode = event.exitCode;
    if (tracked.state === "pending") {
      if (tracked.kind !== "build" && !trace.buildHashedId) {
        tracked.deferredClose = true;
        return;
      }
      const started = await this.startOnTRA(trace, tracked);
      if (!started) {
        tracked.deferredClose = true;
        return;
      }
    }
    await this.closeSpan(trace, tracked, "end", now);
  }

  private async closeSpan(trace: TraceState, span: Tracked, reason: CloseReason, now: number): Promise<boolean> {
    if (span.state === "closed") return true;
    if (span.state === "pending") {
      const started = await this.startOnTRA(trace, span);
      if (!started) return false;
    }
    const children = span.kind === "build"
      ? [...trace.spans.values()]
        .filter((candidate) => candidate.state !== "closed" && candidate.kind !== "build")
        .sort((a, b) => this.depth(trace, b.spanId) - this.depth(trace, a.spanId))
      : this.openChildren(trace, span.spanId);
    for (const child of children) {
      // A child that already ended keeps its own result. Parent-end is only for a child that is still running.
      const childReason: CloseReason = reason === "end" ? (child.deferredClose ? "end" : "parent-end") : reason;
      const closed = await this.closeSpan(trace, child, childReason, now);
      if (!closed) return false;
    }
    if ((reason === "timeout" || reason === "shutdown" || reason === "parent-end") && !span.autocloseNoted) {
      span.autocloseNoted = true;
      if (reason === "parent-end") trace.sawImbalance = true;
      else trace.sawTimeout = true;
      this.note(trace, {
        code: reason,
        message: this.closeMessage(span, reason),
        spanId: span.spanId,
        exitCode: reason === "parent-end" ? EXIT_FAILURE : EXIT_TIMEOUT,
      });
    }

    const result = this.closeResult(span, reason);
    if (span.kind === "test" && reason === "end" && result === "failed") trace.sawFailure = true;
    if (reason === "end" && result === "timeout") trace.sawTimeout = true;
    const finishedAtMs = reason === "end" && span.endMs > span.startMs ? span.endMs : now;
    const duration = Math.max(0, finishedAtMs - span.startMs);
    const failure = this.failureFor(span, reason, result);
    if ((span.kind === "test" || span.kind === "hook") && failure && trace.buildHashedId) {
      await this.emitLogs(trace, failure.slice(0, MAX_RECORDED_ERRORS).map((item) => this.failureLog(trace, span, finishedAtMs, item)));
    }

    if (span.kind === "step") {
      if (!trace.buildHashedId) {
        span.deferredClose = true;
        return false;
      }
      const logged = await this.emitLogs(trace, [this.stepLog(trace, span, finishedAtMs, duration, reason, result)]);
      if (!logged) return false;
      span.state = "closed";
      span.closeReason = reason;
      trace.pairs.step.finished += 1;
      return true;
    }

    if (span.finishAttempts >= this.timeouts.maxFinishAttempts) {
      span.state = "closed";
      span.closeReason = reason;
      trace.abandoned = true;
      this.note(trace, {
        code: "abandoned",
        message: `Stopped retrying finish for ${span.kind} "${span.name}" after ${span.finishAttempts} attempts (exit 1)`,
        spanId: span.spanId,
        exitCode: EXIT_FAILURE,
      });
      trace.sawImbalance = true;
      return true;
    }

    try {
      if (span.kind === "build") {
        if (span.spanId !== trace.buildOwnerSpanId) {
          span.state = "closed";
          span.closeReason = reason;
          return true;
        }
        if (trace.buildHashedId && (reason !== "end" || trace.sawTimeout || trace.sawImbalance || trace.sawFailure)) {
          const recorded = this.recordedErrors(trace);
          const summary = this.buildCloseMessage(trace, reason);
          const message = recorded ? `${summary}\n${recorded}` : summary;
          await this.emitLogs(trace, [{
            kind: "TEST_LOG",
            timestamp: iso(finishedAtMs),
            level: trace.sawTimeout || trace.sawFailure || trace.sawImbalance ? "ERROR" : "INFO",
            message: clip(message, MAX_MESSAGE_CHARS),
            failure: trace.sawTimeout || trace.sawFailure || trace.sawImbalance || undefined,
          }]);
        }
        if (!trace.buildHashedId) throw new Error(`TRA build id missing for build "${span.name}"`);
        await this.client.finishBuild(trace.buildHashedId, { finishedAt: iso(finishedAtMs) });
        trace.closed = true;
        if (reason === "end" && span.exitCode !== undefined && !trace.sawTimeout) {
          trace.explicitExitCode = span.exitCode;
        }
      } else if (span.kind === "test") {
        const buildHashedId = trace.buildHashedId;
        const testRunUuid = span.traId;
        if (!buildHashedId || !testRunUuid) throw new Error(`TRA id missing for test "${span.name}"`);
        await this.client.finishTestRun(buildHashedId, testRunUuid, {
          result,
          finishedAt: iso(finishedAtMs),
          fileName: span.fileName,
          scopes: span.scopes,
          durationInMs: duration >= 1 ? Math.round(duration) : undefined,
          failure,
        });
      } else {
        const buildHashedId = trace.buildHashedId;
        const hookRunUuid = span.traId;
        if (!buildHashedId || !hookRunUuid) throw new Error(`TRA id missing for hook "${span.name}"`);
        await this.client.finishHookRun(buildHashedId, hookRunUuid, {
          hookType: span.hookType,
          result,
          finishedAt: iso(finishedAtMs),
          fileName: span.fileName,
          scopes: span.scopes,
          durationInMs: duration >= 1 ? Math.round(duration) : undefined,
          failure,
        });
      }
      span.state = "closed";
      span.closeReason = reason;
      trace.pairs[span.kind].finished += 1;
      return true;
    } catch (error) {
      span.finishAttempts += 1;
      this.note(trace, {
        code: "tra_finish_failed",
        message: messageOf(error),
        spanId: span.spanId,
        exitCode: trace.sawTimeout ? EXIT_TIMEOUT : EXIT_FAILURE,
      });
      return false;
    }
  }

  private async sweepTrace(trace: TraceState, now: number): Promise<void> {
    const build = this.ownerBuild(trace);
    for (const span of this.deepestOpen(trace, (candidate) => candidate.kind === "hook" || candidate.kind === "step")) {
      const limit = span.kind === "hook" ? this.timeouts.hookTimeoutMs : this.timeouts.stepTimeoutMs;
      if (now - span.openedAtMs >= limit) {
        const closed = await this.closeSpan(trace, span, "timeout", now);
        if (!closed) return;
      }
    }
    for (const span of this.deepestOpen(trace, (candidate) => candidate.kind === "test")) {
      if (now - span.openedAtMs >= this.timeouts.testTimeoutMs) {
        const closed = await this.closeSpan(trace, span, "timeout", now);
        if (!closed) return;
      }
    }
    if (!build || build.state === "closed") return;
    const age = now - build.openedAtMs;
    const idle = now - trace.lastActivityAt;
    if (age >= this.timeouts.buildTimeoutMs) {
      trace.sawTimeout = true;
      await this.finishTrace(trace, "timeout", now);
      return;
    }
    if (idle >= this.timeouts.buildIdleTimeoutMs) {
      await this.finishTrace(trace, "idle", now);
    }
  }

  private async finishTrace(trace: TraceState, reason: "timeout" | "idle" | "shutdown", now: number): Promise<void> {
    const childReason: CloseReason = reason === "idle" ? "timeout" : reason;
    for (let pass = 0; pass < MAX_FINISH_PASSES; pass += 1) {
      const open = [...trace.spans.values()].filter((span) => span.state !== "closed" && span.kind !== "build");
      if (open.length === 0) break;
      if (reason === "idle" || reason === "timeout") trace.sawTimeout = true;
      open.sort((a, b) => this.depth(trace, b.spanId) - this.depth(trace, a.spanId));
      const target = open[0];
      if (!target) break;
      const closed = await this.closeSpan(trace, target, childReason, now);
      if (!closed) return;
    }
    const build = this.ownerBuild(trace);
    if (!build || build.state === "closed") return;
    const unfinished = [...trace.spans.values()].some((span) => span.state !== "closed" && span.kind !== "build");
    if (unfinished) return;
    if (reason === "timeout") trace.sawTimeout = true;
    if (reason === "shutdown") {
      const killed = trace.errors.some((error) => error.code === "shutdown");
      if (killed) trace.sawTimeout = true;
    }
    let buildReason: CloseReason = "end";
    if (trace.sawTimeout) buildReason = reason === "shutdown" ? "shutdown" : "timeout";
    else if (reason === "idle") buildReason = "idle";
    await this.closeSpan(trace, build, buildReason, now);
  }

  private async applyLog(log: LiveLog): Promise<void> {
    const trace = this.trace(log.traceId);
    trace.lastActivityAt = this.now();
    if (!trace.buildHashedId) {
      this.note(trace, {
        code: "dropped-log",
        message: `Log for trace ${log.traceId} arrived before a build was open`,
        spanId: log.spanId,
        exitCode: EXIT_FAILURE,
      });
      return;
    }
    const anchor = log.spanId ? trace.spans.get(log.spanId) : undefined;
    const testUuid = anchor ? this.nearestTestUuid(trace, anchor) : undefined;
    const hookUuid = anchor?.kind === "hook" ? anchor.traId : undefined;
    const attachment = log.kind === "TEST_SCREENSHOT" || log.kind === "TEST_ATTACHMENT";
    await this.emitLogs(trace, [{
      kind: !attachment && anchor?.kind === "hook" ? "HOOK_LOG" : log.kind,
      testRunUuid: testUuid,
      hookRunUuid: hookUuid,
      timestamp: iso(log.timeMs),
      level: log.level,
      message: log.message,
      fileName: log.fileName,
      fileSize: log.fileSize,
    }]);
  }

  private async emitLogs(trace: TraceState, logs: TraLog[]): Promise<boolean> {
    if (!trace.buildHashedId || logs.length === 0) return false;
    try {
      await this.client.addBuildLogs(trace.buildHashedId, { logs });
      return true;
    } catch (error) {
      this.note(trace, {
        code: "tra_log_failed",
        message: messageOf(error),
        exitCode: trace.sawTimeout ? EXIT_TIMEOUT : EXIT_FAILURE,
      });
      return false;
    }
  }

  private stepLog(trace: TraceState, span: Tracked, finishedAtMs: number, duration: number, reason: CloseReason, result: TestResult): TraLog {
    const failed = reason !== "end" || result === "failed" || result === "timeout";
    return {
      kind: span.logKind === "HTTP" ? "HTTP" : "TEST_STEP",
      testRunUuid: this.nearestTestUuid(trace, span),
      hookRunUuid: this.nearestHookUuid(trace, span),
      timestamp: iso(span.startMs || finishedAtMs),
      level: failed ? "ERROR" : "INFO",
      message: reason === "end" ? span.name : this.closeMessage(span, reason),
      duration: duration >= 1 ? Math.round(duration) : undefined,
      failure: failed || undefined,
    };
  }

  private closeResult(span: Tracked, reason: CloseReason): TestResult {
    if (reason === "timeout" || reason === "shutdown") return "timeout";
    if (reason === "parent-end") return "failed";
    return span.result ?? "passed";
  }

  private failureFor(span: Tracked, reason: CloseReason, result: TestResult): TraFailure[] | undefined {
    if (reason === "timeout" || reason === "shutdown" || reason === "parent-end") {
      return [{ error: this.closeMessage(span, reason), backtrace: span.exception?.backtrace }];
    }
    if (span.exception) return [{ error: span.exception.error, backtrace: span.exception.backtrace }];
    if (result === "failed" || result === "timeout") return [{ error: `${span.kind} "${span.name}" ${result}` }];
    return undefined;
  }

  private failureLog(trace: TraceState, span: Tracked, finishedAtMs: number, failure: TraFailure): TraLog {
    const error = failure.error?.trim() || "error";
    const backtrace = failure.backtrace?.trim();
    const text = backtrace ? `${error}\n${backtrace}` : error;
    return {
      kind: span.kind === "hook" ? "HOOK_LOG" : "TEST_LOG",
      testRunUuid: this.nearestTestUuid(trace, span),
      hookRunUuid: span.kind === "hook" ? span.traId : undefined,
      timestamp: iso(finishedAtMs),
      level: "ERROR",
      message: clip(text, MAX_MESSAGE_CHARS),
      failure: true,
    };
  }

  private recordedErrors(trace: TraceState): string {
    const lines: string[] = [];
    for (const span of trace.spans.values()) {
      if (lines.length >= MAX_RECORDED_ERRORS || !span.exception) continue;
      if (span.kind !== "test" && span.kind !== "hook") continue;
      lines.push(`${span.kind} "${span.name}": ${span.exception.error}`);
    }
    return lines.join("\n");
  }

  private closeMessage(span: Tracked, reason: CloseReason): string {
    if (reason === "timeout") {
      const limit = span.kind === "test" ? this.timeouts.testTimeoutMs : span.kind === "build" ? this.timeouts.buildTimeoutMs : span.kind === "step" ? this.timeouts.stepTimeoutMs : this.timeouts.hookTimeoutMs;
      return `Auto-closed ${span.kind} "${span.name}" after ${limit}ms (exit ${EXIT_TIMEOUT})`;
    }
    if (reason === "shutdown") return `Auto-closed ${span.kind} "${span.name}" on shutdown (exit ${EXIT_TIMEOUT})`;
    if (reason === "parent-end") return `Closed open ${span.kind} "${span.name}" because its parent ended first (exit ${EXIT_FAILURE})`;
    return `Closed ${span.kind} "${span.name}"`;
  }

  private projectedExit(trace: TraceState): number {
    if (trace.sawTimeout) return EXIT_TIMEOUT;
    if (trace.sawFailure || trace.sawImbalance || trace.abandoned) return EXIT_FAILURE;
    return trace.explicitExitCode ?? EXIT_OK;
  }

  private buildCloseMessage(trace: TraceState, reason: CloseReason): string {
    const code = this.projectedExit(trace);
    if (reason === "timeout") return `Build auto-closed: exceeded ${this.timeouts.buildTimeoutMs}ms (exit ${code})`;
    if (reason === "shutdown") return `Build auto-closed on shutdown (exit ${code})`;
    if (reason === "idle") return `Build auto-closed after ${this.timeouts.buildIdleTimeoutMs}ms of inactivity (exit ${code})`;
    if (trace.sawTimeout) return `Build finished with auto-closed spans (exit ${code})`;
    if (trace.sawImbalance) return `Build finished with unbalanced spans repaired (exit ${code})`;
    if (trace.sawFailure) return `Build finished with failing tests (exit ${code})`;
    return `Build finished (exit ${code})`;
  }

  private nearestTestUuid(trace: TraceState, span: Tracked): string | undefined {
    let current: Tracked | undefined = span;
    for (let guard = 0; current && guard < MAX_DEPTH; guard += 1) {
      if (current.kind === "test" && current.traId) return current.traId;
      if (!current.parentSpanId) return undefined;
      current = trace.spans.get(current.parentSpanId);
    }
    return undefined;
  }

  private nearestHookUuid(trace: TraceState, span: Tracked): string | undefined {
    if (span.kind === "hook") return span.traId;
    let current = span.parentSpanId ? trace.spans.get(span.parentSpanId) : undefined;
    for (let guard = 0; current && guard < MAX_DEPTH; guard += 1) {
      if (current.kind === "hook" && current.traId) return current.traId;
      current = current.parentSpanId ? trace.spans.get(current.parentSpanId) : undefined;
    }
    return undefined;
  }

  private openChildren(trace: TraceState, spanId: string): Tracked[] {
    return [...trace.spans.values()]
      .filter((span) => span.state !== "closed" && span.parentSpanId === spanId)
      .sort((a, b) => this.depth(trace, b.spanId) - this.depth(trace, a.spanId));
  }

  private deepestOpen(trace: TraceState, include: (span: Tracked) => boolean): Tracked[] {
    return [...trace.spans.values()]
      .filter((span) => span.state !== "closed" && include(span))
      .sort((a, b) => this.depth(trace, b.spanId) - this.depth(trace, a.spanId));
  }

  private ownerBuild(trace: TraceState): Tracked | undefined {
    if (!trace.buildOwnerSpanId) return undefined;
    return trace.spans.get(trace.buildOwnerSpanId);
  }

  private depth(trace: TraceState, spanId: string): number {
    let depth = 0;
    let current = trace.spans.get(spanId);
    const seen = new Set<string>();
    while (current?.parentSpanId && depth < MAX_DEPTH && !seen.has(current.spanId)) {
      seen.add(current.spanId);
      depth += 1;
      current = trace.spans.get(current.parentSpanId);
    }
    return depth;
  }

  private note(trace: TraceState, error: TraceError): void {
    if (trace.errors.length >= MAX_ERROR_NOTES) return;
    trace.errors.push(error);
  }

  private exitCode(trace: TraceState): number | null {
    if (!trace.closed && !trace.sawTimeout && !trace.sawFailure && !trace.sawImbalance) return null;
    if (trace.sawTimeout) return EXIT_TIMEOUT;
    if (trace.explicitExitCode !== undefined && trace.closed && !trace.sawFailure && !trace.sawImbalance) {
      return trace.explicitExitCode;
    }
    if (trace.sawFailure || trace.sawImbalance || trace.abandoned) return EXIT_FAILURE;
    if (trace.closed) return trace.explicitExitCode ?? EXIT_OK;
    return null;
  }

  private snapshot(trace: TraceState): TraceSnapshot {
    const open = { build: 0, test: 0, hook: 0, step: 0 };
    for (const span of trace.spans.values()) {
      if (span.state !== "closed") open[span.kind] += 1;
    }
    const pairsMatch = PAIR_KINDS.every((kind) => trace.pairs[kind].started === trace.pairs[kind].finished);
    const noneOpen = PAIR_KINDS.every((kind) => open[kind] === 0);
    return {
      traceId: trace.traceId,
      buildHashedId: trace.buildHashedId,
      exitCode: this.exitCode(trace),
      closed: trace.closed,
      balanced: pairsMatch && noneOpen && !trace.abandoned,
      open,
      pairs: {
        build: { ...trace.pairs.build },
        test: { ...trace.pairs.test },
        hook: { ...trace.pairs.hook },
        step: { ...trace.pairs.step },
      },
      errors: [...trace.errors],
    };
  }
}
