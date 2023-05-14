// Import Modules
const ChargePointModel = require("../../../Database/models/ChargePoint");
const Log = require("../../../Database/models/Log");
const Connector = require("../../../Database/models/Connector");
const updateConnector = require("../../utils/updateConnector");

const handleMeterValue = async (messageIn) => {
    // Initialize messageTypeId to null
    let messageTypeId = null;
    // Initialize uniqueId to messageIn.UniqueId
    let uniqueId = messageIn[1];
    // Initialize jsonOutPayload to some default values
    let jsonOutPayload = {};

    // Initialize jsonPayload to messageIn.Payload
    let jsonInPayload = messageIn[3];

    // Get chargePointId from messageIn
    const chargePointId = messageIn[messageIn.length - 2];
    // Get chargePoint from database
    const chargePoint = await ChargePointModel.findById(chargePointId);

    let connectorId = -1;
    let meterValue = [];

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
        // Assign jsonInPayload connectorId to connectorId
        connectorId = jsonInPayload.connectorId;
        // Assign meterValue Array to meterValue variable
        meterValue = jsonInPayload.meterValue;

        // Create variables to hold some meter values
        let currentChargeKW = -1;
        let meterKWH = -1;
        let meterTime = null;
        let stateOfChange = -1;

        // Re Assign some values to the var from element in meterValueArray
        meterValue.forEach((meterRead) => {
            let sampledValue = meterRead.sampledValue;

            sampledValue.forEach((element) => {
                let measurand = element.measurand;
                // convert string to number
                let value = Number(element.value);
                let unit = element.unit;
                let location = element.location;

                if (measurand == "Power.Active.Import") {
                    if (value) {
                        currentChargeKW = value;
                        if (
                            unit == "W" ||
                            unit == "VA" ||
                            unit == "Var" ||
                            unit == null
                        ) {
                            currentChargeKW = currentChargeKW / 1000;
                        }
                    }
                } else if (
                    measurand == "Energy.Active.Import.Register" ||
                    measurand == null
                ) {
                    if (value) {
                        meterKWH = value;
                        if (unit == "Wh" || unit == "Varh" || unit == null) {
                            meterKWH = meterKWH / 1000;
                        }
                    }
                    meterTime = meterRead.timestamp;
                } else if (measurand == "SoC") {
                    stateOfChange = value;
                }
            });
        });

        // Update connector to add meter Value
        if (meterKWH >= 0) {
            await updateConnector(
                chargePoint,
                connectorId,
                null,
                meterKWH,
                meterTime
            );
        }

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

        //  Run Logic if
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

module.exports = handleMeterValue;
