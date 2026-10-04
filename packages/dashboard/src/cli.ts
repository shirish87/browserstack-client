#!/usr/bin/env node
import { createDashboardServer } from "./server";

const port = Number(process.env.PORT ?? 40001);
// Loopback only: the server holds BrowserStack credentials and has no auth of its own.
createDashboardServer().listen(port, "127.0.0.1", () => {
  console.log(`TRA dashboard running at http://127.0.0.1:${port}`);
});
