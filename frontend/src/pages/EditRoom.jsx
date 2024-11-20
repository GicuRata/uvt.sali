import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

const EditRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: '',
        equipment: '',
        description: '',
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/rooms/get-room/${roomId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const room = response.data.room;
                setFormData({
                    name: room.name,
                    location: room.location,
                    capacity: room.capacity,
                    equipment: room.equipment.join(', '),
                    description: room.description,
                });
            } catch (error) {
                setMessage('Failed to fetch room details');
            }
        };

        fetchRoomDetails();
    }, [roomId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/rooms/edit-room/${roomId}`, {
                ...formData,
                equipment: formData.equipment.split(',').map((item) => item.trim()),
            }, config);

            setMessage(response.data.message);
            navigate('/dashboard');
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 5 }}>
                <Typography variant="h4" gutterBottom>Edit Room</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Button variant="outlined" color="secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
                </Box>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Room Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Capacity"
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Equipment (comma-separated)"
                        name="equipment"
                        value={formData.equipment}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        name="description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                        <Button variant="contained" color="primary" type="submit">Update Room</Button>
                    </Box>
                </form>
                {message && <Typography color="error" sx={{ marginTop: 2 }}>{message}</Typography>}
            </Paper>
        </Container>
    );
};

export default EditRoom;