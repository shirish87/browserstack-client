# Design: Test Reporting & Test Management Consistency Audit

**Date:** 2026-04-25
**Branch:** feature/cli-unified-binary

## Context

Two new product packages — `@browserstack-client/test-reporting` and `@browserstack-client/test-management` — were added by a coding agent. The goal of this work is to bring both packages to full consistency with:

1. The established architecture (thin client wrapper over generated base, YAML spec as source of truth, no hand-written client logic)
2. The public BrowserStack API documentation (complete endpoint coverage)
3. The testing standard (comprehensive integration tests against the live API, matching the automate/test-management pattern)
4. The CLI standard (every SDK method reachable via a CLI action)

## Current State

### Test Management
- OpenAPI spec: **complete** (51 paths across projects, folders, test-cases, test-runs, test-plans, test-results, attachments, configurations, custom-fields)
- Generated client: complete
- Thin wrapper: correct pattern
- **Gaps:** test suite missing coverage for test-results, test-result attachments, test-run test-cases, assign, bulk-with-operations, test-plan update/linked-runs; CLI needs audit for same

### Test Reporting
- OpenAPI spec: **severely incomplete** — 6 paths, public API has ~24
- Generated client: reflects the incomplete spec
- Thin wrapper: correct pattern but `uploadBaseUrl` not wired
- **Gaps:** missing build detail endpoints, latest build, ingestion lifecycle (7 endpoints), quality gates (8 endpoints), self-healing report, Allure upload
- Test suite: 2 unit tests (initialization only), no integration tests

## Architecture Principles (unchanged)

- YAML spec is the source of truth — all changes start in the spec file
- `pnpm build:types` regenerates everything downstream (types + generated client)
- Thin wrapper (`packages/{product}/src/index.ts`) only sets constructor args — no hand-written methods
- Tests are integration tests against the live API using `resolveUsername()` / `resolveAccessKey()`
- CLI subcommands expose every SDK method as a CLI action

## Design

### 1. Test Reporting — OpenAPI spec expansion

**File:** `packages/openapi/specs/test-reporting.yml`

Add the following path groups, with full request/response schemas inline in `components/schemas`:

#### Build endpoints (add to existing `/builds` group)
- `GET /builds/latest` — query params: `project_name` (req), `build_name`, `user_name`, `build_tags`, `framework`
- Response: full `BuildDetails` schema (name, description, status, duration, tags, alerts, build_id, build_number, vcs_info, ci_info, host_info, etc.)
- `GET /builds/{buildId}` already exists but uses stub `Build` schema — upgrade to `BuildDetails`

#### Ingestion lifecycle (7 endpoints)
All on base `https://api-automation.browserstack.com/ext/v1`:
- `POST /builds/start` → body: name, project_name, started_at, tags, build_run_identifier, host_info, ci_info, version_control, framework; response: `{ success, build_hashed_id }`
- `PUT /builds/{buildHashedId}/finish` → body: finished_at; response: `{ success, message }`
- `POST /builds/{buildHashedId}/tests/start` → body: name, file_name, scopes, started_at, tags, location, result, custom_metadata, environment, body; response: `{ success, uuid }`
- `PUT /builds/{buildHashedId}/tests/{testRunUuid}/finish` → body: result, finished_at, file_name, scopes, duration_in_ms, failure, custom_metadata; response: `{ success, message }`
- `POST /builds/{buildHashedId}/hooks/start` → body: hook_type, name, file_name, scopes, started_at, test_run_id, tags, location; response: `{ success, uuid }`
- `PUT /builds/{buildHashedId}/hooks/{hookRunUuid}/finish` → body: hook_type, result, finished_at, file_name, scopes, duration_in_ms, failure; response: `{ success, message }`
- `POST /builds/{buildHashedId}/logs` → body: logs array (kind, timestamp, level, message, test_run_uuid, hook_run_uuid, etc.); response: `{ success, message }`

#### Quality gates (8 endpoints)
- `GET /quality-gates/{buildUuid}` — status for a build
- `GET /quality-gates/{projectName}/settings`
- `PUT /quality-gates/{projectName}/settings` → body: `{ enabled }`
- `GET /quality-gates/{projectName}/profiles/{profileUuid}`
- `POST /quality-gates/{projectName}/profiles` → body: name, enabled, isGlobalProfile, rules, applicableBuilds, ruleStatus, hooksVisibility
- `PUT /quality-gates/{projectName}/profiles/{profileUuid}` → same body
- `PUT /quality-gates/{projectName}/profiles/{profileUuid}/toggle` → body: `{ enabled }`
- `DELETE /quality-gates/{projectName}/profiles/{profileUuid}`

#### Self-healing report
- `GET /builds/{buildUuid}/selfHealingReport` → response: `{ presignedUrl, expiresAt }`

#### Upload expansion
- Rename existing `/junit/upload` path to `/upload` (or add `/allure/upload`) to handle Allure format
- Add `format` field to upload schema; `x-request-transform: multipart`
- Upload methods use `baseUrl: "sdkCloud"` in the generated execute call

### 2. Test Reporting — thin wrapper update

**File:** `packages/test-reporting/src/index.ts`

