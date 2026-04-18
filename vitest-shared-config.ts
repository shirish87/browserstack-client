import path from "path";

export function getSharedAliases(packageDir: string) {
  return {
    "@browserstack-client/core": path.resolve(packageDir, "../core/src/index.ts"),
    "@browserstack-client/openapi-transforms": path.resolve(packageDir, "../openapi-transforms/src/index.ts"),
    "@browserstack-client/openapi/automate/client": path.resolve(packageDir, "../openapi/generated/automate.client.ts"),
    "@browserstack-client/openapi/automate": path.resolve(packageDir, "../openapi/generated/automate.ts"),
    "@browserstack-client/openapi": path.resolve(packageDir, "../openapi/generated/index.ts"),
    "@browserstack-client/app-automate": path.resolve(packageDir, "../app-automate/src/index.ts"),
    "@browserstack-client/automate": path.resolve(packageDir, "../automate/src/index.ts"),
    "@browserstack-client/screenshots": path.resolve(packageDir, "../screenshots/src/index.ts"),
    "@browserstack-client/js-testing": path.resolve(packageDir, "../js-testing/src/index.ts"),
    "@browserstack-client/local-testing": path.resolve(packageDir, "../local-testing/src/index.ts"),
    "@browserstack-client/local-testing-binary": path.resolve(packageDir, "../local-testing-binary/src/index.ts"),
    "@browserstack-client/cli": path.resolve(packageDir, "../cli/src/index.ts"),
  };
}
