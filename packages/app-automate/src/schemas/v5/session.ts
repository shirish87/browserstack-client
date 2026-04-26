import { z } from "zod";

export const AppAutomateSessionSchema = z.object({
  automation_session: z.object({
    id: z.number(),
    hashed_id: z.string(),
    status: z.enum(["running", "done", "error"]),
    device: z.string().optional(),
    device_version: z.string().optional(),
    os: z.string().optional(),
    os_version: z.string().optional(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
    duration: z.number().optional(),
  }),
});

export const AppAutomateSessionUpdateSchema = z.object({
  status: z.enum(["running", "done", "error"]).optional(),
});

export type AppAutomateSession = z.infer<typeof AppAutomateSessionSchema>;
export type AppAutomateSessionUpdate = z.infer<typeof AppAutomateSessionUpdateSchema>;
