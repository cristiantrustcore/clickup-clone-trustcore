import { apiFetch } from "./client";
import type { AuthResponse, PublicUser } from "../types/auth";

export function registerRequest(input: { username: string; password: string; displayName: string }) {
  return apiFetch<AuthResponse>("/auth/register", { method: "POST", body: input, skipAuth: true });
}

export function loginRequest(input: { username: string; password: string }) {
  return apiFetch<AuthResponse>("/auth/login", { method: "POST", body: input, skipAuth: true });
}

export function refreshRequest() {
  return apiFetch<AuthResponse>("/auth/refresh", { method: "POST", skipAuth: true });
}

export function logoutRequest() {
  return apiFetch<void>("/auth/logout", { method: "POST" });
}

export function meRequest() {
  return apiFetch<{ user: PublicUser }>("/auth/me");
}
