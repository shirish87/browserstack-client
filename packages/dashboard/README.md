# @dot-slash/browserstack-dashboard

A small web dashboard over `TestReportingClient`: projects → builds → tests → the linked Automate / App Automate session and its logs.

```bash
pnpm build
BROWSERSTACK_USERNAME=... BROWSERSTACK_ACCESS_KEY=... pnpm --filter @dot-slash/browserstack-dashboard start
# http://127.0.0.1:40001 (override with PORT)
```

Credentials stay server-side. The server binds to loopback only and has no auth of its own, so don't expose it directly.

`createDashboardHandler({ tra })` returns a Web `(Request) => Response` handler if you'd rather mount it in your own server. Routes (GET only): `/`, `/api/projects`, `/api/projects/:id/builds`, `/api/builds/:id/tests`, `/api/sessions/:id[?device=]`, `/api/sessions/:id/logs[?kinds=text,console&device=]`.
