const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Secure File Sharing API',
            version: '1.0.0',
            description: 'A secure API for file sharing with authentication and encryption',
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message',
                        },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: {
                            type: 'string',
                            description: 'Admin username',
                        },
                        password: {
                            type: 'string',
                            description: 'Admin password',
                        },
                    },
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string',
                            description: 'JWT token',
                        },
                        apiKey: {
                            type: 'string',
                            description: 'Temporary API key',
                        },
                        expiresIn: {
                            type: 'number',
                            description: 'Token expiration time in milliseconds',
                        },
                    },
                },
                FileInfo: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'File ID',
                        },
                        originalName: {
                            type: 'string',
                            description: 'Original file name',
                        },
                        size: {
                            type: 'number',
                            description: 'File size in bytes',
                        },
                        mimeType: {
                            type: 'string',
                            description: 'File MIME type',
                        },
                    },
                },
            },
        },
    },
    apis: ['./server.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);
module.exports = specs; 