import express, { Request, Response } from "express";
import cors from "cors";

import v1_userRoute from "./routes/v1/user"
import v1_keyRoute from "./routes/v1/key"
import v1_newsRoute from "./routes/v1/news"

const app: express.Application = express();

app.use(cors());
app.use(express.json());

app.use("/v1/users", v1_userRoute);
app.use("/v1/keys", v1_keyRoute);
app.use("/v1/news", v1_newsRoute);

export default app;
