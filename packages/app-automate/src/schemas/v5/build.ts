import { z } from "zod";

export const AppAutomateBuildSchema = z.object({
  automation_build: z.object({
    id: z.number(),
    name: z.string(),
    status: z.enum(["running", "done", "queued"]),
    hashed_id: z.string(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
  }),
});

export const AppAutomateBuildUpdateSchema = z.object({
  name: z.string().optional(),
  status: z.enum(["running", "done", "queued"]).optional(),
});

export type AppAutomateBuild = z.infer<typeof AppAutomateBuildSchema>;
export type AppAutomateBuildUpdate = z.infer<typeof AppAutomateBuildUpdateSchema>;
