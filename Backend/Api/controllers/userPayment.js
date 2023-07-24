const User = require("../../Database/models/User");
const TopUpTransaction = require("../../Database/models/topUpTransaction");
const razorpayInstance = require("../razorpay/razorPay");
const Razorpay = require("razorpay");

const order = async (req, res) => {
    // get amount and connectorId from req.body
    const { amount } = req.body;
    // get user from req.user
    const { id: userId } = req.user;

    // get user info from db
    const user = await User.findById(userId);

    // create order options
    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `topup_${user._id}_${Date.now()}`,
    };
    // create order
    const order = await razorpayInstance.orders.create(options);

    // create topUpTransaction
    await TopUpTransaction.create({
        amount,
        currency: order.currency,
        status: "pending",
        orderId: order.id,
        receiptId: order.receipt,
        user,
    });

    res.json({ order });
};

const verifyPayment = (req, res) => {
    // get razorpay order_id payment_id and signature from request body
    
    res.send("verifyPayment");
};

module.exports = {
    order,
    verifyPayment,
};
