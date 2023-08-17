// Import Modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import Admin Model
const Admin = require("../../Database/models/Admin");
// Import User Model
const ApiUser = require("../../Database/models/ApiUser");
// Import RFID Model
const RFID = require("../../Database/models/RFID");

// Import Errors
const { UnauthorizedError, BadRequestError } = require("../errors");

// ###########################################################
// ###########################################################

const adminSignUp = async (req, res) => {
    // Check if balance was provided
    if (req.body.balance) {
        throw new BadRequestError("Balance is not required");
    }
    // Handle Email Verification
    //
    //
    // ###########################################################
    // Check if Admin exists
    const adminExist = await Admin.findOne({ email: req.body.email });
    if (adminExist) {
        throw new BadRequestError("Admin with email address Already Exists");
    }
    // ###########################################################
    // Hash Password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    // ###########################################################
    // Create Admin
    const admin = await Admin.create(req.body);

    // ###########################################################
    // Handle Create Default ApiUser and RFID FOR ADMIN
    const apiUser = await ApiUser.create({
        email: req.body.email,
        username: "Admin",
        isAdmin: true,
        admin,
    });

    const rfid = await RFID.create({
        name: "Admin Rfid",
        rfid: "1",
        blocked: false,
        isAdmin: true,
        apiUser,
        admin,
    });

    // Add rfid to admin apiUser
    apiUser.rfids.push(rfid);

    // ###########################################################
    // Send Response
    res.json({ msg: "Admin Account Created" });
};

const adminLogIn = async (req, res) => {
    // Check if email and password is provided
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password");
    }

    // ###########################################################
    // Check if Admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
        throw new UnauthorizedError("Invalid Credentials");
    }

    // ###########################################################
    // Check if password is correct
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new UnauthorizedError("Wrong Password");
    }

    // ###########################################################
    // Send Response

    // create jwt payload
    const payload = {
        id: admin._id,
    };
    // create jwt token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    // set cookie options
    const cookieOptions = {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: false,
        signed: true,
    };

    res.cookie("token", token, cookieOptions).json({
        msg: "Login Successful",
        token,
    });
};

const logout = async (req, res) => {
    res.cookie("token", "", {
        expires: new Date(Date.now() + 1000),
    }).json({ msg: "Successfully Logged Out!!!" });
};

module.exports = {
    adminSignUp,
    adminLogIn,
    logout,
};
