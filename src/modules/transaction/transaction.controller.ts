

import { NextFunction, Request, Response } from "express";
import mongoose, { ClientSession } from "mongoose";
import AppError from "../../utils/AppError";
import { successResponse } from "../../utils/responseHandler";
import { calculateTransactionFee } from "../../utils/transactionFees";
import {
    AddMoneyInput,
    CashInInput,
    CashOutInput,
    SendMoneyInput,
    WithdrawMoneyInput
} from "../../validation/transaction.validation";
import User from "../user/user.model";
import Wallet from "../wallet/wallet.model";
import Transaction from "./transaction.model";


const checkWalletActive = async (walletId: mongoose.Types.ObjectId) => {
  const wallet = await Wallet.findById(walletId);
  if (!wallet) {
    throw new AppError("Wallet not found", 404);
  }
  if (!wallet.isActive) {
    throw new AppError("Wallet is blocked", 400);
  }
  return wallet;
};


export const addMoney = async (
  req: Request<{}, {}, AddMoneyInput>,
  res: Response,
  next: NextFunction
) => {
  const session: ClientSession = await mongoose.startSession();

  try {
    if (!req.user) {
      return next(new AppError("You are not logged in!", 401));
    }

    const { amount } = req.body;

    await session.withTransaction(async () => {
      
      const wallet = await Wallet.findOne({ userId: req.user!._id }).session(
        session
      );

      if (!wallet) {
        throw new AppError("Wallet not found", 404);
      }

      
      if (!wallet.isActive) {
        throw new AppError("Wallet is blocked", 400);
      }

      
      wallet.balance += amount;
      await wallet.save({ session });

      
      const transaction = await Transaction.create(
        [
          {
            type: "add",
            amount,
            fromWalletId: wallet._id,
            initiatedBy: req.user!._id,
            status: "completed",
          },
        ],
        { session }
      );

      res.status(200).json(
        successResponse(
          {
            transaction: transaction[0],
            newBalance: wallet.balance,
          },
          "Money added successfully"
        )
      );
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};


export const withdrawMoney = async (
  req: Request<{}, {}, WithdrawMoneyInput>,
  res: Response,
  next: NextFunction
) => {
  const session: ClientSession = await mongoose.startSession();

  try {
    if (!req.user) {
      return next(new AppError("You are not logged in!", 401));
    }

    const { amount } = req.body;

    await session.withTransaction(async () => {
      
      const wallet = await Wallet.findOne({ userId: req.user!._id }).session(
        session
      );

      if (!wallet) {
        throw new AppError("Wallet not found", 404);
      }

      
      if (!wallet.isActive) {
        throw new AppError("Wallet is blocked", 400);
      }

      
      if (wallet.balance < amount) {
        throw new AppError("Insufficient balance", 400);
      }

      
      wallet.balance -= amount;
      await wallet.save({ session });

      
      const transaction = await Transaction.create(
        [
          {
            type: "withdraw",
            amount,
            fromWalletId: wallet._id,
            initiatedBy: req.user!._id,
            status: "completed",
          },
        ],
        { session }
      );

      res.status(200).json(
        successResponse(
          {
            transaction: transaction[0],
            newBalance: wallet.balance,
          },
          "Money withdrawn successfully"
        )
      );
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};


export const sendMoney = async (
  req: Request<{}, {}, SendMoneyInput>,
  res: Response,
  next: NextFunction
) => {
  const session: ClientSession = await mongoose.startSession();

  try {
    if (!req.user) {
      return next(new AppError("You are not logged in!", 401));
    }

    const { receiverEmail, amount } = req.body;

    await session.withTransaction(async () => {
      
      const senderWallet = await Wallet.findOne({
        userId: req.user!._id,
      }).session(session);

      if (!senderWallet) {
        throw new AppError("Wallet not found", 404);
      }

      
      if (!senderWallet.isActive) {
        throw new AppError("Your wallet is blocked", 400);
      }

      
      const { fee, feeType, feeValue } = calculateTransactionFee(
        "send",
        amount
      );

      
      if (senderWallet.balance < amount + fee) {
        throw new AppError("Insufficient balance", 400);
      }

      
      const receiverUser = await User.findOne({ email: receiverEmail }).session(
        session
      );

      if (!receiverUser) {
        throw new AppError("Receiver not found", 404);
      }

      
      const receiverWallet = await Wallet.findOne({
        userId: receiverUser._id,
      }).session(session);

      if (!receiverWallet) {
        throw new AppError("Receiver wallet not found", 404);
      }

      
      if (!receiverWallet.isActive) {
        throw new AppError("Receiver wallet is blocked", 400);
      }

      
      senderWallet.balance -= amount + fee;
      receiverWallet.balance += amount;

      await senderWallet.save({ session });
      await receiverWallet.save({ session });

      
      const transaction = await Transaction.create(
        [
          {
            type: "send",
            amount,
            fee,
            feeType,
            feeValue,
            fromWalletId: senderWallet._id,
            toWalletId: receiverWallet._id,
            initiatedBy: req.user!._id,
            status: "completed",
          },
        ],
        { session }
      );

      res.status(200).json(
        successResponse(
          {
            transaction: transaction[0],
            newBalance: senderWallet.balance,
          },
          "Money sent successfully"
        )
      );
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};


export const cashIn = async (
  req: Request<{}, {}, CashInInput>,
  res: Response,
  next: NextFunction
) => {
  const session: ClientSession = await mongoose.startSession();

  try {
    if (!req.user) {
      return next(new AppError("You are not logged in!", 401));
    }

    
    if (req.user.role !== "agent") {
      return next(new AppError("Only agents can perform this action", 403));
    }

    
    if (!req.user.isApproved) {
      return next(new AppError("Agent not approved", 403));
    }

    const { userEmail, amount } = req.body;

    await session.withTransaction(async () => {
      
      const agentWallet = await Wallet.findOne({
        userId: req.user!._id,
      }).session(session);

      if (!agentWallet) {
        throw new AppError("Agent wallet not found", 404);
      }

      if (!agentWallet.isActive) {
        throw new AppError("Agent wallet is blocked", 400);
      }

      
      const user = await User.findOne({ email: userEmail }).session(session);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      
      const userWallet = await Wallet.findOne({ userId: user._id }).session(
        session
      );

      if (!userWallet) {
        throw new AppError("User wallet not found", 404);
      }

      
      if (!userWallet.isActive) {
        throw new AppError("User wallet is blocked", 400);
      }

      
      userWallet.balance += amount;
      await userWallet.save({ session });

      
      const transaction = await Transaction.create(
        [
          {
            type: "cash-in",
            amount,
            toWalletId: userWallet._id,
            initiatedBy: req.user!._id,
            status: "completed",
          },
        ],
        { session }
      );

      res.status(200).json(
        successResponse(
          {
            transaction: transaction[0],
            newUserBalance: userWallet.balance,
          },
          "Cash-in successful"
        )
      );
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};


export const cashOut = async (
  req: Request<{}, {}, CashOutInput>,
  res: Response,
  next: NextFunction
) => {
  const session: ClientSession = await mongoose.startSession();

  try {
    if (!req.user) {
      return next(new AppError("You are not logged in!", 401));
    }

    
    if (req.user.role !== "agent") {
      return next(new AppError("Only agents can perform this action", 403));
    }

    
    if (!req.user.isApproved) {
      return next(new AppError("Agent not approved", 403));
    }

    const { userEmail, amount } = req.body;

    await session.withTransaction(async () => {
      
      const agentWallet = await Wallet.findOne({
        userId: req.user!._id,
      }).session(session);

      if (!agentWallet) {
        throw new AppError("Agent wallet not found", 404);
      }

      if (!agentWallet.isActive) {
        throw new AppError("Agent wallet is blocked", 400);
      }

      
      const user = await User.findOne({ email: userEmail }).session(session);

      if (!user) {
        throw new AppError("User not found", 404);
      }

      
      const userWallet = await Wallet.findOne({ userId: user._id }).session(
        session
      );

      if (!userWallet) {
        throw new AppError("User wallet not found", 404);
      }

      
      if (!userWallet.isActive) {
        throw new AppError("User wallet is blocked", 400);
      }

      
      const { fee, feeType, feeValue } = calculateTransactionFee(
        "cash-out",
        amount
      );

      
      if (userWallet.balance < amount + fee) {
        throw new AppError("User has insufficient balance", 400);
      }

      
      userWallet.balance -= amount + fee;
      await userWallet.save({ session });

      
      agentWallet.balance += fee;
      await agentWallet.save({ session });

      
      const transaction = await Transaction.create(
        [
          {
            type: "cash-out",
            amount,
            fee,
            feeType,
            feeValue,
            fromWalletId: userWallet._id,
            toWalletId: agentWallet._id, 
            initiatedBy: req.user!._id,
            status: "completed",
          },
        ],
        { session }
      );

      res.status(200).json(
        successResponse(
          {
            transaction: transaction[0],
            newUserBalance: userWallet.balance,
          },
          "Cash-out successful"
        )
      );
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};


export const getMyTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next(new AppError("You are not logged in!", 401));
    }

    const transactions = await Transaction.find({
      $or: [
        { initiatedBy: req.user._id },
        {
          fromWalletId: {
            $in: [await Wallet.findOne({ userId: req.user._id }).select("_id")],
          },
        },
        {
          toWalletId: {
            $in: [await Wallet.findOne({ userId: req.user._id }).select("_id")],
          },
        },
      ],
    })
      .populate("fromWalletId", "userId balance")
      .populate("toWalletId", "userId balance")
      .populate("initiatedBy", "name email")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json(
        successResponse(transactions, "Transactions retrieved successfully")
      );
  } catch (error) {
    next(error);
  }
};


export const getAllTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transactions = await Transaction.find()
      .populate("fromWalletId", "userId balance")
      .populate("toWalletId", "userId balance")
      .populate("initiatedBy", "name email")
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json(
        successResponse(transactions, "All transactions retrieved successfully")
      );
  } catch (error) {
    next(error);
  }
};
