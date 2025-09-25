"use strict";
// src/modules/wallet/wallet.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("./wallet.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const wallet_validation_1 = require("../../validation/wallet.validation");
const router = express_1.default.Router();
// Protect all routes after this middleware
router.use(auth_middleware_1.protect);
// Get own wallet
router.get('/me', wallet_controller_1.getMyWallet);
// Admin routes
router.use((0, auth_middleware_1.restrictTo)('admin'));
router.get('/', wallet_controller_1.getAllWallets);
router.patch('/block/:id', (0, validation_middleware_1.default)(wallet_validation_1.blockWalletSchema), wallet_controller_1.blockWallet);
exports.default = router;
