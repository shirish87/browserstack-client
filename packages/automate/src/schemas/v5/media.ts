import { z } from "zod";

/**
 * Schema for Automate Media File response
 */
export const AutomateMediaFileSchema = z.object({
  id: z.string(),
  custom_id: z.string().optional(),
  mime_type: z.string(),
  size: z.number(),
  created_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().optional(),
});

/**
 * Schema for media file upload request
 */
export const AutomateMediaUploadSchema = z.object({
  file: z.instanceof(File),
  custom_id: z.string().optional(),
});

export type AutomateMediaFile = z.infer<typeof AutomateMediaFileSchema>;
export type AutomateMediaUpload = z.infer<typeof AutomateMediaUploadSchema>;
