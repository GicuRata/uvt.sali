import { useState } from 'react';
import axios from 'axios';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        adminSecret: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/create-admin`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div>
            <h2>Admin Registration</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="adminSecret"
                    placeholder="Admin Secret"
                    value={formData.adminSecret}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Register as Admin</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminRegister;
