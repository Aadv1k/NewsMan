import express, { Request, Response } from "express";
import v1_userRoute from "./routes/v1/user"

const app: express.Application = express();

app.use("/api/v1/users", v1_userRoute);

export default app;
