# Design: Umbrella SDK Package (`@dot-slash/browserstack-client`)

**Date:** 2026-05-24  
**Status:** Approved

## Overview

Add a new `packages/sdk` workspace package named `@dot-slash/browserstack-client` that re-exports all BrowserStack product clients under one install. Users who want everything get a single `npm i @dot-slash/browserstack-client`; users who care about bundle size can import selectively via subpath exports.

## Goals

- Single install entry point for all BrowserStack clients
- Subpath exports per product for tree-shakeable selective imports
- Core types (`APIClient`, `BrowserStackOptions`, errors) publicly accessible via `./core` subpath
- Versioning synchronized with the rest of the monorepo (all packages move together)
- Consistent with existing package structure — no special-casing

## Non-Goals

- Inlining/bundling product package code (this is a re-export layer, not a monolithic bundle)
- Independent versioning from the rest of the monorepo
- Namespaced object exports (e.g. `Automate.Client`) — flat named exports only

## Side Effects

Two currently-private packages are made public as part of this work:

- `@dot-slash/browserstack-local-testing-api` (`packages/local-testing`) — remove `"private": true`
- `@dot-slash/browserstack-core` (`packages/core`) — remove `"private": true`

Both are useful standalone; making them public is a net positive.

## Package Structure

```
packages/sdk/
  package.json         # @dot-slash/browserstack-client, version 6.1.0
  tsup.config.ts       # multiple entry points, mirrors other packages
  tsconfig.json        # mirrors other packages
  src/
    index.ts                  # flat barrel — re-exports all subpaths
    automate/index.ts         # re-exports @dot-slash/browserstack-automate
    app-automate/index.ts     # re-exports @dot-slash/browserstack-app-automate
    local-testing/index.ts    # re-exports both local-testing-api + local-testing-binary
    accessibility/index.ts    # re-exports @dot-slash/browserstack-accessibility
    test-management/index.ts  # re-exports @dot-slash/browserstack-test-management
    test-reporting/index.ts   # re-exports @dot-slash/browserstack-test-reporting
    screenshots/index.ts      # re-exports @dot-slash/browserstack-screenshots
    core/index.ts             # re-exports @dot-slash/browserstack-core
```

## Exports Map (`package.json`)

```json
{
  ".":                { "types": "./dist/index.d.ts",                  "import": "./dist/index.js",                  "require": "./dist/index.cjs" },
  "./automate":       { "types": "./dist/automate/index.d.ts",         "import": "./dist/automate/index.js",         "require": "./dist/automate/index.cjs" },
  "./app-automate":   { "types": "./dist/app-automate/index.d.ts",     "import": "./dist/app-automate/index.js",     "require": "./dist/app-automate/index.cjs" },
  "./local-testing":  { "types": "./dist/local-testing/index.d.ts",    "import": "./dist/local-testing/index.js",    "require": "./dist/local-testing/index.cjs" },
  "./accessibility":  { "types": "./dist/accessibility/index.d.ts",    "import": "./dist/accessibility/index.js",    "require": "./dist/accessibility/index.cjs" },
  "./test-management":{ "types": "./dist/test-management/index.d.ts",  "import": "./dist/test-management/index.js",  "require": "./dist/test-management/index.cjs" },
  "./test-reporting": { "types": "./dist/test-reporting/index.d.ts",   "import": "./dist/test-reporting/index.js",   "require": "./dist/test-reporting/index.cjs" },
  "./screenshots":    { "types": "./dist/screenshots/index.d.ts",      "import": "./dist/screenshots/index.js",      "require": "./dist/screenshots/index.cjs" },
  "./core":           { "types": "./dist/core/index.d.ts",             "import": "./dist/core/index.js",             "require": "./dist/core/index.cjs" },
  "./package.json":   "./package.json"
}
```

## tsup Configuration

Multiple entry points, one per subpath:

```ts
entry: {
  index:                "src/index.ts",
  "automate/index":     "src/automate/index.ts",
  "app-automate/index": "src/app-automate/index.ts",
  "local-testing/index":"src/local-testing/index.ts",
  "accessibility/index":"src/accessibility/index.ts",
  "test-management/index": "src/test-management/index.ts",
  "test-reporting/index":  "src/test-reporting/index.ts",
  "screenshots/index":  "src/screenshots/index.ts",
  "core/index":         "src/core/index.ts",
}
```

Format: `["esm", "cjs"]` with `dts: true` — identical to all other packages.

## Dependencies

All product packages and core listed as regular `dependencies` at `workspace:*`:

- `@dot-slash/browserstack-automate`
- `@dot-slash/browserstack-app-automate`
- `@dot-slash/browserstack-local-testing-api`
- `@dot-slash/browserstack-local-testing`
- `@dot-slash/browserstack-accessibility`
- `@dot-slash/browserstack-test-management`
- `@dot-slash/browserstack-test-reporting`
- `@dot-slash/browserstack-screenshots`
- `@dot-slash/browserstack-core`

## Build Order

pnpm resolves build order from the `workspace:*` dependency graph. `packages/sdk` depends on all product packages, so it builds last automatically — no manual ordering needed. The existing root `build:ts` script covers it.

## Usage Examples

```ts
// Everything from one import
import { AutomateClient, AppAutomateClient, LocalTestingBinary } from "@dot-slash/browserstack-client";

// Selective subpath import (tree-shakeable)
import { AutomateClient } from "@dot-slash/browserstack-client/automate";

// Core types for extension
import { APIClient, BrowserStackOptions } from "@dot-slash/browserstack-client/core";

// Local testing — API client + binary manager together
import { LocalTestingClient, LocalTestingBinary } from "@dot-slash/browserstack-client/local-testing";
```

## README Update

The Installation section gets the umbrella package added at the top as the "install everything" option, above the individual package list.

## Out of Scope

- Publishing changes / npm release workflow
- Changelog or migration guide
- Any changes to individual package internals
