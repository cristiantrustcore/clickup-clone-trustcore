import { prisma } from "../../lib/prisma";
import { ApiError } from "../../middleware/error.middleware";
import type { CreateListInput, UpdateListInput } from "./lists.schemas";

const DEFAULT_STATUSES = [
  { name: "Por hacer", color: "#94a3b8", order: 0 },
  { name: "En progreso", color: "#3b82f6", order: 1 },
  { name: "Hecho", color: "#22c55e", order: 2 },
];

export function listListsForSpace(spaceId: string) {
  return prisma.list.findMany({
    where: { spaceId },
    orderBy: { createdAt: "asc" },
    include: { statuses: { orderBy: { order: "asc" } } },
  });
}

export async function getList(id: string) {
  const list = await prisma.list.findUnique({
    where: { id },
    include: { statuses: { orderBy: { order: "asc" } } },
  });
  if (!list) throw new ApiError(404, "Lista no encontrada");
  return list;
}

export async function createListForSpace(spaceId: string, ownerId: string, input: CreateListInput) {
  const space = await prisma.space.findUnique({ where: { id: spaceId } });
  if (!space) throw new ApiError(404, "Espacio no encontrado");

  return prisma.list.create({
    data: {
      name: input.name,
      spaceId,
      ownerId,
      statuses: { createMany: { data: DEFAULT_STATUSES } },
    },
    include: { statuses: { orderBy: { order: "asc" } } },
  });
}

export async function updateList(id: string, input: UpdateListInput) {
  await getList(id);
  return prisma.list.update({ where: { id }, data: input });
}

export async function deleteList(id: string) {
  await getList(id);
  await prisma.list.delete({ where: { id } });
}
