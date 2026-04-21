import accountModel from "../model/account.model.js";
import transactionModel from "../model/transaction.model.js";
import ledgerModel from "../model/ledger.model.js";
import mongoose from "mongoose";
import { sendTransactionEmail } from "../services/email.service.js";

export const createTransaction = async (req, res) => {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,

    })

    if (!fromUserAccount || !toUserAccount) {
        return res.status(404).json({ message: "Account not found" });
    }

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({ message: "Account is not active" });
    }

    if (fromUserAccount.balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
    }

    const isTransactionAlreadyExist = await transactionModel.findOne({
        idempotencyKey
    })

    if (isTransactionAlreadyExist) {
        if (isTransactionAlreadyExist.status === "SUCCESS") {
            return res.status(400).json({ message: "Transaction already exists" });
        }
        else if (isTransactionAlreadyExist.status === "PENDING") {
            return res.status(400).json({ message: "Transaction in progress" });
        }
        else if (isTransactionAlreadyExist.status === "FAILED") {
            return res.status(400).json({ message: "Transaction failed" });
        }
        else if (isTransactionAlreadyExist.status === "REVERTED") {
            return res.status(400).json({ message: "Transaction was reverted, please try again" });
        }
    }

    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
        return res.status(400).json({ message: `Insufficient balance, Current balance is ${balance}. Requested amount is ${amount}` });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const transaction = await transactionModel.create({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
        }, { session });

        const debitLedgerEntry = await ledgerModel.create({
            account: fromAccount,
            amount,
            transaction: transaction._id,
            type: "DEBIT",
        }, { session });

        const creditLedgerEntry = await ledgerModel.create({
            account: toAccount,
            amount,
            transaction: transaction._id,
            type: "CREDIT",
        }, { session });

        transaction.status = "SUCCESS";
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();
        sendTransactionEmail(fromUserAccount.email, transaction, amount, toAccount, fromAccount, "SUCCESS", transaction._id);
        return res.status(201).json({
            message: "Transaction created successfully",
            transaction: transaction
        });

    } catch (error) {
        console.error("Transaction creation failed:", error);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const createInitialFundsTransaction = async (req, res) => {
    const { toAccount, amount, idempotencyKey } = req.body;
    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "toAccount, amount idempotencyKey are requird" });
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount"
        })
    }

}