const Admin = require("../../Database/models/Admin");
const Transaction = require("../../Database/models/Transaction");

const getSessions = async (req, res) => {
    // get admin id
    const { id: adminId } = req.admin;
    // get admin from database with id
    const admin = await Admin.findById(adminId);

    // #################################################################
    // Get Sessions based on query

    // get transactionId query from request
    const { transactionUniqueId } = req.query;

    // create a query object to filter result and for search attribute add admin to it
    const queryObject = { admin };

    // if transactionUniqueId is provided in request query add to query object
    if (transactionUniqueId) {
        queryObject.transactionUniqueId = {
            $regex: transactionUniqueId,
            $options: "i",
        };
    }

    // get Sessions for admin
    let result = Transaction.find(queryObject)
        .populate("chargePoint", "endpoint")
        .populate("connector", "connectorId")
        .populate("location", "name")
        .select("-admin -createdAt -updatedAt -__v");

    // #################################################################
    // Set up Pagination

    // set limit and page(from query) variable
    const limit = Number(req.query.limit) || 20;
    const page = Number(req.query.page) || 1;
    const skip = (page - 1) * limit;

    // edit sessions based on limit and page
    result = result.skip(skip).limit(limit);

    // #################################################################
    // Send final sessions

    const sessions = await result;

    res.json({ nbHits: sessions.length, sessions });
};

module.exports = {getSessions};
