import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";

import { rootRouter } from "./routes/index.routes";
import { STATUS_CODE } from "./utils/status.code";

export const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/', rootRouter);

app.use((req: Request, res: Response) => {
  return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Not found' });
});
