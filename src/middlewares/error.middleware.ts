import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { errorResponse } from "../utils/responseHandler";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);

  
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    return res
      .status(400)
      .json(errorResponse("Validation failed", 400, errors));
  }

  
  if (err.code === 11000) {
    return res
      .status(400)
      .json(errorResponse("Duplicate field value entered", 400));
  }

  
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json(errorResponse("Invalid token", 401));
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json(errorResponse("Token expired", 401));
  }

  
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(errorResponse(err.message, err.statusCode));
  }

  
  res
    .status(500)
    .json(
      errorResponse(
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong!",
        500,
        process.env.NODE_ENV === "development" ? err.stack : null
      )
    );
}
