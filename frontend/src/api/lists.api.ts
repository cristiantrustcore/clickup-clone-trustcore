import { apiFetch } from "./client";
import type { List } from "../types/spaces";

export function fetchListsForSpace(spaceId: string) {
  return apiFetch<{ lists: List[] }>(`/spaces/${spaceId}/lists`);
}

export function createListForSpace(spaceId: string, input: { name: string }) {
  return apiFetch<{ list: List }>(`/spaces/${spaceId}/lists`, { method: "POST", body: input });
}

export function fetchList(id: string) {
  return apiFetch<{ list: List }>(`/lists/${id}`);
}

export function deleteList(id: string) {
  return apiFetch<void>(`/lists/${id}`, { method: "DELETE" });
}
