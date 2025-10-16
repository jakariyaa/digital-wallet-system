

import mongoose, { Types } from 'mongoose';

export interface IWallet {
  userId: Types.ObjectId;
  walletId: string;
  balance: number;
  dailyLimit?: number;
  monthlyLimit?: number;
  dailyAmountUsed: number;
  monthlyAmountUsed: number;
  lastResetDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletDocument extends IWallet, mongoose.Document {}

export interface WalletModel extends mongoose.Model<WalletDocument> {}