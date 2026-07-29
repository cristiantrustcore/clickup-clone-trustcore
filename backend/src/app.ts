import "express-async-errors";
import fs from "node:fs";
import path from "node:path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { authRouter } from "./modules/auth/auth.routes";
import { spacesRouter } from "./modules/spaces/spaces.routes";
import { listsRouter } from "./modules/lists/lists.routes";
import { statusesRouter } from "./modules/statuses/statuses.routes";
import { tasksRouter } from "./modules/tasks/tasks.routes";

export const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/spaces", spacesRouter);
app.use("/api/lists", listsRouter);
app.use("/api/statuses", statusesRouter);
app.use("/api/tasks", tasksRouter);

// Cuando el build del frontend queda junto al del backend (despliegue "combinado" en
// un solo servicio, ej. Render sin Docker separado), el mismo Express sirve la SPA.
// En Docker Compose local, esta carpeta no existe y este bloque simplemente no se activa.
const frontendDist = path.join(__dirname, "../../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);
