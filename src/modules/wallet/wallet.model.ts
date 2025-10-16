

import mongoose, { Schema } from "mongoose";
import { WalletDocument } from "../../types/wallet.types";

const walletSchema = new Schema<WalletDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Wallet must belong to a user"],
      unique: true,
    },
    walletId: {
      type: String,
      required: true,
      unique: true,
      default: () => `wallet_${Math.random().toString(36).substr(2, 9)}`,
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, "Balance cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    dailyLimit: {
      type: Number,
      default: 0,
      min: [0, "Daily limit cannot be negative"],
    },
    monthlyLimit: {
      type: Number,
      default: 0,
      min: [0, "Monthly limit cannot be negative"],
    },
    dailyAmountUsed: {
      type: Number,
      default: 0,
      min: [0, "Daily amount used cannot be negative"],
    },
    monthlyAmountUsed: {
      type: Number,
      default: 0,
      min: [0, "Monthly amount used cannot be negative"],
    },
    lastResetDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);





const Wallet = mongoose.model<WalletDocument>("Wallet", walletSchema);

export default Wallet;
