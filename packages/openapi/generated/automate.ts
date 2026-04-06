/**
 * Types for BrowserStack Automate product types
 * @internal - This is generated code. Do not modify.
 */
export type * from "./openapi.js";

// Re-export the paths type for this product
import type { paths as allPaths } from "./openapi.js";
export type paths = Pick<allPaths, "/automate/plan.json" | "/automate/recycle_key.json" | "/automate/browsers.json" | "/automate/projects.json" | "/automate/projects/{projectId}.json" | "/automate/projects/{projectId}/badge_key" | "/automate/builds.json" | "/automate/builds/{buildId}.json" | "/automate/builds" | "/automate/builds/{buildId}/terminallogs" | "/automate/builds/{buildId}/sessions.json" | "/automate/sessions/{sessionId}.json" | "/automate/sessions" | "/automate/sessions/{sessionId}/logs" | "/automate/sessions/{sessionId}/terminallogs" | "/automate/sessions/{sessionId}/networklogs" | "/automate/sessions/{sessionId}/consolelogs" | "/automate/sessions/{sessionId}/seleniumlogs" | "/automate/sessions/{sessionId}/appiumlogs" | "/automate/sessions/{sessionId}/telemetrylogs" | "/automate/upload-media" | "/automate/recent_media_files" | "/automate/custom_media/delete/{mediaId}">;
