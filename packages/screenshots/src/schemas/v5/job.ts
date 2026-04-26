import { z } from "zod";

export const ScreenshotsJobSchema = z.object({
  id: z.string(),
  job_id: z.string(),
  state: z.enum(["done", "processing", "error"]),
  screenshots: z.array(z.object({
    id: z.string(),
    state: z.enum(["done", "processing", "error"]),
    url: z.string().optional(),
    browser: z.string(),
    browser_version: z.string(),
    os: z.string(),
    os_version: z.string(),
  })).optional(),
  created_at: z.string().datetime().optional(),
});

export type ScreenshotsJob = z.infer<typeof ScreenshotsJobSchema>;
