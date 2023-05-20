const { BadRequestError, NotFoundError } = require("../errors");
const Admin = require("../../Database/models/Admin");
const ChargePoint = require("../../Database/models/ChargePoint");
const Connector = require("../../Database/models/Connector");
const Location = require("../../Database/models/Location");
const mongoose = require("mongoose");
const createChargePoint = async (req, res) => {
    // get admin id
    const { id: adminId } = req.admin;
    // get admin from database with id
    const admin = await Admin.findById(adminId);

    // ##########################################################################
    // Check if chargepoint with name already exist
    const { name } = req.body;
    // get chargepoint from database with name
    const nameExist = await ChargePoint.findOne({ name, admin });

    // throw error if chargepoint with name already exist
    if (nameExist) {
        throw new BadRequestError("ChargePoint with name already exist");
    }

    // ##########################################################################
    // Check if chargepoint with endpoint already exist
    const { endpoint } = req.body;
    if (!endpoint) {
        throw new BadRequestError("Endpoint is required");
    }

    // get chargepoint from database with endpoint
    const endpointExist = await ChargePoint.findOne({ endpoint, admin });

    // throw error if chargepoint with endpoint already exist
    if (endpointExist) {
        throw new BadRequestError("ChargePoint with endpoint already exist");
    }

    // ##########################################################################
    // Get Location

    // get location id from request body
    const { locationId } = req.body;
    // get location from database with id that belongs to admin
    const location = await Location.findOne({ _id: locationId, admin });

    // throw error if location does not exist
    if (!location) {
        throw new BadRequestError("Location does not exist");
    }

    // ##########################################################################
    // Add location and Admin to request body

    // add location to request body
    req.body.location = location;
    // add admin to request body
    req.body.admin = admin;

    // ##########################################################################
    // Create ChargePoint

    const chargePoint = await ChargePoint.create(req.body);

    // // ##########################################################################
    // // Add ChargePoint to Location

    // // add chargePoint to location
    // location.chargePoints.push(chargePoint);
    // // save location
    // await location.save();

    res.json({ msg: "charge point added" });
};

const getChargePoints = async (req, res) => {
    // get admin id
    const { id: adminId } = req.admin;
    // get admin from database with id
    const admin = await Admin.findById(adminId);

    // #################################################################
    // Get chargePoints based on query

    // get name query from request
    const { name, locationId } = req.query;

    // create a query object to filter result and for search attribute add admin to it
    const queryObject = { admin };

    // if name is provided in request query add to query object
    if (name) {
        queryObject.name = { $regex: name, $options: "i" };
    }
    // If locationId is provided in request query add to query object
    if (locationId) {
        queryObject.location = locationId;
    }

    // get chargePoints for admin
    let result = ChargePoint.find(queryObject)
        .populate("location", {
            _id: 0,
            admin: 0,
            chargePoints: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        })
        .populate("connectors", {
            _id: 0,
            chargePoint: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        })
        .select("-admin -createdAt -updatedAt -__v");

    // #################################################################
    // Set up Pagination

    // set limit and page(from query) variable
    const limit = Number(req.query.limit) || 2;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // edit chargePoints based on limit and page
    result = result.skip(skip).limit(limit);

    // #################################################################
    // Send final chargePoints

    const chargePoints = await result;

    res.json({ nbHits: chargePoints.length, chargePoints });
};

const getChargePoint = async (req, res) => {
    // get admin id from auth middleware
    const { id: adminId } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(adminId);

    // get chargePoint id from request params
    const { id } = req.params;

    // #################################################################
    // Get chargePoint wih id and admin

    const chargePoint = await ChargePoint.findOne({ _id: id, admin })
        .populate("location", {
            _id: 0,
            admin: 0,
            chargePoints: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        })
        .populate("connectors", {
            _id: 0,
            chargePoint: 0,
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

const updateChargePoint = async (req, res) => {
    // get admin id from auth middleware
    const { id: adminId } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(adminId);
    // get chargePoint id from request params
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestError("Invalid Object Id");
    }

    // ##########################################################################
    // Check if user is trying to update endpoint
    if (req.body.endpoint) {
        throw new BadRequestError("Cannot update endpoint");
    }

    // ##########################################################################
    // Check if chargepoint with name already exist
    if (req.body.name) {
        // get chargepoint from database with name
        const nameExist = await ChargePoint.findOne({
            name: req.body.name,
            admin,
        });

        // throw error if chargepoint with name already exist
        if (nameExist) {
            throw new BadRequestError("ChargePoint with name already exist");
        }
    }

    // ##########################################################################
    // Get Location

    if (req.body.locationId) {
        // get location id from request body
        const { locationId } = req.body;
        // Check if id is valid mongooseId
        if (!mongoose.isValidObjectId(req.body.locationId)) {
            throw new BadRequestError("Invalid Object Id");
        }
        // get location from database with id that belongs to admin
        const location = await Location.findOne({ _id: locationId, admin });

        // throw error if location does not exist
        if (!location) {
            throw new BadRequestError("Location does not exist");
        }

        // ##########################################################################
        // Add location and Admin to request body

        // add location to request body
        req.body.location = location;
    }

    // #################################################################
    // Get chargePoint with id and admin and update

    const chargePoint = await ChargePoint.findOneAndUpdate(
        { _id: id, admin },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    )
        .populate("location", {
            _id: 0,
            admin: 0,
            chargePoints: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        })
        .populate("connectors", {
            _id: 0,
            chargePoint: 0,
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

    res.json({ msg: "chargePoint updated", chargePoint });
};

const deleteChargePoint = async (req, res) => {
    // get admin id from auth middleware
    const { id: adminId } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(adminId);
    // get chargePoint id from request params
    const { id } = req.params;

    // #################################################################
    // Get chargePoint with id and admin and delete

    const chargePoint = await ChargePoint.findOneAndDelete({ _id: id, admin });

    // if chargePoint doesn't exist throw error
    if (!chargePoint) {
        throw new NotFoundError("chargePoint not found");
    }

    // Delete all connector with the chargePointId
    await Connector.deleteMany({ chargePoint });

    res.json({ msg: "chargePoint Deleted" });
};

module.exports = {
    createChargePoint,
    getChargePoints,
    getChargePoint,
    updateChargePoint,
    deleteChargePoint,
};
