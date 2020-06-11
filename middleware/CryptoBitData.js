const crypto = require('crypto');

const AES_BYTE = 16;

function encrypt(data, key) {
    // For AES this is always 16
    let iv = crypto.randomBytes(AES_BYTE);
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

function decryptVault(arr, key) {
    let decryptedArray = [];

    arr.forEach(item => {
        decryptedArray.push({
            _id: item._id,
            account_name: decrypt(item.account_name, key),
            username: decrypt(item.username, key),
            password: decrypt(item.password, key),
            url: decrypt(item.url, key),
            note: decrypt(item.note, key)
        });
    });

    return decryptedArray;
}

module.exports = { encrypt, decrypt, decryptVault };