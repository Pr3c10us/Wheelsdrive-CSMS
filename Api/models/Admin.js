// Import mongoose
const mongoose = require("mongoose");

// create user schema for csms cpo
const AdminSchema = new mongoose.Schema({
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
    password: {
        type: String,
    },
    country: {
        type: String,
    },
    company: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
});

// create user model for csms cpo
const Admin = mongoose.model("Admin", AdminSchema);

// export user model for csms cpo
module.exports = Admin;

// Demo Admin
const demoAdmin = {
    firstName: "Precious",
    lastName: "Owolabi",
    email: "owo.pre.eno@gmail.com",
    mobile: "+2348167890123",
    password: "123456",
    Country: "Nigeria",
    Company: "WheelsDrive",
};
