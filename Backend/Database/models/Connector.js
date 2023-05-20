// Import mongoose
const mongoose = require("mongoose");

// Create connector schema
const connectorSchema = new mongoose.Schema(
    {
        connectorId: {
            type: Number,
        },
        type: {
            type: String,
            enum: {
                values: ["type2", "chademo", "j1772", "", "ccs1", "ccs2"],
            },
        },
        format: {
            type: String,
            enum: {
                values: ["socket", "cable"],
            },
        },
        powerType: {
            type: String,
            enum: {
                values: ["AC", "DC"],
            },
        },
        power: {
            type: Number,
        },
        lastStatus: {
            type: String,
            enum: {
                values: [
                    "Available",
                    "Occupied",
                    "Reserved",
                    "Unavailable",
                    "Faulted",
                    "Charging",
                    "Undefined"
                ],
            },
        },
        LastMeter: {
            type: Number,
        },
        LastMeterTime: {
            type: Date,
        },
        active: {
            type: Boolean,
            default: false,
        },
        chargePoint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChargePoint",
        },
        rate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rate",
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
    },
    { timestamps: true }
);

// Create connector model
const Connector = mongoose.model("Connector", connectorSchema);

// Export connector model
module.exports = Connector;

// Demo connector
const demoConnector = {
    connectorId: 1,
    type: "type2",
    format: "socket",
    powerType: "AC",
    power: 7.4,
    lastStatus: "Available",
    LastMeter: 0,
    LastMeterTime: new Date(),
    chargePoint: "5f9d7b3b7e3f7e2b7c3f7e2b",
    rate: "5f9d7b3b7e3f7e2b7c3f7e2b",
    logs: ["5f9d7b3b7e3f7e2b7c3f7e2b"],
    admin: "5f9d7b3b7e3f7e2b7c3f7e2b",
};
