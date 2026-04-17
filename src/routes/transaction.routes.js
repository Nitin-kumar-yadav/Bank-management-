import express from "express"
import authMiddleware from "../middleware/auth.middleware.js";

const transactionRoutes = express.Router();
transactionRoutes.post('/', authMiddleware, (req, res) => {
    // TODO: Implement transaction creation logic
    res.status(501).json({ message: 'Not implemented' });
});

export default transactionRoutes;