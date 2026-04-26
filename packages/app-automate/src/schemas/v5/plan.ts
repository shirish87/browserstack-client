import { z } from "zod";

export const AppAutomatePlanSchema = z.object({
  parallel_sessions_max_allowed: z.number(),
  parallel_sessions_running: z.number(),
  queued_sessions: z.number(),
  devices_max_allowed: z.number(),
  devices_running: z.number(),
  team_parallel_sessions_max_allowed: z.number().optional(),
  team_parallel_sessions_running: z.number().optional(),
});

export type AppAutomatePlan = z.infer<typeof AppAutomatePlanSchema>;
