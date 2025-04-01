const jwt = require('jsonwebtoken');
const { apiKeys } = require('../config/database');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    const apiKey = req.headers['x-api-key'];

    if (!token || !apiKey) {
        return res.status(401).json({ error: 'Missing authentication credentials' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
        const keyData = apiKeys.get(token);

        if (!keyData || keyData.key !== apiKey || Date.now() > keyData.expiresAt) {
            return res.status(401).json({ error: 'Invalid or expired API key' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticate; 