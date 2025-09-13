// src/modules/wallet/wallet.routes.ts

import express from 'express';
import { getMyWallet, getAllWallets, blockWallet } from './wallet.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validation.middleware';
import { blockWalletSchema } from '../../validation/wallet.validation';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Get own wallet
router.get('/me', getMyWallet);

// Admin routes
router.use(restrictTo('admin'));

router.get('/', getAllWallets);
router.patch('/block/:id', validate(blockWalletSchema), blockWallet);

export default router;