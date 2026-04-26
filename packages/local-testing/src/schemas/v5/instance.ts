import { z } from "zod";

export const LocalBinaryInstanceSchema = z.object({
  id: z.string(),
  pid: z.number().optional(),
  status: z.enum(["connected", "disconnected"]),
  public_ip: z.string().optional(),
  local_ip: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type LocalBinaryInstance = z.infer<typeof LocalBinaryInstanceSchema>;
