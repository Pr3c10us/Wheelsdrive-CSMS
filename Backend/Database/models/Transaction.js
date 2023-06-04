// Import mongoose
const mongoose = require("mongoose");

// Create OCPP TRANSACTIONS schema
const transactionSchema = new mongoose.Schema(
    {
        transactionUniqueId: {
            type: Number,
        },
        startRFID: {
            type: String,
        },
        startTime: {
            type: Date,
        },
        meterStart: {
            type: Number,
        },
        startResult: {
            type: String,
        },
        StopRFID: {
            type: String,
        },
        stopTime: {
            type: Date,
        },
        meterStop: {
            type: Number,
        },
        stopReason: {
            type: String,
        },
        unitChargingRate: {
            type: Number,
        },
        discountChargingRate: {
            type: Number,
        },
        totalEnergy:{
            type: Number,
        },
        cost: {
            type: Number,
        },
        chargePoint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChargePoint",
        },
        connector: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Connector",
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
        },
    },
    { timestamps: true }
);

// Create OCPP TRANSACTIONS model
const Transaction = mongoose.model("Transaction", transactionSchema);

// Export OCPP TRANSACTIONS model
module.exports = Transaction;
