import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
const router = express.Router();




router.post("/", authMiddleware, (req, res) => {
    // TODO: Implement account creation logic
    res.status(501).json({ message: "Not implemented" });
});

export default router