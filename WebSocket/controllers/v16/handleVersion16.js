// Import processRequest
const processRequest = require("./processRequest");

const handleVersion16 = async (chargePointStatusClass) => {
    const ws = chargePointStatusClass.WebSocket;
    const chargePointId = chargePointStatusClass.Id;
    const ocppVersion = chargePointStatusClass.Protocol;

    ws.on("message", async (message) => {
        const messageIn = JSON.parse(message);

        messageIn.push(chargePointId);
        messageIn.push(ocppVersion);
        // const messageTypeId = ocppMessage[0];
        // const uniqueId = ocppMessage[1];
        // const action = ocppMessage[2];
        // const payload = ocppMessage[3];

        // If the messageTypeId is CALL,
        if (messageIn[0] == 2) {
            // Handle the incoming message
            const messageOut = await processRequest(messageIn);
            // Send a CALLRESULT message back to the client
            ws.send(JSON.stringify(messageOut));
        }
    });
};

module.exports = handleVersion16;
