"use strict";
// src/modules/auth/auth.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const user_validation_1 = require("../../validation/user.validation");
const router = express_1.default.Router();
router.post('/register', (0, validation_middleware_1.default)(user_validation_1.registerSchema), auth_controller_1.register);
router.post('/login', (0, validation_middleware_1.default)(user_validation_1.loginSchema), auth_controller_1.login);
exports.default = router;
