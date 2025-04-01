import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token and API key
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (apiKey) {
        config.headers['x-api-key'] = apiKey;
    }
    
    return config;
});

export const authService = {
    signup: async (username, password, email) => {
        const response = await api.post('/auth/signup', { username, password, email });
        return response.data;
    },

    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        const { token, apiKey, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
    },

    refreshKey: async () => {
        const response = await api.post('/auth/refresh-key');
        const { apiKey } = response.data;
        localStorage.setItem('apiKey', apiKey);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('apiKey');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export const fileService = {
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    downloadFile: async (fileId) => {
        const response = await api.get(`/file/${fileId}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    listFiles: async () => {
        const response = await api.get('/files');
        return response.data;
    }
};

export default api; 