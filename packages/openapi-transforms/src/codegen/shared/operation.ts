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

/**
 * Converts a method name (like getBrowsers) to a CLI-friendly action slug (get-browsers).
 */
export function toActionSlug(methodName: string): string {
  return methodName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/**
 * Checks if a schema represents an array or a list.
 */
export function isArrayList(schema: unknown): boolean {
  if (!schema || typeof schema !== "object") return false;
  const s = schema as Record<string, unknown>;
  if (s.type === "array") return true;
  if (Array.isArray(s.oneOf)) return s.oneOf.some(isArrayList);
  if (Array.isArray(s.anyOf)) return s.anyOf.some(isArrayList);
  return false;
}

/**
 * High-level helper to get a CLI action name from an operation.
 */
export function toCLIAction(methodName: string, responseSchema?: unknown): string {
  let action = toActionSlug(methodName);

  const isGet = action.startsWith("get-");
  const isPlural = action.endsWith("s");
  const returnsArray = isArrayList(responseSchema);

  // CLI-friendly mapping: get-*s -> list-*
  // Also map get-* that returns an array to list-*
  if (isGet && (isPlural || returnsArray)) {
    action = action.replace(/^get-/, "list-");
  }

  return action;
}
