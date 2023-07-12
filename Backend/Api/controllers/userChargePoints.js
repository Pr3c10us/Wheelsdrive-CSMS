const ChargePoint = require("../../Database/models/ChargePoint");
const Connector = require("../../Database/models/Connector");
const mongoose = require("mongoose");
const { BadRequestError } = require("../errors");

const getAllChargePoints = async (req, res) => {
    // #################################################################
    // Get chargePoints based on query

    // get name query from request
    const { locationId } = req.params;

    // check if id is proper objectId
    if (!mongoose.isValidObjectId(locationId)) {
        throw new BadRequestError("Invalid Id");
    }

    // create a query object to filter result and for search attribute add admin to it
    const queryObject = {};

    // If locationId is provided in request query add to query object
    if (locationId) {
        queryObject.location = locationId;
    }

    // get chargePoints for admin
    let result = ChargePoint.find(queryObject)
        .populate("location", {
            admin: 0,
            chargePoints: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        })
        .populate({
            path: "connectors",
            select: "-createdAt -updatedAt -__v",
            populate: { path: "rate" },
        })
        // .populate("connectors", {
        //     chargePoint: 0,
        //     createdAt: 0,
        //     updatedAt: 0,
        //     __v: 0,
        // })
        .select("-admin -createdAt -updatedAt -__v");

    // #################################################################
    // Set up Pagination

    // set limit and page(from query) variable
    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // edit chargePoints based on limit and page
    result = result.skip(skip).limit(limit);

    // #################################################################
    // Send final chargePoints

    const chargePoints = await result;

    res.json({ nbHits: chargePoints.length, chargePoints });
};

const getChargePoints = async (req, res) => {
    // get chargePoint id from request params
    const { id } = req.params;

    // check if id is proper objectId
    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestError("Invalid Id");
    }

    // #################################################################
    // Get chargePoint wih id
    const chargePoint = await ChargePoint.findById(id)
        .populate("location", {
            admin: 0,
            chargePoints: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        })
        .populate({
            path: "connectors",
            select: "-createdAt -updatedAt -__v",
            populate: { path: "admin" },
        })
        // .populate("connectors")
        .select("-admin -createdAt -updatedAt -__v");

    // if chargePoint doesn't exist throw error
    if (!chargePoint) {
        throw new NotFoundError("chargePoint not found");
    }

    res.json(chargePoint);
};

module.exports = {
    getAllChargePoints,
    getChargePoints,
};
