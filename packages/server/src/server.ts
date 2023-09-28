import express, { Request, Response } from "express";

const app: express.Application = express();

app.use((req: Request, res: Response) => {
    res.status(200).json({ Hello: "World" });
});

export default app;
