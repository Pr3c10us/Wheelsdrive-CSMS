// Import mongoose
const mongoose = require("mongoose");

// Create rfid schema
const rfidSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        rfid: {
            type: String,
        },
        expires: {
            type: Date,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        blocked: {
            type: Boolean,
            default: false,
        },
        parentRFID: {
            type: String,
        },
        apiUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ApiUser",
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
    },
    { timestamps: true }
);

// Create rfid model
const RFID = mongoose.model("RFID", rfidSchema);

// Export rfid model
module.exports = RFID;

// Demo rfid
const demoRFID = {
    name: "John Doe",
    rfid: "1234",
    expires: "2020-11-01T00:00:00.000Z",
    blocked: false,
    adminUserId: "5f8f7b7b9d3e9b1b7c9e4b1b",
};
