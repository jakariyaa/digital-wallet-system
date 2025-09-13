// src/modules/auth/auth.routes.ts

import express from 'express';
import { register, login } from './auth.controller';
import validate from '../../middlewares/validation.middleware';
import { registerSchema, loginSchema } from '../../validation/user.validation';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;