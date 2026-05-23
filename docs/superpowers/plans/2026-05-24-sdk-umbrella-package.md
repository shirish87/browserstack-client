# SDK Umbrella Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `packages/sdk` as the `@dot-slash/browserstack-client` umbrella package that re-exports all BrowserStack product clients via a flat barrel and per-product subpath exports.

**Architecture:** A new workspace package follows the same tsup/ESM+CJS pattern as every other package in the monorepo. It re-exports from product packages as `dependencies` (no code inlining). Two currently-private packages (`core`, `local-testing-api`) are made public. The SDK package builds last naturally via pnpm's dependency graph.

**Tech Stack:** TypeScript, tsup, pnpm workspaces, ESM+CJS dual output.

---

## File Map

**Create:**
- `packages/sdk/package.json` — package manifest for `@dot-slash/browserstack-client`
- `packages/sdk/tsconfig.json` — extends `../../tsconfig.base.json`, paths to workspace sources
- `packages/sdk/tsup.config.ts` — multi-entry tsup config, `platform: "node"` (due to local-testing-binary)
- `packages/sdk/src/index.ts` — flat barrel re-exporting all submodules
- `packages/sdk/src/automate/index.ts` — re-exports `@dot-slash/browserstack-automate`
- `packages/sdk/src/app-automate/index.ts` — re-exports `@dot-slash/browserstack-app-automate`
- `packages/sdk/src/local-testing/index.ts` — re-exports both `@dot-slash/browserstack-local-testing-api` and `@dot-slash/browserstack-local-testing`
- `packages/sdk/src/accessibility/index.ts` — re-exports `@dot-slash/browserstack-accessibility`
- `packages/sdk/src/test-management/index.ts` — re-exports `@dot-slash/browserstack-test-management`
- `packages/sdk/src/test-reporting/index.ts` — re-exports `@dot-slash/browserstack-test-reporting`
- `packages/sdk/src/screenshots/index.ts` — re-exports `@dot-slash/browserstack-screenshots`
- `packages/sdk/src/core/index.ts` — re-exports `@dot-slash/browserstack-core`

**Modify:**
- `packages/core/package.json` — remove `"private": true`
- `packages/local-testing/package.json` — remove `"private": true`
- `README.md` — add umbrella install option at top of Installation section

---

### Task 1: Make `core` and `local-testing-api` public

**Files:**
- Modify: `packages/core/package.json`
- Modify: `packages/local-testing/package.json`

- [ ] **Step 1: Remove `"private": true` from core**

In `packages/core/package.json`, remove the line:
```json
"private": true,
```
Also add `publishConfig` immediately after `"name"` (matching the pattern of other published packages):
```json
"publishConfig": {
  "access": "public"
},
```

- [ ] **Step 2: Remove `"private": true` from local-testing-api**

In `packages/local-testing/package.json`, remove the line:
```json
"private": true,
```
Add `publishConfig` immediately after `"name"`:
```json
"publishConfig": {
  "access": "public"
},
```

- [ ] **Step 3: Commit**

```bash
git add packages/core/package.json packages/local-testing/package.json
git commit -m "feat: make core and local-testing-api packages public"
```

---

### Task 2: Create `packages/sdk/package.json`

**Files:**
- Create: `packages/sdk/package.json`

- [ ] **Step 1: Create the package manifest**

Create `packages/sdk/package.json` with this exact content:

```json
{
  "name": "@dot-slash/browserstack-client",
  "publishConfig": {
    "access": "public"
  },
  "version": "6.1.0",
  "type": "module",
  "description": "BrowserStack SDK — all API clients in one package",
  "engines": {
    "node": ">=20.0.0"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./automate": {
      "types": "./dist/automate/index.d.ts",
      "import": "./dist/automate/index.js",
      "require": "./dist/automate/index.cjs"
    },
    "./app-automate": {
      "types": "./dist/app-automate/index.d.ts",
      "import": "./dist/app-automate/index.js",
      "require": "./dist/app-automate/index.cjs"
    },
    "./local-testing": {
      "types": "./dist/local-testing/index.d.ts",
      "import": "./dist/local-testing/index.js",
      "require": "./dist/local-testing/index.cjs"
    },
    "./accessibility": {
      "types": "./dist/accessibility/index.d.ts",
      "import": "./dist/accessibility/index.js",
      "require": "./dist/accessibility/index.cjs"
    },
    "./test-management": {
      "types": "./dist/test-management/index.d.ts",
      "import": "./dist/test-management/index.js",
      "require": "./dist/test-management/index.cjs"
    },
    "./test-reporting": {
      "types": "./dist/test-reporting/index.d.ts",
      "import": "./dist/test-reporting/index.js",
      "require": "./dist/test-reporting/index.cjs"
    },
    "./screenshots": {
      "types": "./dist/screenshots/index.d.ts",
      "import": "./dist/screenshots/index.js",
      "require": "./dist/screenshots/index.cjs"
    },
    "./core": {
      "types": "./dist/core/index.d.ts",
      "import": "./dist/core/index.js",
      "require": "./dist/core/index.cjs"
    },
    "./package.json": "./package.json"
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "sideEffects": false,
  "scripts": {
    "build": "tsup",
    "typecheck": "tsc --noEmit || true"
  },
  "dependencies": {
    "@dot-slash/browserstack-automate": "workspace:*",
    "@dot-slash/browserstack-app-automate": "workspace:*",
    "@dot-slash/browserstack-local-testing-api": "workspace:*",
    "@dot-slash/browserstack-local-testing": "workspace:*",
    "@dot-slash/browserstack-accessibility": "workspace:*",
    "@dot-slash/browserstack-test-management": "workspace:*",
    "@dot-slash/browserstack-test-reporting": "workspace:*",
    "@dot-slash/browserstack-screenshots": "workspace:*",
    "@dot-slash/browserstack-core": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8.5.1",
    "typescript": "^6.0.3"
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/sdk/package.json
git commit -m "feat(sdk): add package.json for @dot-slash/browserstack-client"
```

