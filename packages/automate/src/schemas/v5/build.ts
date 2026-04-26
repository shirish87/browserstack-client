import { z } from "zod";

/**
 * Schema for Automate Build response
 */
export const AutomateBuildSchema = z.object({
  automation_build: z.object({
    id: z.number(),
    name: z.string(),
    status: z.enum(["running", "done", "queued"]),
    hashed_id: z.string(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
  }),
});

/**
 * Schema for Automate Build request body
 */
export const AutomateBuildUpdateSchema = z.object({
  name: z.string().optional(),
  status: z.enum(["running", "done", "queued"]).optional(),
});

export type AutomateBuild = z.infer<typeof AutomateBuildSchema>;
export type AutomateBuildUpdate = z.infer<typeof AutomateBuildUpdateSchema>;
