# ShareIT Backend

A secure file sharing backend service with user authentication and file encryption.

## Features

- User authentication with JWT
- Secure file upload and download
- File encryption at rest
- API key management
- Swagger API documentation

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   JWT_SECRET=your-jwt-secret-key
   SESSION_SECRET=your-session-secret-key
   ENCRYPTION_KEY=your-encryption-key
   NODE_ENV=development
   ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Documentation

Once the server is running, visit `http://localhost:3001/api-docs` to access the Swagger API documentation.

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── routes/        # Route definitions
│   ├── utils/         # Utility functions
│   └── server.js      # Main application file
├── .env               # Environment variables
├── .gitignore        # Git ignore rules
├── package.json      # Project dependencies
└── README.md         # Project documentation
```

## Security Features

- JWT-based authentication
- API key validation
- File encryption at rest
- Secure session management
- CORS protection
- Input validation
- Error handling

## License

ISC 