// Import Logs
const Log = require("../../../Database/models/Log");
const { v4: uuidv4 } = require("uuid");
const remoteReset16 = async (chargePointInfo, ws, res) => {
    const msgOut = [
        2,
        uuidv4(),
        "Reset",
        {
            type: "Soft",
        },
    ];

    // Log the message
    await Log.create({
        message: msgOut[2],
        origin: "csms",
        chargePointInfo,
        result: JSON.stringify(msgOut[3]),
        connectorId: 0,
        admin: chargePointInfo.admin._id,
    });

    // Send the message
    await ws.send(JSON.stringify(msgOut));

    // Send response
    return res.json({ message: "Remote Reset done" });
};

module.exports = remoteReset16;
