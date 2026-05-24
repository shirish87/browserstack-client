# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BrowserStack client SDK monorepo — TypeScript clients wrapping all BrowserStack REST APIs. Uses pnpm workspaces with ESM-only packages. Targets Node.js >= 18 (requires Fetch API).

## Common Commands

```bash
# Install dependencies
pnpm install

# Build all packages (openapi types must be built first)
pnpm build:types && pnpm build

# Run all tests (integration tests — require BROWSERSTACK_USERNAME and BROWSERSTACK_KEY env vars)
pnpm test

# Run tests for a single package
pnpm test -- --project automate

# Run a single test file
pnpm test -- --project automate -- src/__tests__/automate.test.ts

# Watch mode
pnpm test:watch

# Type-check all packages
pnpm check

# Lint
pnpm lint

# Regenerate OpenAPI types from specs
pnpm build:types
```

## Architecture

### Monorepo Structure (pnpm workspaces)

- **`packages/openapi`** — OpenAPI YAML specs (`specs/`) and generated TypeScript types (`generated/`). Built via `node build.mjs` which bundles/validates specs with swagger-parser, then generates TS types with `openapi-typescript`. All other packages depend on these generated types.
- **`packages/core`** — Shared runtime: `APIClient` base class (wraps `openapi-fetch`), auth helpers, error types, env resolution, HTTP adapter interfaces (fetch/axios/got). Every API client package depends on this.
- **`packages/automate`** — BrowserStack Automate API client
- **`packages/app-automate`** — BrowserStack App Automate API client
- **`packages/js-testing`** — BrowserStack JavaScript Testing API client
- **`packages/screenshots`** — BrowserStack Screenshots API client
- **`packages/local-testing`** — BrowserStack Local Testing API client
- **`packages/local-testing-binary`** — Node.js-specific: manages the BrowserStackLocal binary (download, start, stop). Uses `node:*` modules.
- **`packages/cli`** — CLI entry points for local testing and app-automate

### Key Patterns

**API client pattern:** Each API client extends `APIClient<paths>` from core, where `paths` is the generated OpenAPI type for that API. Methods call `this.makeGetRequest()`, `this.makePostRequest()`, etc. — type-safe wrappers around `openapi-fetch` that handle error extraction.

**Two base URLs:** `APIClient` creates two `openapi-fetch` instances: `this.sdk` (api.browserstack.com) and `this.sdkCloud` (api-cloud.browserstack.com). Methods use `makeCloudGetRequest`/`makeCloudPostRequest` for cloud endpoints.

**Auth resolution:** Username from `options.username` or `BROWSERSTACK_USERNAME` env var. Access key from `options.accessKey`, `BROWSERSTACK_ACCESS_KEY`, or `BROWSERSTACK_KEY` env var. Resolved in `core/src/api-client.ts`.

**Build tooling:** Each package uses `tsup` for ESM bundling. OpenAPI types package uses a custom `build.mjs` script.

### Testing

Tests are **integration tests** that hit the live BrowserStack API. They require valid credentials in environment variables. Each package has `src/__tests__/setup.ts` that creates client instances and helpers (e.g., `randomBuildId()`, `randomSessionId()`). Shared test utilities are in `packages/core/src/__tests__/test-utils.ts`.

Test framework: Vitest with workspace configuration (`vitest.workspace.ts`) — each package is a separate test project.

## Testing Requirements

Every new feature, bug fix, or behavior change MUST follow TDD — no exceptions:

1. Write a failing test first and confirm it fails for the right reason
2. Write minimal code to make it pass
3. No production code without a corresponding test

Use `pnpm test -- --project <package>` to run tests for the affected package. For unit-level tests (no live API needed), use a mock fetch via `packages/core/src/__tests__/mock-fetch.ts`.
