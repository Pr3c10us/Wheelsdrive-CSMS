const Admin = require("../../Database/models/Admin");

const getAdminDetails = async (req, res) => {
    const { id } = req.admin;

    // get user info
    const admin = await Admin.findById(id, " -password -__v -mobile ");

    // return user details
    res.json({ admin });
};

module.exports = {
    getAdminDetails,
};
