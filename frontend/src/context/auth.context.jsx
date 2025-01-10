import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (userData) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                userData
            );
            const token = response.data.token;

            localStorage.setItem('token', token);

            // Optionally: validate the token right away
            await validateTokenOnServer(token);
        } catch (error) {
            console.error("Login error:", error.response?.data?.message || error.message);
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/register`,
                userData
            );
            return response.data; // Return the response for success indication
        } catch (error) {
            console.error("Registration error:", error.response?.data.message || error.message);
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    // New function to validate token with the server
    const validateTokenOnServer = async (token) => {
        try {
            // Make a request to /api/auth/validate
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/auth/validate`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            // If valid, set user data from response
            setUser({
                id: res.data.id,
                username: res.data.username,
                role: res.data.role,
            });
        } catch (error) {
            console.error("Token validation error:", error.response?.data || error.message);
            // If invalid, remove it
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Validate with the server
            validateTokenOnServer(token).finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
