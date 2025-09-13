import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './routes';
import errorHandler from './middlewares/error.middleware';
import { successResponse, errorResponse } from './utils/responseHandler';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json(
    successResponse({
      message: 'Digital Wallet API is running!',
      version: '1.0.0'
    })
  );
});

// API routes
app.use(router);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json(
    errorResponse('Route not found', 404)
  );
});

// Error handling middleware
app.use(errorHandler);

export default app;