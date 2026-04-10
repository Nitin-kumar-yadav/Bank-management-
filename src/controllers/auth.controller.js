import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail } from "../services/email.service.js";

export const registerUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json({
                message: "Email, name and password are required",
                status: "failed"
            })
        }
        const isExist = await userModel.findOne({
            email: email
        })
        if (isExist) {
            return res.status(422).json({
                message: "User already exists",
                status: "failed"
            })
        }
        const user = await userModel.create({ email, name, password });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000
        })
        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            message: "User registered successfully",
            status: "success"
        })
        await sendRegistrationEmail(user.email, user.name);
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error", status: "failed" });
    }
}

export const loginUser = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: "Email and password are required",
            status: "failed"
        })
    }
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email }).select("+password");
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failed"
            })
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
                status: "failed"
            })
        } const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            message: "User logged in successfully",
            status: "success"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}