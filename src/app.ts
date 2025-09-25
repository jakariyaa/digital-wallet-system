import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import errorHandler from "./middlewares/error.middleware";
import router from "./routes";
import { errorResponse, successResponse } from "./utils/responseHandler";

dotenv.config();

const app: Application = express();

// CORS Configuration
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    // regex: match subdomains + main domain
    const regex = /^https?:\/\/([a-z0-9-]+\.)*jakariya\.eu\.org$/;

    if (regex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json(
    successResponse({
      message: "Digital Wallet API is running!",
      version: "1.0.0",
    })
  );
});

// API routes
app.use(router);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json(errorResponse("Route not found", 404));
});

// Error handling middleware
app.use(errorHandler);

export default app;
