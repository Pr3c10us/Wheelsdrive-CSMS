// Import Models
const Log = require("../../../Database/models/Log");
const Transaction = require("../../../Database/models/Transaction");
const Connector = require("../../../Database/models/Connector");
const ChargePointModel = require("../../../Database/models/ChargePoint");
const RFID = require("../../../Database/models/RFID");
const Rate = require("../../../Database/models/Rates");
const cleanChargeTagId = require("../../utils/cleanChargeTagId");
const updateConnector = require("../../utils/updateConnector");
const generateTransactionId = require("../../utils/generateTransactionId");
const User = require("../../../Database/models/User");
const { v4: uuidv4 } = require("uuid");

const handleStartTransaction = async (d, ws) => {
    // Initialize messageTypeId to null
    let messageTypeId = null;
    // Initialize uniqueId to d.UniqueId
    let uniqueId = d[1];
    // Initialize jsonOutPayload to some default values
    let jsonOutPayload = {
        idTagInfo: {
            expiryDate: new Date(2199, 11, 31),
            parentIdTag: "",
            status: "",
        },
        transactionId: 0,
    };

    // Initialize jsonPayload to d.Payload
    let jsonInPayload = d[3];

    // Get chargePointId from d
    const chargePointId = d[d.length - 2];
    // Get chargePoint from database
    const chargePoint = await ChargePointModel.findById(chargePointId);
    if (!chargePoint) {
        const errorCode = "InternalError";
        // Return Error Message with error code FormationViolation
        const callError = [4, uniqueId, errorCode, "", {}];
        await Log.create({
            errorCode: errorCode,
            message: d[2],
            origin: "csms",
            chargePoint,
            admin: chargePoint.admin._id,
        });
        return callError;
    }

    // Create a new log before we handle message
    await Log.create({
        result: JSON.stringify(jsonInPayload),
        message: d[2],
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

        let rfid;
        // If idTag is null return status "Accepted"
        if (idTag === null || !idTag) {
            jsonOutPayload.idTagInfo.status = "Blocked";
        } else {
            try {
                // Get RFID from database
                rfid = await RFID.findOne({
                    rfid: idTag,
                    admin: chargePoint.admin._id,
                });

                // If RFID exists
                if (rfid) {
                    // Set parentIdTag
                    jsonOutPayload.idTagInfo.parentIdTag =
                        rfid.parentRFID || rfid.rfid;
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
                    rfid = await RFID.findOne({
                        rfid: idTag,
                        // admin: chargePoint.admin._id,
                    });
                    const connector = await Connector.findOne({
                        connectorId,
                        chargePoint,
                    }).populate("rate");
                    if (connector.rate) {
                        const connectorRate = await Rate.findById(
                            connector.rate._id
                        );
                        const user = await User.findById(rfid.user._id);
                        const chargingTime = user.balance / connectorRate.price;
                        // convert chargingTime from hours to milliseconds
                        const chargingTimeInMilliSeconds =
                            chargingTime * 3600000;
                        // if chargingTimeInMilliSeconds is less than 1 minute then block the user
                        if (chargingTimeInMilliSeconds < 300000) {
                            jsonOutPayload.idTagInfo.status = "Blocked";
                        } else {
                            if (rfid && !rfid.admin && rfid.parentRFID) {
                                jsonOutPayload.idTagInfo.status = "Accepted";
                                jsonOutPayload.idTagInfo.parentIdTag =
                                    rfid.parentRFID || rfid.rfid;
                            } else {
                                jsonOutPayload.idTagInfo.status = "Invalid";
                            }
                        }
                    }
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
                    // transactionUniqueId:
                    startRFID: idTag,
                    transactionUniqueId: generateTransactionId(),
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

                // if rfid has no admin but has user and if connector rate is provided then calculate how much time user can charge and update expiry date
                if (rfid) {
                    if (rfid.user) {
                        transaction.transactionType = "Customer";
                        const connector = await Connector.findOne({
                            connectorId,
                            chargePoint,
                        }).populate("rate");
                        if (connector.rate) {
                            const connectorRate = await Rate.findById(
                                connector.rate._id
                            );
                            if (connectorRate) {
                                const user = await User.findById(rfid.user._id);
                                const chargingTime =
                                    user.balance / connectorRate.price;
                                // convert chargingTime from hours to milliseconds
                                const chargingTimeInMilliSeconds =
                                    chargingTime * 3600000;
                                // get expiry date
                                const expiryDate = new Date(
                                    new Date().getTime() +
                                        chargingTimeInMilliSeconds
                                );
                                jsonOutPayload.idTagInfo.expiryDate =
                                    expiryDate.toISOString();
                                
                                setTimeout(async () => {
                                    const msgOut = [
                                        2,
                                        uuidv4(),
                                        "RemoteStopTransaction",
                                        {
                                            transactionId:
                                                transaction.transactionUniqueId,
                                        },
                                    ];

                                    ws.send(JSON.stringify(msgOut));
                                }, chargingTimeInMilliSeconds);
                                await transaction.save();
                            }
                        }
                    }
                }

                jsonOutPayload.transactionId = transaction.transactionUniqueId;
            } catch (error) {
                errorCode = "InternalError";
                const callError = [4, uniqueId, errorCode, "", {}];
                await Log.create({
                    errorCode: errorCode,
                    message: d[2],
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
            message: d[2],
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
            message: d[2],
            origin: "csms",
            chargePoint,
            connectorId: jsonInPayload.connectorId,
            admin: chargePoint.admin._id,
        });
        return callError;
    }
};

module.exports = handleStartTransaction;
