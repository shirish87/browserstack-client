import { z } from "zod";

/** Credentials entered by the user. */
export const CredentialsSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  accessKey: z.string().trim().min(1, "Access key is required"),
});
export type Credentials = z.infer<typeof CredentialsSchema>;

// --- Test Reporting & Analytics -------------------------------------------------------------
// The dashboard uses the client's own zod schemas and inferred types directly (generated from the
// verified OpenAPI spec), so the API contract has one source of truth. Fields are optional/nullable
// exactly as the client declares them; the UI handles absence rather than papering over it.
import type { BuildSummary, Project } from "@dot-slash/browserstack-test-reporting/models";

export {
  BuildDetailsSchema,
  BuildListResponseSchema,
  PaginationSchema,
  ProjectListResponseSchema,
  QualityGateSettingsSchema,
  QualityGateStatusSchema,
  TestRunsResponseSchema,
  type BuildDetails,
  type BuildListResponse,
  type BuildSummary,
  type Pagination,
  type Project,
  type ProjectListResponse,
  type QualityGateSettings,
  type QualityGateStatus,
  type StatusStats,
  type TestRunNode,
  type TestRunsResponse,
} from "@dot-slash/browserstack-test-reporting/models";

/** A listed build that carries its id: the only kind the UI can open. A narrowing of the client's type, not a copy. */
export type IdentifiedBuild = BuildSummary & { buildId: string };
export const hasBuildId = (b: BuildSummary): b is IdentifiedBuild => typeof b.buildId === "string" && b.buildId.length > 0;

/** A project with the id and name the UI needs to open it. */
export type NamedProject = Project & { id: number; name: string };
export const isNamedProject = (p: Project): p is NamedProject => typeof p.id === "number" && typeof p.name === "string";

export const SelfHealingReportSchema = z.object({
  presignedUrl: z.string().nullish(),
  expiresAt: z.string().nullish(),
});
export type SelfHealingReport = z.infer<typeof SelfHealingReportSchema>;

/** Response of `GET/POST /api/session`. The access key never leaves the server. */
export const SessionResponseSchema = z.object({ username: z.string() });
export type SessionResponse = z.infer<typeof SessionResponseSchema>;

/** Newest-updated project first (stable for ties and projects without a date); returns a new array. */
export function mostRecentFirst<T extends { updatedAt?: string | null | undefined }>(projects: readonly T[]): T[] {
  const at = (p: T): number => Date.parse(p.updatedAt ?? "") || 0;
  return [...projects].sort((a, b) => at(b) - at(a));
}
