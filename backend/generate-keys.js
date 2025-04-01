const crypto = require('crypto');

// Generate API Key (32 bytes = 64 hex characters)
const apiKey = crypto.randomBytes(32).toString('hex');

// Generate Encryption Key (32 bytes = 64 hex characters)
const encryptionKey = crypto.randomBytes(32).toString('hex');

// Generate JWT Secret (32 bytes = 64 hex characters)
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Generate Session Secret (32 bytes = 64 hex characters)
const sessionSecret = crypto.randomBytes(32).toString('hex');

console.log('Generated Keys:');
console.log('PORT=3001');
console.log('API_KEY=' + apiKey);
console.log('ENCRYPTION_KEY=' + encryptionKey);
console.log('JWT_SECRET=' + jwtSecret);
console.log('SESSION_SECRET=' + sessionSecret);
console.log('ADMIN_USERNAME=admin');
console.log('ADMIN_PASSWORD=' + crypto.randomBytes(16).toString('hex')); 