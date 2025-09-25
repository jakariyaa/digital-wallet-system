"use strict";
// src/modules/user/user.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveAgent = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const responseHandler_1 = require("../../utils/responseHandler");
// Get all users (admin only)
const getAllUsers = async (req, res, next) => {
    try {
        const users = await user_model_1.default.find().select('-password');
        res.status(200).json((0, responseHandler_1.successResponse)(users, 'Users retrieved successfully'));
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
// Approve/suspend agent (admin only)
const approveAgent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isApproved } = req.body;
        // Find user by ID
        const user = await user_model_1.default.findById(id);
        if (!user) {
            return next(new AppError_1.default('User not found', 404));
        }
        // Check if user is an agent
        if (user.role !== 'agent') {
            return next(new AppError_1.default('User is not an agent', 400));
        }
        // Update approval status
        user.isApproved = isApproved;
        await user.save();
        const message = isApproved ? 'Agent approved successfully' : 'Agent suspended successfully';
        res.status(200).json((0, responseHandler_1.successResponse)(user, message));
    }
    catch (error) {
        next(error);
    }
};
exports.approveAgent = approveAgent;
