# ShareIT - File Sharing Application

ShareIT is a secure file sharing application built with Node.js and React. It allows users to upload, store, and share files with encryption and authentication.

## Features

- 🔐 User Authentication (Signup/Login)
- 📤 Secure File Upload
- 📥 File Download
- 🔑 JWT-based Authentication
- 🔒 File Encryption
- 📱 Responsive Design
- 📚 API Documentation (Swagger)

## Tech Stack

### Backend
- Node.js
- Express.js
- Multer (File Upload)
- JWT (Authentication)
- Crypto-js (Encryption)
- Swagger (API Documentation)

### Frontend
- React
- React Router
- Tailwind CSS
- Axios

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Project Structure

```
shareIT/
├── backend/              # Node.js backend
│   ├── src/             # Source code
│   ├── scripts/         # Utility scripts
│   ├── package.json     # Backend dependencies
│   ├── .env.template    # Environment variables template
│   └── .env            # Environment variables (you'll create this)
└── frontend/            # React frontend
    ├── src/            # Source code
    ├── public/         # Static files
    └── package.json    # Frontend dependencies
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd shareIT
```

2. Set up the backend:
```bash
cd backend
npm install
```

3. Generate security keys and create environment file:
```bash
# Generate secure keys and create .env.template
node scripts/generateKeys.js

# Copy the template to .env
# On Windows:
copy .env.template .env
# On Linux/Mac:
cp .env.template .env
```

The `generateKeys.js` script will:
- Generate secure random keys for JWT, encryption, and sessions
- Create an `.env.template` file with the generated keys
- Display the generated keys in the console
- Set up the correct environment variables

Your `.env` file will contain:
```env
PORT=3001
JWT_SECRET=<generated-jwt-secret>
ENCRYPTION_KEY=<generated-encryption-key>
SESSION_SECRET=<generated-session-secret>
NODE_ENV=development
```

4. Set up the frontend:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```
The backend will run on http://localhost:3001

2. Start the frontend development server:
```bash
cd frontend
npm start
```
The frontend will run on http://localhost:3000

3. Verify the setup:
- Backend API documentation should be available at http://localhost:3001/api-docs
- Frontend login page should be available at http://localhost:3000
- Try creating a new account and logging in
- Test file upload and download functionality

## API Documentation

Once the backend is running, you can access the API documentation at:
http://localhost:3001/api-docs

The documentation includes:
- Authentication endpoints (login, signup, refresh token)
- File management endpoints (upload, download, list)
- Request/response schemas
- Security requirements

## Features in Detail

### Authentication
- Users can create accounts with username, email, and password
- Passwords are hashed before storage
- JWT tokens are used for authentication
- API keys are required for file operations

### File Management
- Files are encrypted before storage using AES encryption
- Users can upload multiple files
- Files can be downloaded securely
- File metadata (name, size, type) is tracked

### Security
- All API endpoints require authentication
- Files are encrypted using AES encryption
- API keys expire after 24 hours
- CORS is configured for security
- Secure key generation for all sensitive operations

## Development Guidelines

### Backend Development
- All routes are documented using Swagger
- Authentication middleware is used for protected routes
- File uploads are handled using Multer
- Error handling is implemented for all routes
- Environment variables are used for sensitive data

### Frontend Development
- Components are organized by feature
- Authentication state is managed using Context API
- File uploads use FormData
- Responsive design using Tailwind CSS

## Troubleshooting

Common issues and solutions:
1. **Backend won't start**: Make sure you've copied `.env.template` to `.env`
2. **Frontend can't connect**: Verify backend is running and CORS is configured
3. **Upload fails**: Check file size limits and API key expiration
4. **Authentication issues**: Clear browser storage and try logging in again

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 