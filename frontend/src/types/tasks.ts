export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  order: number;
  listId: string;
  statusId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
