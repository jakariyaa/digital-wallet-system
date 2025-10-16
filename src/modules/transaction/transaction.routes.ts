

import express from 'express';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import validate from '../../middlewares/validation.middleware';
import {
    addMoneySchema,
    cashInSchema,
    cashOutSchema,
    sendMoneySchema,
    withdrawMoneySchema
} from '../../validation/transaction.validation';
import {
    addMoney,
    cashIn,
    cashOut,
    getAllTransactions,
    getMyTransactions,
    sendMoney,
    withdrawMoney
} from './transaction.controller';

const router = express.Router();


router.use(protect);


router.post('/add', restrictTo('user'), validate(addMoneySchema), addMoney);
router.post('/withdraw', restrictTo('user'), validate(withdrawMoneySchema), withdrawMoney);
router.post('/send', restrictTo('user'), validate(sendMoneySchema), sendMoney);


router.post('/cash-in', restrictTo('agent'), validate(cashInSchema), cashIn);
router.post('/cash-out', restrictTo('agent'), validate(cashOutSchema), cashOut);


router.get('/me', getMyTransactions);


router.use(restrictTo('admin'));
router.get('/', getAllTransactions);

export default router;