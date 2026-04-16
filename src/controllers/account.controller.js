import accountModel from "../model/account.model.js";

const createAccountController = async (req, res) => {
    try {
        const user = req.user;
        const account = await accountModel.create({
            user: user._id,
            status: "ACTIVE",
            currency: "INR",

        })
        return res.status(201).json({ message: "Account created successfully", account });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default createAccountController