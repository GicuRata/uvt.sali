import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/auth.context';
import { useNavigate } from 'react-router-dom';
// import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [message, setMessage] = useState('');





    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>{user.username}'s Dashboard</h1>
                <button onClick={logout}>Logout</button>
            </div>
            <div className="dashboard-content">
            </div>
        </div>
    );
};

export default Dashboard;
