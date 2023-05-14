// Import ChargePointModel
const ChargePointModel = require("../../../Database/models/ChargePoint");
// Import ocpp logs
const Log = require("../../../Database/models/Log");

const handleHeartbeat = async (messageIn) => {
    // Initialize jsonOutPayload to some default values
    let jsonOutPayload = {
        currentTime: new Date().toISOString(),
    };

    // Get chargePointId from message
    const chargePointId = messageIn[messageIn.length - 2];

    // Get chargePoint from database
    const chargePoint = await ChargePointModel.findById(chargePointId);

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
