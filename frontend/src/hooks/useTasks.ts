import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as tasksApi from "../api/tasks.api";

export function useTasksForList(listId: string | undefined) {
  return useQuery({
    queryKey: ["lists", listId, "tasks"],
    queryFn: () => tasksApi.fetchTasksForList(listId!),
    enabled: Boolean(listId),
  });
}

export function useCreateTask(listId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { title: string; statusId: string }) => tasksApi.createTaskForList(listId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lists", listId, "tasks"] }),
  });
}

export function useDeleteTask(listId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tasksApi.deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lists", listId, "tasks"] }),
  });
}

export function useMoveTask(listId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, statusId, order }: { id: string; statusId: string; order: number }) =>
      tasksApi.moveTask(id, { statusId, order }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lists", listId, "tasks"] }),
  });
}
