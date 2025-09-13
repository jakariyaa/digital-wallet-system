// src/modules/user/user.routes.ts

import express from 'express';
import { getAllUsers, approveAgent } from './user.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validation.middleware';
import { approveAgentSchema } from '../../validation/user.validation';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Admin routes
router.use(restrictTo('admin'));

router.get('/', getAllUsers);
router.patch('/approve/:id', validate(approveAgentSchema), approveAgent);

export default router;