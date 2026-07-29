import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  color: z.string().max(20).optional(),
});

export const updateSpaceSchema = createSpaceSchema.partial();

export type CreateSpaceInput = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceInput = z.infer<typeof updateSpaceSchema>;
