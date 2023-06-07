function generateTransactionId() {
    // Generate a random number between 1000000000 and 9999999999
    const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;

    // Get the current timestamp
    const timestamp = Date.now();

    // Combine the timestamp and random number to create a unique number
    const uniqueNumber =
        Number(timestamp.toString()) + Number(randomNumber.toString());

    return uniqueNumber;
}

console.log(generateTransactionId());

module.exports = generateTransactionId;
