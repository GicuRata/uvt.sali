import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/AddRoom.module.css'; // Import scoped CSS for EditRoom

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
                    headers: { Authorization: `Bearer ${token}` },
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

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/rooms/edit-room/${roomId}`,
                {
                    ...formData,
                    equipment: formData.equipment.split(',').map((item) => item.trim()),
                },
                config
            );

            setMessage(response.data.message);
            navigate('/dashboard');
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.paper}>
                <h2 className={styles.title}>Edit Room</h2>
                <div className={styles.backButtonContainer}>
                    <button
                        className={styles.backButton}
                        onClick={() => navigate('/dashboard')}
                    >
                        Back to Dashboard
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Room Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter room name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="location">Location:</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            placeholder="Enter location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="capacity">Capacity:</label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            placeholder="Enter capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="equipment">Equipment (comma-separated):</label>
                        <input
                            type="text"
                            id="equipment"
                            name="equipment"
                            placeholder="Enter equipment"
                            value={formData.equipment}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            placeholder="Enter description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className={styles.submitButtonContainer}>
                        <button className={styles.submitButton} type="submit">
                            Update Room
                        </button>
                    </div>
                </form>
                <p className={styles.errorMessage} id="errorMessage">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default EditRoom;
