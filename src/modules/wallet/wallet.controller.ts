

import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/AppError';
import { successResponse } from '../../utils/responseHandler';
import { BlockWalletInput } from '../../validation/wallet.validation';
import User from '../user/user.model';
import Wallet from './wallet.model';


export const getMyWallet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next(new AppError('You are not logged in!', 401));
    }

    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      return next(new AppError('Wallet not found', 404));
    }

    res.status(200).json(
      successResponse(
        wallet,
        'Wallet retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};


export const getAllWallets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wallets = await Wallet.find().populate('userId', 'name email role');

    res.status(200).json(
      successResponse(
        wallets,
        'Wallets retrieved successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};


export const blockWallet = async (req: Request<BlockWalletInput['params'], {}, BlockWalletInput['body']>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    
    const wallet = await Wallet.findById(id);
    if (!wallet) {
      return next(new AppError('Wallet not found', 404));
    }

    
    wallet.isActive = isActive;
    await wallet.save();

    
    if (!isActive) {
      await User.findByIdAndUpdate(wallet.userId, { isActive: false });
    }

    const message = isActive ? 'Wallet unblocked successfully' : 'Wallet blocked successfully';
    
    res.status(200).json(
      successResponse(
        wallet,
        message
      )
    );
  } catch (error) {
    next(error);
  }
};