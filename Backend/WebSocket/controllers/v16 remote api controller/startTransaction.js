// Import Logs
const Log = require("../../../Database/models/Log");
const { v4: uuidv4 } = require("uuid");
const remoteStartTransaction16 = async (
    chargePointInfo,
    ws,
    res,
    idTag,
    connectorId,
) => {
    const msgOut = [
        2,
        uuidv4(),
        "RemoteStartTransaction",
        {
            idTag,
            connectorId,
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
    return res.json({ message: "Remote Start Transaction done" });
};

module.exports = remoteStartTransaction16;
