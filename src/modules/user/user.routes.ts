

import express from 'express';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validation.middleware';
import { approveAgentSchema } from '../../validation/user.validation';
import { approveAgent, getAllUsers } from './user.controller';

const router = express.Router();


router.use(protect);


router.use(restrictTo('admin'));

router.get('/', getAllUsers);
router.patch('/approve/:id', validate(approveAgentSchema), approveAgent);

export default router;