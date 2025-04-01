import config from '../config.js';

class ApiService {
    constructor() {
        this.apiKey = null;
        this.token = null;
    }

    async login(username, password) {
        try {
            const response = await fetch(`${config.API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            this.token = data.token;
            this.apiKey = data.apiKey;
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async refreshApiKey() {
        try {
            const response = await fetch(`${config.API_URL}/auth/refresh-key`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to refresh API key');
            }

            const data = await response.json();
            this.apiKey = data.apiKey;
            return data;
        } catch (error) {
            console.error('Error refreshing API key:', error);
            throw error;
        }
    }

    async request(endpoint, options = {}) {
        if (!this.apiKey || !this.token) {
            throw new Error('Not authenticated');
        }

        const headers = {
            'x-api-key': this.apiKey,
            'Authorization': `Bearer ${this.token}`,
            ...options.headers
        };

        try {
            const response = await fetch(`${config.API_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (response.status === 401) {
                // Try to refresh the API key
                await this.refreshApiKey();
                // Retry the request with the new API key
                return this.request(endpoint, options);
            }

            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            return response;
        } catch (error) {
            console.error(`Request to ${endpoint} failed:`, error);
            throw error;
        }
    }

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await this.request('/upload', {
            method: 'POST',
            body: formData
        });
        
        return response.json();
    }

    async getFiles() {
        const response = await this.request('/files');
        return response.json();
    }

    async downloadFile(fileId) {
        return await this.request(`/file/${fileId}`);
    }
}

export const apiService = new ApiService(); 