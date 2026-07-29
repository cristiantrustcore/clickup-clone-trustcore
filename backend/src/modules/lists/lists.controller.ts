import type { Request, Response } from "express";
import * as listsService from "./lists.service";

export async function listListsForSpaceHandler(req: Request, res: Response) {
  const lists = await listsService.listListsForSpace(req.params.spaceId);
  res.json({ lists });
}

export async function createListForSpaceHandler(req: Request, res: Response) {
  const list = await listsService.createListForSpace(req.params.spaceId, req.user!.sub, req.body);
  res.status(201).json({ list });
}

export async function getListHandler(req: Request, res: Response) {
  const list = await listsService.getList(req.params.id);
  res.json({ list });
}

export async function updateListHandler(req: Request, res: Response) {
  const list = await listsService.updateList(req.params.id, req.body);
  res.json({ list });
}

export async function deleteListHandler(req: Request, res: Response) {
  await listsService.deleteList(req.params.id);
  res.status(204).send();
}
