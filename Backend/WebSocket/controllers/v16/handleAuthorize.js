// Import Modules
const ChargePointModel = require("../../../Database/models/ChargePoint");
const Log = require("../../../Database/models/Log");
const RFID = require("../../../Database/models/RFID");
const cleanChargeTagId = require("../../utils/cleanChargeTagId");

const handleAuthorize = async (messageIn) => {
    // Initialize messageTypeId to null
    let messageTypeId = null;
    // Initialize uniqueId to messageIn.UniqueId
    let uniqueId = messageIn[1];
    // Initialize jsonOutPayload to some default values
    let jsonOutPayload = {
        idTagInfo: {
            expiryDate: null,
            parentIdTag: "",
            status: "",
        },
    };

    // Initialize jsonPayload to messageIn.Payload
    let jsonInPayload = messageIn[3];

    // Get chargePointId from messageIn
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
            chargePoint: chargePoint,
            admin: chargePoint.admin._id,
        });
        return callError;
    }

    // Create a new log before we handle message
    await Log.create({
        result: JSON.stringify(jsonInPayload),
        message: messageIn[2],
        origin: "charger",
        // connectorId: jsonInPayload.connectorId,
        chargePoint,
        admin: chargePoint.admin._id,
    });

    let idTag = null;

    try {
        messageTypeId = 3;
        // Clean idTag
        idTag = cleanChargeTagId(jsonInPayload.idTag);

        try {
            // Get RFID from database
            const rfid = await RFID.findOne({
                rfid: idTag,
                admin: chargePoint.admin._id,
            });

            // If RFID is not found
            if (rfid) {
                // Set parentIdTag
                jsonOutPayload.idTagInfo.parentIdTag = rfid.parentRFID;
                if (rfid.expires) {
                    jsonOutPayload.idTagInfo.expiryDate =
                        rfid.expires.toISOString();
                }
                // If rfid is blocked
                if (rfid.blocked) {
                    jsonOutPayload.idTagInfo.status = "Blocked";
                } // If rfid is expired
                else if (
                    rfid.expires &&
                    jsonOutPayload.idTagInfo.expiryDate <
                        new Date().toISOString()
                ) {
                    jsonOutPayload.idTagInfo.status = "Expired";
                } else {
                    // If rfid is valid
                    jsonOutPayload.idTagInfo.status = "Accepted";
                }
            } else {
                jsonOutPayload.idTagInfo.status = "Invalid";
            }
        } catch (error) {
            console.log(error);
            jsonOutPayload.idTagInfo.status = "Invalid";
        }

        // Create callResult
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
        jsonOutPayload.idTagInfo.status = "Invalid";
        const errorCode = "FormationViolation";
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

module.exports = handleAuthorize;
