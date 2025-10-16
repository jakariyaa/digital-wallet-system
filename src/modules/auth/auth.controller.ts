

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError";
import { successResponse } from "../../utils/responseHandler";
import setCookie from "../../utils/setCookie";
import { LoginInput, RegisterInput } from "../../validation/user.validation";
import User from "../user/user.model";


const signToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: 7 * 24 * 60 * 60, 
  });
};


export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User with this email already exists", 400));
    }

    
    const user = await User.create({
      name,
      email,
      password,
      role, 
    });

    
    const token = signToken(user._id.toString(), user.role);

    
    (user as any).password = undefined;

    
    setCookie(res, token);

    res.status(201).json(
      successResponse(
        {
          user,
        },
        "User registered successfully",
        201
      )
    );
  } catch (error) {
    next(error);
  }
};


export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    
    if (!user.isActive) {
      return next(new AppError("User account is deactivated", 401));
    }

    
    if (user.role === "agent" && !user.isApproved) {
      return next(new AppError("Agent account is not approved yet", 401));
    }

    
    const token = signToken(user._id.toString(), user.role);

    
    (user as any).password = undefined;

    
    setCookie(res, token);

    res.status(200).json(
      successResponse(
        {
          user,
        },
        "Logged in successfully"
      )
    );
  } catch (error) {
    next(error);
  }
};


export const logout = (req: Request, res: Response) => {
  if (!req.cookies || !req.cookies.token) {
    return res.status(200).json(successResponse(null, "No active session"));
  }
  res.cookie("token", "");
  res.status(200).json(successResponse(null, "Logged out successfully"));
};
