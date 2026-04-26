/**
 * Types for BrowserStack Local Testing product types
 * @internal - This is generated code. Do not modify.
 */
export type * from "./openapi.js";

// Re-export the paths type for this product
import type { paths as allPaths } from "./openapi.js";
export type paths = Pick<allPaths, "/local/v1/list" | "/local/v1/{localInstanceId}">;
