// In-memory storage for files and API keys
const files = new Map();
const apiKeys = new Map();
const users = new Map();

module.exports = {
    files,
    apiKeys,
    users
}; 