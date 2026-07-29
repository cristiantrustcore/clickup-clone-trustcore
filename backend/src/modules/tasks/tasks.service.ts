import { prisma } from "../../lib/prisma";
import { ApiError } from "../../middleware/error.middleware";
import type { CreateTaskInput, MoveTaskInput, UpdateTaskInput } from "./tasks.schemas";

export function listTasksForList(listId: string) {
  return prisma.task.findMany({ where: { listId }, orderBy: { order: "asc" } });
}

export async function getTask(id: string) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new ApiError(404, "Tarea no encontrada");
  return task;
}

export async function createTaskForList(listId: string, ownerId: string, input: CreateTaskInput) {
  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list) throw new ApiError(404, "Lista no encontrada");

  const status = await prisma.status.findUnique({ where: { id: input.statusId } });
  if (!status || status.listId !== listId) {
    throw new ApiError(400, "El estado indicado no pertenece a esta lista");
  }

  // max+1 (not count) so gaps left by deleted tasks never collide with an existing order value
  const maxOrder = await prisma.task.aggregate({
    where: { listId, statusId: input.statusId },
    _max: { order: true },
  });
  const order = (maxOrder._max.order ?? -1) + 1;

  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority,
      dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      listId,
      statusId: input.statusId,
      ownerId,
      order,
    },
  });
}

export async function updateTask(id: string, input: UpdateTaskInput) {
  await getTask(id);
  return prisma.task.update({
    where: { id },
    data: {
      ...input,
      dueDate: input.dueDate === undefined ? undefined : input.dueDate ? new Date(input.dueDate) : null,
    },
  });
}

export async function deleteTask(id: string) {
  await getTask(id);
  await prisma.task.delete({ where: { id } });
}

export async function moveTask(id: string, input: MoveTaskInput) {
  const task = await getTask(id);

  const status = await prisma.status.findUnique({ where: { id: input.statusId } });
  if (!status || status.listId !== task.listId) {
    throw new ApiError(400, "El estado indicado no pertenece a esta lista");
  }

  const sameColumn = task.statusId === input.statusId;

  const targetSiblings = await prisma.task.findMany({
    where: { listId: task.listId, statusId: input.statusId, NOT: { id: task.id } },
    orderBy: { order: "asc" },
  });

  const targetIndex = Math.min(Math.max(input.order, 0), targetSiblings.length);
  targetSiblings.splice(targetIndex, 0, task);

  const updates = targetSiblings.map((sibling, index) =>
    prisma.task.update({
      where: { id: sibling.id },
      data: { order: index, statusId: input.statusId },
    }),
  );

  // if the task changed columns, re-pack the source column so its order stays dense too
  if (!sameColumn) {
    const sourceSiblings = await prisma.task.findMany({
      where: { listId: task.listId, statusId: task.statusId, NOT: { id: task.id } },
      orderBy: { order: "asc" },
    });
    updates.push(
      ...sourceSiblings.map((sibling, index) =>
        prisma.task.update({ where: { id: sibling.id }, data: { order: index } }),
      ),
    );
  }

  await prisma.$transaction(updates);

  return listTasksForList(task.listId);
}
