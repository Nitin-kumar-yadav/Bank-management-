import accountModel from "../model/account.model.js";
import transactionModel from "../model/transaction.model.js";



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

} 