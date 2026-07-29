import type { CorsOptions } from "cors";
import { env } from "./env";

const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim());

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // allow non-browser requests (curl, server-to-server) with no Origin header
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
};
