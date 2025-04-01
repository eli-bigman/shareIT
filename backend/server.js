const express = require('express');
const multer = require('multer');
const crypto = require('crypto-js');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-key', 'Authorization'],
    credentials: true
}));    
app.use(express.json());

// In-memory storage for files and API keys
const files = new Map();
const apiKeys = new Map();
const users = new Map();

// Multer configuration for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Generate a temporary API key
const generateApiKey = () => {
    return crypto.lib.WordArray.random(32).toString();
};

// Hash password
const hashPassword = (password) => {
    return crypto.SHA256(password).toString();
};

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['username', 'password', 'email']
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               password:
 *                 type: string
 *                 description: User's password
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *       400:
 *         description: Invalid input or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/auth/signup', (req, res) => {
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
        files: [] // Array to track user's files
    });

    res.status(201).json({ message: 'User created successfully' });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get API key
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/auth/login', (req, res) => {
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
});

/**
 * @swagger
 * /auth/refresh-key:
 *   post:
 *     summary: Refresh API key
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: API key refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: New API key
 *                 expiresIn:
 *                   type: number
 *                   description: Expiration time in milliseconds
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/auth/refresh-key', (req, res) => {
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
});

// Basic authentication middleware
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

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileInfo'
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/upload', authenticate, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileId = crypto.lib.WordArray.random(16).toString();
        const encryptedContent = crypto.AES.encrypt(
            req.file.buffer.toString('base64'),
            process.env.ENCRYPTION_KEY
        ).toString();

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
});

/**
 * @swagger
 * /file/{id}:
 *   get:
 *     summary: Download a file
 *     tags: [Files]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File content
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/file/:id', authenticate, (req, res) => {
    try {
        const file = files.get(req.params.id);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const decryptedContent = crypto.AES.decrypt(
            file.encryptedContent,
            process.env.ENCRYPTION_KEY
        ).toString(crypto.enc.Utf8);

        res.setHeader('Content-Type', file.mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
        res.send(Buffer.from(decryptedContent, 'base64'));
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving file' });
    }
});

/**
 * @swagger
 * /files:
 *   get:
 *     summary: List all files
 *     tags: [Files]
 *     security:
 *       - BearerAuth: []
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FileInfo'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/files', authenticate, (req, res) => {
    const fileList = Array.from(files.entries()).map(([id, file]) => ({
        id,
        originalName: file.originalName,
        size: file.size,
        mimeType: file.mimeType
    }));
    res.json(fileList);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API documentation available at http://localhost:${port}/api-docs`);
}); 