"use strict";
// src/modules/transaction/transaction.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTransactions = exports.getMyTransactions = exports.cashOut = exports.cashIn = exports.sendMoney = exports.withdrawMoney = exports.addMoney = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wallet_model_1 = __importDefault(require("../wallet/wallet.model"));
const transaction_model_1 = __importDefault(require("./transaction.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const responseHandler_1 = require("../../utils/responseHandler");
const transactionFees_1 = require("../../utils/transactionFees");
// Helper function to check if wallet is active
const checkWalletActive = async (walletId) => {
    const wallet = await wallet_model_1.default.findById(walletId);
    if (!wallet) {
        throw new AppError_1.default("Wallet not found", 404);
    }
    if (!wallet.isActive) {
        throw new AppError_1.default("Wallet is blocked", 400);
    }
    return wallet;
};
// Add money to own wallet (User)
const addMoney = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    try {
        if (!req.user) {
            return next(new AppError_1.default("You are not logged in!", 401));
        }
        const { amount } = req.body;
        await session.withTransaction(async () => {
            // Get user's wallet
            const wallet = await wallet_model_1.default.findOne({ userId: req.user._id }).session(session);
            if (!wallet) {
                throw new AppError_1.default("Wallet not found", 404);
            }
            // Check if wallet is active
            if (!wallet.isActive) {
                throw new AppError_1.default("Wallet is blocked", 400);
            }
            // Update wallet balance
            wallet.balance += amount;
            await wallet.save({ session });
            // Create transaction record
            const transaction = await transaction_model_1.default.create([
                {
                    type: "add",
                    amount,
                    fromWalletId: wallet._id,
                    initiatedBy: req.user._id,
                    status: "completed",
                },
            ], { session });
            res.status(200).json((0, responseHandler_1.successResponse)({
                transaction: transaction[0],
                newBalance: wallet.balance,
            }, "Money added successfully"));
        });
    }
    catch (error) {
        next(error);
    }
    finally {
        await session.endSession();
    }
};
exports.addMoney = addMoney;
// Withdraw money from own wallet (User)
const withdrawMoney = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    try {
        if (!req.user) {
            return next(new AppError_1.default("You are not logged in!", 401));
        }
        const { amount } = req.body;
        await session.withTransaction(async () => {
            // Get user's wallet
            const wallet = await wallet_model_1.default.findOne({ userId: req.user._id }).session(session);
            if (!wallet) {
                throw new AppError_1.default("Wallet not found", 404);
            }
            // Check if wallet is active
            if (!wallet.isActive) {
                throw new AppError_1.default("Wallet is blocked", 400);
            }
            // Check sufficient balance
            if (wallet.balance < amount) {
                throw new AppError_1.default("Insufficient balance", 400);
            }
            // Update wallet balance
            wallet.balance -= amount;
            await wallet.save({ session });
            // Create transaction record
            const transaction = await transaction_model_1.default.create([
                {
                    type: "withdraw",
                    amount,
                    fromWalletId: wallet._id,
                    initiatedBy: req.user._id,
                    status: "completed",
                },
            ], { session });
            res.status(200).json((0, responseHandler_1.successResponse)({
                transaction: transaction[0],
                newBalance: wallet.balance,
            }, "Money withdrawn successfully"));
        });
    }
    catch (error) {
        next(error);
    }
    finally {
        await session.endSession();
    }
};
exports.withdrawMoney = withdrawMoney;
// Send money to another user (User)
const sendMoney = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    try {
        if (!req.user) {
            return next(new AppError_1.default("You are not logged in!", 401));
        }
        const { receiverEmail, amount } = req.body;
        await session.withTransaction(async () => {
            // Get sender's wallet
            const senderWallet = await wallet_model_1.default.findOne({
                userId: req.user._id,
            }).session(session);
            if (!senderWallet) {
                throw new AppError_1.default("Wallet not found", 404);
            }
            // Check if sender's wallet is active
            if (!senderWallet.isActive) {
                throw new AppError_1.default("Your wallet is blocked", 400);
            }
            // Calculate fee
            const { fee, feeType, feeValue } = (0, transactionFees_1.calculateTransactionFee)("send", amount);
            // Check sufficient balance (amount + fee)
            if (senderWallet.balance < amount + fee) {
                throw new AppError_1.default("Insufficient balance", 400);
            }
            // Get receiver user
            const receiverUser = await user_model_1.default.findOne({ email: receiverEmail }).session(session);
            if (!receiverUser) {
                throw new AppError_1.default("Receiver not found", 404);
            }
            // Get receiver's wallet
            const receiverWallet = await wallet_model_1.default.findOne({
                userId: receiverUser._id,
            }).session(session);
            if (!receiverWallet) {
                throw new AppError_1.default("Receiver wallet not found", 404);
            }
            // Check if receiver's wallet is active
            if (!receiverWallet.isActive) {
                throw new AppError_1.default("Receiver wallet is blocked", 400);
            }
            // Update wallets balance
            senderWallet.balance -= amount + fee;
            receiverWallet.balance += amount;
            await senderWallet.save({ session });
            await receiverWallet.save({ session });
            // Create transaction record
            const transaction = await transaction_model_1.default.create([
                {
                    type: "send",
                    amount,
                    fee,
                    feeType,
                    feeValue,
                    fromWalletId: senderWallet._id,
                    toWalletId: receiverWallet._id,
                    initiatedBy: req.user._id,
                    status: "completed",
                },
            ], { session });
            res.status(200).json((0, responseHandler_1.successResponse)({
                transaction: transaction[0],
                newBalance: senderWallet.balance,
            }, "Money sent successfully"));
        });
    }
    catch (error) {
        next(error);
    }
    finally {
        await session.endSession();
    }
};
exports.sendMoney = sendMoney;
// Cash-in to user's wallet (Agent)
const cashIn = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    try {
        if (!req.user) {
            return next(new AppError_1.default("You are not logged in!", 401));
        }
        // Check if user is agent
        if (req.user.role !== "agent") {
            return next(new AppError_1.default("Only agents can perform this action", 403));
        }
        // Check if agent is approved
        if (!req.user.isApproved) {
            return next(new AppError_1.default("Agent not approved", 403));
        }
        const { userEmail, amount } = req.body;
        await session.withTransaction(async () => {
            // Check if agent's wallet is active
            const agentWallet = await wallet_model_1.default.findOne({
                userId: req.user._id,
            }).session(session);
            if (!agentWallet) {
                throw new AppError_1.default("Agent wallet not found", 404);
            }
            if (!agentWallet.isActive) {
                throw new AppError_1.default("Agent wallet is blocked", 400);
            }
            // Get user
            const user = await user_model_1.default.findOne({ email: userEmail }).session(session);
            if (!user) {
                throw new AppError_1.default("User not found", 404);
            }
            // Get user's wallet
            const userWallet = await wallet_model_1.default.findOne({ userId: user._id }).session(session);
            if (!userWallet) {
                throw new AppError_1.default("User wallet not found", 404);
            }
            // Check if user's wallet is active
            if (!userWallet.isActive) {
                throw new AppError_1.default("User wallet is blocked", 400);
            }
            // Update user's wallet balance
            userWallet.balance += amount;
            await userWallet.save({ session });
            // Create transaction record
            const transaction = await transaction_model_1.default.create([
                {
                    type: "cash-in",
                    amount,
                    toWalletId: userWallet._id,
                    initiatedBy: req.user._id,
                    status: "completed",
                },
            ], { session });
            res.status(200).json((0, responseHandler_1.successResponse)({
                transaction: transaction[0],
                newUserBalance: userWallet.balance,
            }, "Cash-in successful"));
        });
    }
    catch (error) {
        next(error);
    }
    finally {
        await session.endSession();
    }
};
exports.cashIn = cashIn;
// Cash-out from user's wallet (Agent)
const cashOut = async (req, res, next) => {
    const session = await mongoose_1.default.startSession();
    try {
        if (!req.user) {
            return next(new AppError_1.default("You are not logged in!", 401));
        }
        // Check if user is agent
        if (req.user.role !== "agent") {
            return next(new AppError_1.default("Only agents can perform this action", 403));
        }
        // Check if agent is approved
        if (!req.user.isApproved) {
            return next(new AppError_1.default("Agent not approved", 403));
        }
        const { userEmail, amount } = req.body;
        await session.withTransaction(async () => {
            // Check if agent's wallet is active
            const agentWallet = await wallet_model_1.default.findOne({
                userId: req.user._id,
            }).session(session);
            if (!agentWallet) {
                throw new AppError_1.default("Agent wallet not found", 404);
            }
            if (!agentWallet.isActive) {
                throw new AppError_1.default("Agent wallet is blocked", 400);
            }
            // Get user
            const user = await user_model_1.default.findOne({ email: userEmail }).session(session);
            if (!user) {
                throw new AppError_1.default("User not found", 404);
            }
            // Get user's wallet
            const userWallet = await wallet_model_1.default.findOne({ userId: user._id }).session(session);
            if (!userWallet) {
                throw new AppError_1.default("User wallet not found", 404);
            }
            // Check if user's wallet is active
            if (!userWallet.isActive) {
                throw new AppError_1.default("User wallet is blocked", 400);
            }
            // Calculate fee
            const { fee, feeType, feeValue } = (0, transactionFees_1.calculateTransactionFee)("cash-out", amount);
            // Check sufficient balance (amount + fee)
            if (userWallet.balance < amount + fee) {
                throw new AppError_1.default("User has insufficient balance", 400);
            }
            // Update user's wallet balance
            userWallet.balance -= amount + fee;
            await userWallet.save({ session });
            // Credit agent's wallet with commission (fee)
            agentWallet.balance += fee;
            await agentWallet.save({ session });
            // Create transaction record
            const transaction = await transaction_model_1.default.create([
                {
                    type: "cash-out",
                    amount,
                    fee,
                    feeType,
                    feeValue,
                    fromWalletId: userWallet._id,
                    toWalletId: agentWallet._id, // Agent's wallet receives the fee as commission
                    initiatedBy: req.user._id,
                    status: "completed",
                },
            ], { session });
            res.status(200).json((0, responseHandler_1.successResponse)({
                transaction: transaction[0],
                newUserBalance: userWallet.balance,
            }, "Cash-out successful"));
        });
    }
    catch (error) {
        next(error);
    }
    finally {
        await session.endSession();
    }
};
exports.cashOut = cashOut;
// Get own transactions (User/Agent)
const getMyTransactions = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new AppError_1.default("You are not logged in!", 401));
        }
        const transactions = await transaction_model_1.default.find({
            $or: [
                { initiatedBy: req.user._id },
                {
                    fromWalletId: {
                        $in: [await wallet_model_1.default.findOne({ userId: req.user._id }).select("_id")],
                    },
                },
                {
                    toWalletId: {
                        $in: [await wallet_model_1.default.findOne({ userId: req.user._id }).select("_id")],
                    },
                },
            ],
        })
            .populate("fromWalletId", "userId balance")
            .populate("toWalletId", "userId balance")
            .populate("initiatedBy", "name email")
            .sort({ createdAt: -1 });
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)(transactions, "Transactions retrieved successfully"));
    }
    catch (error) {
        next(error);
    }
};
exports.getMyTransactions = getMyTransactions;
// Get all transactions (Admin)
const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await transaction_model_1.default.find()
            .populate("fromWalletId", "userId balance")
            .populate("toWalletId", "userId balance")
            .populate("initiatedBy", "name email")
            .sort({ createdAt: -1 });
        res
            .status(200)
            .json((0, responseHandler_1.successResponse)(transactions, "All transactions retrieved successfully"));
    }
    catch (error) {
        next(error);
    }
};
exports.getAllTransactions = getAllTransactions;
