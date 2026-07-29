import type { Request, Response } from "express";
import * as statusesService from "./statuses.service";

export async function listStatusesHandler(req: Request, res: Response) {
  const statuses = await statusesService.listStatusesForList(req.params.listId);
  res.json({ statuses });
}

export async function createStatusHandler(req: Request, res: Response) {
  const status = await statusesService.createStatusForList(req.params.listId, req.body);
  res.status(201).json({ status });
}

export async function updateStatusHandler(req: Request, res: Response) {
  const status = await statusesService.updateStatus(req.params.id, req.body);
  res.json({ status });
}

export async function deleteStatusHandler(req: Request, res: Response) {
  await statusesService.deleteStatus(req.params.id);
  res.status(204).send();
}

export async function reorderStatusesHandler(req: Request, res: Response) {
  const statuses = await statusesService.reorderStatuses(req.params.listId, req.body);
  res.json({ statuses });
}
