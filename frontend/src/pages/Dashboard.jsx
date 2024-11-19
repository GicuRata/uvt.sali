import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/auth.context';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/get-rooms`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
                setRooms(response.data.rooms);
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
                setMessage('Failed to fetch rooms');
            }
        };

        fetchRooms();
    }, []);

    return (
        <div>
            <h1>Welcome, {user.username}!</h1>
            <button onClick={logout}>Logout</button>
            {user.role === 'admin' && (
                <div>
                    <h2>Admin Section</h2>
                    <p>You have admin privileges. Manage rooms below:</p>
                    {/* Admin functionalities like AddRoom */}
                </div>
            )}

            <div>
                <h2>Rooms</h2>
                {message && <p>{message}</p>}
                <ul>
                    {rooms.map((room) => (
                        <li key={room._id}>{room.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;