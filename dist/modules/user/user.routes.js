"use strict";
// src/modules/user/user.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const user_validation_1 = require("../../validation/user.validation");
const router = express_1.default.Router();
// Protect all routes after this middleware
router.use(auth_middleware_1.protect);
// Admin routes
router.use((0, auth_middleware_1.restrictTo)('admin'));
router.get('/', user_controller_1.getAllUsers);
router.patch('/approve/:id', (0, validation_middleware_1.default)(user_validation_1.approveAgentSchema), user_controller_1.approveAgent);
exports.default = router;
