import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { setAccessToken } from "../api/client";
import { loginRequest, logoutRequest, refreshRequest, registerRequest } from "../api/auth.api";
import type { PublicUser } from "../types/auth";

interface AuthContextValue {
  user: PublicUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");

  useEffect(() => {
    // al cargar la app, intenta renovar sesión usando la cookie httpOnly de refresh
    refreshRequest()
      .then((res) => {
        setAccessToken(res.accessToken);
        setUser(res.user);
        setStatus("authenticated");
      })
      .catch(() => {
        setAccessToken(null);
        setStatus("unauthenticated");
      });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await loginRequest({ username, password });
    setAccessToken(res.accessToken);
    setUser(res.user);
    setStatus("authenticated");
  }, []);

  const register = useCallback(async (username: string, password: string, displayName: string) => {
    const res = await registerRequest({ username, password, displayName });
    setAccessToken(res.accessToken);
    setUser(res.user);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest().catch(() => undefined);
    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
