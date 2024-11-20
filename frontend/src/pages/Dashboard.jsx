import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/auth.context';
import { Add, Edit, Delete } from '@mui/icons-material';
import { AppBar, Toolbar, Button, Container, Typography, List, ListItem, ListItemText, IconButton, Paper, Box } from '@mui/material';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/get-rooms`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setRooms(response.data.rooms);
            } catch (error) {
                console.error('Failed to fetch rooms:', error);
                setMessage('Failed to fetch rooms');
            }
        };

        fetchRooms();
    }, []);

    const handleAdd = () => {
        navigate('/admin/add-room');
    };

    const handleEdit = (roomId) => {
        navigate(`/admin/edit-room/${roomId}`);
    };

    const handleDelete = async (roomId) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${import.meta.env.VITE_API_URL}/api/rooms/delete-room/${roomId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setRooms(rooms.filter(room => room._id !== roomId));
            } catch (error) {
                console.error('Failed to delete room:', error);
                setMessage('Failed to delete room');
            }
        }
    };

    return (
        <Container>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Welcome, {user.username}
                    </Typography>
                    <Button color="inherit" onClick={logout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {user.role === 'admin' && (
                    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                        <Typography variant="h4">Admin Section</Typography>
                        <Typography variant="body1">You have admin privileges. Manage rooms below:</Typography>
                        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAdd}>
                            Add Room
                        </Button>
                    </Paper>
                )}
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <Typography variant="h4">Rooms</Typography>
                    {message && <Typography variant="body1" color="error">{message}</Typography>}
                    <List>
                        {rooms.map((room) => (
                            <ListItem key={room._id} divider>
                                <ListItemText
                                    primary={room.name}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="textPrimary">
                                                Location: {room.location}
                                            </Typography>
                                            <br />
                                            Capacity: {room.capacity}
                                            {room.equipment.length > 0 && room.equipment[0] !== "" && (
                                                <>
                                                    <br />
                                                    Equipment: {room.equipment.filter(e => e).join(', ')}
                                                </>
                                            )}
                                            {room.description && (
                                                <>
                                                    <br />
                                                    Description: {room.description}
                                                </>
                                            )}
                                        </>
                                    }
                                />
                                {user.role === 'admin' && (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(room._id)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(room._id)}>
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>
        </Container>
    );
};

export default Dashboard;