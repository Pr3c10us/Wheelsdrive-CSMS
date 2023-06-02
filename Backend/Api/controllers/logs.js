const Admin = require("../../Database/models/Admin");
const Log = require("../../Database/models/Log");

const getLogs = async (req, res) => {
    // get admin id
    const { id: adminId } = req.admin;
    // get admin from database with id
    const admin = await Admin.findById(adminId);

    // #################################################################
    // Get Sessions based on query

    // create a query object to filter result and for search attribute add admin to it
    const queryObject = { admin };

    // get Sessions for admin
    let result = Log.find(queryObject)
        .populate("chargePoint", "endpoint")
        .select("-admin -updatedAt -__v");

    // #################################################################
    // Set up Pagination

    // set limit and page(from query) variable
    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // edit logs based on limit and page
    result = result.skip(skip).limit(limit);

    // #################################################################
    // Send final logs

    const logs = await result;

    res.json({ nbHits: logs.length, logs });
};

module.exports = { getLogs };
