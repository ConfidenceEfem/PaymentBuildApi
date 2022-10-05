const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    transactionId: {
        type: Number,
        trim: true
    },
    name: {
        type: String,
        required: [true, "Transaction name is needed"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
    },
    phone: {
        type: String,
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String, 
        required: true,
        // enum: ["NGN", "USD", "EUR", "GBP"]
    },
    paymentStatus: {
        type: String,
        // enum: ["success", "failed", "pending"],
        default: "pending"
    },
    paymentGateway: {
        type: String,
        required: true,
        // enum: ["paystack"],
    }
},{
    timestamps: true
})

module.exports = mongoose.model("transaction", TransactionSchema)