import { z } from 'zod';


export const blockWalletSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Wallet ID is required'),
  }),
  body: z.object({
    isActive: z.boolean(),
  }),
});


export type BlockWalletInput = z.infer<typeof blockWalletSchema>;