import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate.middleware";
import { createListSchema, updateListSchema } from "./lists.schemas";
import {
  createListForSpaceHandler,
  deleteListHandler,
  getListHandler,
  listListsForSpaceHandler,
  updateListHandler,
} from "./lists.controller";
import { statusesRouterForList } from "../statuses/statuses.routes";
import { tasksRouterForList } from "../tasks/tasks.routes";

// mounted at /api/spaces/:spaceId/lists (spaceId comes from the parent router)
export const listsRouterForSpace = Router({ mergeParams: true });
listsRouterForSpace.get("/", listListsForSpaceHandler);
listsRouterForSpace.post("/", validateBody(createListSchema), createListForSpaceHandler);

// mounted at /api/lists
export const listsRouter = Router();
listsRouter.use(requireAuth);
listsRouter.get("/:id", getListHandler);
listsRouter.patch("/:id", validateBody(updateListSchema), updateListHandler);
listsRouter.delete("/:id", deleteListHandler);
listsRouter.use("/:listId/statuses", statusesRouterForList);
listsRouter.use("/:listId/tasks", tasksRouterForList);
