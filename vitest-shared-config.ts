import path from "path";

export function getSharedAliases(packageDir: string) {
  return {
    "@browserstack-client/core": path.resolve(packageDir, "../core/src/index.ts"),
    "@browserstack-client/openapi-transforms": path.resolve(packageDir, "../openapi-transforms/src/index.ts"),
    "@browserstack-client/openapi/automate/client": path.resolve(packageDir, "../openapi/generated/automate.client.ts"),
    "@browserstack-client/openapi/automate": path.resolve(packageDir, "../openapi/generated/automate.ts"),
    "@browserstack-client/openapi/test-management/client": path.resolve(packageDir, "../openapi/generated/test-management.client.ts"),
    "@browserstack-client/openapi/test-management": path.resolve(packageDir, "../openapi/generated/test-management.ts"),
    "@browserstack-client/openapi/accessibility/client": path.resolve(packageDir, "../openapi/generated/accessibility.client.ts"),
    "@browserstack-client/openapi/accessibility": path.resolve(packageDir, "../openapi/generated/accessibility.ts"),
    "@browserstack-client/openapi/test-reporting/client": path.resolve(packageDir, "../openapi/generated/test-reporting.client.ts"),
    "@browserstack-client/openapi/test-reporting": path.resolve(packageDir, "../openapi/generated/test-reporting.ts"),
    "@browserstack-client/openapi": path.resolve(packageDir, "../openapi/generated/index.ts"),
    "@browserstack-client/app-automate": path.resolve(packageDir, "../app-automate/src/index.ts"),
    "@browserstack-client/automate": path.resolve(packageDir, "../automate/src/index.ts"),
    "@browserstack-client/screenshots": path.resolve(packageDir, "../screenshots/src/index.ts"),
    "@browserstack-client/js-testing": path.resolve(packageDir, "../js-testing/src/index.ts"),
    "@browserstack-client/local-testing": path.resolve(packageDir, "../local-testing/src/index.ts"),
    "@browserstack-client/local-testing-binary": path.resolve(packageDir, "../local-testing-binary/src/index.ts"),
    "@browserstack-client/test-management": path.resolve(packageDir, "../test-management/src/index.ts"),
    "@browserstack-client/accessibility": path.resolve(packageDir, "../accessibility/src/index.ts"),
    "@browserstack-client/test-reporting": path.resolve(packageDir, "../test-reporting/src/index.ts"),
    "@browserstack-client/cli": path.resolve(packageDir, "../cli/src/index.ts"),
  };
}
