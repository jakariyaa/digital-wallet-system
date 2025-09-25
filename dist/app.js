"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const routes_1 = __importDefault(require("./routes"));
const responseHandler_1 = require("./utils/responseHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS
app.use((0, cors_1.default)());
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Root route
app.get("/", (req, res) => {
    res.status(200).json((0, responseHandler_1.successResponse)({
        message: "Digital Wallet API is running!",
        version: "1.0.0",
    }));
});
// API routes
app.use(routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json((0, responseHandler_1.errorResponse)("Route not found", 404));
});
// Error handling middleware
app.use(error_middleware_1.default);
exports.default = app;
