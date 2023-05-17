// Import ChargePoint model
const ChargePointModel = require("../../../Database/models/ChargePoint");
const Log = require("../../../Database/models/Log");

const handleDataTransfer = async (messageIn) => {
    // Initialize messageTypeId to null
    let messageTypeId = null;
    // Initialize uniqueId to messageIn.UniqueId
    let uniqueId = messageIn[1];
    // Initialize jsonOutPayload to some default values
    let jsonOutPayload = {
        status: "",
    };

    // Initialize jsonPayload to messageIn.Payload
    let jsonInPayload = messageIn[3];

    // Get chargePointId from messageIn
    const chargePointId = messageIn[messageIn.length - 2];
    // Get chargePoint from database
    const chargePoint = await ChargePointModel.findById(chargePointId);

    // Create a new log before we handle message
    await Log.create({
        result: JSON.stringify(jsonInPayload),
        message: messageIn[2],
        origin: "charger",
        // connectorId: jsonInPayload.connectorId,
        chargePoint,
        admin: chargePoint.admin._id,
    });

    try {
        messageTypeId = 3;
        jsonOutPayload.status = "Accepted";

        const callResult = [messageTypeId, uniqueId, jsonOutPayload];
        // Create a new log after we handle message for StatusNotificationResponse
        await Log.create({
            result: JSON.stringify(jsonOutPayload),
            message: messageIn[2],
            origin: "csms",
            // connectorId: jsonInPayload.connectorId,
            chargePoint,
            admin: chargePoint.admin._id,
        });
        return callResult;
    } catch (error) {
        console.log(error);
        const errorCode = "InternalError";
        const callError = [4, uniqueId, errorCode, "", {}];
        await Log.create({
            errorCode: errorCode,
            message: messageIn[2],
            origin: "csms",
            chargePoint,
            // connectorId: jsonInPayload.connectorId,
            admin: chargePoint.admin._id,
        });
        return callError;
    }
};

module.exports = handleDataTransfer;
