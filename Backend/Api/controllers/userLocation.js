// Import modules
const { NotFoundError } = require("../errors");
const Location = require("../../Database/models/Location");
const ChargePoint = require("../../Database/models/ChargePoint");

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
    const limit = Number(req.query.limit) || 50;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // edit locations based on limit and page
    // result = result.skip(skip).limit(limit);

    // #################################################################
    // Send final locations

    const locations = await result;

    res.json({ nbHits: locations.length, locations });
};

const getLocation = async (req, res) => {
    // get location id from request params
    const { id } = req.params;

    // #################################################################
    // Get Location wih id

    const locationDetails = await Location.findOne({
        _id: id,
        display: true,
    }).populate("admin", { company: 1, _id: 0, country: 1 });

    // if location doesn't exist throw error
    if (!locationDetails) {
        throw new NotFoundError("Location not found");
    }

    let location = { locationDetails };

    // Check for chargePoints in location and add to location object
    const chargePoints = await ChargePoint.find({ location: locationDetails });
    // If chargePoints exist add to location object
    if (chargePoints) {
        console.log("first");
        location.chargePoints = chargePoints;
    }

    res.json(location);
};
// Export modules
module.exports = {
    getLocations,
    getLocation,
};
