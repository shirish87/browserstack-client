import { z } from "zod";

export const ScreenshotsBrowserSchema = z.object({
  os: z.string(),
  os_version: z.string(),
  browser: z.string(),
  browser_version: z.string(),
  device: z.string().optional(),
});

export type ScreenshotsBrowser = z.infer<typeof ScreenshotsBrowserSchema>;
