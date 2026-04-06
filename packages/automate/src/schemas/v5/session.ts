import { z } from "zod";

/**
 * Schema for Automate Session response
 */
export const AutomateSessionSchema = z.object({
  automation_session: z.object({
    id: z.number(),
    hashed_id: z.string(),
    status: z.enum(["running", "done", "error"]),
    browser: z.string().optional(),
    browser_version: z.string().optional(),
    os: z.string().optional(),
    os_version: z.string().optional(),
    device: z.string().optional(),
    created_at: z.string().datetime().optional(),
    updated_at: z.string().datetime().optional(),
    duration: z.number().optional(),
    logs: z.object({
      console_logs_url: z.string().optional(),
      network_logs_url: z.string().optional(),
      selenium_logs_url: z.string().optional(),
      appium_logs_url: z.string().optional(),
      telemetry_logs_url: z.string().optional(),
    }).optional(),
  }),
});

/**
 * Schema for Automate Session request body
 */
export const AutomateSessionUpdateSchema = z.object({
  status: z.enum(["running", "done", "error"]).optional(),
  name: z.string().optional(),
  mark: z.string().optional(),
});

export type AutomateSession = z.infer<typeof AutomateSessionSchema>;
export type AutomateSessionUpdate = z.infer<typeof AutomateSessionUpdateSchema>;
