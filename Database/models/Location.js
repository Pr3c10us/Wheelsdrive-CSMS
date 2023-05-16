const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        address: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
        latitude: {
            type: String,
        },
        longitude: {
            type: String,
        },
        display: {
            type: Boolean,
            default: true,
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
        // chargePoints: [
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "ChargePoint",
        //     },
        // ],
    },
    {
        timestamps: true,
    }
);

// create location model
const Location = mongoose.model("Location", LocationSchema);

// export location model
module.exports = Location;

// Demo Location
const demoLocation = {
    name: "Ikorodu",
    address: "6-18 Prince Adetoba Ave",
    ZipCode: "104101",
    City: "Ikorodu",
    State: "Lagos",
    Country: "Nigeria",
    Latitude: "6.656304",
    display: true,
    Longitude: "3.525031",
};
