import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as listsApi from "../api/lists.api";

export function useList(listId: string | undefined) {
  return useQuery({
    queryKey: ["lists", listId],
    queryFn: () => listsApi.fetchList(listId!),
    enabled: Boolean(listId),
  });
}

export function useListsForSpace(spaceId: string | undefined) {
  return useQuery({
    queryKey: ["spaces", spaceId, "lists"],
    queryFn: () => listsApi.fetchListsForSpace(spaceId!),
    enabled: Boolean(spaceId),
  });
}

export function useCreateList(spaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string }) => listsApi.createListForSpace(spaceId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "lists"] }),
  });
}

export function useDeleteList(spaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: listsApi.deleteList,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["spaces", spaceId, "lists"] }),
  });
}
