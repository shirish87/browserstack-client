/**
 * Types for BrowserStack Screenshots product types
 * @internal - This is generated code. Do not modify.
 */
export type * from "./openapi.js";

// Re-export the paths type for this product
import type { paths as allPaths } from "./openapi.js";
export type paths = Pick<allPaths, "/screenshots/browsers.json" | "/screenshots" | "/screenshots/{jobId}.json">;
