# TRA dashboard

Read-only browser UI for BrowserStack **Test Reporting & Analytics**: projects → builds → build detail
(summary, failure categories, smart tags, VCS/CI/host, quality gate, self-healing report) → test hierarchy.

React 19, Vite, react-router, TanStack Query, Tailwind v4 + shadcn-style components, zod. TypeScript `strict`,
no type assertions: every API response is parsed with a zod schema (`src/lib/schemas.ts`) at the boundary.

```bash
# from repo root, once
pnpm install && pnpm build:types
pnpm -r --filter ./packages/core --filter ./packages/test-reporting --filter ./packages/router build

cd examples/tra-dashboard
pnpm install
pnpm dev                 # real BrowserStack (sign in with username + access key)
TRA_MOCK=1 pnpm dev      # offline fixtures, any credentials work
pnpm check && pnpm test
```

## How it talks to BrowserStack

The SDK's `middleware` hook rewrites each request to `/gateway?url=…` on the dev/preview server
(`server/gateway-plugin.ts`), which uses `@dot-slash/browserstack-router` to forward to the allowlisted
TRA hosts with Basic auth. The browser never calls browserstack.com directly, so there is no CORS issue.

Credentials are held in `sessionStorage` and sent to the gateway as headers. That suits a local/internal tool;
for a public deployment, keep them server-side behind your own auth.
