const mongoose = require("mongoose")

const WalletSchema = new mongoose.Schema({
    balance: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model("wallet", WalletSchema)