import { prisma } from "../../lib/prisma";
import { ApiError } from "../../middleware/error.middleware";
import type { CreateSpaceInput, UpdateSpaceInput } from "./spaces.schemas";

export function listSpaces() {
  return prisma.space.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { lists: true } } },
  });
}

export async function getSpace(id: string) {
  const space = await prisma.space.findUnique({
    where: { id },
    include: { lists: { orderBy: { createdAt: "asc" } } },
  });
  if (!space) throw new ApiError(404, "Espacio no encontrado");
  return space;
}

export function createSpace(ownerId: string, input: CreateSpaceInput) {
  return prisma.space.create({
    data: { ...input, ownerId },
  });
}

export async function updateSpace(id: string, input: UpdateSpaceInput) {
  await getSpace(id);
  return prisma.space.update({ where: { id }, data: input });
}

export async function deleteSpace(id: string) {
  await getSpace(id);
  await prisma.space.delete({ where: { id } });
}
