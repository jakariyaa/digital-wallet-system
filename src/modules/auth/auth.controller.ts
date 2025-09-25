// src/modules/auth/auth.controller.ts

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../../utils/AppError";
import { successResponse } from "../../utils/responseHandler";
import { LoginInput, RegisterInput } from "../../validation/user.validation";
import User from "../user/user.model";

// Generate JWT token
const signToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  });
};

// Register new user
export const register = async (
  req: Request<{}, {}, RegisterInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("User with this email already exists", 400));
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role, // Allow specifying role for testing
    });

    // Generate token
    const token = signToken(user._id.toString(), user.role);

    // Remove password from output
    (user as any).password = undefined;

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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

// Login user
export const login = async (
  req: Request<{}, {}, LoginInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError("User account is deactivated", 401));
    }

    // For agents, check if approved
    if (user.role === "agent" && !user.isApproved) {
      return next(new AppError("Agent account is not approved yet", 401));
    }

    // Generate token
    const token = signToken(user._id.toString(), user.role);

    // Remove password from output
    (user as any).password = undefined;

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

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
