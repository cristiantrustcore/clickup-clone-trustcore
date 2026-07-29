import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate.middleware";
import { createTaskSchema, moveTaskSchema, updateTaskSchema } from "./tasks.schemas";
import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskHandler,
  listTasksHandler,
  moveTaskHandler,
  updateTaskHandler,
} from "./tasks.controller";

// mounted at /api/lists/:listId/tasks (auth already applied by the parent lists router)
export const tasksRouterForList = Router({ mergeParams: true });
tasksRouterForList.get("/", listTasksHandler);
tasksRouterForList.post("/", validateBody(createTaskSchema), createTaskHandler);

// mounted at /api/tasks
export const tasksRouter = Router();
tasksRouter.use(requireAuth);
tasksRouter.get("/:id", getTaskHandler);
tasksRouter.patch("/:id", validateBody(updateTaskSchema), updateTaskHandler);
tasksRouter.delete("/:id", deleteTaskHandler);
tasksRouter.patch("/:id/move", validateBody(moveTaskSchema), moveTaskHandler);
