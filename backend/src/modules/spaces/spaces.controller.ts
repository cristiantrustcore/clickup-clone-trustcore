import type { Request, Response } from "express";
import * as spacesService from "./spaces.service";

export async function listSpacesHandler(_req: Request, res: Response) {
  const spaces = await spacesService.listSpaces();
  res.json({ spaces });
}

export async function getSpaceHandler(req: Request, res: Response) {
  const space = await spacesService.getSpace(req.params.id);
  res.json({ space });
}

export async function createSpaceHandler(req: Request, res: Response) {
  const space = await spacesService.createSpace(req.user!.sub, req.body);
  res.status(201).json({ space });
}

export async function updateSpaceHandler(req: Request, res: Response) {
  const space = await spacesService.updateSpace(req.params.id, req.body);
  res.json({ space });
}

export async function deleteSpaceHandler(req: Request, res: Response) {
  await spacesService.deleteSpace(req.params.id);
  res.status(204).send();
}
