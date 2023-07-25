const ChargePoint = require("../../Database/models/ChargePoint");

// create function to generate random string
function generateRandomString(length) {
    const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
    }
    return result;
}

async function generateUniqueConnectionId() {
    let connectionId = generateRandomString(8);
    let exists = await ChargePoint.exists({ connectionId });

    while (exists) {
        connectionId = generateRandomString(8);
        exists = await ChargePoint.exists({ connectionId });
    }

    return connectionId;
}


// export randomString
module.exports = {generateUniqueConnectionId};