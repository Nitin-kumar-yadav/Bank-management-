import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating a user"],
        unique: [true, "Email already exists"],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    name: {
        type: String,
        required: [true, "Name is required for creating a user"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [128, "Name must be at most 128 characters long"]
    },
    password: {
        type: String,
        required: [true, "Password is required for creating a user"],
        trim: true,
        minlength: [6, "Password must be at least 6 characters long"],
        maxlength: [128, "Password must be at most 128 characters long"],
        select: false
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false,
        
    }

}, { timestamps: true })

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("User", userSchema);
export default userModel;
