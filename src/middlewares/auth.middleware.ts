// src/middlewares/auth.middleware.ts

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../modules/user/user.model";
import { UserDocument } from "../types/user.types";
import AppError from "../utils/AppError";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

interface JwtPayload {
  id: string;
  role: string;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Get token from cookie and check if it exists
    const token = req.cookies.token;
    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    // 2) Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    // 4) Check if user is active
    if (!currentUser.isActive) {
      return next(new AppError("This user account has been deactivated.", 401));
    }

    // 5) For agents, check if approved
    if (currentUser.role === "agent" && !currentUser.isApproved) {
      return next(new AppError("Agent account is not approved yet", 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token. Please log in again!", 401));
    }
    if (error.name === "TokenExpiredError") {
      return next(
        new AppError("Your token has expired! Please log in again.", 401)
      );
    }
    next(error);
  }
};

// Restrict access to certain roles
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("You are not logged in!", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