---

### Task 3: Create `packages/sdk/tsconfig.json` and `tsup.config.ts`

**Files:**
- Create: `packages/sdk/tsconfig.json`
- Create: `packages/sdk/tsup.config.ts`

- [ ] **Step 1: Create tsconfig.json**

Create `packages/sdk/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "ignoreDeprecations": "6.0",
    "noEmit": true,
    "paths": {
      "@dot-slash/browserstack-core": ["../core/src/index.ts"],
      "@dot-slash/browserstack-automate": ["../automate/src/index.ts"],
      "@dot-slash/browserstack-app-automate": ["../app-automate/src/index.ts"],
      "@dot-slash/browserstack-local-testing-api": ["../local-testing/src/index.ts"],
      "@dot-slash/browserstack-local-testing": ["../local-testing-binary/src/index.ts"],
      "@dot-slash/browserstack-accessibility": ["../accessibility/src/index.ts"],
      "@dot-slash/browserstack-test-management": ["../test-management/src/index.ts"],
      "@dot-slash/browserstack-test-reporting": ["../test-reporting/src/index.ts"],
      "@dot-slash/browserstack-screenshots": ["../screenshots/src/index.ts"]
    }
  },
  "include": ["src"]
}
```

- [ ] **Step 2: Create tsup.config.ts**

