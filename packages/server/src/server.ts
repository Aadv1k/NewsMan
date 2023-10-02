import express, { Request, Response } from "express";

import v1_userRoute from "./routes/v1/user"
import v1_keyRoute from "./routes/v1/key"

const app: express.Application = express();

app.use(express.json());

app.use("/api/v1/users", v1_userRoute);
app.use("/api/v1/keys", v1_keyRoute);

export default app;
