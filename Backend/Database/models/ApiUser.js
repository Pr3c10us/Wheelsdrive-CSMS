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
    username: {
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
        default: false,
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

// Create demo user
// const demoUser = new ApiUser({
//     firstName: "Demo",
//     lastName: "User",
//     email: "demo@demo",
//     mobile: "1234567890",
// });
