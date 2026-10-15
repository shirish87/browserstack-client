import http from "node:http";
import { createOtelGateway } from "../../packages/router/dist/index.js";

const hits = [];
let seq = 0;

function read(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function listen(server) {
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve(`http://127.0.0.1:${address.port}`);
    });
  });
}

const tra = http.createServer(async (req, res) => {
  if (req.url === "/__requests") {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(hits));
    return;
  }
  const bodyText = await read(req);
  let body = {};
  if (bodyText) {
    try {
      body = JSON.parse(bodyText);
    } catch {
      body = { raw: bodyText };
    }
  }
  let payload = {};
  if (req.method === "POST" && req.url === "/builds/start") payload = { build_hashed_id: "bld_1" };
  else if (req.method === "POST" && req.url?.endsWith("/tests/start")) payload = { uuid: `test_${++seq}` };
  else if (req.method === "POST" && req.url?.endsWith("/hooks/start")) payload = { uuid: `hook_${++seq}` };
  hits.push({
    method: req.method,
    url: req.url,
    body,
    auth: req.headers.authorization ?? "",
    response: payload,
  });
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(payload));
});

const traUrl = await listen(tra);
const gateway = createOtelGateway({
  username: "user",
  accessKey: "key",
  baseUrl: traUrl,
  sweepIntervalMs: 0,
});
const otel = http.createServer((req, res) => {
  void gateway(req, res);
});
const otelUrl = await listen(otel);

process.stdout.write(`${JSON.stringify({ tra: traUrl, otel: otelUrl })}\n`);

function shutdown() {
  void gateway.shutdown().finally(() => {
    tra.close();
    otel.close();
    process.exit(0);
  });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
