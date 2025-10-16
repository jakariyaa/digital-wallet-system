

import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/AppError';
import { successResponse } from '../../utils/responseHandler';
import { ApproveAgentInput } from '../../validation/user.validation';
import User from './user.model';


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


export const approveAgent = async (req: Request<ApproveAgentInput['params'], {}, ApproveAgentInput['body']>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    
    const user = await User.findById(id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    
    if (user.role !== 'agent') {
      return next(new AppError('User is not an agent', 400));
    }

    
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