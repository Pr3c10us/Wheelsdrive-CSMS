// Import Models
const Log = require("../../../Database/models/Log");
const Transaction = require("../../../Database/models/Transaction");
const Connector = require("../../../Database/models/Connector");
const ChargePointModel = require("../../../Database/models/ChargePoint");
const RFID = require("../../../Database/models/RFID");
const Rate = require("../../../Database/models/Rates");
const cleanChargeTagId = require("../../utils/cleanChargeTagId");
const updateConnector = require("../../utils/updateConnector");

const handleStartTransaction = async (messageIn) => {
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
        TransactionId: 0,
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
        connectorId: jsonInPayload.connectorId,
        chargePoint,
        admin: chargePoint.admin._id,
    });

    let connectorId = -1;
    let errorCode = "";

    try {
        messageTypeId = 3;
        let idTag = await cleanChargeTagId(jsonInPayload.idTag);
        connectorId = jsonInPayload.connectorId;

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

        // If connectorId is valid i.e > 0
        if (connectorId > 0) {
            // Update connector status to occupied
            await updateConnector(
                chargePoint,
                connectorId,
                "Occupied",
                jsonInPayload.meterStart / 1000,
                jsonInPayload.timestamp
            );
        }

        // If idTagInfo.status is Accepted
        if (jsonOutPayload.idTagInfo.status === "Accepted") {
            try {
                // Get connector from database
                const connector = await Connector.findOne({
                    connectorId,
                    chargePoint,
                }).populate("rate");

                // create unitChargingRate and discountChargingRate
                let unitChargingRate = 0;
                let discountChargingRate = 0;

                // Get connectorRate from database if connector has rate
                if (connector.rate) {
                    const connectorRate = await Rate.findById(
                        connector.rate._id
                    );

                    if (connectorRate) {
                        // Get unitChargingRate from connectorRate
                        unitChargingRate = connectorRate.price;
                        // Get discountChargingRate from connectorRate
                        discountChargingRate = connectorRate.discount;
                    }
                }

                // Create new transaction
                const transaction = await Transaction.create({
                    startRFID: idTag,
                    startTime: jsonInPayload.timestamp,
                    meterStart: jsonInPayload.meterStart / 1000,
                    startResult: jsonOutPayload.idTagInfo.status,
                    unitChargingRate,
                    discountChargingRate,
                    chargePoint,
                    connector,
                    admin: chargePoint.admin._id,
                    location: chargePoint.location._id,
                });

                jsonOutPayload.TransactionId = transaction._id;
            } catch (error) {
                errorCode = "InternalError";
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
        }

        // Create callResult
        const callResult = [messageTypeId, uniqueId, jsonOutPayload];
        // Create a new log after we handle transaction
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
        errorCode = "InternalError";
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

module.exports = handleStartTransaction;
