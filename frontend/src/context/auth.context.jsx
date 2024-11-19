import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (userData) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, userData);
            localStorage.setItem('token', response.data.token);
            const userDataFromToken = JSON.parse(atob(response.data.token.split('.')[1])); // Decode token to get user info
            setUser({ id: userDataFromToken.id, username: userDataFromToken.username });
        } catch (error) {
            console.error("Login error:", error.response?.data.message || error.message);
        }
    };
    const register = async (userData) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Decode the token to get user data if it's a JWT
            const userData = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
            setUser({ id: userData.id, username: userData.username, token });
            // console.log('User loaded from token:', decodedToken); // Debug log

        }
        setLoading(false);
    }, []);


    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthContext;