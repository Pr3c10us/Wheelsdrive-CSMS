const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    mobile: {
        type: String,
        unique: true,
    },
    // mobile: {
    //     type: String,
    //     unique: true,
    // },
    username: {
        type: String,
        unique: true,
    },
    carDetails: {
        type: String,
    },
    chargerAccess: {
        type: String,
    },
    password: {
        type: String,
    },
    pin: {
        type: String,
    },
    balance: {
        type: Number,
        default: 0,
    },
    otp: {
        type: Array,
    },
    mobileVerified: {
        type: Boolean,
        default: false,
    },
    twoFactorVerified: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User ;

// Demo user object
// {
//     "firstname": "John",
//     "lastname": "Doe",
//     "email": "johndoe@gmail",
//     "password": "123456",
//     "pin": "1234",
// }
