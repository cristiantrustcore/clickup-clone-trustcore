import { z } from "zod";

export const createListSchema = z.object({
  name: z.string().min(1).max(120),
});

export const updateListSchema = createListSchema.partial();

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
