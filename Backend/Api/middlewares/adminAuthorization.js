// Import Modules
const jwt = require("jsonwebtoken");
const Admin = require("../../Database/models/Admin");
const { BadRequestError, UnauthorizedError } = require("../errors");

const adminAuthorization = async (req, res, next) => {
    // get token from cookie and throw error if token is not present
    const { token } = req.signedCookies;
    if (!token) {
        throw new BadRequestError("Not authorized to access this route");
    }

    try {
        // get admin id from token
        const { id } = await jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(id);

        // if admin doesn't exist throw bad request error
        if (!admin) {
            throw new BadRequestError("Admin Doesn't exist");
        }

        // add an admin object to api request to be used in controller logic
        req.admin = { id };

        next();
    } catch (error) {
        console.log(error);
        // if block failed throw unauthorized error
        throw new UnauthorizedError("Authorization failed");
    }
};

// export middleware
module.exports = adminAuthorization;
