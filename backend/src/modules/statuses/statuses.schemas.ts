import { z } from "zod";

export const createStatusSchema = z.object({
  name: z.string().min(1).max(60),
  color: z.string().max(20).optional(),
  order: z.number().int().min(0).optional(),
});

export const updateStatusSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  color: z.string().max(20).optional(),
});

export const reorderStatusesSchema = z.object({
  order: z.array(z.string()).min(1),
});

export type CreateStatusInput = z.infer<typeof createStatusSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type ReorderStatusesInput = z.infer<typeof reorderStatusesSchema>;
