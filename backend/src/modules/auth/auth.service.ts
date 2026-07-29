import crypto from "node:crypto";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { ApiError } from "../../middleware/error.middleware";
import type { LoginInput, RegisterInput } from "./auth.schemas";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function signAccessToken(userId: string, username: string) {
  return jwt.sign({ sub: userId, username }, env.JWT_ACCESS_SECRET, {
    // ACCESS_TOKEN_TTL viene de env como string simple (ej. "15m"); jsonwebtoken
    // lo acepta en runtime pero sus tipos exigen el tipo interno de la libreria "ms".
    expiresIn: env.ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"],
  });
}

async function issueRefreshToken(userId: string) {
  const rawToken = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(rawToken),
      userId,
      expiresAt,
    },
  });

  return { rawToken, expiresAt };
}

function toPublicUser(user: { id: string; username: string; displayName: string }) {
  return { id: user.id, username: user.username, displayName: user.displayName };
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { username: input.username } });
  if (existing) {
    throw new ApiError(409, "Ese nombre de usuario ya existe");
  }

  const passwordHash = await argon2.hash(input.password);
  const user = await prisma.user.create({
    data: {
      username: input.username,
      displayName: input.displayName,
      passwordHash,
    },
  });

  const accessToken = signAccessToken(user.id, user.username);
  const { rawToken, expiresAt } = await issueRefreshToken(user.id);

  return { user: toPublicUser(user), accessToken, refreshToken: rawToken, refreshExpiresAt: expiresAt };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { username: input.username } });
  if (!user) {
    throw new ApiError(401, "Usuario o contraseña incorrectos");
  }

  const passwordValid = await argon2.verify(user.passwordHash, input.password);
  if (!passwordValid) {
    throw new ApiError(401, "Usuario o contraseña incorrectos");
  }

  const accessToken = signAccessToken(user.id, user.username);
  const { rawToken, expiresAt } = await issueRefreshToken(user.id);

  return { user: toPublicUser(user), accessToken, refreshToken: rawToken, refreshExpiresAt: expiresAt };
}

export async function refresh(rawToken: string | undefined) {
  if (!rawToken) {
    throw new ApiError(401, "No se encontró refresh token");
  }

  const tokenHash = hashToken(rawToken);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new ApiError(401, "Refresh token inválido o expirado");
  }

  // rotate: revoke the used token and issue a new one
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const accessToken = signAccessToken(stored.user.id, stored.user.username);
  const { rawToken: newRawToken, expiresAt } = await issueRefreshToken(stored.user.id);

  return {
    user: toPublicUser(stored.user),
    accessToken,
    refreshToken: newRawToken,
    refreshExpiresAt: expiresAt,
  };
}

export async function logout(rawToken: string | undefined) {
  if (!rawToken) return;

  const tokenHash = hashToken(rawToken);
  await prisma.refreshToken
    .updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    })
    .catch(() => undefined);
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "Usuario no encontrado");
  }
  return toPublicUser(user);
}
