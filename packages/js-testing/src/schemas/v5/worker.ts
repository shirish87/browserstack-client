import { z } from "zod";

export const JSTestingWorkerSchema = z.object({
  id: z.number(),
  status: z.enum(["running", "queue", "terminated"]).optional(),
  browser: z.string().optional(),
  browser_version: z.string().optional(),
  os: z.string().optional(),
  created_at: z.string().datetime().optional(),
});

export const JSTestingWorkerCreateSchema = z.object({
  url: z.string(),
  browser: z.string(),
  browser_version: z.string(),
  os: z.string(),
  os_version: z.string(),
  timeout: z.number().optional(),
  resolution: z.string().optional(),
});

export type JSTestingWorker = z.infer<typeof JSTestingWorkerSchema>;
export type JSTestingWorkerCreate = z.infer<typeof JSTestingWorkerCreateSchema>;
