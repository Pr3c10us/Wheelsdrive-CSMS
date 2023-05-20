// Import Modules
const ChargePointModel = require("../../../Database/models/ChargePoint");
const Log = require("../../../Database/models/Log");
const Connector = require("../../../Database/models/Connector");
const updateConnector = require("../../utils/updateConnector");

const handleStatusNotification = async (messageIn) => {
    // Initialize messageTypeId to null
    let messageTypeId = null;
    // Initialize uniqueId to messageIn.UniqueId
    let uniqueId = messageIn[1];
    // Initialize jsonOutPayload to some default values
    let jsonOutPayload = {};
    // Initialize jsonPayload to messageIn.Payload and chargePoint Id
    let jsonInPayload = messageIn[3];
    const chargePointId = messageIn[messageIn.length - 2];

    // ##########################################################
    let connectorId = 0;

    // Get chargePoint from database
    const chargePoint = await ChargePointModel.findById(chargePointId);
    if (!chargePoint) {
        const errorCode = "InternalError";
        // Return Error Message with error code FormationViolation
        const callError = [4, uniqueId, errorCode, "", {}];
        await Log.create({
            errorCode: errorCode,
            message: messageIn[2],
            origin: "csms",
            chargePoint,
            admin: chargePoint.admin._id,
        });
        return callError;
    }

    // Create a new log before we handle message
    await Log.create({
        result: JSON.stringify(jsonInPayload),
        message: messageIn[2],
        origin: "charger",
        connectorId: jsonInPayload.connectorId,
        chargePoint,
        admin: chargePoint.admin._id,
    });

    try {
        messageTypeId = 3;
        // Assign ConnectorId in statusNotificationRequest to connectorId var
        connectorId = jsonInPayload.connectorId;

        // Assign Undefined to a newStatus Variable
        let newStatus = null;
        //  Create switch case to change newStatus based on statusNotificationRequest
        switch (jsonInPayload.status) {
            case "Available":
                newStatus = "Available";
                break;
            case "Charging":
                newStatus = "Charging";
                break;
            case "Reserved":
                newStatus = "Reserved";
                break;
            case "Unavailable":
                newStatus = "Unavailable";
                break;
            case "Faulted":
                newStatus = "Faulted";
                break;
        }

        // Run updateConnector function
        await updateConnector(chargePoint, connectorId, newStatus, null, null);

        // Create callResult
        const callResult = [messageTypeId, uniqueId, jsonOutPayload];
        // Create a new log after we handle message for StatusNotificationResponse
        await Log.create({
            result: JSON.stringify(jsonOutPayload),
            message: messageIn[2],
            origin: "csms",
            connectorId: jsonInPayload.connectorId,
            chargePoint,
            admin: chargePoint.admin._id,
        });
        return callResult;
    } catch (error) {
        console.log(error);
        const errorCode = "InternalError";
        // Return Error Message with error code InternalError
        const callError = [4, uniqueId, errorCode, "", {}];
        await Log.create({
            errorCode: errorCode,
            message: messageIn[2],
            origin: "csms",
            chargePoint,
            connectorId: jsonInPayload.connectorId,
            admin: chargePoint.admin._id,
        });
        return callError;
    }
};

module.exports = handleStatusNotification;
