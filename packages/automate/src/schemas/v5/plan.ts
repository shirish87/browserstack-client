import { z } from "zod";

/**
 * Schema for Automate Plan response
 */
export const AutomatePlanSchema = z.object({
  parallel_sessions_max_allowed: z.number(),
  parallel_sessions_running: z.number(),
  queued_sessions: z.number(),
  browsers_max_allowed: z.number(),
  browsers_running: z.number(),
  team_parallel_sessions_max_allowed: z.number().optional(),
  team_parallel_sessions_running: z.number().optional(),
});

export type AutomatePlan = z.infer<typeof AutomatePlanSchema>;
