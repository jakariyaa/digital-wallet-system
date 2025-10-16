import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import errorHandler from "./middlewares/error.middleware";
import router from "./routes";
import { errorResponse, successResponse } from "./utils/responseHandler";

dotenv.config();

const app: Application = express();


app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: ["http://localhost:5173", "https://cashyo.jakariya.eu.org"],
    credentials: true,
  })
);


app.get("/", (req: Request, res: Response) => {
  res.status(200).json(
    successResponse({
      message: "Digital Wallet API is running!",
      version: "1.0.0",
    })
  );
});


app.use(router);


app.use((req: Request, res: Response) => {
  res.status(404).json(errorResponse("Route not found", 404));
});


app.use(errorHandler);

export default app;
