const initiateController = async (messageIn) => {
    // Initialize messageTypeId to null
    let messageTypeId = null;
    // Initialize uniqueId to messageIn.UniqueId
    let uniqueId = messageIn[1];
    // Initialize jsonOutPayload to some default values
    let jsonOutPayload = {
        status: "",
        currentTime: new Date().toISOString(),
        interval: 300,
    };

    // Initialize jsonPayload to messageIn.Payload
    let jsonInPayload = messageIn[3];
    const chargePointId = messageIn[messageIn.length - 2];
    const ocppVersion = messageIn[messageIn.length - 1];

    // Get chargePoint from database
    const chargePoint = await ChargePointModel.findById(chargePointId);
};

module.exports = initiateController;
