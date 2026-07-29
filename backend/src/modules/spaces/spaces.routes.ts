import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate.middleware";
import { createSpaceSchema, updateSpaceSchema } from "./spaces.schemas";
import {
  createSpaceHandler,
  deleteSpaceHandler,
  getSpaceHandler,
  listSpacesHandler,
  updateSpaceHandler,
} from "./spaces.controller";
import { listsRouterForSpace } from "../lists/lists.routes";

export const spacesRouter = Router();

spacesRouter.use(requireAuth);

spacesRouter.get("/", listSpacesHandler);
spacesRouter.post("/", validateBody(createSpaceSchema), createSpaceHandler);
spacesRouter.get("/:id", getSpaceHandler);
spacesRouter.patch("/:id", validateBody(updateSpaceSchema), updateSpaceHandler);
spacesRouter.delete("/:id", deleteSpaceHandler);

// nested: /api/spaces/:spaceId/lists
spacesRouter.use("/:spaceId/lists", listsRouterForSpace);
