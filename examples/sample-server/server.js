import express from "express";
import path from "node:path";
import { createGateway, createOtelGateway } from "@dot-slash/browserstack-router";

const PORT = process.env.PORT ?? 40000;

const automateBundlePath = path.resolve(
  import.meta.dirname,
  "../../packages/automate/dist/index.js"
);

const app = express();

app.use(express.static(path.resolve(import.meta.dirname, "public"), { dotfiles: "allow" }));

app.get("/sdk/automate.js", (req, res) => {
  res.sendFile(automateBundlePath, { dotfiles: "allow" });
});

app.get("/sdk/automate.js.map", (req, res) => {
  res.sendFile(`${automateBundlePath}.map`, { dotfiles: "allow" });
});

const otelUsername = process.env.BROWSERSTACK_USERNAME ?? "";
const otelAccessKey = process.env.BROWSERSTACK_ACCESS_KEY ?? process.env.BROWSERSTACK_KEY ?? "";
const otelGateway = otelUsername && otelAccessKey
  ? createOtelGateway({
      username: otelUsername,
      accessKey: otelAccessKey,
      hookTimeoutMs: Number(process.env.BROWSERSTACK_OTEL_HOOK_TIMEOUT_MS ?? 120000),
      testTimeoutMs: Number(process.env.BROWSERSTACK_OTEL_TEST_TIMEOUT_MS ?? 600000),
      stepTimeoutMs: Number(process.env.BROWSERSTACK_OTEL_STEP_TIMEOUT_MS ?? 120000),
      buildTimeoutMs: Number(process.env.BROWSERSTACK_OTEL_BUILD_TIMEOUT_MS ?? 3600000),
      buildIdleTimeoutMs: Number(process.env.BROWSERSTACK_OTEL_BUILD_IDLE_TIMEOUT_MS ?? 3600000),
    })
  : null;

app.use("/v1/traces", (req, res, next) => {
  if (!otelGateway) {
    res.status(503).type("text/plain").send("BrowserStack credentials are not configured");
    return;
  }
  return otelGateway(req, res, next);
});

app.use("/gateway", (req, res, next) => {
  const username = req.headers["x-browserstack-username"];
  const accessKey = req.headers["x-browserstack-access-key"];
  delete req.headers["x-browserstack-username"];
  delete req.headers["x-browserstack-access-key"];

  if (typeof username !== "string" || !username || typeof accessKey !== "string" || !accessKey) {
    res.status(400).type("text/plain").send("Missing x-browserstack-username / x-browserstack-access-key headers");
    return;
  }

  const forwardRequest = createGateway({
    username,
    accessKey,
    allowedHosts: ["api.browserstack.com"],
  });
  forwardRequest(req, res, next);
});

const server = app.listen(PORT, () => {
  console.log(`Sample server running at http://localhost:${PORT}`);
});

async function shutdown(code) {
  if (otelGateway) await otelGateway.shutdown();
  server.close(() => process.exit(code));
}

process.on("SIGTERM", () => {
  void shutdown(0);
});
process.on("SIGINT", () => {
  void shutdown(0);
});
