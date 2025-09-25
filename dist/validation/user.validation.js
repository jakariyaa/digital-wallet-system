"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveAgentSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// User registration schema
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
        email: zod_1.z.string().email('Invalid email format').max(100, 'Email cannot exceed 100 characters'),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password cannot exceed 100 characters'),
        role: zod_1.z.enum(['admin', 'user', 'agent']).optional().default('user'),
    }),
});
// User login schema
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
// Approve agent schema
exports.approveAgentSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'User ID is required'),
    }),
    body: zod_1.z.object({
        isApproved: zod_1.z.boolean(),
    }),
});
