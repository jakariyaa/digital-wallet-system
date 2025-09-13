import { z } from 'zod';

// Base transaction schema with common fields
const baseTransactionSchema = {
  amount: z.number().positive('Amount must be greater than 0'),
};

// Add money schema (User)
export const addMoneySchema = z.object({
  body: z.object({
    ...baseTransactionSchema,
  }),
});

// Withdraw money schema (User)
export const withdrawMoneySchema = z.object({
  body: z.object({
    ...baseTransactionSchema,
  }),
});

// Send money schema (User)
export const sendMoneySchema = z.object({
  body: z.object({
    ...baseTransactionSchema,
    receiverEmail: z.string().email('Invalid email format'),
  }),
});

// Cash-in schema (Agent)
export const cashInSchema = z.object({
  body: z.object({
    ...baseTransactionSchema,
    userEmail: z.string().email('Invalid email format'),
  }),
});

// Cash-out schema (Agent)
export const cashOutSchema = z.object({
  body: z.object({
    ...baseTransactionSchema,
    userEmail: z.string().email('Invalid email format'),
  }),
});

// Type exports for use in controllers
export type AddMoneyInput = z.infer<typeof addMoneySchema>['body'];
export type WithdrawMoneyInput = z.infer<typeof withdrawMoneySchema>['body'];
export type SendMoneyInput = z.infer<typeof sendMoneySchema>['body'];
export type CashInInput = z.infer<typeof cashInSchema>['body'];
export type CashOutInput = z.infer<typeof cashOutSchema>['body'];