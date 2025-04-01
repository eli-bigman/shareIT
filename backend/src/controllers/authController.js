const jwt = require('jsonwebtoken');
const { users, apiKeys } = require('../config/database');
const { generateApiKey, hashPassword } = require('../utils/crypto');

const signup = (req, res) => {
    const { username, password, email } = req.body;

    // Validate input
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if username already exists
    if (users.has(username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    // Create new user
    const hashedPassword = hashPassword(password);
    users.set(username, {
        username,
        password: hashedPassword,
        email,
        createdAt: new Date(),
        files: []
    });

    res.status(201).json({ message: 'User created successfully' });
};

const login = (req, res) => {
    const { username, password } = req.body;
    
    // Check if user exists and password matches
    const user = users.get(username);
    const hashedPassword = hashPassword(password);

    if (!user || user.password !== hashedPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ username, email: user.email }, process.env.JWT_SECRET || 'your-jwt-secret', {
        expiresIn: '24h'
    });
    
    const apiKey = generateApiKey();
    apiKeys.set(token, {
        key: apiKey,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
    });

    res.json({ 
        token,
        apiKey,
        expiresIn: 24 * 60 * 60 * 1000,
        user: {
            username: user.username,
            email: user.email
        }
    });
};

const refreshKey = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
        const apiKey = generateApiKey();
        
        apiKeys.set(token, {
            key: apiKey,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000)
        });

        res.json({ 
            apiKey,
            expiresIn: 24 * 60 * 60 * 1000
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = {
    signup,
    login,
    refreshKey
}; 