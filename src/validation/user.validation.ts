import { z } from 'zod';


export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().email('Invalid email format').max(100, 'Email cannot exceed 100 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password cannot exceed 100 characters'),
    role: z.enum(['admin', 'user', 'agent']).optional().default('user'),
  }),
});


export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});


export const approveAgentSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'User ID is required'),
  }),
  body: z.object({
    isApproved: z.boolean(),
  }),
});


export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type ApproveAgentInput = z.infer<typeof approveAgentSchema>;