import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate.middleware";
import { createStatusSchema, reorderStatusesSchema, updateStatusSchema } from "./statuses.schemas";
import {
  createStatusHandler,
  deleteStatusHandler,
  listStatusesHandler,
  reorderStatusesHandler,
  updateStatusHandler,
} from "./statuses.controller";

// mounted at /api/lists/:listId/statuses (auth already applied by the parent lists router)
export const statusesRouterForList = Router({ mergeParams: true });
statusesRouterForList.get("/", listStatusesHandler);
statusesRouterForList.post("/", validateBody(createStatusSchema), createStatusHandler);
statusesRouterForList.patch("/reorder", validateBody(reorderStatusesSchema), reorderStatusesHandler);

// mounted at /api/statuses
export const statusesRouter = Router();
statusesRouter.use(requireAuth);
statusesRouter.patch("/:id", validateBody(updateStatusSchema), updateStatusHandler);
statusesRouter.delete("/:id", deleteStatusHandler);
