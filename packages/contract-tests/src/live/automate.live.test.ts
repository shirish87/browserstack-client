import { beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { AutomateBuildSchema, AutomateBuildSessionSchema, AutomateSessionSchema, HarArchiveSchema } from "@dot-slash/browserstack-automate/models";
import { unmodelledKeys } from "../drift";
import { dedupePath, liveContext, unique, type LiveContext } from "./helpers";
import type { BuildTestSession } from "@dot-slash/browserstack-test-reporting";

const MAX_BUILDS = 4;
const MAX_SESSIONS = 6;

let ctx: LiveContext;
const sessions: BuildTestSession[] = [];

beforeAll(async () => {
  ctx = liveContext();
  let projectId: number | undefined;
  let next: string | undefined;
  for (let page = 0; page < 20 && projectId === undefined; page++) {
    const res = await ctx.testReporting.getProjects(next);
    projectId = res.projects?.find((p) => p.name === ctx.projectName)?.id;
    if (!res.pagination?.hasNext || !res.pagination.nextPage) break;
    next = res.pagination.nextPage;
  }
  if (projectId === undefined) return;
  const builds = await ctx.testReporting.getProjectBuilds(projectId);
  const seen = new Set<string>();
  for (const b of (builds.builds ?? []).slice(0, MAX_BUILDS)) {
    if (!b.buildId) continue;
    for (const s of await ctx.testReporting.getBuildTestSessions(b.buildId)) {
      if (!seen.has(s.sessionId) && seen.size < MAX_SESSIONS) {
        seen.add(s.sessionId);
        sessions.push(s);
      }
    }
  }
});

describe("Automate live contract (sessions reached through TRA)", () => {
  it("TRA builds link to at least one Automate session", () => {
    expect(sessions.length, "no TRA test in the latest builds carried a session_id").toBeGreaterThan(0);
  });

  it("every linked session resolves and matches the models", async () => {
    const drift: string[] = [];
    for (const s of sessions) {
      const linked = await ctx.testReporting.getTestSession(s.sessionId);
      expect(linked, `TRA session_id ${s.sessionId} is unknown to Automate`).toBeDefined();
      if (!linked) continue;
      AutomateSessionSchema.parse(linked.session);
      drift.push(...unmodelledKeys(AutomateSessionSchema, linked.session).map(dedupePath));
      expect(linked.session.hashedId).toBe(s.sessionId);
    }
    expect(unique(drift)).toEqual([]);
  });

  it("a session's build lists the session, and build + session list match the models", async () => {
    // The client unwraps getBuild: build fields at the top level, sessions as plain session objects.
    const BuildWithSessions = AutomateBuildSchema.and(z.object({ sessions: z.array(AutomateBuildSessionSchema) }));
    const drift: string[] = [];
    const checked = new Set<string>();
    for (const s of sessions) {
      const linked = await ctx.testReporting.getTestSession(s.sessionId);
      const buildId = linked?.session.buildHashedId;
      if (!buildId || checked.has(buildId)) continue;
      checked.add(buildId);
      const build = await ctx.automate.getBuild(buildId);
      BuildWithSessions.parse(build);
      drift.push(...unmodelledKeys(BuildWithSessions, build).map(dedupePath));
      // getSessions returns only 10 sessions unless asked for more, so page through all of them.
      const listed: Awaited<ReturnType<typeof ctx.automate.getSessions>> = [];
      for (let offset = 0; offset < 1000; offset += 100) {
        const page = await ctx.automate.getSessions(buildId, "100", String(offset));
        listed.push(...page);
        if (page.length < 100) break;
      }
      z.array(AutomateSessionSchema).parse(listed);
      drift.push(...unmodelledKeys(z.array(AutomateSessionSchema), listed).map(dedupePath));
      expect(listed.map((x) => x.hashedId), "the TRA session_id must be listed in its Automate build").toContain(s.sessionId);
    }
    expect(checked.size).toBeGreaterThan(0);
    expect(unique(drift)).toEqual([]);
  });

  it("every log kind is either ok or cleanly missing, never an error; the HAR matches the models", async () => {
    const harDrift: string[] = [];
    for (const s of sessions) {
      const logs = await ctx.testReporting.getTestSessionLogs(s.sessionId, ["text", "console", "network", "selenium", "playwright", "appium"]);
      for (const [kind, result] of Object.entries(logs)) expect(result.status, `${s.sessionId} ${kind}`).not.toBe("error");
      expect(logs.text?.status, "the text log should always exist").toBe("ok");
      if (logs.network?.status === "ok") {
        HarArchiveSchema.parse(logs.network.data);
        harDrift.push(...unmodelledKeys(HarArchiveSchema, logs.network.data).map(dedupePath));
      }
    }
    expect(unique(harDrift)).toEqual([]);
  });

  it("default log selection follows the URLs the session reports", async () => {
    for (const s of sessions) {
      const linked = await ctx.testReporting.getTestSession(s.sessionId);
      expect(linked?.product, "these sessions come from Automate (web) tests").toBe("automate");
      if (linked?.product !== "automate") continue;
      const logs = await ctx.testReporting.getTestSessionLogs(s.sessionId);
      expect(Boolean(logs.playwright), "playwright logs requested iff the session reports a URL").toBe(Boolean(linked.session.playwrightLogsUrl));
      expect(Boolean(logs.selenium)).toBe(Boolean(linked.session.seleniumLogsUrl));
    }
  });
});

describe("error formats", () => {
  it("Automate: an unknown session is a 404 HttpError with a non-empty message", async () => {
    // A well-formed id gets a plain-text "Not Found"; a malformed one hits nginx's HTML page.
    for (const id of ["0".repeat(40), "bad"]) {
      const err = await ctx.automate.getSession(id).catch((e: unknown) => e);
      expect(err).toMatchObject({ status: 404 });
      expect(err instanceof Error ? err.message : "").not.toBe("");
    }
  });

  it("Automate: a log the session never produced is an S3 XML 404 with a readable reason", async () => {
    const logs = await ctx.testReporting.getTestSessionLogs(sessions[0]?.sessionId ?? "", ["selenium", "appium"]);
    const reasons = Object.values(logs).flatMap((r) => (r.status === "missing" ? [r.reason] : []));
    for (const reason of reasons) expect(reason).toMatch(/NoSuchKey|404|Not Found/);
  });

  it("TRA: an unknown build is a JSON 404 whose message names the build", async () => {
    await expect(ctx.testReporting.getBuild("doesnotexist0000")).rejects.toThrow(/not found/i);
  });
});
