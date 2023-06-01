// Import Logs
const Log = require("../../../Database/models/Log");
const { v4: uuidv4 } = require("uuid");
const remoteUnlockConnectors16 = async (
    chargePointInfo,
    ws,
    res,
    connectorId
) => {
    const msgOut = [
        2,
        uuidv4(),
        "UnlockConnector",
        {
            connectorId: connectorId,
        },
    ];

    // Log the message
    await Log.create({
        message: msgOut[2],
        origin: "csms",
        chargePointInfo,
        result: JSON.stringify(msgOut[3]),
        connectorId: connectorId,
        admin: chargePointInfo.admin._id,
    });

    // Send the message
    await ws.send(JSON.stringify(msgOut));

    // Send response
    return res.json({ message: "Remote Unlock Connectors done" });
};

module.exports = remoteUnlockConnectors16;
