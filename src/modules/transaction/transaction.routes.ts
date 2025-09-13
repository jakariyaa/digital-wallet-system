// src/modules/transaction/transaction.routes.ts

import express from 'express';
import {
  addMoney,
  withdrawMoney,
  sendMoney,
  cashIn,
  cashOut,
  getMyTransactions,
  getAllTransactions
} from './transaction.controller';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validation.middleware';
import { 
  addMoneySchema, 
  withdrawMoneySchema, 
  sendMoneySchema, 
  cashInSchema, 
  cashOutSchema 
} from '../../validation/transaction.validation';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// User routes
router.post('/add', restrictTo('user'), validate(addMoneySchema), addMoney);
router.post('/withdraw', restrictTo('user'), validate(withdrawMoneySchema), withdrawMoney);
router.post('/send', restrictTo('user'), validate(sendMoneySchema), sendMoney);

// Agent routes
router.post('/cash-in', restrictTo('agent'), validate(cashInSchema), cashIn);
router.post('/cash-out', restrictTo('agent'), validate(cashOutSchema), cashOut);

// Get own transactions
router.get('/me', getMyTransactions);

// Admin routes
router.use(restrictTo('admin'));
router.get('/', getAllTransactions);

export default router;