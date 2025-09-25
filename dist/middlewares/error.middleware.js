"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const AppError_1 = __importDefault(require("../utils/AppError"));
const responseHandler_1 = require("../utils/responseHandler");
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((el) => el.message);
        return res
            .status(400)
            .json((0, responseHandler_1.errorResponse)("Validation failed", 400, errors));
    }
    // Handle mongoose duplicate field errors
    if (err.code === 11000) {
        return res
            .status(400)
            .json((0, responseHandler_1.errorResponse)("Duplicate field value entered", 400));
    }
    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json((0, responseHandler_1.errorResponse)("Invalid token", 401));
    }
    if (err.name === "TokenExpiredError") {
        return res.status(401).json((0, responseHandler_1.errorResponse)("Token expired", 401));
    }
    // AppError
    if (err instanceof AppError_1.default) {
        return res
            .status(err.statusCode)
            .json((0, responseHandler_1.errorResponse)(err.message, err.statusCode));
    }
    // Default error
    res
        .status(500)
        .json((0, responseHandler_1.errorResponse)(process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong!", 500, process.env.NODE_ENV === "development" ? err.stack : null));
}
