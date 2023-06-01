// Import Modules
const jwt = require("jsonwebtoken");
const Admin = require("../../Database/models/Admin");

const adminAuthorization = async (req, res, next) => {
    // get token from cookie and throw error if token is not present
    const { token } = req.signedCookies;
    if (!token) {
        return res
            .status(400)
            .json({ msg: "Not authorized to access this route" });
    }

    try {
        // get admin id from token
        const { id } = await jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(id);

        // if admin doesn't exist throw bad request error
        if (!admin) {
            return res.status(400).json({ msg: "Admin Doesn't exist" });
        }

        // add an admin object to api request to be used in controller logic
        req.admin = { id };

        next();
    } catch (error) {
        console.log(error);
        // if block failed throw unauthorized error
        return res.status(403).json({ msg: "Authorization failed" });
    }
};

// export middleware
module.exports = adminAuthorization;
