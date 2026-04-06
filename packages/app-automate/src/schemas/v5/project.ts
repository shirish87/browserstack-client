import { z } from "zod";

export const AppAutomateProjectSchema = z.object({
  project: z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
    build_count: z.number().optional(),
  }),
});

export const AppAutomateProjectUpdateSchema = z.object({
  name: z.string().optional(),
});

export type AppAutomateProject = z.infer<typeof AppAutomateProjectSchema>;
export type AppAutomateProjectUpdate = z.infer<typeof AppAutomateProjectUpdateSchema>;