Create `packages/sdk/tsup.config.ts`:

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "automate/index": "src/automate/index.ts",
    "app-automate/index": "src/app-automate/index.ts",
    "local-testing/index": "src/local-testing/index.ts",
    "accessibility/index": "src/accessibility/index.ts",
    "test-management/index": "src/test-management/index.ts",
    "test-reporting/index": "src/test-reporting/index.ts",
    "screenshots/index": "src/screenshots/index.ts",
    "core/index": "src/core/index.ts",
  },
  format: ["esm", "cjs"],
  platform: "node",
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  external: [
    "@dot-slash/browserstack-automate",
    "@dot-slash/browserstack-app-automate",
    "@dot-slash/browserstack-local-testing-api",
    "@dot-slash/browserstack-local-testing",
    "@dot-slash/browserstack-accessibility",
    "@dot-slash/browserstack-test-management",
    "@dot-slash/browserstack-test-reporting",
    "@dot-slash/browserstack-screenshots",
    "@dot-slash/browserstack-core",
  ],
});
```

Note: all product packages are `external` — we are re-exporting, not bundling. `dts: false` because the `types` fields in `exports` point at each product package's own `.d.ts` files via the re-exports; TypeScript resolves them through the dependency graph.

- [ ] **Step 3: Commit**

```bash
git add packages/sdk/tsconfig.json packages/sdk/tsup.config.ts
git commit -m "feat(sdk): add tsconfig and tsup config"
```

---

### Task 4: Create per-product source files

**Files:**
- Create: `packages/sdk/src/automate/index.ts`
- Create: `packages/sdk/src/app-automate/index.ts`
- Create: `packages/sdk/src/local-testing/index.ts`
- Create: `packages/sdk/src/accessibility/index.ts`
- Create: `packages/sdk/src/test-management/index.ts`
- Create: `packages/sdk/src/test-reporting/index.ts`
- Create: `packages/sdk/src/screenshots/index.ts`
- Create: `packages/sdk/src/core/index.ts`

- [ ] **Step 1: Create automate subpath**

Create `packages/sdk/src/automate/index.ts`:
```ts
export * from "@dot-slash/browserstack-automate";
```

- [ ] **Step 2: Create app-automate subpath**

Create `packages/sdk/src/app-automate/index.ts`:
```ts
export * from "@dot-slash/browserstack-app-automate";
```

- [ ] **Step 3: Create local-testing subpath**

Create `packages/sdk/src/local-testing/index.ts`:
```ts
export * from "@dot-slash/browserstack-local-testing-api";
export * from "@dot-slash/browserstack-local-testing";
```

- [ ] **Step 4: Create accessibility subpath**

Create `packages/sdk/src/accessibility/index.ts`:
```ts
export * from "@dot-slash/browserstack-accessibility";
```

- [ ] **Step 5: Create test-management subpath**

Create `packages/sdk/src/test-management/index.ts`:
```ts
export * from "@dot-slash/browserstack-test-management";
```

- [ ] **Step 6: Create test-reporting subpath**

Create `packages/sdk/src/test-reporting/index.ts`:
```ts
export * from "@dot-slash/browserstack-test-reporting";
```

- [ ] **Step 7: Create screenshots subpath**

Create `packages/sdk/src/screenshots/index.ts`:
```ts
export * from "@dot-slash/browserstack-screenshots";
```

- [ ] **Step 8: Create core subpath**

Create `packages/sdk/src/core/index.ts`:
```ts
export * from "@dot-slash/browserstack-core";
```

- [ ] **Step 9: Commit**

```bash
git add packages/sdk/src/
git commit -m "feat(sdk): add per-product subpath source files"
```

---

### Task 5: Create the flat barrel `src/index.ts`

**Files:**
- Create: `packages/sdk/src/index.ts`

- [ ] **Step 1: Create the barrel**

Create `packages/sdk/src/index.ts`:
```ts
export * from "./automate/index";
export * from "./app-automate/index";
export * from "./local-testing/index";
export * from "./accessibility/index";
export * from "./test-management/index";
export * from "./test-reporting/index";
export * from "./screenshots/index";
export * from "./core/index";
```

- [ ] **Step 2: Commit**

```bash
git add packages/sdk/src/index.ts
git commit -m "feat(sdk): add flat barrel index"
```

---

### Task 6: Install dependencies and build

**Files:** none (build artifacts in `packages/sdk/dist/`, gitignored)

- [ ] **Step 1: Install workspace dependencies**

Run from the repo root:
```bash
pnpm install
```
Expected: pnpm resolves `workspace:*` deps and links `packages/sdk` node_modules to sibling packages. No errors.

- [ ] **Step 2: Build all packages in dependency order**

```bash
pnpm build:types && pnpm build:ts
```
Expected: all packages build, `packages/sdk` builds last (after its deps). Output ends with something like:
```
@dot-slash/browserstack-client: build
```
with no errors.

- [ ] **Step 3: Typecheck the SDK package**

```bash
pnpm --filter @dot-slash/browserstack-client run typecheck
```
Expected: exits 0 (the `|| true` in the script means warnings are non-fatal, but there should be no errors).

- [ ] **Step 4: Verify dist output**

```bash
ls packages/sdk/dist/
```
Expected output includes:
```
automate/
app-automate/
local-testing/
accessibility/
test-management/
test-reporting/
screenshots/
core/
index.js
index.cjs
```

- [ ] **Step 5: Commit nothing** — dist is gitignored. Move on.

---

### Task 7: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add umbrella install option**

In `README.md`, replace the current Installation section's opening paragraph/code block. The new Installation section should read:

```markdown
## Installation

Install all BrowserStack clients at once:

```bash
$ npm i @dot-slash/browserstack-client
```

Or install only the client(s) you need:

```bash
# Automate
$ npm i @dot-slash/browserstack-automate

# App Automate
$ npm i @dot-slash/browserstack-app-automate

# Local Testing (API & Binary)
$ npm i @dot-slash/browserstack-local-testing-api @dot-slash/browserstack-local-testing

# Accessibility
$ npm i @dot-slash/browserstack-accessibility

# Test Management
$ npm i @dot-slash/browserstack-test-management

# Test Reporting & Analytics
$ npm i @dot-slash/browserstack-test-reporting

# Screenshots
$ npm i @dot-slash/browserstack-screenshots
```
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add @dot-slash/browserstack-client umbrella install to README"
```

---

## Self-Review

**Spec coverage:**
- ✅ New `packages/sdk` package — Tasks 2–5
- ✅ Subpath exports per product — Tasks 3–5
- ✅ Flat barrel top-level — Task 5
- ✅ `core` made public — Task 1
- ✅ `local-testing-api` made public — Task 1
- ✅ Versioning synchronized (6.1.0) — Task 2
- ✅ Same tsup/ESM+CJS build pattern — Task 3
- ✅ Build order via pnpm dep graph — Task 6
- ✅ README update — Task 7

**Placeholder scan:** None found.

**Type consistency:** No types defined in this plan — all types flow through from the product packages via `export *`. No consistency issues.
