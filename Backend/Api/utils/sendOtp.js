const { BadRequestError } = require("../errors");
const { PublishCommand } = require("@aws-sdk/client-sns");
const { snsClient } = require("../aws/sns");
const sendOtp = async (mobile, code) => {
    const params = {
        // TopicArn: process.env.SNS_TOPIC_ARN,
        Subject: "Wheelsdrive",
        Message: `This is your one ime password ${code}` /* required */,
        PhoneNumber: mobile,
    };
    const command = new PublishCommand(params);
    try {
        await snsClient.send(command);
    } catch (error) {
        console.log(error);
        throw new BadRequestError("Error sending otp");
    }
};

module.exports = { sendOtp };
