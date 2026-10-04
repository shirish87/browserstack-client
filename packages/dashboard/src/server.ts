import { createServer, type Server } from "node:http";
import { Readable } from "node:stream";
import { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import { createDashboardHandler } from "./handler";

/** Serves the dashboard over node:http. Credentials come from the client (options or BROWSERSTACK_* env vars). */
export function createDashboardServer(tra: TestReportingClient = new TestReportingClient()): Server {
  const handle = createDashboardHandler({ tra });
  return createServer(async (req, res) => {
    const host = req.headers.host ?? "localhost";
    const response = await handle(new Request(new URL(req.url ?? "/", `http://${host}`), { method: req.method }));
    res.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body) Readable.fromWeb(response.body as never).pipe(res);
    else res.end();
  });
}
