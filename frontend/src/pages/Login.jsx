import React, { useState, useContext } from 'react';
import AuthContext from '../context/auth.context';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
                <button type="button" onClick={() => navigate('/register')}>Go To Register</button>
            </form>
        </div>
    );
}

export default Login;