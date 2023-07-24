const ChargePoint = require("../../Database/models/ChargePoint");
const Location = require("../../Database/models/Location");
const Transaction = require("../../Database/models/Transaction");

const revenue = async (req, res) => {
    const { type } = req.query;
    // return console.log(type);

    let dateFilter = {};
    let format = "%Y-%m-%d";
    if (type === "day") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateFilter = { $match: { createdAt: { $gte: thirtyDaysAgo } } };
    } else if (type === "month") {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        dateFilter = { $match: { createdAt: { $gte: twelveMonthsAgo } } };
        format = "%Y-%m";
    } else {
        dateFilter = {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), 0, 1),
                },
            },
        };
    }

    const pipeline = [
        dateFilter,
        {
            $group: {
                _id: {
                    $dateToString: { format, date: "$createdAt" },
                },
                revenue: { $sum: "$cost" },
            },
        },
        {
            $sort: { _id: -1 },
        },
    ];

    const result = await Transaction.aggregate(pipeline);
    res.json(result);
};

const totalTransaction = async (req, res) => {
    const { type } = req.query;
    // return console.log(type);

    let dateFilter = {};
    let format = "%Y-%m-%d";
    if (type === "day") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateFilter = { $match: { createdAt: { $gte: thirtyDaysAgo } } };
    } else if (type === "month") {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        dateFilter = { $match: { createdAt: { $gte: twelveMonthsAgo } } };
        format = "%Y-%m";
    } else {
        dateFilter = {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), 0, 1),
                },
            },
        };
    }

    const pipeline = [
        dateFilter,
        {
            $group: {
                _id: {
                    $dateToString: { format, date: "$createdAt" },
                },
                totalTransaction: { $sum: 1 },
            },
        },
        {
            $sort: { _id: -1 },
        },
    ];

    const result = await Transaction.aggregate(pipeline);
    res.json(result);
};

const power = async (req, res) => {
    const { type } = req.query;
    // return console.log(type);

    let dateFilter = {};
    let format = "%Y-%m-%d";
    if (type === "day") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateFilter = { $match: { createdAt: { $gte: thirtyDaysAgo } } };
    } else if (type === "month") {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        dateFilter = { $match: { createdAt: { $gte: twelveMonthsAgo } } };
        format = "%Y-%m";
    } else {
        dateFilter = {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), 0, 1),
                },
            },
        };
    }

    const pipeline = [
        dateFilter,
        {
            $group: {
                _id: {
                    $dateToString: { format, date: "$createdAt" },
                },
                power: { $sum: "$totalEnergy" },
            },
        },
        {
            $sort: { _id: -1 },
        },
    ];

    const result = await Transaction.aggregate(pipeline);
    res.json(result);
};

const otherDashboardData = async (req, res) => {
    const chargePoints = await ChargePoint.find({});
    const totalChargePoints = chargePoints.length;
    const totalConnectedChargePoints = chargePoints.filter(
        (chargePoint) => chargePoint.isConnected
    ).length;
    const totalDisconnectedChargePoints = chargePoints.filter(
        (chargePoint) => !chargePoint.isConnected
    ).length;

    // get all locations
    const locations = await Location.find({});
    const totalLocations = locations.length;

    // get all transactions
    const transactions = await Transaction.find({});
    const totalPower = transactions.reduce((acc, transaction) => {
        return acc + (transaction.totalEnergy || 0);
    }, 0);

    res.json({
        totalChargePoints,
        totalConnectedChargePoints,
        totalDisconnectedChargePoints,
        totalLocations,
        totalPower,
    });
};

module.exports = { revenue, totalTransaction, power, otherDashboardData };
