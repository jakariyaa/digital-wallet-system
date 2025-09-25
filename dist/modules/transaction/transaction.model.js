"use strict";
// src/modules/transaction/transaction.model.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const transactionSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
    },
    toWalletId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
    },
    systemWallet: {
        type: String,
        default: process.env.SYSTEM_WALLET_ID,
    },
    initiatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Initiator is required"],
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "completed",
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Indexes
transactionSchema.index({ initiatedBy: 1 });
transactionSchema.index({ fromWalletId: 1 });
transactionSchema.index({ toWalletId: 1 });
transactionSchema.index({ createdAt: -1 });
const Transaction = mongoose_1.default.model("Transaction", transactionSchema);
exports.default = Transaction;
