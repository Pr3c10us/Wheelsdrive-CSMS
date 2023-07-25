// Import ChargePointModel
const ChargePointModel = require("../../../Database/models/ChargePoint");
// Import ocpp logs
const Log = require("../../../Database/models/Log");

const handleHeartbeat = async (messageIn) => {
    // Initialize jsonOutPayload to some default values
    let jsonOutPayload = {
        currentTime: new Date().toISOString(),
    };
    // Initialize uniqueId to messageIn.UniqueId
    let uniqueId = messageIn[1];

    // Get chargePointId from message
    const chargePointId = messageIn[messageIn.length - 2];

    // Get chargePoint from database
    const chargePoint = await ChargePointModel.findOne({
        connectionId: chargePointId,
    });
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

    await Log.create({
        message: messageIn[2],
        origin: "charger",
        chargePoint,
        admin: chargePoint.admin._id,
    });

    // Create callResult
    const callResult = [3, messageIn[1], jsonOutPayload];

    await Log.create({
        result: JSON.stringify(jsonOutPayload),
        message: messageIn[2],
        origin: "csms",
        chargePoint,
        admin: chargePoint.admin._id,
    });
    return callResult;
};

module.exports = handleHeartbeat;
