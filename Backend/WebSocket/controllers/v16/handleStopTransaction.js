// Import Models
const Log = require("../../../Database/models/Log");
const Transaction = require("../../../Database/models/Transaction");
const Connector = require("../../../Database/models/Connector");
const ChargePointModel = require("../../../Database/models/ChargePoint");
const RFID = require("../../../Database/models/RFID");
const Rate = require("../../../Database/models/Rates");
const cleanChargeTagId = require("../../utils/cleanChargeTagId");
const updateConnector = require("../../utils/updateConnector");

const handleStopTransaction = async (messageIn) => {
    // Initialize messageTypeId to null
    let messageTypeId = null;
    // Initialize uniqueId to messageIn.UniqueId
    let uniqueId = messageIn[1];
    // Initialize jsonOutPayload to some default values
    let jsonOutPayload = {
        idTagInfo: {
            expiryDate: new Date(2199, 11, 31),
            parentIdTag: "",
            status: "",
        },
    };

    // Initialize jsonPayload to messageIn.Payload
    let jsonInPayload = messageIn[3];

    // Get chargePointId from messageIn
    const chargePointId = messageIn[messageIn.length - 2];
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

    let errorCode = "";
    try {
        messageTypeId = 3;

        // Clean idTag and assign it to idTag
        let idTag = await cleanChargeTagId(jsonInPayload.idTag);

        // If idTag is null return status "Accepted"
        if (idTag === null || !idTag) {
            jsonOutPayload.idTagInfo.status = "Accepted";
        } else {
            try {
                // Get RFID from database
                const rfid = await RFID.findOne({
                    rfid: idTag,
                    admin: chargePoint.admin._id,
                });

                // If RFID exists
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
                jsonOutPayload.idTagInfo.status = "Invalid";
            }
        }

        // If status is "Accepted"
        if (jsonOutPayload.idTagInfo.status === "Accepted") {
            try {
                // Get Transaction by transactionId
                let transaction = await Transaction.findById(
                    jsonInPayload.transactionId
                );

                if (
                    !transaction ||
                    // transaction.chargePoint._id !== chargePoint._id ||
                    transaction.stopTime
                ) {
                    transaction = await Transaction.findOne({
                        chargePoint: chargePoint._id,
                    }).sort({ _id: -1 });
                    console.log("Accepted");

                    if (transaction) {
                        if (transaction.stopTime) {
                            transaction = null;
                        }
                    } else {
                    }
                }

                // If transaction exists
                if (transaction) {
                    // if transaction connectorId is not null
                    // get connector id of transaction
                    const connector = await Connector.findById(
                        transaction.connector._id
                    );
                    // If connector exists
                    if (connector && connector.connectorId > 0) {
                        await updateConnector(
                            chargePoint,
                            connector.connectorId,
                            null,
                            jsonInPayload.meterStop / 1000,
                            jsonInPayload.timestamp
                        );
                    } else {
                    }

                    let valid = true;

                    if (transaction.startRFID != idTag) {
                        // find rfid in db
                        const rfid = await RFID.findOne({
                            rfid: transaction.startRFID,
                            admin: chargePoint.admin._id,
                        });

                        if (rfid) {
                            if (
                                rfid.parentRFID !=
                                jsonOutPayload.idTagInfo.parentIdTag
                            ) {
                                jsonOutPayload.idTagInfo.status = "Invalid";
                                valid = false;
                            }
                        }
                    }

                    if (valid) {
                        // Get total time of transaction in hours
                        const startDate = new Date(transaction.startTime);
                        const endDate = new Date(jsonInPayload.timestamp);
                        const timeDiff =
                            endDate.getTime() - startDate.getTime();
                        const totalTime = timeDiff / 3600000;

                        // Get rate of transaction from connector
                        const rate = await Rate.findById(connector.rate._id);

                        transaction.StopRFID = idTag;
                        transaction.stopTime = jsonInPayload.timestamp;
                        transaction.meterStop = jsonInPayload.meterStop / 1000;
                        transaction.stopReason = jsonInPayload.reason;
                        transaction.cost =
                            transaction.unitChargingRate *
                            totalTime *
                            (transaction.discountChargingRate / 100);
                        transaction.totalEnergy = connector.power * totalTime;

                        await transaction.save();
                    }
                } else {
                    errorCode = "PropertyConstraintViolation";
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
            } catch (error) {
                errorCode = "InternalError";
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
        }

        // Create callResult
        const callResult = [messageTypeId, uniqueId, jsonOutPayload];
        // Create a new log after we handle transaction
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
        errorCode = "FormationViolation";
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

module.exports = handleStopTransaction;
