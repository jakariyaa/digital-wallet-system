"use strict";
// src/utils/responseHandler.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (data, message = 'Success', statusCode = 200) => {
    return {
        success: true,
        message,
        data,
        statusCode
    };
};
exports.successResponse = successResponse;
const errorResponse = (message = 'An error occurred', statusCode = 500, error = null) => {
    return {
        success: false,
        message,
        error,
        statusCode
    };
};
exports.errorResponse = errorResponse;
