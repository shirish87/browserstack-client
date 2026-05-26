import { AutomateClient } from "@dot-slash/browserstack-automate";
import { AppAutomateClient } from "@dot-slash/browserstack-app-automate";
import { AccessibilityClient } from "@dot-slash/browserstack-accessibility";
import { TestManagementClient } from "@dot-slash/browserstack-test-management";
import { TestReportingClient } from "@dot-slash/browserstack-test-reporting";
import {
  AutomateSchemas,
  AppAutomateSchemas,
  AccessibilitySchemas,
  TestManagementSchemas,
  TestReportingSchemas,
  WebsiteScannerSchemas,
} from "../schemas.generated.ts";
import { parseArgs } from "../parser.ts";
import type { TUIAction } from "../tui-types.ts";

function buildPositionalArgs(action: TUIAction, filterValues: Record<string, string>): string[] {
  const pathArgs = action.fields.filter(f => f.location === "path").map(f => filterValues[f.name] ?? "");
  const queryArgs = action.fields.filter(f => f.location === "query").map(f => filterValues[f.name] ?? "");
  return [...pathArgs, ...queryArgs].filter(v => v !== "");
}

function getSchemaMap(productId: string): Record<string, { schema: any; argNames: string[]; call: (client: object, data: any) => Promise<unknown> }> | null {
  switch (productId) {
    case "automate": return AutomateSchemas.ActionSchemaMap;
    case "app-automate": return AppAutomateSchemas.ActionSchemaMap;
    case "accessibility": return AccessibilitySchemas.ActionSchemaMap;
    case "test-management": return {
      ...TestManagementSchemas.ProjectsActionSchemaMap,
      ...TestManagementSchemas.FoldersActionSchemaMap,
      ...TestManagementSchemas.TestCasesActionSchemaMap,
      ...TestManagementSchemas.AttachmentsActionSchemaMap,
      ...TestManagementSchemas.TestResultsActionSchemaMap,
      ...TestManagementSchemas.TestRunsActionSchemaMap,
      ...TestManagementSchemas.TestPlansActionSchemaMap,
      ...TestManagementSchemas.ConfigurationsActionSchemaMap,
      ...TestManagementSchemas.CustomFieldsActionSchemaMap,
    };
    case "test-reporting": return TestReportingSchemas.ActionSchemaMap;
    case "website-scanner": return WebsiteScannerSchemas.ActionSchemaMap;
    default: return null;
  }
}

let _clients: {
  automate?: AutomateClient;
  appAutomate?: AppAutomateClient;
  accessibility?: AccessibilityClient;
  testManagement?: TestManagementClient;
  testReporting?: TestReportingClient;
} = {};

function getClient(productId: string): object | null {
  switch (productId) {
    case "automate":
      return (_clients.automate ??= new AutomateClient({}));
    case "app-automate":
      return (_clients.appAutomate ??= new AppAutomateClient({}));
    case "accessibility":
      return (_clients.accessibility ??= new AccessibilityClient({}));
    case "test-management":
      return (_clients.testManagement ??= new TestManagementClient({}));
    case "test-reporting":
      return (_clients.testReporting ??= new TestReportingClient({}));
    case "website-scanner":
      // Not yet a dependency of the TypeScript CLI.
      return null;
    default:
      return null;
  }
}

function toSnakeCase(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(toSnakeCase);
  if (v !== null && typeof v === "object") {
    return Object.fromEntries(
      Object.entries(v as Record<string, unknown>).map(([k, val]) => [
        k.replace(/([A-Z])/g, "_$1").toLowerCase(),
        toSnakeCase(val),
      ])
    );
  }
  return v;
}

/**
 * Directly dispatches a picker source action via the SDK and returns the raw JSON-serialised result.
 * The result is converted to snake_case to match the valueField/labelFields in the TUI manifest
 * (which use wire-format names, consistent with the Go TUI picker).
 * Used by fetchPickerItemsForAction to bypass the human-formatted CLI runner output.
 */
export async function dispatchPickerAction(
  productId: string,
  action: TUIAction,
  filterValues: Record<string, string>,
): Promise<string> {
  const schemaMap = getSchemaMap(productId);
  if (!schemaMap) throw new Error(`Picker dispatch not supported for product: ${productId}`);

  const schemaConfig = schemaMap[action.id];
  if (!schemaConfig) throw new Error(`No schema for action: ${productId}.${action.id}`);

  const client = getClient(productId);
  if (!client) throw new Error(`No client for product: ${productId}`);

  const positional = buildPositionalArgs(action, filterValues);
  const parsed = parseArgs(schemaConfig.schema, positional, schemaConfig.argNames);
  const result = await schemaConfig.call(client, parsed);
  return JSON.stringify(toSnakeCase(result));
}
