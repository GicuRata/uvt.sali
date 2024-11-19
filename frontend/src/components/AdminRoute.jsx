import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/auth.context';

const AdminProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Loading...</div>;

    if (user) {
        return user.role === 'admin' ? children : <Navigate to="/dashboard" />;
    } else {
        return <Navigate to="/register" />;
    }
};

export default AdminProtectedRoute;