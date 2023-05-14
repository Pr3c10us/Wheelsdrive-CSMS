// Import mongoose
const mongoose = require("mongoose");

// Create OCPP LOGS schema
const logSchema = new mongoose.Schema(
    {
        // If there was an error from the charge point ocpp request, then return errorCode like "FormationViolation"
        errorCode: {
            type: String,
        },
        // If request has payload like {connectorId: 1, idTag: "1234"}, then return payload as string to be converted
        result: {
            type: String,
        },
        // This would be the message action like "BootNotification"
        message: {
            type: String,
        },
        // The origin of where the message is from either charger or csms
        origin: {
            type: String,
            enum: ["charger", "csms"],
        },
        // The connector of the charge point where the request was made
        connectorId: {
            type: Number
        },
        // The chargePoint where request was made
        chargePoint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChargePoint",
        },
        // the admin of the admin that made the request
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
    },
    { timestamps: true }
);

// Create OCPP LOGS model
const Log = mongoose.model("Log", logSchema);

// Export OCPP LOGS model
module.exports = Log;

// Demo OCPP LOGS
const demoLog = {
    errorCode: "FormationViolation",
    result: "Accepted",
    message: "BootNotification",
    origin: "charger",
    connector: "5f9d7b3b7e3f7e2b7c3f7e2b",
    chargePoint: "5f9d7b3b7e3f7e2b7c3f7e2b",
    admin: "5f9d7b3b7e3f7e2b7c3f7e2b",
};
