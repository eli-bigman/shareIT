import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [apiKey, setApiKey] = useState(null);

    useEffect(() => {
        // Check for stored authentication data
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedApiKey = localStorage.getItem('apiKey');

        if (storedToken && storedUser && storedApiKey) {
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
            setApiKey(storedApiKey);
        }
    }, []);

    const login = (userData, token, apiKey) => {
        setIsAuthenticated(true);
        setUser(userData);
        setApiKey(apiKey);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('apiKey', apiKey);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setApiKey(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('apiKey');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, apiKey, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 