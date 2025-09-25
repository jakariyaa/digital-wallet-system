"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashOutSchema = exports.cashInSchema = exports.sendMoneySchema = exports.withdrawMoneySchema = exports.addMoneySchema = void 0;
const zod_1 = require("zod");
// Base transaction schema with common fields
const baseTransactionSchema = {
    amount: zod_1.z.number().positive('Amount must be greater than 0'),
};
// Add money schema (User)
exports.addMoneySchema = zod_1.z.object({
    body: zod_1.z.object({
        ...baseTransactionSchema,
    }),
});
// Withdraw money schema (User)
exports.withdrawMoneySchema = zod_1.z.object({
    body: zod_1.z.object({
        ...baseTransactionSchema,
    }),
});
// Send money schema (User)
exports.sendMoneySchema = zod_1.z.object({
    body: zod_1.z.object({
        ...baseTransactionSchema,
        receiverEmail: zod_1.z.string().email('Invalid email format'),
    }),
});
// Cash-in schema (Agent)
exports.cashInSchema = zod_1.z.object({
    body: zod_1.z.object({
        ...baseTransactionSchema,
        userEmail: zod_1.z.string().email('Invalid email format'),
    }),
});
// Cash-out schema (Agent)
exports.cashOutSchema = zod_1.z.object({
    body: zod_1.z.object({
        ...baseTransactionSchema,
        userEmail: zod_1.z.string().email('Invalid email format'),
    }),
});
