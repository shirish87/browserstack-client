# TRA dashboard

Read-only UI for BrowserStack **Test Reporting & Analytics**: projects → builds → build detail
(summary, failure categories, smart tags, VCS/CI/host, quality gate, self-healing report) → test hierarchy.

- **Backend:** Node 22 + Express 5 (`server/`), TypeScript strict.
- **Frontend:** React 19, Vite, react-router, TanStack Query, Tailwind v4 + shadcn-style components (`src/`),
  built to static assets in `public/` and served by Express with SPA fallback routing.
- **Types:** no type assertions; every API response, request body and env var is validated with zod
  (`src/lib/schemas.ts`, `server/index.ts`).

## Run

```bash
# once, from the repo root
pnpm install && pnpm build:types
pnpm -r --filter ./packages/core --filter ./packages/test-reporting --filter ./packages/router build

cd examples/tra-dashboard && pnpm install

pnpm dev                     # Express :3000 (watch) + Vite :5173 with /api and /gateway proxied
TRA_MOCK=1 pnpm dev          # same, with offline fixtures (any credentials work)

pnpm build && pnpm start     # production: static assets in public/, server in dist-server/
pnpm check && pnpm test
```

Environment: `PORT` (3000), `TRA_MOCK` (0/1), `SESSION_TTL_HOURS` (8), `COOKIE_SECURE`
(defaults to 1 when `NODE_ENV=production`; set 0 to run over plain http).

## How it works

| Route | Purpose |
| --- | --- |
| `POST /api/session` | Validates `{username, accessKey}`, verifies them against TRA, creates a server-side session, sets an `HttpOnly; SameSite=Strict` cookie |
| `GET /api/session` | Current user (used to resume after a page reload) |
| `DELETE /api/session` | Sign out |
| `ALL /gateway?url=…` | Session-authenticated proxy (`@dot-slash/browserstack-router`) to the allowlisted TRA hosts; credentials come from the session, the browser's cookie/auth headers are not forwarded |
| everything else | Static files from `public/`, falling back to `index.html` for client-side routes; unknown `/api/*` returns a JSON 404 |

The access key is sent once, held in server memory, and never stored in the browser. State-changing requests
with a foreign `Origin` are refused. The session store is in-memory (single instance); put Redis behind the
`SessionStore` interface to scale out. Login attempts are not rate-limited yet.
