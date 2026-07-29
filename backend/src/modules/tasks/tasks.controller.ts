import type { Request, Response } from "express";
import * as tasksService from "./tasks.service";

export async function listTasksHandler(req: Request, res: Response) {
  const tasks = await tasksService.listTasksForList(req.params.listId);
  res.json({ tasks });
}

export async function createTaskHandler(req: Request, res: Response) {
  const task = await tasksService.createTaskForList(req.params.listId, req.user!.sub, req.body);
  res.status(201).json({ task });
}

export async function getTaskHandler(req: Request, res: Response) {
  const task = await tasksService.getTask(req.params.id);
  res.json({ task });
}

export async function updateTaskHandler(req: Request, res: Response) {
  const task = await tasksService.updateTask(req.params.id, req.body);
  res.json({ task });
}

export async function deleteTaskHandler(req: Request, res: Response) {
  await tasksService.deleteTask(req.params.id);
  res.status(204).send();
}

export async function moveTaskHandler(req: Request, res: Response) {
  const tasks = await tasksService.moveTask(req.params.id, req.body);
  res.json({ tasks });
}
