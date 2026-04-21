import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";



async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access, token is missing",
                success: false
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.userId)
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized access, user not found",
                success: false
            })
        }
        req.user = user;
        return next();
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export async function systemUserMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access, token is missing",
                success: false
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decodedToken.userId).select("+systemUser")
        if (!user.systemUser) {
            return res.status(401).json({
                message: "Forbidden access, not a system user",
                success: false
            })
        }
        req.user = user;
        return next();
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error in system user middleware",
            success: false
        })
    }
}

export default authMiddleware;