const mongoosse = require("mongoose");

const RateSchema = new mongoosse.Schema(
    {
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        currency: {
            type: String,
            default: "INR",
        },
        discount: {
            type: Number,
        },
        price: {
            type: Number,
        },
        admin: {
            type: mongoosse.Schema.Types.ObjectId,
            ref: "Admin",
        },
    },
    { timestamps: true }
);

const Rate = mongoosse.model("Rate", RateSchema);

module.exports = Rate;

const demoRate = new Rate({
    name: "Demo Rate 1",
    description: "This is a demo rate",
    discount: 5,
    price: 30,
});
