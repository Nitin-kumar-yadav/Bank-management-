import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Account must be associated with a user"],
        index: true,
    },
    status: {
        enum: ["ACTIVE", "FROZEN", "CLOSED"],
        default: "ACTIVE",
        message: "Status can be either ACTIVE, FROZEN or CLOSED",
        required: true
    },
    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR",
    }
    
}, { timestamps: true });

accountSchema.index({user: 1, status: 1})

const accountModel = mongoose.model("account", accountSchema);
export default accountModel;