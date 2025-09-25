"use strict";
// src/middlewares/auth.middleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const protect = async (req, res, next) => {
    try {
        // 1) Get token from cookie and check if it exists
        const token = req.cookies.token;
        if (!token) {
            return next(new AppError_1.default("You are not logged in! Please log in to get access.", 401));
        }
        // 2) Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // 3) Check if user still exists
        const currentUser = await user_model_1.default.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError_1.default("The user belonging to this token does no longer exist.", 401));
        }
        // 4) Check if user is active
        if (!currentUser.isActive) {
            return next(new AppError_1.default("This user account has been deactivated.", 401));
        }
        // 5) For agents, check if approved
        if (currentUser.role === "agent" && !currentUser.isApproved) {
            return next(new AppError_1.default("Agent account is not approved yet", 401));
        }
        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    }
    catch (error) {
        if (error.name === "JsonWebTokenError") {
            return next(new AppError_1.default("Invalid token. Please log in again!", 401));
        }
        if (error.name === "TokenExpiredError") {
            return next(new AppError_1.default("Your token has expired! Please log in again.", 401));
        }
        next(error);
    }
};
exports.protect = protect;
// Restrict access to certain roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError_1.default("You are not logged in!", 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.default("You do not have permission to perform this action", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
