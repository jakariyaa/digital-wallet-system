"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const transaction_routes_1 = __importDefault(require("../modules/transaction/transaction.routes"));
const user_routes_1 = __importDefault(require("../modules/user/user.routes"));
const wallet_routes_1 = __importDefault(require("../modules/wallet/wallet.routes"));
const router = (0, express_1.Router)();
router.use("/api/auth", auth_routes_1.default);
router.use("/api/wallets", wallet_routes_1.default);
router.use("/api/transactions", transaction_routes_1.default);
router.use("/api/users", user_routes_1.default);
exports.default = router;
