const crypto = require('crypto-js');

const generateApiKey = () => {
    return crypto.lib.WordArray.random(32).toString();
};

const hashPassword = (password) => {
    return crypto.SHA256(password).toString();
};

const encryptFile = (content, key) => {
    return crypto.AES.encrypt(content, key).toString();
};

const decryptFile = (encryptedContent, key) => {
    return crypto.AES.decrypt(encryptedContent, key).toString(crypto.enc.Utf8);
};

module.exports = {
    generateApiKey,
    hashPassword,
    encryptFile,
    decryptFile
}; 