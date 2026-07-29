import "express-async-errors";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { authRouter } from "./modules/auth/auth.routes";

export const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);

app.use(notFoundHandler);
app.use(errorHandler);
