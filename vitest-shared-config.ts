import path from "path";

export function getSharedAliases(packageDir: string) {
  return {
    "@dot-slash/browserstack-core": path.resolve(packageDir, "../core/src/index.ts"),
    "@dot-slash/browserstack-openapi-transforms": path.resolve(packageDir, "../openapi-transforms/src/index.ts"),
    "@dot-slash/browserstack-openapi/automate/client": path.resolve(packageDir, "../openapi/generated/automate.client.ts"),
    "@dot-slash/browserstack-openapi/automate": path.resolve(packageDir, "../openapi/generated/automate.ts"),
    "@dot-slash/browserstack-openapi/test-management/client": path.resolve(packageDir, "../openapi/generated/test-management.client.ts"),
    "@dot-slash/browserstack-openapi/test-management": path.resolve(packageDir, "../openapi/generated/test-management.ts"),
    "@dot-slash/browserstack-openapi/accessibility/client": path.resolve(packageDir, "../openapi/generated/accessibility.client.ts"),
    "@dot-slash/browserstack-openapi/accessibility": path.resolve(packageDir, "../openapi/generated/accessibility.ts"),
    "@dot-slash/browserstack-openapi/test-reporting/client": path.resolve(packageDir, "../openapi/generated/test-reporting.client.ts"),
    "@dot-slash/browserstack-openapi/test-reporting": path.resolve(packageDir, "../openapi/generated/test-reporting.ts"),
    "@dot-slash/browserstack-openapi": path.resolve(packageDir, "../openapi/generated/index.ts"),
    "@dot-slash/browserstack-app-automate": path.resolve(packageDir, "../app-automate/src/index.ts"),
    "@dot-slash/browserstack-automate": path.resolve(packageDir, "../automate/src/index.ts"),
    "@dot-slash/browserstack-screenshots": path.resolve(packageDir, "../screenshots/src/index.ts"),
    "@dot-slash/browserstack-js-testing": path.resolve(packageDir, "../js-testing/src/index.ts"),
    "@dot-slash/browserstack-local-testing-api": path.resolve(packageDir, "../local-testing/src/index.ts"),
    "@dot-slash/browserstack-local-testing": path.resolve(packageDir, "../local-testing-binary/src/index.ts"),
    "@dot-slash/browserstack-test-management": path.resolve(packageDir, "../test-management/src/index.ts"),
    "@dot-slash/browserstack-accessibility": path.resolve(packageDir, "../accessibility/src/index.ts"),
    "@dot-slash/browserstack-test-reporting": path.resolve(packageDir, "../test-reporting/src/index.ts"),
    "@dot-slash/browserstack-cli": path.resolve(packageDir, "../cli/typescript/src/index.ts"),
  };
}
