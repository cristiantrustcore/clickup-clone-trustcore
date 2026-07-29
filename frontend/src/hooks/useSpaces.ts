import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as spacesApi from "../api/spaces.api";

export function useSpaces() {
  return useQuery({ queryKey: ["spaces"], queryFn: spacesApi.fetchSpaces });
}

export function useSpace(id: string | undefined) {
  return useQuery({
    queryKey: ["spaces", id],
    queryFn: () => spacesApi.fetchSpace(id!),
    enabled: Boolean(id),
  });
}

export function useCreateSpace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: spacesApi.createSpace,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["spaces"] }),
  });
}

export function useDeleteSpace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: spacesApi.deleteSpace,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["spaces"] }),
  });
}
