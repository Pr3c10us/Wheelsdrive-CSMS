const User = require("../../Database/models/User");
const TopUpTransaction = require("../../Database/models/topUpTransaction");
const { BadRequestError } = require("../errors");
const razorpayInstance = require("../razorPay/razorPay");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const order = async (req, res) => {
    // get amount and connectorId from req.body
    const { amount } = req.body;
    if (!amount) {
        throw new BadRequestError("Please provide amount");
    }
    // get user from req.user
    const { id: userId } = req.user;

    // get user info from db
    const user = await User.findById(userId);

    // create order options
    const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `${user._id}_${Date.now()}`,
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

const verifyPayment = async (req, res) => {
    const data = crypto.createHmac(
        "sha256",
        process.env.RAZORPAY_WEBHOOK_SECRET
    );
    data.update(JSON.stringify(req.body));

    const digest = data.digest("hex");
    // console.log({
    //     digest,
    //     signature: req.headers["x-razorpay-signature"],
    //     req: req.body,
    // });

    if (digest === req.headers["x-razorpay-signature"]) {
        // get order id from req.body
        if (!req.body.payload.payment) {
            throw new BadRequestError("Payment verification failed");
        }
        const { order_id: orderId, status } = req.body.payload.payment.entity;
        // get topUpTransaction from db
        const topUpTransaction = await TopUpTransaction.findOne({
            orderId,
        });
        if (!topUpTransaction) {
            throw new BadRequestError("Invalid order");
        }
        if (topUpTransaction.status === "success") {
            throw new BadRequestError("Payment already verified");
        }
        // get user from topUpTransaction
        const { user: userId } = topUpTransaction;
        const user = await User.findById(userId);
        // update user wallet
        user.balance += topUpTransaction.amount;
        await user.save();
        // update topUpTransaction
        topUpTransaction.status = "success";
        await topUpTransaction.save();
        // send response
        res.json({
            status: "ok",
        });
    } else {
        throw new BadRequestError("Payment verification failed");
    }
};

module.exports = {
    order,
    verifyPayment,
};

const demo = {
    payment: {
        entity: {
            id: "pay_MKy798PgqNM7uf",
            entity: "payment",
            amount: 10000,
            currency: "INR",
            status: "captured",
            order_id: "order_MKy6MsbrRoev0O",
            invoice_id: null,
            international: false,
            method: "card",
            amount_refunded: 0,
            refund_status: null,
            captured: true,
            description: "Test Transaction",
            card_id: "card_MKy79BZQvqKA40",
            card: [Object],
            bank: null,
            wallet: null,
            vpa: null,
            email: "gaurav.kumar@example.com",
            contact: "+919000090000",
            notes: [Object],
            fee: 200,
            tax: 0,
            error_code: null,
            error_description: null,
            error_source: null,
            error_step: null,
            error_reason: null,
            acquirer_data: [Object],
            created_at: 1690928809,
        },
    },
    order: {
        entity: {
            id: "order_MKy6MsbrRoev0O",
            entity: "order",
            amount: 10000,
            amount_paid: 10000,
            amount_due: 0,
            currency: "INR",
            receipt: "6488ec7ba799d153404f4dfe_1690928762753",
            offer_id: null,
            status: "paid",
            attempts: 1,
            notes: [],
            created_at: 1690928764,
        },
    },
};
