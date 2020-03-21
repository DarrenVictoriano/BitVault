require('dotenv').config();
const crypto = require('crypto');

// Key must be 256 byte (32 characters)

function encrypt(data, key) {
    // For AES this is always 16
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc',
        new Buffer.from(key), iv);
    let encrypted = cipher.update(data);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(data, key) {
    let dataParts = data.split(':');
    let iv = new Buffer.from(dataParts.shift(), 'hex');
    let encryptedData = new Buffer.from(dataParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc',
        new Buffer.from(key), iv);
    let decryptedData = decipher.update(encryptedData);

    decryptedData = Buffer.concat([decryptedData, decipher.final()]);

    return decryptedData.toString();
}
