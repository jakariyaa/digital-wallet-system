import { z } from 'zod';

// Block wallet schema
export const blockWalletSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Wallet ID is required'),
  }),
  body: z.object({
    isActive: z.boolean(),
  }),
});

// Type exports for use in controllers
export type BlockWalletInput = z.infer<typeof blockWalletSchema>;