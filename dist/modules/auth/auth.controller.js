"use strict";
// src/modules/auth/auth.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const responseHandler_1 = require("../../utils/responseHandler");
const user_model_1 = __importDefault(require("../user/user.model"));
// Generate JWT token
const signToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    });
};
// Register new user
const register = async (req, res, next) => {
    try {
        const { name, email, password, role = "user" } = req.body;
        // Check if user already exists
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            return next(new AppError_1.default("User with this email already exists", 400));
        }
        // Create new user
        const user = await user_model_1.default.create({
            name,
            email,
            password,
            role, // Allow specifying role for testing
        });
        // Generate token
        const token = signToken(user._id.toString(), user.role);
        // Remove password from output
        user.password = undefined;
        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(201).json((0, responseHandler_1.successResponse)({
            user,
        }, "User registered successfully", 201));
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// Login user
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Check if user exists and password is correct
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError_1.default("Incorrect email or password", 401));
        }
        // Check if user is active
        if (!user.isActive) {
            return next(new AppError_1.default("User account is deactivated", 401));
        }
        // For agents, check if approved
        if (user.role === "agent" && !user.isApproved) {
            return next(new AppError_1.default("Agent account is not approved yet", 401));
        }
        // Generate token
        const token = signToken(user._id.toString(), user.role);
        // Remove password from output
        user.password = undefined;
        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json((0, responseHandler_1.successResponse)({
            user,
        }, "Logged in successfully"));
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
