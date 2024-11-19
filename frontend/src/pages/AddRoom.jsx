import { useState } from 'react';
import axios from 'axios';

const AddRoom = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: '',
        equipment: '',
        description: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/rooms/add-room`, {
                ...formData,
                equipment: formData.equipment.split(',').map((item) => item.trim()),
            }, config);

            setMessage(response.data.message);
            setFormData({
                name: '',
                location: '',
                capacity: '',
                equipment: '',
                description: '',
            });
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div>
            <h2>Add New Room</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Room Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="equipment"
                    placeholder="Equipment (comma-separated)"
                    value={formData.equipment}
                    onChange={handleChange}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                />
                <button type="submit">Add Room</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddRoom;
