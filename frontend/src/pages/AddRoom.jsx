import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AddRoom.module.css';

const AddRoom = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        capacity: '',
        equipment: '',
        description: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/rooms/add-room`,
                {
                    ...formData,
                    equipment: formData.equipment.split(',').map((item) => item.trim()),
                },
                config
            );

            setMessage(response.data.message);
            setFormData({
                name: '',
                location: '',
                capacity: '',
                equipment: '',
                description: '',
            });
            navigate('/dashboard');
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.paper}>
                <h2 className={styles.title}>Add New Room</h2>
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
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="location">Location:</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            placeholder="Enter location"
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="capacity">Capacity:</label>
                        <input
                            type="number"
                            id="capacity"
                            name="capacity"
                            placeholder="Enter capacity"
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="equipment">Equipment (comma-separated):</label>
                        <input
                            type="text"
                            id="equipment"
                            name="equipment"
                            placeholder="Enter equipment"
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
                            onChange={handleChange}
                        ></textarea>
                    </div>
                    <div className={styles.submitButtonContainer}>
                        <button className={styles.submitButton} type="submit">
                            Add Room
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

export default AddRoom;
