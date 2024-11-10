import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/auth.context';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    return user ? children : <Navigate to="/register" />;
};

export default ProtectedRoute;