import { apiFetch } from "./client";
import type { Task } from "../types/tasks";

export function fetchTasksForList(listId: string) {
  return apiFetch<{ tasks: Task[] }>(`/lists/${listId}/tasks`);
}

export function createTaskForList(listId: string, input: { title: string; statusId: string }) {
  return apiFetch<{ task: Task }>(`/lists/${listId}/tasks`, { method: "POST", body: input });
}

export function updateTask(id: string, input: Partial<Pick<Task, "title" | "description" | "priority" | "dueDate">>) {
  return apiFetch<{ task: Task }>(`/tasks/${id}`, { method: "PATCH", body: input });
}

export function deleteTask(id: string) {
  return apiFetch<void>(`/tasks/${id}`, { method: "DELETE" });
}

export function moveTask(id: string, input: { statusId: string; order: number }) {
  return apiFetch<{ tasks: Task[] }>(`/tasks/${id}/move`, { method: "PATCH", body: input });
}
