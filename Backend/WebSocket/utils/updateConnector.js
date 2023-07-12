// // Import connector model
// const Connector = require("../../Database/models/Connector");

// const updateConnector = (
//     chargePoint,
//     connectorId,
//     newStatus,
//     meterKWH,
//     meterTime
// ) => {
//     return new Promise(async (resolve, reject) => {
//         // If connectorId is greater than 0 run database logic
//         if (connectorId > 0) {
//             // Check if connector with connectorId and chargePoint exit
//             const connectorStatus = await Connector.findOne({
//                 connectorId,
//                 chargePoint,
//             });

//             // Create new connector and Add to chargePoint if connectorStatus doesn't exist
//             if (!connectorStatus) {
//                 const newConnector = await Connector.create({
//                     connectorId,
//                     // lastStatus: newStatus,
//                     // LastMeter: meterKWH,
//                     // LastMeterTime: meterTime,
//                     chargePoint,
//                     admin: chargePoint.admin._id,
//                 });

//                 if (newStatus !== null) {
//                     newConnector.lastStatus = newStatus;
//                     // Save update
//                     await newConnector.save();
//                 }

//                 if (meterKWH !== null) {
//                     newConnector.LastMeter = meterKWH;
//                     newConnector.LastMeterTime = meterTime;
//                     // Save update
//                     await newConnector.save();
//                 }

//                 // Add connector to chargePoint
//                 chargePoint.connectors.push(newConnector);
//                 await chargePoint.save();
//             } else {
//                 // Update connector status if newStatus is not undefined or null
//                 if (newStatus !== null) {
//                     connectorStatus.lastStatus = newStatus;
//                     // Save update
//                     await connectorStatus.save();
//                 }
//                 // Update connector meter values if meterKWh exist
//                 if (meterKWH !== null) {
//                     connectorStatus.LastMeter = meterKWH;
//                     connectorStatus.LastMeterTime = meterTime;
//                     // Save update
//                     await connectorStatus.save();
//                 }
//             }
//         }
//         resolve();
//     });
// };

// module.exports = updateConnector;

// Import connector model
const Connector = require("../../Database/models/Connector");
const { generateAndStoreQRCode } = require("./uploadQrCode");

const updateConnector = async (
    chargePoint,
    connectorId,
    newStatus,
    meterKWH,
    meterTime
) => {
    try {
        // If connectorId is greater than 0, run database logic
        if (connectorId > 0) {
            // Check if connector with connectorId and chargePoint exists
            const connectorStatus = await Connector.findOne({
                connectorId,
                chargePoint,
            });

            // Create new connector and add to chargePoint if connectorStatus doesn't exist
            if (!connectorStatus) {
                const newConnector = await Connector.create({
                    connectorId,
                    chargePoint,
                    admin: chargePoint.admin._id,
                });

                if (newStatus !== null) {
                    newConnector.lastStatus = newStatus;
                }

                if (meterKWH !== null) {
                    newConnector.LastMeter = meterKWH;
                    newConnector.LastMeterTime = meterTime;
                }

                // Save the updates
                await newConnector.save();

                // Generate and store qr code
                await generateAndStoreQRCode(
                    `${newConnector._id}`,
                    `${newConnector._id}.png`
                );
                newConnector.qrcode_url = `https://${process.env.S3_QR_CODE_BUCKET_NAME}.s3.amazonaws.com/${newConnector._id}.png`;

                // Save the updates
                await newConnector.save();
                
                // Add connector to chargePoint
                chargePoint.connectors.push(newConnector._id);
                await chargePoint.save();
            } else {
                // Update connector status if newStatus is not undefined or null
                if (newStatus !== null) {
                    connectorStatus.lastStatus = newStatus;
                }

                // Update connector meter values if meterKWh exists
                if (meterKWH !== null) {
                    connectorStatus.LastMeter = meterKWH;
                    connectorStatus.LastMeterTime = meterTime;
                }

                // Save the updates
                await connectorStatus.save();
            }
        }
    } catch (error) {}
};

module.exports = updateConnector;
