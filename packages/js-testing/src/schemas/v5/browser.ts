import { z } from "zod";

export const JSTestingBrowserSchema = z.object({
  browser: z.string(),
  browser_version: z.string(),
  os: z.string(),
  os_version: z.string(),
  device: z.string().optional(),
});

export const JSTestingBrowserListSchema = z.array(JSTestingBrowserSchema);

export type JSTestingBrowser = z.infer<typeof JSTestingBrowserSchema>;
export type JSTestingBrowserList = z.infer<typeof JSTestingBrowserListSchema>;
