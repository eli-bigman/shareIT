const crypto = require('crypto');

// Generate a secure random key
const generateKey = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex');
};

// Generate all required keys
const jwtSecret = generateKey();
const encryptionKey = generateKey();
const sessionSecret = generateKey();

// Create .env content
const envContent = `PORT=3001
JWT_SECRET=${jwtSecret}
ENCRYPTION_KEY=${encryptionKey}
SESSION_SECRET=${sessionSecret}
NODE_ENV=development`;

// Display the generated keys
console.log('\x1b[32m%s\x1b[0m', 'Generated Security Keys:');
console.log('\x1b[36m%s\x1b[0m', '==========================================');
console.log('JWT Secret:', jwtSecret);
console.log('Encryption Key:', encryptionKey);
console.log('Session Secret:', sessionSecret);
console.log('\x1b[36m%s\x1b[0m', '==========================================');
console.log('\x1b[33m%s\x1b[0m', '\nThese keys have been written to .env.template');
console.log('\x1b[33m%s\x1b[0m', 'Copy .env.template to .env to use these keys');

// Write to .env.template
const fs = require('fs');
fs.writeFileSync('backend/.env.template', envContent);

console.log('\x1b[32m%s\x1b[0m', '\nKey generation completed successfully!'); 