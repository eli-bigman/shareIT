const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ShareIT API',
      version: '1.0.0',
      description: 'API documentation for ShareIT file sharing service',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
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
              description: 'User\'s username',
            },
            password: {
              type: 'string',
              description: 'User\'s password',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'JWT token for authentication',
            },
            apiKey: {
              type: 'string',
              description: 'API key for file operations',
            },
            expiresIn: {
              type: 'integer',
              description: 'Token expiration time in milliseconds',
            },
            user: {
              type: 'object',
              properties: {
                username: {
                  type: 'string',
                  description: 'User\'s username',
                },
                email: {
                  type: 'string',
                  description: 'User\'s email address',
                },
              },
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
              type: 'integer',
              description: 'File size in bytes',
            },
            mimeType: {
              type: 'string',
              description: 'File MIME type',
            },
          },
        },
      },
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
    },
    security: [
      {
        BearerAuth: [],
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ['./src/server.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs; 