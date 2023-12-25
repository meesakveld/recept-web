const { v4: generateRandomUUID } = require('uuid');


/**
 * @returns {string} random uuid
 */
function RandomUUID() {
    return generateRandomUUID()
}

module.exports = {
    RandomUUID,
}