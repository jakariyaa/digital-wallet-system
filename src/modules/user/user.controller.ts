// src/modules/user/user.controller.ts

import { Request, Response, NextFunction } from 'express';
import User from './user.model';
import AppError from '../../utils/AppError';
import { successResponse, errorResponse } from '../../utils/responseHandler';
import { ApproveAgentInput } from '../../validation/user.validation';

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json(
      successResponse(
        users,
        'Users retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// Approve/suspend agent (admin only)
export const approveAgent = async (req: Request<ApproveAgentInput['params'], {}, ApproveAgentInput['body']>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Check if user is an agent
    if (user.role !== 'agent') {
      return next(new AppError('User is not an agent', 400));
    }

    // Update approval status
    user.isApproved = isApproved;
    await user.save();

    const message = isApproved ? 'Agent approved successfully' : 'Agent suspended successfully';
    
    res.status(200).json(
      successResponse(
        user,
        message
      )
    );
  } catch (error) {
    next(error);
  }
};