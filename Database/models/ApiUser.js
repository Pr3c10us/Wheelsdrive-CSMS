// Import mongoose
const mongoose = require("mongoose");

// Create user schema
const apiUserSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    mobile: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
    },
    rfids: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RFID",
        },
    ],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
    },
});

// Create user model
const ApiUser = mongoose.model("ApiUser", apiUserSchema);

// Export user model
module.exports = ApiUser;
