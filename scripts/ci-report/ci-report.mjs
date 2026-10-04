// Uploads the vitest JUnit report of a CI run to BrowserStack Test Reporting & Analytics using our own
// TestReportingClient (dogfooding). Reporting is best-effort: it never throws and the CLI always exits 0,
// so an unreachable BrowserStack can't fail the build.
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

export function buildUploadParams(env, label) {
  const repo = env.GITHUB_REPOSITORY;
  const branch = env.GITHUB_REF_NAME;
  const sha = env.GITHUB_SHA;
  const runId = env.GITHUB_RUN_ID;
  const params = {
    projectName: repo ?? "browserstack-client",
    buildName: runId ? `${env.GITHUB_WORKFLOW ?? "CI"} #${env.GITHUB_RUN_NUMBER} (${branch})` : `local ${new Date().toISOString()}`,
    tags: ["ci", label, branch].filter(Boolean).join(","),
    format: "junit",
  };
  if (runId) {
    params.buildIdentifier = `${runId}-${env.GITHUB_RUN_ATTEMPT ?? "1"}`;
    params.ci = `${env.GITHUB_SERVER_URL ?? "https://github.com"}/${repo}/actions/runs/${runId}`;
  }
  if (sha) params.versionControl = { sha, shortSha: sha.slice(0, 7), branch };
  return params;
}

export async function reportJUnit({ client, file, env, label, read = async (f) => new Blob([await readFile(f)], { type: "text/xml" }) }) {
  try {
    const blob = await read(file);
    await client.uploadReport({ ...buildUploadParams(env, label), file: blob, fileName: file.split(/[\\/]/).pop() });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function main() {
  const [file = "junit.xml", label = "ci"] = process.argv.slice(2);
  if (!process.env.BROWSERSTACK_USERNAME || !(process.env.BROWSERSTACK_ACCESS_KEY || process.env.BROWSERSTACK_KEY)) {
    console.log("ci-report: BrowserStack credentials not available (fork PR?); skipping.");
    return;
  }
  const { TestReportingClient } = await import("../../packages/test-reporting/dist/index.js");
  const res = await reportJUnit({ client: new TestReportingClient(), file, env: process.env, label });
  console.log(res.ok ? `ci-report: uploaded ${file} to BrowserStack TRA` : `ci-report: upload failed (ignored): ${res.error}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => console.log(`ci-report: failed (ignored): ${e}`));
}
