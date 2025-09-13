// src/modules/transaction/transaction.model.ts

import mongoose, { Schema } from "mongoose";
import { TransactionDocument } from "../../types/transaction.types";

const transactionSchema = new Schema<TransactionDocument>(
  {
    type: {
      type: String,
      required: [true, "Transaction type is required"],
      enum: ["add", "withdraw", "send", "cash-in", "cash-out"],
    },
    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    fee: {
      type: Number,
      default: 0,
    },
    feeType: {
      type: String,
      enum: ["percentage", "flat"],
    },
    feeValue: {
      type: Number,
    },
    commission: {
      type: Number,
      default: 0,
    },
    fromWalletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },
    toWalletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
    },
    systemWallet: {
      type: String,
      default: process.env.SYSTEM_WALLET_ID,
    },
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Initiator is required"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
transactionSchema.index({ initiatedBy: 1 });
transactionSchema.index({ fromWalletId: 1 });
transactionSchema.index({ toWalletId: 1 });
transactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model<TransactionDocument>(
  "Transaction",
  transactionSchema
);

export default Transaction;
