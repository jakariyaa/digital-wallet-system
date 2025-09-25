"use strict";
// src/modules/transaction/transaction.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("./transaction.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const transaction_validation_1 = require("../../validation/transaction.validation");
const router = express_1.default.Router();
// Protect all routes after this middleware
router.use(auth_middleware_1.protect);
// User routes
router.post('/add', (0, auth_middleware_1.restrictTo)('user'), (0, validation_middleware_1.default)(transaction_validation_1.addMoneySchema), transaction_controller_1.addMoney);
router.post('/withdraw', (0, auth_middleware_1.restrictTo)('user'), (0, validation_middleware_1.default)(transaction_validation_1.withdrawMoneySchema), transaction_controller_1.withdrawMoney);
router.post('/send', (0, auth_middleware_1.restrictTo)('user'), (0, validation_middleware_1.default)(transaction_validation_1.sendMoneySchema), transaction_controller_1.sendMoney);
// Agent routes
router.post('/cash-in', (0, auth_middleware_1.restrictTo)('agent'), (0, validation_middleware_1.default)(transaction_validation_1.cashInSchema), transaction_controller_1.cashIn);
router.post('/cash-out', (0, auth_middleware_1.restrictTo)('agent'), (0, validation_middleware_1.default)(transaction_validation_1.cashOutSchema), transaction_controller_1.cashOut);
// Get own transactions
router.get('/me', transaction_controller_1.getMyTransactions);
// Admin routes
router.use((0, auth_middleware_1.restrictTo)('admin'));
router.get('/', transaction_controller_1.getAllTransactions);
exports.default = router;
