import express, { Request, Response } from "express";

import v1_userRoute from "./routes/v1/user"
import v1_keyRoute from "./routes/v1/key"
import v1_newsRoute from "./routes/v1/news"

const app: express.Application = express();

app.use(express.json());

app.use("/api/v1/users", v1_userRoute);
app.use("/api/v1/keys", v1_keyRoute);
app.use("/api/v1/news", v1_newsRoute);

export default app;
