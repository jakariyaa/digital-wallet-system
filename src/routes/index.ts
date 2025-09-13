import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import transactionRoutes from "../modules/transaction/transaction.routes";
import userRoutes from "../modules/user/user.routes";
import walletRoutes from "../modules/wallet/wallet.routes";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/wallets", walletRoutes);
router.use("/api/transactions", transactionRoutes);
router.use("/api/users", userRoutes);

export default router;
