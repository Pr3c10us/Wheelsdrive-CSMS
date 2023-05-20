// Import ChargePointModel
const ChargePointModel = require("../../../Database/models/ChargePoint");
// Import ocpp logs
const Log = require("../../../Database/models/Log");

const handleBootNotification = async (messageIn) => {
    // Initialize messageTypeId to null
    let messageTypeId = null;
    // Initialize uniqueId to messageIn.UniqueId
    let uniqueId = messageIn[1];
    // Initialize jsonOutPayload to some default values
    let jsonOutPayload = {
        status: "",
        interval: 300,
        currentTime: new Date().toISOString(),
    };

    // Initialize jsonPayload to messageIn.Payload
    let jsonInPayload = messageIn[3];
    const chargePointId = messageIn[messageIn.length - 2];
    const ocppVersion = messageIn[messageIn.length - 1];

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

    await Log.create({
        result: JSON.stringify(jsonInPayload),
        message: messageIn[2],
        origin: "charger",
        chargePoint,
        admin: chargePoint.admin._id,
    });

    try {
        // Assign callResult id to messageTypeId
        messageTypeId = 3;

        // Check if charge point has been connected
        if (
            chargePoint.isConnected &&
            chargePoint.serialNumber != jsonInPayload.chargePointSerialNumber
        ) {
            jsonOutPayload.status = "Rejected";
        } else {
            // Update Charge Point details
            chargePoint.vendor = jsonInPayload.chargePointVendor;
            chargePoint.model = jsonInPayload.chargePointModel;
            chargePoint.serialNumber = jsonInPayload.chargePointSerialNumber;
            chargePoint.firmwareVersion = jsonInPayload.firmwareVersion;
            chargePoint.iccid = jsonInPayload.iccid;
            chargePoint.imsi = jsonInPayload.imsi;
            chargePoint.isConnected = true;
            chargePoint.ocppVersion = ocppVersion;

            // Save update
            await chargePoint.save();

            jsonOutPayload.status = "Accepted";
        }

        // Create messageOut
        const callResult = [messageTypeId, uniqueId, jsonOutPayload];

        await Log.create({
            result: JSON.stringify(jsonOutPayload),
            message: messageIn[2],
            origin: "csms",
            chargePoint,
            admin: chargePoint.admin._id,
        });
        return callResult;
    } catch (error) {
        const errorCode = "FormationViolation";
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
};

module.exports = handleBootNotification;
