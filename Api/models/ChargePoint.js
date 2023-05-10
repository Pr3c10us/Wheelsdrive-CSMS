const mongoose = require("mongoose");

// create chargePoint schema
const ChargePointSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        clientCertificate: {
            type: String,
        },
        notes: {
            type: String,
        },
        display: {
            type: Boolean,
            default: true,
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
