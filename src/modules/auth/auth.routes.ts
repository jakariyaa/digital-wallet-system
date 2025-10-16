

import express from "express";
import validate from "../../middlewares/validation.middleware";
import { loginSchema, registerSchema } from "../../validation/user.validation";
import { login, logout, register } from "./auth.controller";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);

export default router;
