const mongoose = require("mongoose");
const { NotFoundError, BadRequestError } = require("../errors");
const Admin = require("../../Database/models/Admin");
const Rate = require("../../Database/models/Rates");

const createRate = async (req, res) => {
    // get admin id from auth middleware
    const { id } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(id);

    // add admin to request body
    req.body.admin = admin;

    // create new rate
    await Rate.create(req.body);

    res.json({ msg: "Rate Added" });
};

const getRates = async (req, res) => {
    // get admin id from auth middleware
    const { id } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(id);

    // #################################################################
    // Get rates based on query

    // get name query from request
    const { name } = req.query;

    // create a query object to filter result and for search attribute add admin to it
    const queryObject = { admin };

    // if name is provided in request query add to query object
    if (name) {
        queryObject.name = { $regex: name, $options: "i" };
    }

    // get rates for admin
    let result = Rate.find(queryObject);

    // #################################################################
    // Set up Pagination

    // set limit and page(from query) variable
    const limit = Number(req.query.limit) || 2;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // edit rates based on limit and page
    // result = result.skip(skip).limit(limit);

    // #################################################################
    // Send final Rates

    const rates = await result;

    res.json({ nbHits: rates.length, rates });
};

const updateRate = async (req, res) => {
    // get admin id from auth middleware
    const { id: adminId } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(adminId);
    // get rate id from request params
    const { id } = req.params;
    
    // Check if id is valid mongoose object id
    if (!mongoose.isValidObjectId(id)) {
        throw new BadRequestError("Invalid Object Id");
    }

    // #################################################################
    // Get rate with id and admin and update

    const rate = await Rate.findOneAndUpdate({ _id: id, admin }, req.body, {
        new: true,
        runValidators: true,
    });

    // if rate doesn't exist throw error
    if (!rate) {
        throw new NotFoundError("rate not found");
    }

    res.json({ msg: "rate updated", rate });
};

const deleteRate = async (req, res) => {
    // get admin id from auth middleware
    const { id: adminId } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(adminId);
    // get rate id from request params
    const { id } = req.params;

    // #################################################################
    // Get rate with id and admin and delete

    const rate = await Rate.findOneAndDelete({ _id: id, admin });

    // if rate doesn't exist throw error
    if (!rate) {
        throw new NotFoundError("rate not found");
    }

    res.json({ msg: "rate Deleted" });
};

module.exports = {
    createRate,
    getRates,
    updateRate,
    deleteRate,
};
