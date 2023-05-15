// Import modules
const mongoose = require("mongoose");
const Admin = require("../../Database/models/Admin");
const ApiUser = require("../../Database/models/ApiUser");
const { BadRequestError, NotFoundError } = require("../errors");

// create crud controller for apiUser and res.send the controller function name
const createApiUser = async (req, res) => {
    // get admin id
    const { id: adminId } = req.admin;
    // get admin from database with id
    const admin = await Admin.findById(adminId);

    // Add admin to request body
    req.body.admin = admin;

    // Create new apiUser
    await ApiUser.create(req.body);

    res.json({ msg: "Api User Created" });
};

const getApiUsers = async (req, res) => {
    // get admin id
    const { id: adminId } = req.admin;
    // get admin from database with id
    const admin = await Admin.findById(adminId);

    // #################################################################
    // Get apiUser based on query

    // get name query from request
    const { name } = req.query;

    // create a query object to filter result and for search attribute add admin to it
    const queryObject = { admin };

    // if name is provided in request query add to query object
    if (name) {
        queryObject.name = { $regex: name, $options: "i" };
    }

    // get apiUser for admin
    let result = ApiUser.find(queryObject);

    // #################################################################
    // Set up Pagination

    // set limit and page(from query) variable
    const limit = Number(req.query.limit) || 2;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // edit apiUser based on limit and page
    // result = result.skip(skip).limit(limit);

    // #################################################################
    // Send final ApiUser

    const apiUser = await result;

    res.json({ nbHits: apiUser.length, apiUser });
};

const updateApiUser = async (req, res) => {
    // get admin id
    const { id: adminId } = req.admin;
    // get admin from database with id
    const admin = await Admin.findById(adminId);
    // get apiUser id from request params
    const { id } = req.params;

    // Check if id is valid mongoose object id
    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestError("Invalid Object Id");
    }

    // #################################################################
    // Get apiUser with id and admin and update

    const apiUser = await ApiUser.findOneAndUpdate(
        { _id: id, admin },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    // if apiUser doesn't exist throw error
    if (!apiUser) {
        throw new NotFoundError("apiUser not found");
    }

    res.json({ msg: "apiUser updated", apiUser });
};

const deleteApiUser = async (req, res) => {
    // get admin id
    const { id: adminId } = req.admin;
    // get admin from database with id
    const admin = await Admin.findById(adminId);
    // get apiUser id from request params
    const { id } = req.params;

    // Check if id is valid mongoose object id
    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestError("Invalid Object Id");
    }

    // Get apiUser with id and admin
    const apiUser = await ApiUser.findOne({ _id: id, admin });

    // if apiUser doesn't exist throw error
    if (!apiUser) {
        throw new NotFoundError("apiUser not found");
    }

    // Check if admin is deleting himself
    if (apiUser.isAdmin) {
        throw new BadRequestError("Admin can't be deleted");
    }

    // #################################################################
    // Get apiUser with id and admin and delete

    await ApiUser.findByIdAndDelete(apiUser._id);

    res.json({ msg: "apiUser Deleted" });
};

module.exports = {
    createApiUser,
    getApiUsers,
    updateApiUser,
    deleteApiUser,
};