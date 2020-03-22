const crypto = require('crypto');

const ITERATION = 10000;
const KEY_LENGTH = 16;
const SALT_BYTES = 24;
const DIGEST = 'sha512';

function generateSalt(int) {
    const saltBuffer = crypto.randomBytes(int);
    return saltBuffer.toString('hex');
}

function generateDEK(password) {
    const salt = generateSalt(SALT_BYTES)
    const dek = crypto.pbkdf2Sync(password, salt, ITERATION, KEY_LENGTH, DIGEST);
    return dek.toString('hex');
}

module.exports = { generateDEK };