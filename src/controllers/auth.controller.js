import userModel from "../model/user.model.js";

export const registerUser = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const user = await userModel.create({ email, name, password });
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}