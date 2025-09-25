"use strict";
// src/utils/transactionFees.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTransactionFee = void 0;
const TRANSACTION_FEES = {
    send: { type: "percentage", value: 0.01 }, // 1% fee for sending money
    "cash-out": { type: "flat", value: 10 }, // Flat 10 unit fee for cash-out
};
const calculateTransactionFee = (transactionType, amount) => {
    const config = TRANSACTION_FEES[transactionType];
    if (!config) {
        return { fee: 0, feeType: undefined, feeValue: undefined };
    }
    let fee = 0;
    if (config.type === "percentage") {
        fee = amount * config.value;
    }
    else if (config.type === "flat") {
        fee = config.value;
    }
    return { fee, feeType: config.type, feeValue: config.value };
};
exports.calculateTransactionFee = calculateTransactionFee;
