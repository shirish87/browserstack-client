import { z } from "zod";

export const LocalBinaryDownloadSchema = z.object({
  content: z.instanceof(Uint8Array),
  filename: z.string(),
});

export type LocalBinaryDownload = z.infer<typeof LocalBinaryDownloadSchema>;
