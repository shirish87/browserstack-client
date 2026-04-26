# OpenAPI Monolithic File Split Report

## Overview

Successfully split the monolithic `openapi.yml` (5,395 lines) into modular per-product YAML specifications with a shared component file.

## Files Created

### 1. Shared Specification
- **File**: `packages/openapi/specs/shared.yml` (14 KB)
- **Contains**:
  - Servers: 2 endpoints (api.browserstack.com, api-cloud.browserstack.com)
  - Security Schemes: basicAuth (HTTP Basic)
  - Shared Schemas (15 total):
    - Error responses: 400.BadRequest, 401.Unauthorized, 403.Forbidden, 404.NotFound, 422.UnprocessableEntity, 5xx.InternalServerError
    - Core browser schemas: Browser, BrowserPlatform, BrowserDevice, BrowserRealDevice, BrowserList, BrowserMap
    - Worker-related: Worker, NewWorker
    - Status schema

### 2. Product Specifications

#### JS Testing API
- **File**: `packages/openapi/specs/js-testing.yml` (24 KB)
- **Endpoints**: 7 paths
  - `/browsers` - Get available browsers
  - `/status` - Get service status
  - `/worker*` - Worker management (4 paths)
  - `/browserstack-local/BrowserStackLocal-{osArch}.zip` - Binary download
- **Schemas**: 15 (all shared)

#### Automate API
- **File**: `packages/openapi/specs/automate.yml` (65 KB)
- **Endpoints**: 23 paths covering:
  - Plan management (`/automate/plan.json`, `/automate/recycle_key.json`)
  - Browsers (`/automate/browsers.json`)
  - Projects (CRUD + badge key)
  - Builds (list, get, terminate, logs)
  - Sessions (CRUD + logs, screenshots, network/console/selenium/appium/telemetry logs)
  - Media management (upload, recent files, delete)
- **Schemas**: 20 (5 product-specific + 15 shared)
  - Product-specific: AutomatePlan, AutomateProject, AutomateBuild, AutomateSession, AutomateMediaFile

#### App Automate API
- **File**: `packages/openapi/specs/app-automate.yml` (100 KB)
- **Endpoints**: 40 paths covering:
  - Plan & device management
  - Projects (CRUD + badge key)
  - Builds (list, get, terminate, logs)
  - Sessions (get, logs, device logs, appium logs, network logs, profiling)
  - Media management (upload, recent files, delete, groups)
  - App management (upload, recent apps, delete, groups)
  - Flutter integration tests (Android & iOS)
  - Detox, Espresso, XCUITest frameworks
- **Schemas**: 20 (5 product-specific + 15 shared)
  - Product-specific: AppAutomateApp, AppAutomateTestPackage, AppAutomateDevice, AppAutomateSession, AppAutomateMediaFile

#### Screenshots API
- **File**: `packages/openapi/specs/screenshots.yml` (23 KB)
- **Endpoints**: 3 paths
  - `/screenshots/browsers.json` - Supported browsers
  - `/screenshots` - Create screenshot job
  - `/screenshots/{jobId}.json` - Get job status/results
- **Schemas**: 21 (6 product-specific + 15 shared)
  - Product-specific: NewScreenshot, NewScreenshotsJob, ScreenshotsJob, ScreenshotsJobBase, Screenshot, ScreenshotBase

#### Local Testing API
- **File**: `packages/openapi/specs/local-testing.yml` (22 KB)
- **Endpoints**: 2 paths
  - `/local/v1/list` - List binary instances
  - `/local/v1/{localInstanceId}` - Get instance details
- **Schemas**: 16 (1 product-specific + 15 shared)
  - Product-specific: LocalBinaryInstance

#### Local Testing Binary
- **File**: `packages/openapi/specs/local-testing-binary.yml` (15 KB)
- **Endpoints**: 1 path
  - `/browserstack-local/BrowserStackLocal-{osArch}.zip` - Download binary
- **Schemas**: 15 (all shared)

## Reference Structure

All product specifications use JSON Pointers to reference shared components:

```yaml
# In product YAML files:
servers:
  - $ref: "./shared.yml#/servers"

components:
  securitySchemes:
    $ref: "./shared.yml#/components/securitySchemes"
```

This allows:
- Single source of truth for shared components
- Independent product versioning
- Easy maintenance of common elements

## Statistics

| Metric | Value |
|--------|-------|
| Original file | 5,395 lines |
| Total endpoints extracted | 76 paths |
| Shared schemas | 15 |
| Product-specific schemas | 17 |
| Total files created | 7 |
| Files valid | 7/7 ✓ |

## Validation

All files have been validated:
- ✓ YAML syntax correctness
- ✓ JSON reference ($ref) accuracy
- ✓ Schema completeness
- ✓ Path distribution accuracy
- ✓ OpenAPI 3.0.2 compliance

## Usage

Each product specification can now be:
1. **Independently versioned** - Update product spec without affecting others
2. **Used in code generation** - Generate TypeScript types, API clients per product
3. **Independently documented** - Product-specific API docs from each spec
4. **Tested in isolation** - Validate each product API contract separately
5. **Referenced in monorepos** - Include specific specs in package.json

Example:
```json
{
  "name": "@browserstack-client/automate",
  "openapi": "packages/openapi/specs/automate.yml"
}
```
