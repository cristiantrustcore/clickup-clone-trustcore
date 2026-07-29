import type { Request, Response } from "express";
import { env } from "../../config/env";
import * as authService from "./auth.service";

const REFRESH_COOKIE = "refreshToken";

function refreshCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/api/auth",
  };
}

export async function registerHandler(req: Request, res: Response) {
  const result = await authService.register(req.body);
  res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions(result.refreshExpiresAt));
  res.status(201).json({ user: result.user, accessToken: result.accessToken });
}

export async function loginHandler(req: Request, res: Response) {
  const result = await authService.login(req.body);
  res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions(result.refreshExpiresAt));
  res.json({ user: result.user, accessToken: result.accessToken });
}

export async function refreshHandler(req: Request, res: Response) {
  const rawToken = req.cookies?.[REFRESH_COOKIE];
  const result = await authService.refresh(rawToken);
  res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions(result.refreshExpiresAt));
  res.json({ user: result.user, accessToken: result.accessToken });
}

export async function logoutHandler(req: Request, res: Response) {
  const rawToken = req.cookies?.[REFRESH_COOKIE];
  await authService.logout(rawToken);
  res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
  res.status(204).send();
}

export async function meHandler(req: Request, res: Response) {
  const user = await authService.getUserById(req.user!.sub);
  res.json({ user });
}
