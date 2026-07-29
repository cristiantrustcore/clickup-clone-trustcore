import { apiFetch } from "./client";
import type { Space } from "../types/spaces";

export function fetchSpaces() {
  return apiFetch<{ spaces: Space[] }>("/spaces");
}

export function fetchSpace(id: string) {
  return apiFetch<{ space: Space }>(`/spaces/${id}`);
}

export function createSpace(input: { name: string; description?: string }) {
  return apiFetch<{ space: Space }>("/spaces", { method: "POST", body: input });
}

export function deleteSpace(id: string) {
  return apiFetch<void>(`/spaces/${id}`, { method: "DELETE" });
}
