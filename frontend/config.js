const config = {
    API_URL: 'http://localhost:3001',
    // In a real application, this would be fetched from a secure endpoint
    // or managed through a proper authentication system
    getApiKey: async () => {
        try {
            console.log('Attempting to fetch API key from:', `${config.API_URL}/auth/key`);
            const response = await fetch(`${config.API_URL}/auth/key`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to get API key: ${response.status} ${response.statusText} - ${errorText}`);
            }
            
            const data = await response.json();
            return data.apiKey;
        } catch (error) {
            console.error('Error getting API key:', error);
            throw error;
        }
    }
};

export default config; 