const { User } = require("../../Database/models/User");
const { ForbiddenError, NotFoundError, BadRequestError } = require("../errors");
const bcrypt = require("bcryptjs");
const { PublishCommand } = require("@aws-sdk/client-sns");
const { snsClient } = require("../aws/sns");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    // check if balance field is filled
    if (
        req.body.balance ||
        req.body.mobileVerified ||
        req.body.twoFactorVerified ||
        req.body.otp
    ) {
        throw new ForbiddenError("Forbidden field - Balance");
    }

    // hash password and pin
    req.body.password = await bcrypt.hash(req.body.password, 10);

    // Generate a random 6-digit verification code and add too body
    let code = Math.floor(Math.random() * 900000) + 100000;
    code = code.toString();
    // Set the expiration time to 10 minutes from now
    const expiration = Date.now() + 1000 * 60 * 10;

    // create otp in body
    const otp = [code, expiration];

    // update db with mobile provide and insert otp
    req.body.otp = otp;

    // Send the verification code to the user's mobile number
    const params = {
        // TopicArn: process.env.SNS_TOPIC_ARN,
        Subject: "Wheelsdrive",
        Message: `This is your one ime password ${code}` /* required */,
        PhoneNumber: req.body.mobile,
    };
    const command = new PublishCommand(params);
    try {
        await snsClient.send(command);
    } catch (error) {
        console.log(error);
        throw new BadRequestError("Error sending otp");
    }

    // create user
    await User.create(req.body);

    res.status(200).json({
        msg: "Created",
    });
};

const sendCode = async (req, res) => {
    // get mobile from query
    const { mobile, resend } = req.body;
    // check if mobile is provided
    if (!mobile) {
        throw new BadRequestError("Please provide a valid mobile number");
    }

    // check if user exist
    const user = await User.findOne({ mobile });
    if (!user) {
        throw new NotFoundError(`User with this mobile number does not exist.`);
    }
    if (user.otp[0] && (resend == "no" || !resend)) {
        return res.json({ msg: "Sent already" });
    }

    // Generate a random 6-digit verification code and add too body
    let code = Math.floor(Math.random() * 900000) + 100000;
    code = code.toString();
    // Set the expiration time to 10 minutes from now
    const expiration = Date.now() + 1000 * 60 * 10;

    // create otp in body
    const otp = [code, expiration];
    // update db with mobile provide and insert otp
    user.otp = otp;
    await user.save();

    // Send the verification code to the user's mobile number with html
    const params = {
        // TopicArn: process.env.SNS_TOPIC_ARN,
        Subject: "Wheelsdrive",
        Message: `This is your one ime password ${code}` /* required */,
        PhoneNumber: req.body.mobile,
    };
    const command = new PublishCommand(params);
    try {
        await snsClient.send(command);
    } catch (error) {
        console.log(error);
        throw new BadRequestError("Error sending otp");
    }

    res.json({ msg: "sent" });
};

const verifyCode = async (req, res) => {
    const { code, mobile } = req.body;

    // check if they provided all values
    if (!mobile || !code) {
        throw new BadRequestError(
            "Please provide a valid mobile number and otp code"
        );
    }

    // get user info
    const user = await User.findOne({ mobile });
    // check if user exist in db
    if (!user) {
        throw new NotFoundError(`User with this mobile number does not exist.`);
    }

    // Check if the code is correct
    if (code !== user.otp[0]) {
        console.log(code, user.otp[0], code !== user.otp[0]);
        throw new BadRequestError("The code provided is incorrect");
    }
    // Check if the code has expired
    if (Date.now() > user.otp[1]) {
        throw new BadRequestError("Code has expired, Request a new one");
    }

    // if mobile is unverified change to verified
    if (!user.mobileVerified) {
        user.mobileVerified = true;
    }
    // if two factor auth is unverified change to verified
    if (!user.twoFactorVerified) {
        user.twoFactorVerified = true;
    }
    // Save updates
    await user.save();

    res.json({
        msg: "The code you entered is correct",
    });
};

const login = async (req, res) => {
    const { username, password } = req.body;
    // Check if username and password are provided
    if (!username || !password) {
        throw new BadRequestError("Please provide your username and password");
    }

    // get user info of provided username
    const user = await User.findOne({ username });

    // check if user exist
    if (!user) {
        throw new NotFoundError("User with username does not exist");
    }

    // check if password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new BadRequestError("The password you entered is incorrect");
    }

    // Make twoFactorVerified false
    user.twoFactorVerified = false;
    await user.save();

    // create payload for jwt
    const payload = { id: user.id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    res.json({
        msg: "Login Successful",
        token,
    });
};

module.exports = {
    login,
    signup,
    sendCode,
    verifyCode,
    // logout,
};
