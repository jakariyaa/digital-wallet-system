

import express from 'express';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validation.middleware';
import { blockWalletSchema } from '../../validation/wallet.validation';
import { blockWallet, getAllWallets, getMyWallet } from './wallet.controller';

const router = express.Router();


router.use(protect);


router.get('/me', getMyWallet);


router.use(restrictTo('admin'));

router.get('/', getAllWallets);
router.patch('/block/:id', validate(blockWalletSchema), blockWallet);

export default router;