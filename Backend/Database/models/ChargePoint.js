const mongoose = require("mongoose");

// create chargePoint schema
const ChargePointSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        
        endpoint: {
            type: String,
        },
        ocppVersion: {
            type: String,
            enum: {
                values: ["ocpp1.6", "ocpp2.0", "ocpp2.0.1"],
            },
        },
        clientCertificate: {
            type: String,
        },
        notes: {
            type: String,
        },
        vendor: {
            type: String,
        },
        model: {
            type: String,
        },
        serialNumber: {
            type: String,
        },
        firmwareVersion: {
            type: String,
        },
        iccid: {
            type: String,
        },
        imsi: {
            type: String,
        },
        display: {
            type: Boolean,
            default: true,
        },
        isConnected: {
            type: Boolean,
            default: false,
        },
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Location",
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
        connectors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Connector",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// create chargePoint model
const ChargePoint = mongoose.model("ChargePoint", ChargePointSchema);

// export chargePoint model
module.exports = ChargePoint;

// Demo ChargePoint
const demoChargePoint = {
    name: "ChargePoint 1",
    clientCertificate: "clientCertificate",
    notes: "notes",
    display: true,
    location: "60c4b0e9e0e9e00b7c9d4b1a",
};
