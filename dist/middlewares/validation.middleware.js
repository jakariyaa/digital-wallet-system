"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../utils/AppError"));
const responseHandler_1 = require("../utils/responseHandler");
// Validation middleware factory
const validate = (schema) => async (req, res, next) => {
    try {
        // Validate request data against schema
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        // If validation passes, proceed to next middleware
        return next();
    }
    catch (error) {
        // If validation fails, handle ZodError
        if (error instanceof zod_1.ZodError) {
            // Format Zod errors into a more readable format
            const errorMessages = error.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            }));
            // Return validation error response
            return res.status(400).json((0, responseHandler_1.errorResponse)('Validation failed', 400, {
                errors: errorMessages,
            }));
        }
        // Handle any other errors
        return next(new AppError_1.default('Internal server error', 500));
    }
};
exports.default = validate;
