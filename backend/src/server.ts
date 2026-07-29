import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`API escuchando en 0.0.0.0:${env.PORT} (${env.NODE_ENV})`);
});
