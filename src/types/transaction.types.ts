// src/types/transaction.types.ts

import mongoose, { Types } from "mongoose";

export interface ITransaction {
  type: "add" | "withdraw" | "send" | "cash-in" | "cash-out";
  amount: number;
  fee?: number;
  feeType?: "percentage" | "flat";
  feeValue?: number;
  commission?: number;
  fromWalletId?: Types.ObjectId;
  toWalletId?: Types.ObjectId;
  systemWallet?: string;
  initiatedBy: Types.ObjectId; // userId of the person initiating the transaction
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionDocument extends ITransaction, mongoose.Document {}

export interface TransactionModel extends mongoose.Model<TransactionDocument> {}
