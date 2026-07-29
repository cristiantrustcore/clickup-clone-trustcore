import { prisma } from "../../lib/prisma";
import { ApiError } from "../../middleware/error.middleware";
import type { CreateStatusInput, ReorderStatusesInput, UpdateStatusInput } from "./statuses.schemas";

export function listStatusesForList(listId: string) {
  return prisma.status.findMany({ where: { listId }, orderBy: { order: "asc" } });
}

export async function createStatusForList(listId: string, input: CreateStatusInput) {
  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list) throw new ApiError(404, "Lista no encontrada");

  let order = input.order;
  if (order === undefined) {
    const maxOrder = await prisma.status.aggregate({ where: { listId }, _max: { order: true } });
    order = (maxOrder._max.order ?? -1) + 1;
  }

  return prisma.status.create({
    data: { name: input.name, color: input.color, order, listId },
  });
}

async function getStatus(id: string) {
  const status = await prisma.status.findUnique({ where: { id } });
  if (!status) throw new ApiError(404, "Estado no encontrado");
  return status;
}

export async function updateStatus(id: string, input: UpdateStatusInput) {
  await getStatus(id);
  return prisma.status.update({ where: { id }, data: input });
}

export async function deleteStatus(id: string) {
  await getStatus(id);
  await prisma.status.delete({ where: { id } });
}

export async function reorderStatuses(listId: string, input: ReorderStatusesInput) {
  await prisma.$transaction(
    input.order.map((statusId, index) =>
      prisma.status.update({ where: { id: statusId }, data: { order: index } }),
    ),
  );
  return listStatusesForList(listId);
}
