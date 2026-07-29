import { z } from "zod";

const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  statusId: z.string().min(1),
  priority: priorityEnum.optional(),
  dueDate: z.string().datetime().nullish(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).nullish(),
  priority: priorityEnum.optional(),
  dueDate: z.string().datetime().nullish(),
});

export const moveTaskSchema = z.object({
  statusId: z.string().min(1),
  order: z.number().int().min(0),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
