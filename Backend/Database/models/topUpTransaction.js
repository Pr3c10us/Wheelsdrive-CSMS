const mongoose = require("mongoose");

const topUpTransaction = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: "INR",
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "success", "failed"],
    },
    notes: {
        type: String,
    },
    orderId: {
        type: String,
    },
    receiptId: {
        type: String,
    },
    razorpayOrderId: {
        type: String,
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpaySignature: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

const TopUpTransaction = mongoose.model("topUpTransaction", topUpTransaction);

module.exports = TopUpTransaction;
