const fsp = require('fs/promises');

/**
 * 
 * @param {string} fileToWrite 
 * @param {JSON} contentToAdd 
 */
async function writeToFile(fileToWrite, contentToAdd) {
    await fsp.writeFile(fileToWrite, JSON.stringify(contentToAdd, null, 4))
}


/**
 * 
 * @param {string} fileToRead 
 * @returns {JSON} Data
 */
async function readFile(fileToRead) {
    const data =  await fsp.readFile(fileToRead, 'utf-8');
    return JSON.parse(data)
}


module.exports = { 
    writeToFile,
    readFile,
}