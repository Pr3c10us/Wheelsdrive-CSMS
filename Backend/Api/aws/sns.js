const { SNSClient } = require("@aws-sdk/client-sns");

// a client can be shared by different commands.
const snsClient = new SNSClient({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

module.exports = { snsClient };
