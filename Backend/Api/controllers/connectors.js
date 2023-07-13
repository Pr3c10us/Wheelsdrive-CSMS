const Admin = require("../../Database/models/Admin");
const Connector = require("../../Database/models/Connector");
const mongoose = require("mongoose");
const { BadRequestError, NotFoundError } = require("../errors");

// Get a connector info
const getConnectorInfo = async (req, res) => {
    // get admin id from auth middleware
    const { id: adminId } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(adminId);

    // get chargePoint id from request params
    const { id } = req.params;

    // #################################################################
    // Get chargePoint wih id and admin

    const chargePoint = await Connector.findOne({ _id: id, admin })
        .populate("chargePoint", {
            admin: 0,
            chargePoints: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        })
        .populate("rate", {
            admin: 0,
            chargePoints: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        })
        // .populate("connectors")
        .select("-admin -createdAt -updatedAt -__v");

    // if chargePoint doesn't exist throw error
    if (!chargePoint) {
        throw new NotFoundError("chargePoint not found");
    }

    res.json(chargePoint);
};

// Create Update connector controller
const updateConnector = async (req, res) => {
    // get admin id from auth middleware
    const { id: adminId } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(adminId);
    // get connector id from request params
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestError("Invalid Object Id");
    }

    // ##########################################################################
    // Update connector with id and admin
    const connector = await Connector.findOneAndUpdate(
        { _id: id, admin },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    )
        .populate("chargePoint", {
            _id: 0,
            admin: 0,
            connectors: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        })
        .select("-admin -createdAt -updatedAt -__v");

    // if connector doesn't exist throw error
    if (!connector) {
        throw new NotFoundError("connector not found");
    }

    res.json({ msg: "connector updated" });
};

module.exports = {
    updateConnector,
    getConnectorInfo,
};
