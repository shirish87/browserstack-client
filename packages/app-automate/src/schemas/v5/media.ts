import { z } from "zod";

export const AppAutomateMediaFileSchema = z.object({
  id: z.string(),
  custom_id: z.string().optional(),
  mime_type: z.string(),
  size: z.number(),
  created_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().optional(),
});

export const AppAutomateMediaUploadSchema = z.object({
  file: z.instanceof(File).optional(),
  custom_id: z.string().optional(),
});

export type AppAutomateMediaFile = z.infer<typeof AppAutomateMediaFileSchema>;
export type AppAutomateMediaUpload = z.infer<typeof AppAutomateMediaUploadSchema>;
