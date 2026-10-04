import { z } from "zod";

/** Credentials entered by the user. */
export const CredentialsSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  accessKey: z.string().trim().min(1, "Access key is required"),
});
export type Credentials = z.infer<typeof CredentialsSchema>;

export const PaginationSchema = z.object({
  hasNext: z.boolean().optional(),
  nextPage: z.string().nullish(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const StatusStatsSchema = z.object({
  passed: z.number().default(0),
  failed: z.number().default(0),
  pending: z.number().default(0),
  skipped: z.number().default(0),
  unknown: z.number().default(0),
});
export type StatusStats = z.infer<typeof StatusStatsSchema>;

export const ProjectSchema = z.object({
  id: z.number(),
  name: z.string(),
  groupId: z.number().nullish(),
  createdBy: z.number().nullish(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
  observabilityUrl: z.string().nullish(),
});
export type Project = z.infer<typeof ProjectSchema>;

export const ProjectsResponseSchema = z.object({
  projects: z.array(ProjectSchema).default([]),
  pagination: PaginationSchema.optional(),
});
export type ProjectsResponse = z.infer<typeof ProjectsResponseSchema>;

export const BuildSummarySchema = z.object({
  name: z.string().nullish(),
  status: z.string().nullish(),
  duration: z.number().nullish(),
  user: z.string().nullish(),
  tags: z.array(z.string()).default([]),
  buildId: z.string(),
  originalName: z.string().nullish(),
  finishedAt: z.string().nullish(),
  startedAt: z.string().nullish(),
  statusStats: StatusStatsSchema.optional(),
  buildNumber: z.number().nullish(),
  isArchived: z.boolean().nullish(),
  observabilityUrl: z.string().nullish(),
  tcmTestRunIdentifier: z.string().nullish(),
});
export type BuildSummary = z.infer<typeof BuildSummarySchema>;

export const BuildsResponseSchema = z.object({
  builds: z.array(BuildSummarySchema).default([]),
  pagination: PaginationSchema.optional(),
});
export type BuildsResponse = z.infer<typeof BuildsResponseSchema>;

export const BuildDetailsSchema = z.object({
  name: z.string().nullish(),
  description: z.string().nullish(),
  status: z.string().nullish(),
  duration: z.number().nullish(),
  user: z.string().nullish(),
  tags: z.array(z.string()).default([]),
  buildId: z.string(),
  buildNumber: z.number().nullish(),
  originalName: z.string().nullish(),
  finishedAt: z.string().nullish(),
  startedAt: z.string().nullish(),
  statusStats: StatusStatsSchema.optional(),
  failureCategories: z.record(z.string(), z.number()).default({}),
  smartTags: z
    .object({
      isFlaky: z.number().default(0),
      isAlwaysFailing: z.number().default(0),
      isPerformanceAnomaly: z.number().default(0),
      isNewFailure: z.number().default(0),
    })
    .optional(),
  isArchived: z.boolean().nullish(),
  observabilityUrl: z.string().nullish(),
  vcsInfo: z.object({ name: z.string().nullish(), sha: z.string().nullish(), branch: z.string().nullish() }).optional(),
  ciInfo: z
    .object({
      jobName: z.string().nullish(),
      name: z.string().nullish(),
      buildNumber: z.string().nullish(),
      buildUrl: z.string().nullish(),
    })
    .optional(),
  hostInfo: z.object({ hostname: z.string().nullish(), os: z.string().nullish() }).optional(),
});
export type BuildDetails = z.infer<typeof BuildDetailsSchema>;

/** A node in the (free-form) test hierarchy. */
export interface HierarchyNode {
  name?: string | null;
  details?: Record<string, unknown> | null;
  children?: HierarchyNode[] | null;
  [key: string]: unknown;
}

export const HierarchyNodeSchema: z.ZodType<HierarchyNode> = z.lazy(() =>
  z.looseObject({
    name: z.string().nullish(),
    details: z.record(z.string(), z.unknown()).nullish(),
    children: z.array(HierarchyNodeSchema).nullish(),
  }),
);

export const TestRunsResponseSchema = z.object({
  name: z.string().nullish(),
  projectId: z.number().nullish(),
  buildId: z.string().nullish(),
  buildName: z.string().nullish(),
  buildNumber: z.number().nullish(),
  testSummary: StatusStatsSchema.optional(),
  isArchived: z.boolean().nullish(),
  hierarchy: z.array(HierarchyNodeSchema).default([]),
  pagination: PaginationSchema.optional(),
});
export type TestRunsResponse = z.infer<typeof TestRunsResponseSchema>;

export const QualityGateStatusSchema = z.object({
  status: z.string().nullish(),
  buildUuid: z.string().nullish(),
  buildUrl: z.string().nullish(),
  qualityGateResult: z.string().nullish(),
  qualityProfiles: z
    .array(
      z.object({
        id: z.string().nullish(),
        name: z.string().nullish(),
        type: z.string().nullish(),
        result: z.string().nullish(),
        rules: z.array(z.record(z.string(), z.unknown())).default([]),
      }),
    )
    .default([]),
});
export type QualityGateStatus = z.infer<typeof QualityGateStatusSchema>;

export const QualityGateSettingsSchema = z.object({
  enabled: z.boolean().nullish(),
  shouldOverrideBuildStatus: z.boolean().nullish(),
  qualityProfiles: z
    .array(
      z.object({
        id: z.string().nullish(),
        name: z.string().nullish(),
        rulesCount: z.number().nullish(),
        enabled: z.boolean().nullish(),
        isGlobalProfile: z.boolean().nullish(),
      }),
    )
    .default([]),
});
export type QualityGateSettings = z.infer<typeof QualityGateSettingsSchema>;

export const SelfHealingReportSchema = z.object({
  presignedUrl: z.string().nullish(),
  expiresAt: z.string().nullish(),
});
export type SelfHealingReport = z.infer<typeof SelfHealingReportSchema>;

/** Response of `GET/POST /api/session`. The access key never leaves the server. */
export const SessionResponseSchema = z.object({ username: z.string() });
export type SessionResponse = z.infer<typeof SessionResponseSchema>;
