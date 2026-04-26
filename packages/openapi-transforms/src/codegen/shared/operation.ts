export function toPascalCase(s: string): string {
  return s
    .split(/[-_ .]/)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

// Maps product name → PascalCase prefix used in operationIds for that product
export const OPERATION_ID_PREFIX: Record<string, string> = {
  "accessibility": "Accessibility",
  "app-automate": "AppAutomate",
  "automate": "Automate",
  "local-testing": "LocalBinary",
  "local-testing-binary": "LocalBinary",
  "screenshots": "Screenshots",
  "test-management": "TestManagement",
  "test-reporting": "TestReporting",
};

/**
 * Strips the redundant product prefix from an operationId.
 * e.g. getAutomateBrowsers (product=automate) → getBrowsers
 *      bulkDeleteTestManagementTestCases (product=test-management) → bulkDeleteTestCases
 */
export function stripOperationPrefix(operationId: string, product: string): string {
  const prefix = OPERATION_ID_PREFIX[product];
  if (!prefix) return operationId;
  const idx = operationId.indexOf(prefix);
  if (idx === -1) return operationId;
  const verb = operationId.slice(0, idx);
  const rest = operationId.slice(idx + prefix.length);
  if (!rest) return operationId;
  return verb + rest.charAt(0).toUpperCase() + rest.slice(1);
}
