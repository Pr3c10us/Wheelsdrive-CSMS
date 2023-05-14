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
        blocked: {
            type: Boolean,
        },
        parentRFID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RFID",
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
    parentRFID: "5f9d7b3b7e3f7e2b7c3f7e2b",
    admin: "5f9d7b3b7e3f7e2b7c3f7e2b",
};
