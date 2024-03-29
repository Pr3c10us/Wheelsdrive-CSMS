// Import Modules
const jwt = require("jsonwebtoken");
const Admin = require("../../Database/models/Admin");
const User = require("../../Database/models/User");

const adminAuthorization = async (req, res, next) => {
    // check if auth header exist
    if (
        !req.headers ||
        !req.headers.authorization ||
        req.headers.authorization.split(" ")[0] !== "JWT"
    ) {
        return res.status(400).json({ msg: "Provide Auth header" });
    }
    // get token from cookie and throw error if token is not present
    const token = req.headers.authorization.split(" ")[1];
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
        return res.status(400).json({ msg: "Authorization failed" });
    }
};

const userAuthorization = async (req, res, next) => {
    // check if auth header exist
    if (
        !req.headers ||
        !req.headers.authorization ||
        req.headers.authorization.split(" ")[0] !== "JWT"
    ) {
        return res.status(400).json({ msg: "Provide Auth header" });
    }
    // get token from cookie and throw error if token is not present
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res
            .status(400)
            .json({ msg: "Not authorized to access this route" });
    }

    try {
        // get admin id from token
        const { id } = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(id);

        // if user doesn't exist throw bad request error
        if (!user) {
            return res.status(400).json({ msg: "User Doesn't exist" });
        }

        // add an user object to api request to be used in controller logic
        req.user = { id };

        next();
    } catch (error) {
        console.log(error);
        // if block failed throw unauthorized error
        return res.status(400).json({ msg: "Authorization failed" });
    }
};
// export middleware
module.exports = { adminAuthorization, userAuthorization };
