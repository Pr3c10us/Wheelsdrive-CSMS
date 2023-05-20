// Import modules
const mongoose = require("mongoose");
const Admin = require("../../Database/models/Admin");
const ApiUser = require("../../Database/models/ApiUser");
const RFID = require("../../Database/models/RFID");
const { BadRequestError, NotFoundError } = require("../errors");

// create crud controller for apiUser and res.send the controller function name
const createRFID = async (req, res) => {
    // get admin id
    const { id: adminId } = req.admin;
    // get admin from database with id
    const admin = await Admin.findById(adminId);

    // Check if rfid exists
    const rfid = await RFID.findOne({ rfid: req.body.rfid, admin });
    if (rfid) {
        throw new BadRequestError("RFID already exists");
    }

    // Add admin to request body
    req.body.admin = admin;
    // Convert expires time to date
    req.body.expires = new Date(req.body.expires).toISOString();

    // Get parent rfid from db
    const parentRFID = await RFID.findOne({ isAdmin: true, admin });
    req.body.parentRFID = parentRFID.rfid;

    // Check if apiUserId is valid mongoose id
    if (!mongoose.isValidObjectId(req.body.apiUserId)) {
        throw new BadRequestError("Invalid Object Id");
    }
    // Get apiUser from db
    const apiUser = await ApiUser.findOne({ _id: req.body.apiUserId, admin });
    // Check if apiUser exists
    if (!apiUser) {
        throw new NotFoundError("Api User not found");
    }
    // Add apiUser to request body
    req.body.apiUser = apiUser;

    // Create new apiUser
    const rfidNew = await RFID.create(req.body);

    // Add rfid to apiUser
    apiUser.rfids.push(rfidNew);
    await apiUser.save();

    res.json({ msg: "RFID Added" });
};

const getRFIDs = async (req, res) => {
    // get admin id
    const { id: adminId } = req.admin;
    // get admin from database with id
    const admin = await Admin.findById(adminId);

    // #################################################################
    // Get rfid based on query

    // get name query from request
    const { name } = req.query;

    // create a query object to filter result and for search attribute add admin to it
    const queryObject = { admin };

    // if name is provided in request query add to query object
    if (name) {
        queryObject.name = { $regex: name, $options: "i" };
    }

    // get rfid for admin
    let result = RFID.find(queryObject);

    // #################################################################
    // Set up Pagination

    // set limit and page(from query) variable
    const limit = Number(req.query.limit) || 2;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // edit rfid based on limit and page
    // result = result.skip(skip).limit(limit);

    // #################################################################
    // Send final RFID

    const rfid = await result;

    res.json({ nbHits: rfid.length, rfid });
};

const updateRFID = async (req, res) => {
    // get admin id
    const { id: adminId } = req.admin;
    // get admin from database with id
    const admin = await Admin.findById(adminId);
    // get rfid id from request params
    const { id } = req.params;

    // Check if id is valid mongoose object id
    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestError("Invalid Object Id");
    }

    // Check if rfid exists
    const rfidExist = await RFID.findOne({ rfid: req.body.rfid, admin });
    if (rfidExist) {
        throw new NotFoundError("RFID Already Exists");
    }

    // Change apiUser if provided
    if (req.body.apiUserId) {
        if (!mongoose.isValidObjectId(req.body.apiUserId)) {
            throw new BadRequestError("Invalid Object Id");
        }
        // Get apiUser from db
        const apiUser = await ApiUser.findOne({
            _id: req.body.apiUserId,
            admin,
        });
        // Check if apiUser exists
        if (!apiUser) {
            throw new NotFoundError("Api User not found");
        }
        // Add apiUser to request body
        req.body.apiUser = apiUser;
    }

    // #################################################################
    // Get rfid with id and admin and update

    const rfid = await RFID.findOneAndUpdate({ _id: id, admin }, req.body, {
        new: true,
        runValidators: true,
    });

    // if rfid doesn't exist throw error
    if (!rfid) {
        throw new NotFoundError("rfid not found");
    }

    res.json({ msg: "rfid updated", rfid });
};

const deleteRFID = async (req, res) => {
    // get admin id
    const { id: adminId } = req.admin;
    // get admin from database with id
    const admin = await Admin.findById(adminId);
    // get rfid id from request params
    const { id } = req.params;

    // Check if id is valid mongoose object id
    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestError("Invalid Object Id");
    }

    // Get rfid with id and admin
    const rfid = await RFID.findOne({ _id: id, admin });

    // if rfid doesn't exist throw error
    if (!rfid) {
        throw new NotFoundError("rfid not found");
    }

    // Check if admin is deleting himself
    if (rfid.isAdmin) {
        throw new BadRequestError("Admin can't be deleted");
    }

    // #################################################################
    // Get rfid with id and admin and delete

    const rfidNew = await RFID.findByIdAndDelete(rfid._id);

    // Get apiUser from db
    const apiUser = await ApiUser.findOne({ _id: rfidNew.apiUser, admin });

    // Filter the connectors array to exclude the objectIdToRemove
    apiUser.rfids = apiUser.rfids.filter(
        (objectId) => !objectId.equals(rfidNew._id)
    );

    // Save the updated chargePoint
    await apiUser.save();

    res.json({ msg: "rfid Deleted" });
};

module.exports = {
    createRFID,
    getRFIDs,
    updateRFID,
    deleteRFID,
};
