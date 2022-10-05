const mongoose = require("mongoose")

const WalletTransSchema = new mongoose.Schema({

    amount: {
        type: Number,
        default: 0,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    isInFlow: {type: Boolean},
    paymentMethod: {
        type: String, 
        default: "paystack"
    },
    currency:{
        type: String,
        required: [true, "Currency is required"],
        // enum: ["NGN", 'USD', "EUR", "GBP"]
    },
    status: {
        type: String, 
        required: [true, "payment status is a must"],
        // enum: ["successful", "pending", "failed"]
    }
},{
    timestamps: true
})

module.exports = mongoose.model("walletTransaction", WalletTransSchema)