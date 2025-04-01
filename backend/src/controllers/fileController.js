const crypto = require('crypto-js');
const { files } = require('../config/database');
const { encryptFile, decryptFile } = require('../utils/crypto');

const uploadFile = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileId = crypto.lib.WordArray.random(16).toString();
        const encryptedContent = encryptFile(
            req.file.buffer.toString('base64'),
            process.env.ENCRYPTION_KEY
        );

        files.set(fileId, {
            originalName: req.file.originalname,
            encryptedContent,
            mimeType: req.file.mimetype,
            size: req.file.size
        });

        res.json({
            id: fileId,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (error) {
        res.status(500).json({ error: 'Error uploading file' });
    }
};

const downloadFile = (req, res) => {
    try {
        const file = files.get(req.params.id);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const decryptedContent = decryptFile(
            file.encryptedContent,
            process.env.ENCRYPTION_KEY
        );

        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
        res.send(Buffer.from(decryptedContent, 'base64'));
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving file' });
    }
};

const listFiles = (req, res) => {
    const fileList = Array.from(files.entries()).map(([id, file]) => ({
        id,
        originalName: file.originalName,
        size: file.size,
        mimeType: file.mimeType
    }));
    res.json(fileList);
};

module.exports = {
    uploadFile,
    downloadFile,
    listFiles
}; 