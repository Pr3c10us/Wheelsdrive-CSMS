// create function to generate random string
const randomString = (length) => {
    // declare all characters
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // declare variable to store random string
    let result = "";
    // iterate over length
    for (let i = length; i > 0; --i) {
        // get random character from chars
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    // return result
    return result;
}

// export randomString
module.exports = randomString;