import express from "express"
import authMiddleware, { systemUserMiddleware } from "../middleware/auth.middleware.js";
import { createTransaction, createInitialFundsTransaction } from "../controllers/transaction.controller.js";


const transactionRoutes = express.Router();
transactionRoutes.post('/', authMiddleware, createTransaction);
transactionRoutes.post("/system/initial-funds", systemUserMiddleware, createInitialFundsTransaction)

export default transactionRoutes;