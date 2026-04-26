import { z } from "zod";

/**
 * Schema for Automate Project response
 */
export const AutomateProjectSchema = z.object({
  project: z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
    build_count: z.number().optional(),
  }),
});

/**
 * Schema for Automate Project request body
 */
export const AutomateProjectUpdateSchema = z.object({
  name: z.string().optional(),
});

export type AutomateProject = z.infer<typeof AutomateProjectSchema>;
export type AutomateProjectUpdate = z.infer<typeof AutomateProjectUpdateSchema>;
