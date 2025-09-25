"use strict";
// src/modules/wallet/wallet.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockWallet = exports.getAllWallets = exports.getMyWallet = void 0;
const wallet_model_1 = __importDefault(require("./wallet.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const responseHandler_1 = require("../../utils/responseHandler");
// Get logged in user's wallet
const getMyWallet = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new AppError_1.default('You are not logged in!', 401));
        }
        const wallet = await wallet_model_1.default.findOne({ userId: req.user._id });
        if (!wallet) {
            return next(new AppError_1.default('Wallet not found', 404));
        }
        res.status(200).json((0, responseHandler_1.successResponse)(wallet, 'Wallet retrieved successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.getMyWallet = getMyWallet;
// Get all wallets (admin only)
const getAllWallets = async (req, res, next) => {
    try {
        const wallets = await wallet_model_1.default.find().populate('userId', 'name email role');
        res.status(200).json((0, responseHandler_1.successResponse)(wallets, 'Wallets retrieved successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.getAllWallets = getAllWallets;
// Block/unblock wallet (admin only)
const blockWallet = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        // Find wallet by ID
        const wallet = await wallet_model_1.default.findById(id);
        if (!wallet) {
            return next(new AppError_1.default('Wallet not found', 404));
        }
        // Update wallet status
        wallet.isActive = isActive;
        await wallet.save();
        // Also update user's isActive status if blocking
        if (!isActive) {
            await user_model_1.default.findByIdAndUpdate(wallet.userId, { isActive: false });
        }
        const message = isActive ? 'Wallet unblocked successfully' : 'Wallet blocked successfully';
        res.status(200).json((0, responseHandler_1.successResponse)(wallet, message));
    }
    catch (error) {
        next(error);
    }
};
exports.blockWallet = blockWallet;
