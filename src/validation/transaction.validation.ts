import { z } from 'zod';


const baseTransactionSchema = {
  amount: z.number().positive('Amount must be greater than 0'),
};


export const addMoneySchema = z.object({
  body: z.object({
    ...baseTransactionSchema,
  }),
});


export const withdrawMoneySchema = z.object({
  body: z.object({
    ...baseTransactionSchema,
  }),
});


export const sendMoneySchema = z.object({
  body: z.object({
    ...baseTransactionSchema,
    receiverEmail: z.string().email('Invalid email format'),
  }),
});


export const cashInSchema = z.object({
  body: z.object({
    ...baseTransactionSchema,
    userEmail: z.string().email('Invalid email format'),
  }),
});


export const cashOutSchema = z.object({
  body: z.object({
    ...baseTransactionSchema,
    userEmail: z.string().email('Invalid email format'),
  }),
});


export type AddMoneyInput = z.infer<typeof addMoneySchema>['body'];
export type WithdrawMoneyInput = z.infer<typeof withdrawMoneySchema>['body'];
export type SendMoneyInput = z.infer<typeof sendMoneySchema>['body'];
export type CashInInput = z.infer<typeof cashInSchema>['body'];
export type CashOutInput = z.infer<typeof cashOutSchema>['body'];