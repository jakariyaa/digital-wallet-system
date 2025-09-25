"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockWalletSchema = void 0;
const zod_1 = require("zod");
// Block wallet schema
exports.blockWalletSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().min(1, 'Wallet ID is required'),
    }),
    body: zod_1.z.object({
        isActive: zod_1.z.boolean(),
    }),
});