```typescript
export class TestReportingClient extends GeneratedTestReportingClient {
  constructor(options?: BrowserStackOptions & { uploadBaseUrl?: string }) {
    super(
      options ?? {},
      options?.baseUrl ?? "https://api-automation.browserstack.com/ext/v1",
      options?.uploadBaseUrl ?? "https://upload-automation.browserstack.com",
      "@browserstack-client/test-reporting",
      "6.0.0"
    );
  }
}
```

Upload operations in the spec use `baseUrl: "sdkCloud"` so they route to the upload base URL.

### 3. Test Reporting — integration test suite

**Files:**
- `packages/test-reporting/src/__tests__/setup.ts` — new file
- `packages/test-reporting/src/__tests__/test-reporting.test.ts` — replace current 2-test stub

**`setup.ts` pattern** (matches test-management):
```typescript
export const testReportingContext = {
  client,
  randomProjectId: async () => { ... },       // GET /projects, pick random
  randomBuildId: async (projectId) => { ... }, // GET /projects/{id}/builds, pick random
  randomBuildUuid: async () => { ... },        // GET /builds/{id} → build_id field
};
```

**Test groups:**
- Projects: list
- Builds: list (with projectId), get, get-latest, update (tags)
- Test runs: list by buildId
- Self-healing: get report (presignedUrl defined)
- Quality gates: get status, get settings (read-only; profile CRUD via create→verify→delete cycle)
- Ingestion: one end-to-end flow — startBuild → startTestRun → finishTestRun → finishBuild → verify build appears in list
- Upload: JUnit upload + Allure upload (both with a minimal fixture file)

### 4. Test Management — test suite gaps

**File:** `packages/test-management/src/__tests__/test-management.test.ts`

Add test groups for currently-untested methods:

- **Test run test cases:** `getTestManagementTestRunTestCases(projectId, testRunId)` — verify array returned
- **Assign test cases:** `assignTestManagementTestRunTestCases(projectId, testRunId, body)` — create run, assign, verify
- **Test results (run-level):** `getTestManagementTestRunResults`, `addTestManagementTestRunResult` (single + bulk + with steps)
- **Test results (test-case-level):** `getTestManagementTestRunTestCaseResults`, `getTestManagementTestCaseResults`
- **Test result attachments:** `getTestManagementTestResultAttachments`, `addTestManagementTestResultAttachment`, `deleteTestManagementTestResultAttachment`
- **Bulk with operations:** `bulkEditTestManagementTestCasesWithOperations`
- **Test plan update (POST):** `updateTestManagementTestPlan`
- **Test plan linked runs:** `getTestManagementTestPlanTestRuns`

**`setup.ts` addition:** `randomTestResultId(projectId, testRunId)` helper.

### 5. Test Management — CLI audit

**File:** `packages/cli/src/browserstack-test-management.ts`

Audit and add missing CLI actions for:
- `test-runs`: `test-cases` action (calls `getTestManagementTestRunTestCases`), `assign` action
- `test-runs`: `results` action (list + add), `test-case-results` action
- `test-results`: new resource handler for result-level attachments (get, add, delete)
- `test-plans`: `update` and `test-runs` actions if missing

### 6. Test Reporting — CLI expansion

**File:** `packages/cli/src/browserstack-test-reporting.ts`

Add missing actions:
- `builds`: `latest` action, `self-healing-report` action
- `ingestion`: new resource handler — `start-build`, `finish-build`, `start-test-run`, `finish-test-run`, `start-hook`, `finish-hook`, `add-logs`
- `quality-gates`: new resource handler — `status`, `settings`, `get-profile`, `create-profile`, `update-profile`, `toggle-profile`, `delete-profile`
- `upload`: `allure` action (alongside existing `junit`)

## Verification

```bash
# 1. Regenerate types and clients after spec changes
pnpm build:types

# 2. Type-check all packages
pnpm typecheck

# 3. Run test-reporting tests
pnpm test -- --project test-reporting

# 4. Run test-management tests
pnpm test -- --project test-management

# 5. Smoke-test CLI
node packages/cli/dist/browserstack-test-reporting.js projects list
node packages/cli/dist/browserstack-test-reporting.js builds list
node packages/cli/dist/browserstack-test-management.js test-runs results list <projectId> <testRunId>
```

## Files Modified

| File | Change |
|------|--------|
| `packages/openapi/specs/test-reporting.yml` | Expand from 6 to ~24 paths with full schemas |
| `packages/openapi/generated/test-reporting.ts` | Regenerated (do not edit manually) |
| `packages/openapi/generated/test-reporting.client.ts` | Regenerated (do not edit manually) |
| `packages/test-reporting/src/index.ts` | Add `uploadBaseUrl` constructor option |
| `packages/test-reporting/src/__tests__/setup.ts` | New file — test context + helpers |
| `packages/test-reporting/src/__tests__/test-reporting.test.ts` | Replace stub with full integration suite |
| `packages/test-management/src/__tests__/test-management.test.ts` | Add missing test groups |
| `packages/test-management/src/__tests__/setup.ts` | Add `randomTestResultId` helper |
| `packages/cli/src/browserstack-test-reporting.ts` | Add ingestion, quality-gates, latest, self-healing, allure |
| `packages/cli/src/browserstack-test-management.ts` | Add results, result-attachments, assign, test-cases-in-run |
