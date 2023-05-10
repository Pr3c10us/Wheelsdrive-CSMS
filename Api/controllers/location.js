// Import modules
const { NotFoundError } = require("../errors");
const Admin = require("../models/Admin");
const Location = require("../models/Location");

const createLocation = async (req, res) => {
    // get admin id from auth middleware
    const { id } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(id);

    // add admin object to request body
    req.body.admin = admin;

    await Location.create(req.body);

    res.json({ msg: "Location created" });
};

const adminLocations = async (req, res) => {
    // get admin id from auth middleware
    const { id } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(id);

    // #################################################################
    // Get Locations based on query

    // get name query from request
    const { name } = req.query;

    // create a query object to filter result and for search attribute add admin to it
    const queryObject = { admin };

    // if name is provided in request query add to query object
    if (name) {
        queryObject.name = { $regex: name, $options: "i" };
    }

    // get locations for admin
    let result = Location.find(queryObject);

    // #################################################################
    // Set up Pagination

    // set limit and page(from query) variable
    const limit = Number(req.query.page) || 20;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // edit locations based on limit and page
    result = result.skip(skip).limit(limit);

    // #################################################################
    // Send final locations

    const locations = await result;

    res.json({ nbHits: locations.length, locations });
};

const getLocations = async (req, res) => {
    // get name query from request
    const { name } = req.query;

    // create a query object to filter result and for search attribute add admin to it
    const queryObject = { display: true };

    // if name is provided in request query add to query object
    if (name) {
        queryObject.name = { $regex: name, $options: "i" };
    }

    // get locations for admin
    let result = Location.find(queryObject);

    // #################################################################
    // Set up Pagination

    // set limit and page(from query) variable
    const limit = Number(req.query.page) || 50;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // edit locations based on limit and page
    result = result.skip(skip).limit(limit);

    // #################################################################
    // Send final locations

    const locations = await result;

    res.json({ nbHits: locations.length, locations });
};

const getAdminLocation = async (req, res) => {
    // get admin id from auth middleware
    const { id: adminId } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(adminId);

    // get location id from request params
    const { id } = req.params;

    // #################################################################
    // Get Location wih id and admin

    const location = await Location.findOne({ _id: id, admin }).populate(
        "admin",
        { company: 1, _id: 0, country: 1 }
    );

    // if location doesn't exist throw error
    if (!location) {
        throw new NotFoundError("Location not found");
    }

    res.json(location);
};

const getLocation = async (req, res) => {
    // get location id from request params
    const { id } = req.params;

    // #################################################################
    // Get Location wih id and admin

    const location = await Location.findOne({
        _id: id,
        display: true,
    }).populate("admin", { company: 1, _id: 0, country: 1 });

    // if location doesn't exist throw error
    if (!location) {
        throw new NotFoundError("Location not found");
    }

    res.json(location);
};

const updateLocation = async (req, res) => {
    // get admin id from auth middleware
    const { id: adminId } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(adminId);
    // get location id from request params
    const { id } = req.params;

    // #################################################################
    // Get Location with id and admin and update

    const location = await Location.findOneAndUpdate(
        { _id: id, admin },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    // if location doesn't exist throw error
    if (!location) {
        throw new NotFoundError("Location not found");
    }

    res.json({ msg: "Location updated", location });
};

const deleteLocation = async (req, res) => {
    // get admin id from auth middleware
    const { id: adminId } = req.admin;
    // get admin info with id
    const admin = await Admin.findById(adminId);
    // get location id from request params
    const { id } = req.params;

    // #################################################################
    // Get Location with id and admin and delete

    const location = await Location.findOneAndDelete({ _id: id, admin });

    // if location doesn't exist throw error
    if (!location) {
        throw new NotFoundError("Location not found");
    }

    res.json({ msg: "Location Deleted" });
};

// Export modules
module.exports = {
    createLocation,
    adminLocations,
    getLocations,
    getAdminLocation,
    getLocation,
    updateLocation,
    deleteLocation,
};
