/* eslint-disable @typescript-eslint/no-unused-vars */
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import { envVas } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: envVas.FRONTEND_URL,
    credentials: true,
  })
);
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "Welcome to Parcel Delivery API" });
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
