// Import Handlers
const Log = require("../../../Database/models/Log");
const handleAuthorize = require("./handleAuthorize");
const handleBootNotification = require("./handleBootNotification");
const handleDataTransfer = require("./handleDataTransfer");
const handleHeartbeat = require("./handleHeartbeat");
const handleMeterValue = require("./handleMeterValue");
const handleStartTransaction = require("./handleStartTransaction");
const handleStatusNotification = require("./handleStatusNotification");

const processRequest = async (messageIn) => {
    let messageOut = null;
    console.log(messageIn);
    if (messageIn[3].meterValue) {
        console.log(messageIn[3].meterValue[0]);
    }
    // Create Switch statement for messageIn.Action
    switch (messageIn[2]) {
        // If messageIn.Action is BootNotification
        case "BootNotification":
            messageOut = await handleBootNotification(messageIn);
            break;
        case "Heartbeat":
            messageOut = await handleHeartbeat(messageIn);
            break;
        case "StatusNotification":
            messageOut = await handleStatusNotification(messageIn);
            break;
        case "MeterValues":
            messageOut = await handleMeterValue(messageIn);
            break;
        case "Authorize":
            messageOut = await handleAuthorize(messageIn);
            break;
        case "DataTransfer":
            messageOut = await handleDataTransfer(messageIn);
            break;
        case "StartTransaction":
            messageOut = await handleStartTransaction(messageIn);
            break;
        default:
            break;
    }
    return messageOut;
};

module.exports = processRequest;
