import { beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { AppAutomateBuildContainerSchema, AppAutomateSessionSchema } from "@dot-slash/browserstack-app-automate/models";
import { unmodelledKeys } from "../drift";
import { dedupePath, liveContext, unique, type LiveContext } from "./helpers";

const MAX_BUILDS_SCANNED = 12;
const MAX_SESSIONS = 6;
const SESSION_STATUSES = ["passed", "failed", "running", "timeout"];

let ctx: LiveContext;
/** Sessions of tests TRA reports a device for, with the device name TRA gave. */
const mobile: { sessionId: string; device: string }[] = [];

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
  for (const b of (builds.builds ?? []).slice(0, MAX_BUILDS_SCANNED)) {
    if (!b.buildId || seen.size >= MAX_SESSIONS) continue;
    for (const t of await ctx.testReporting.getBuildTests(b.buildId)) {
      if (t.platform.device && t.sessionId && !seen.has(t.sessionId) && seen.size < MAX_SESSIONS) {
        seen.add(t.sessionId);
        mobile.push({ sessionId: t.sessionId, device: t.platform.device });
      }
    }
  }
});

describe("App Automate live contract (mobile sessions reached through TRA)", () => {
  it("TRA reports a device for mobile tests, and those session ids exist (run the Appium generator first)", () => {
    expect(mobile.length, "no TRA test with a device was found; run the generators in packages/contract-tests/generators").toBeGreaterThan(0);
  });

  it("a mobile session_id is unknown to Automate and resolves in App Automate, matching the models", async () => {
    const drift: string[] = [];
    for (const m of mobile) {
      const web = await ctx.automate.getSession(m.sessionId).catch((e: unknown) => e);
      expect(web, "Automate must not know a mobile session").toMatchObject({ status: 404 });

      const linked = await ctx.testReporting.getTestSession(m.sessionId, { device: m.device });
      expect(linked?.product).toBe("app-automate");
      if (linked?.product !== "app-automate") continue;
      AppAutomateSessionSchema.parse(linked.session);
      drift.push(...unmodelledKeys(AppAutomateSessionSchema, linked.session).map(dedupePath));
      expect(linked.session.device, "TRA and App Automate agree on the device").toBe(m.device);
      expect(SESSION_STATUSES).toContain(linked.session.status);
    }
    expect(unique(drift)).toEqual([]);
  });

  it("the build lists its sessions (paged), and build detail embeds the lighter session shape", async () => {
    const drift: string[] = [];
    const checked = new Set<string>();
    for (const m of mobile) {
      const linked = await ctx.testReporting.getTestSession(m.sessionId, { device: m.device });
      const buildId = linked?.session.buildHashedId;
      if (!buildId || checked.has(buildId)) continue;
      checked.add(buildId);

      const build = await ctx.appAutomate.getBuild(buildId);
      // Unlike Automate, App Automate's getBuild keeps the wrapper: { automationBuild, sessions: [{ automationSession }] }.
      AppAutomateBuildContainerSchema.parse(build);
      drift.push(...unmodelledKeys(AppAutomateBuildContainerSchema, build).map(dedupePath));

      const listed: Awaited<ReturnType<typeof ctx.appAutomate.getSessions>> = [];
      for (let offset = 0; offset < 1000; offset += 100) {
        const page = await ctx.appAutomate.getSessions(buildId, "100", String(offset));
        listed.push(...page);
        if (page.length < 100) break;
      }
      z.array(AppAutomateSessionSchema).parse(listed);
      drift.push(...unmodelledKeys(z.array(AppAutomateSessionSchema), listed).map(dedupePath));
      expect(listed.map((x) => x.hashedId), "the TRA session_id is listed in its App Automate build").toContain(m.sessionId);
    }
    expect(checked.size).toBeGreaterThan(0);
    expect(unique(drift)).toEqual([]);
  });

  it("the status filter uses passed/failed, and an unknown status returns an empty list instead of an error", async () => {
    const m = mobile[0];
    if (!m) return;
    const linked = await ctx.testReporting.getTestSession(m.sessionId, { device: m.device });
    const buildId = linked?.session.buildHashedId;
    if (!buildId) return;
    const all = await ctx.appAutomate.getSessions(buildId, "100");
    for (const status of unique(all.map((s) => s.status))) {
      const filtered = await ctx.appAutomate.getSessions(buildId, "100", undefined, status);
      expect(filtered.length, `status=${status}`).toBe(all.filter((s) => s.status === status).length);
    }
    expect(await ctx.appAutomate.getSessions(buildId, "100", undefined, "done"), "'done' is not a session status").toEqual([]);
    expect(await ctx.appAutomate.getSessions(buildId, "100", undefined, "no-such-status")).toEqual([]);
  });

  it("default log kinds are ok or cleanly missing, never an error; web-only kinds are missing for mobile", async () => {
    for (const m of mobile) {
      const logs = await ctx.testReporting.getTestSessionLogs(m.sessionId, undefined, { device: m.device });
      expect(logs.text?.status, "the text log should exist").toBe("ok");
      for (const [kind, result] of Object.entries(logs)) expect(result.status, `${m.sessionId} ${kind}`).not.toBe("error");

      const everything = await ctx.testReporting.getTestSessionLogs(m.sessionId, ["text", "appium", "device", "network", "selenium", "console", "playwright"], { device: m.device });
      for (const kind of ["selenium", "console", "playwright"] as const) expect(everything[kind]?.status).toBe("missing");
      for (const [kind, result] of Object.entries(everything)) expect(result.status, `${m.sessionId} ${kind}`).not.toBe("error");
    }
  });
});
